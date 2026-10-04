package ch020;

// 架构决策记录（ADR）：存在 docs/adr，代码评审时强制执行
class WhatArchitectureActuallyIs01 {

    // 决策是数据，而不只是文档：结构化的 ADR 能被工具检查、被评审流程强制执行。
    // Java record 天生适合这种"不可变数据载体"。
    record ArchitectureDecision(
        int number,
        String title,
        String status,      // proposed | accepted | superseded
        String context,
        String decision,
        String consequences) {}

    static void example() {
        var adr4 = new ArchitectureDecision(
            4,
            "模块化单体优先于微服务",
            "accepted",
            "团队 6 人。没有专职运维。部署预算只有一条流水线。",
            "限界上下文变成模块。模块之间不允许网络调用。",
            "以后可以把某个模块拆成服务；反过来几乎不可能。");
    }
}
