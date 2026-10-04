// 支付核心：幂等 + 状态机 + 事件记账

public enum PaymentStatus
{
    Pending,      // 待支付：订单已创建，未发起网关调用
    Processing,   // 支付中：已发网关，等确认（可停留很久）
    Succeeded,    // 成功：终态
    Failed,       // 失败：终态，可重新发起（新幂等键）
    Unknown,      // 未知：网关超时，等对账裁决（关键状态！）
    Refunded,     // 已退款：终态
}

// 状态跃迁表：非法跃迁直接抛异常，代码即文档
public static class PaymentTransitions
{
    private static readonly Dictionary<PaymentStatus, PaymentStatus[]> _allowed = new()
    {
        [PaymentStatus.Pending]    = new[] { PaymentStatus.Processing, PaymentStatus.Failed },
        [PaymentStatus.Processing] = new[] { PaymentStatus.Succeeded, PaymentStatus.Failed, PaymentStatus.Unknown },
        [PaymentStatus.Unknown]    = new[] { PaymentStatus.Succeeded, PaymentStatus.Failed }, // 只有对账能裁决
        [PaymentStatus.Succeeded]  = new[] { PaymentStatus.Refunded },
        [PaymentStatus.Failed]     = Array.Empty<PaymentStatus>(), // 终态：重付走新单
        [PaymentStatus.Refunded]   = Array.Empty<PaymentStatus>(),
    };

    public static void EnsureAllowed(PaymentStatus from, PaymentStatus to)
    {
        if (!_allowed[from].Contains(to))
            throw new InvalidPaymentTransitionException(from, to);
    }
}

public interface IPaymentService
{
    // 幂等键唯一索引保证：同键重复调用直接返回上次结果，不重新执行
    Task<Payment> PayAsync(string idempotencyKey, PaymentRequest request);
}

// 记账事件：钱只通过事件流动，余额是折叠出来的
public record LedgerEvent(
    Guid EventId,
    string PaymentId,
    string DebitAccount,    // 借方科目
    string CreditAccount,   // 贷方科目
    decimal Amount,
    DateTime OccurredAt);
