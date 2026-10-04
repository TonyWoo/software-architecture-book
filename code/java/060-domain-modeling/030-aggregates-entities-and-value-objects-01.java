package ch060;

import java.math.BigDecimal;

// 值对象：没有身份，不可变，相等只看值。
class AggregatesEntitiesValueObjects01 {

    record Money(BigDecimal amount, String currency) {
        static Money zero(String currency) {
            return new Money(BigDecimal.ZERO, currency);
        }

        Money add(Money other) {
            // 不同币种不能直接相加：这是业务规则，不是类型体操。
            if (!currency.equals(other.currency))
                throw new DomainException(
                    "Cannot add " + currency + " to " + other.currency + ".");
            return new Money(amount.add(other.amount), currency);
        }
    }

    record Sku(String value) {}

    static class DomainException extends RuntimeException {
        DomainException(String message) {
            super(message);
        }
    }
}
