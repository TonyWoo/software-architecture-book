package ch110;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

// 经典案例 · 信息流：推拉结合的核心逻辑
class ClassicCasesCommerceFeedPayments02 {

    interface TimelineService {
        // 刷信息流：合并"推来的"和"现拉的"
        List<Post> getTimeline(String userId, String cursor, int count);
        // 发帖：决定推还是存，供粉丝拉
        Post publishPost(String authorId, String content);
    }

    @Service
    static class DefaultTimelineService implements TimelineService {
        private static final int CELEBRITY_THRESHOLD = 10_000; // 粉丝数阈值：超过就是大V

        private final PostStore postStore;
        private final SocialGraph graph;
        private final TimelineCache timelineCache;
        private final CelebrityIndex celebrityIndex;

        DefaultTimelineService(PostStore postStore, SocialGraph graph,
                               TimelineCache timelineCache, CelebrityIndex celebrityIndex) {
            this.postStore = postStore;
            this.graph = graph;
            this.timelineCache = timelineCache;
            this.celebrityIndex = celebrityIndex;
        }

        public Post publishPost(String authorId, String content) {
            Post post = postStore.save(authorId, content);
            int followerCount = graph.getFollowerCount(authorId);

            if (followerCount > CELEBRITY_THRESHOLD) {
                // 大V：只记"某大V在某时间发了帖"，粉丝刷的时候现拉
                celebrityIndex.add(authorId, post.id(), post.createdAt());
            } else {
                // 普通用户：推模式，直接写进每个粉丝的时间线
                List<String> followers = graph.getFollowers(authorId);
                timelineCache.pushToMany(followers, post.id(), post.createdAt());
            }
            return post;
        }

        public List<Post> getTimeline(String userId, String cursor, int count) {
            // 1. 从 Redis 取推来的帖子 ID（Sorted Set 按时间倒序）
            List<String> pushed = timelineCache.getRange(userId, cursor, count);
            // 2. 现拉关注的大V的新帖
            List<String> celebrities = graph.getFollowedCelebrities(userId);
            List<String> pulled = celebrityIndex.getNewerThan(
                celebrities, timelineCache.getLastMergeTime(userId));
            // 3. 合并、去重、按时间排序，取前 N 个，再回源取正文
            var merged = new ArrayList<String>();
            merged.addAll(pushed);
            merged.addAll(pulled);
            return postStore.getMany(merged.stream().distinct().limit(count).toList());
        }
    }

    record Post(String id, String authorId, String content, Instant createdAt) {}

    interface PostStore {
        Post save(String authorId, String content);
        List<Post> getMany(List<String> ids);
    }

    interface SocialGraph {
        int getFollowerCount(String authorId);
        List<String> getFollowers(String authorId);
        List<String> getFollowedCelebrities(String userId);
    }

    interface TimelineCache {
        void pushToMany(List<String> userIds, String postId, Instant at);
        List<String> getRange(String userId, String cursor, int count);
        Instant getLastMergeTime(String userId);
    }

    interface CelebrityIndex {
        void add(String authorId, String postId, Instant at);
        List<String> getNewerThan(List<String> authorIds, Instant since);
    }
}
