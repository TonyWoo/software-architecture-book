package ch110;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

// 经典案例 · 支付核心：幂等 + 状态机 + 事件记账
class ClassicCasesCommerceFeedPayments03 {

    enum PaymentStatus {
        PENDING,    // 待支付：订单已创建，未发起网关调用
        PROCESSING, // 支付中：已发网关，等确认（可停留很久）
        SUCCEEDED,  // 成功：终态
        FAILED,     // 失败：终态，可重新发起（新幂等键）
        UNKNOWN,    // 未知：网关超时，等对账裁决（关键状态！）
        REFUNDED,   // 已退款：终态
    }

    // 状态跃迁表：非法跃迁直接抛异常，代码即文档
    static final class PaymentTransitions {
        private static final Map<PaymentStatus, Set<PaymentStatus>> ALLOWED =
            new EnumMap<>(PaymentStatus.class);

        static {
            ALLOWED.put(PaymentStatus.PENDING,
                Set.of(PaymentStatus.PROCESSING, PaymentStatus.FAILED));
            ALLOWED.put(PaymentStatus.PROCESSING,
                Set.of(PaymentStatus.SUCCEEDED, PaymentStatus.FAILED, PaymentStatus.UNKNOWN));
            // 只有对账能裁决 UNKNOWN
            ALLOWED.put(PaymentStatus.UNKNOWN,
                Set.of(PaymentStatus.SUCCEEDED, PaymentStatus.FAILED));
            ALLOWED.put(PaymentStatus.SUCCEEDED, Set.of(PaymentStatus.REFUNDED));
            ALLOWED.put(PaymentStatus.FAILED, Set.of());   // 终态：重付走新单
            ALLOWED.put(PaymentStatus.REFUNDED, Set.of()); // 终态
        }

        static void ensureAllowed(PaymentStatus from, PaymentStatus to) {
            if (!ALLOWED.get(from).contains(to))
                throw new InvalidPaymentTransitionException(from, to);
        }
    }

    static class InvalidPaymentTransitionException extends RuntimeException {
        InvalidPaymentTransitionException(PaymentStatus from, PaymentStatus to) {
            super("非法的支付状态跃迁: " + from + " -> " + to);
        }
    }

    interface PaymentService {
        // 幂等键唯一索引保证：同键重复调用直接返回上次结果，不重新执行
        Payment pay(String idempotencyKey, PaymentRequest request);
    }

    // 记账事件：钱只通过事件流动，余额是折叠出来的
    record LedgerEvent(
        UUID eventId,
        String paymentId,
        String debitAccount,   // 借方科目
        String creditAccount,   // 贷方科目
        BigDecimal amount,
        Instant occurredAt) {}

    record PaymentRequest(BigDecimal amount, String currency) {}
    record Payment(String id, PaymentStatus status) {}
}
