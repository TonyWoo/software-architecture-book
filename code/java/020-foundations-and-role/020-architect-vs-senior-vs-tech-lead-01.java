package ch020;

// 决策权归属：谁拍板、拍板前听谁的、管哪些事——写下来，评审时对表。
class ArchitectVsSeniorVsTechLead01 {

    enum DecisionScope { CODE, TEAM, ARCHITECTURE }

    record DecisionRight(
        DecisionScope scope,
        String owner,      // 谁拍板
        String consulted,  // 拍板前必须听谁的
        String examples) {}

    static void example() {
        var rights = new DecisionRight[] {
            new DecisionRight(DecisionScope.CODE, "资深开发", "技术负责人",
                "命名、算法、测试策略、模块内部的重构"),
            new DecisionRight(DecisionScope.TEAM, "技术负责人", "架构师",
                "迭代排期、代码归属、结对轮换、合并策略"),
            new DecisionRight(DecisionScope.ARCHITECTURE, "架构师", "技术负责人 + 资深开发",
                "模块边界、数据库选型、跨服务契约、NFR 预算"),
        };
    }
}
