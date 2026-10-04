package ch080;

// 这是心智模型，不是实现——要知道这些状态转换意味着什么。
class ConsensusRaftIntuition01 {

    enum RaftRole { FOLLOWER, CANDIDATE, LEADER }

    static class RaftNode {
        private RaftRole role = RaftRole.FOLLOWER;
        private long currentTerm;
        private int votesReceived;

        // 跟随者收不到心跳 → 变成候选人，开启新任期，拉票。
        void onElectionTimeout() {
            role = RaftRole.CANDIDATE;
            currentTerm++;
            votesReceived = 1; // 先投自己一票
        }

        // 本任期内拿到多数票，候选人成为领导者。
        // 两个候选人不可能同时拿到多数——整个把戏就靠这一条。
        void onVoteReceived(int clusterSize) {
            if (role == RaftRole.CANDIDATE && ++votesReceived > clusterSize / 2)
                role = RaftRole.LEADER;
        }

        // 更高任期的消息永远赢：立刻让位。
        void onHigherTermObserved(long term) {
            currentTerm = term;
            role = RaftRole.FOLLOWER;
            votesReceived = 0;
        }

        RaftRole role() {
            return role;
        }
    }
}
