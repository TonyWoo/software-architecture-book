package ch030;

import java.util.Arrays;
import java.util.Comparator;

// 债的登记表写成代码：可查询、可评审、丢不了。
class TechnicalDebtAndEvolutionaryPressure01 {

    enum DebtKind { DELIBERATE, ACCIDENTAL }

    record TechDebt(
        String id,
        String description,
        DebtKind kind,
        String owner,
        String repaymentTrigger, // "结账 v2 上线前"、"2027 年 Q2"
        int interestEstimate) {} // 1-5：每次后续改动有多痛

    static final TechDebt[] ITEMS = {
        // 审慎的债：税率硬编码，扩张到第二个税区前必须还。
        new TechDebt("TD-014", "CheckoutService 里税率硬编码",
            DebtKind.DELIBERATE, "billing-team", "扩张到第二个税区之前", 4),
        // 意外的债：订单查询绕过读模型，仪表盘 N+1。
        new TechDebt("TD-021", "订单查询绕过读模型（仪表盘 N+1）",
            DebtKind.ACCIDENTAL, "platform-team", "仪表盘 p99 超过 2 秒时", 5),
    };

    // 利息高的先还：这就是还款顺序。
    static TechDebt[] byInterestDescending() {
        return Arrays.stream(ITEMS)
            .sorted(Comparator.comparingInt(TechDebt::interestEstimate).reversed())
            .toArray(TechDebt[]::new);
    }
}
