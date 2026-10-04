package ch040;

import java.math.BigDecimal;

class SimplicityYagniKissDeepModules01 {

    // 容易：顺手、复制粘贴、正在悄悄分叉。
    // 三个方法长得一样，将来改折扣逻辑要改三处，总有一处会漏。
    static BigDecimal priceForMembers(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.9"));
    }

    static BigDecimal priceForVip(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.85"));
    }

    static BigDecimal priceForStaff(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.8"));
    }

    // 简单：一个概念，一个改动点。
    static BigDecimal applyDiscount(BigDecimal amount, BigDecimal rate) {
        return amount.multiply(rate);
    }

    static class DiscountRates {
        static final BigDecimal MEMBER = new BigDecimal("0.9");
        static final BigDecimal VIP = new BigDecimal("0.85");
        static final BigDecimal STAFF = new BigDecimal("0.8");
    }
}
