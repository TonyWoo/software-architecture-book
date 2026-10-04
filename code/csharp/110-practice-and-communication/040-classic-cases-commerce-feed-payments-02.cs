// 信息流服务：推拉结合的核心逻辑

public interface ITimelineService
{
    // 刷信息流：合并"推来的"和"现拉的"
    Task<IReadOnlyList<Post>> GetTimelineAsync(string userId, string? cursor, int count);
    // 发帖：决定推还是存，供粉丝拉
    Task<Post> PublishPostAsync(string authorId, string content);
}

public class TimelineService : ITimelineService
{
    private const int CelebrityThreshold = 10_000; // 粉丝数阈值：超过就是大V

    public async Task<Post> PublishPostAsync(string authorId, string content)
    {
        var post = await _postStore.SaveAsync(authorId, content);
        var followerCount = await _graph.GetFollowerCountAsync(authorId);

        if (followerCount > CelebrityThreshold)
        {
            // 大V：只记"某大V在某时间发了帖"，粉丝刷的时候现拉
            await _celebrityIndex.AddAsync(authorId, post.Id, post.CreatedAt);
        }
        else
        {
            // 普通用户：推模式，直接写进每个粉丝的时间线
            var followers = await _graph.GetFollowersAsync(authorId);
            await _timelineCache.PushToManyAsync(followers, post.Id, post.CreatedAt);
        }
        return post;
    }

    public async Task<IReadOnlyList<Post>> GetTimelineAsync(
        string userId, string? cursor, int count)
    {
        // 1. 从 Redis 取推来的帖子 ID（Sorted Set 按时间倒序）
        var pushed = await _timelineCache.GetRangeAsync(userId, cursor, count);
        // 2. 现拉关注的大V的新帖
        var celebrities = await _graph.GetFollowedCelebritiesAsync(userId);
        var pulled = await _celebrityIndex.GetNewerThanAsync(celebrties: celebrities,
            since: await _timelineCache.GetLastMergeTimeAsync(userId));
        // 3. 合并、去重、按时间排序，取前 N 个，再回源取正文
        var merged = MergeDedup(pushed, pulled).Take(count);
        return await _postStore.GetManyAsync(merged);
    }
}
