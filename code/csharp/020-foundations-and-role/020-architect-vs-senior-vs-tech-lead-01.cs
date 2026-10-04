public enum DecisionScope { Code, Team, Architecture }

public record DecisionRight(
    DecisionScope Scope,
    string Owner,        // 谁拍板
    string Consulted,   // 拍板前必须听谁的
    string Examples);

var rights = new DecisionRight[]
{
    new(DecisionScope.Code, "资深开发", "技术负责人",
        "命名、算法、测试策略、模块内部的重构"),
    new(DecisionScope.Team, "技术负责人", "架构师",
        "迭代排期、代码归属、结对轮换、合并策略"),
    new(DecisionScope.Architecture, "架构师", "技术负责人 + 资深开发",
        "模块边界、数据库选型、跨服务契约、NFR 预算"),
};
