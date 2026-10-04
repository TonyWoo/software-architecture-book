// 架构决策记录（ADR）：存在 docs/adr，代码评审时强制执行
public record ArchitectureDecision(
    int Number,
    string Title,
    string Status,      // proposed | accepted | superseded
    string Context,
    string Decision,
    string Consequences);

var adr4 = new ArchitectureDecision(
    Number: 4,
    Title: "Modular monolith over microservices",
    Status: "accepted",
    Context: "团队 6 人。没有专职运维。部署预算只有一条流水线。",
    Decision: "限界上下文变成程序集。上下文之间不允许网络调用。",
    Consequences: "以后可以把某个模块拆成服务；反过来几乎不可能。");
