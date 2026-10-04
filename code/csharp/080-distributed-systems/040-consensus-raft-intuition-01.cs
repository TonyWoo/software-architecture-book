// .NET 8：这是心智模型，不是实现——要知道这些状态转换意味着什么。
public enum RaftRole { Follower, Candidate, Leader }

public sealed class RaftNode
{
    public RaftRole Role { get; private set; } = RaftRole.Follower;
    public long CurrentTerm { get; private set; }
    public int VotesReceived { get; private set; }

    // 跟随者收不到心跳 → 变成候选人，开启新任期，拉票。
    public void OnElectionTimeout(int clusterSize)
    {
        Role = RaftRole.Candidate;
        CurrentTerm++;
        VotesReceived = 1; // 先投自己一票
    }

    // 本任期内拿到多数票，候选人成为领导者。
    // 两个候选人不可能同时拿到多数——整个把戏就靠这一条。
    public void OnVoteReceived(int clusterSize)
    {
        if (Role == RaftRole.Candidate && ++VotesReceived > clusterSize / 2)
            Role = RaftRole.Leader;
    }

    // 更高任期的消息永远赢：立刻让位。
    public void OnHigherTermObserved(long term)
    {
        CurrentTerm = term;
        Role = RaftRole.Follower;
        VotesReceived = 0;
    }
}
