// 债的登记表写成代码：可查询、可评审、丢不了。
public enum DebtKind { Deliberate, Accidental }

public record TechDebt(
    string Id,
    string Description,
    DebtKind Kind,
    string Owner,
    string RepaymentTrigger,   // "结账 v2 上线前"、"2027 年 Q2"
    int InterestEstimate);     // 1-5：每次后续改动有多痛

public static class DebtRegister
{
    public static readonly TechDebt[] Items =
    {
        // 审慎的债：税率硬编码，扩张到第二个税区前必须还。
        new("TD-014", "CheckoutService 里税率硬编码",
            DebtKind.Deliberate, "billing-team",
            "扩张到第二个税区之前", 4),
        // 意外的债：订单查询绕过读模型，仪表盘 N+1。
        new("TD-021", "订单查询绕过读模型（仪表盘 N+1）",
            DebtKind.Accidental, "platform-team",
            "仪表盘 p99 超过 2 秒时", 5),
    };

    // 利息高的先还：这就是还款顺序。
    public static IEnumerable<TechDebt> ByInterestDescending() =>
        Items.OrderByDescending(d => d.InterestEstimate);
}
