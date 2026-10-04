package ch030;

import java.time.LocalDate;
import java.util.List;

// 最小的 ADR 模型：决策是数据，而不只是文档。
class ArchitectureDecisionRecordsAdrs01 {

    enum AdrStatus { PROPOSED, ACCEPTED, DEPRECATED, SUPERSEDED }

    record Adr(
        int number,
        String title,
        AdrStatus status,
        String context,
        String decision,
        String consequences,
        LocalDate decidedOn,      // 对应 C# 的 DateOnly：只记日期不记时间
        List<String> supersedes) {}

    static void example() {
        // 上面那份 ADR，用代码表示：
        var adr42 = new Adr(
            42,
            "订单服务使用 PostgreSQL 作为事务存储",
            AdrStatus.ACCEPTED,
            "订单服务需要 ACID：扣款 + 锁库存同成功同失败。" +
            "峰值 200 单/分钟，单节点够用。团队已在运维 Postgres。",
            "PostgreSQL 16，部署在现有托管集群上。",
            "好：ACID、工具链熟悉。坏：纵向扩展天花板，" +
            "10 倍流量时重审。风险：共享集群的邻居噪音。",
            LocalDate.of(2026, 9, 14),
            List.of());
    }
}
