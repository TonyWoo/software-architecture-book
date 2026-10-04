// 架构驱动力登记：只记那两三个真正说了算的
public record ArchitecturalDriver(
    string Name,
    string Source,          // 来自哪个干系人 / 哪条约束
    string StructuralImpact // 它逼着架构长成什么样
);

var drivers = new ArchitecturalDriver[]
{
    new("上线前必须通过等保三级",
        "约束：法规（合规团队）",
        "所有用户数据落盘加密；管理后台独立部署、独立鉴权；全链路审计日志进不可变存储。"),
    new("大促 10 倍流量，p99 下单 < 800ms",
        "需求：业务方 + NFR",
        "下单路径无同步第三方调用；outbox + 异步扣款；读多写少的商品页走缓存。"),
    new("团队 4 人，无专职运维",
        "约束：业务（管理层）",
        "单体优先，单条流水线部署；任何需要多集群、多中间件的方案直接出局。"),
};
