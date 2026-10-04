package ch040;

import java.math.BigDecimal;

class SolidCohesionAndCoupling02 {

    interface DiscountPolicy {
        BigDecimal apply(BigDecimal amount);
    }

    static class NoDiscount implements DiscountPolicy {
        public BigDecimal apply(BigDecimal amount) {
            return amount;
        }
    }

    static class LoyaltyDiscount implements DiscountPolicy {
        public BigDecimal apply(BigDecimal amount) {
            return amount.multiply(new BigDecimal("0.9"));
        }
    }

    // 对修改关闭：新增折扣政策不需要动这里的一行代码。
    static class Checkout {
        private final DiscountPolicy policy;

        Checkout(DiscountPolicy policy) {
            this.policy = policy;
        }

        BigDecimal total(BigDecimal amount) {
            return policy.apply(amount);
        }
    }
}
