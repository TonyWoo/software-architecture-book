// 最小的 ADR 模型：决策是数据，而不只是文档。
public enum AdrStatus { Proposed, Accepted, Deprecated, Superseded }

public record Adr(
    int Number,
    string Title,
    AdrStatus Status,
    string Context,
    string Decision,
    string Consequences,
    DateOnly DecidedOn,
    string[] Supersedes = null!
);

// 上面那份 ADR，用代码表示：
var adr42 = new Adr(
    Number: 42,
    Title: "订单服务使用 PostgreSQL 作为事务存储",
    Status: AdrStatus.Accepted,
    Context: "订单服务需要 ACID：扣款 + 锁库存同成功同失败。" +
             "峰值 200 单/分钟，单节点够用。团队已在运维 Postgres。",
    Decision: "PostgreSQL 16，部署在现有托管集群上。",
    Consequences: "好：ACID、工具链熟悉。坏：纵向扩展天花板，" +
                 "10 倍流量时重审。风险：共享集群的邻居噪音。",
    DecidedOn: new DateOnly(2026, 9, 14));
