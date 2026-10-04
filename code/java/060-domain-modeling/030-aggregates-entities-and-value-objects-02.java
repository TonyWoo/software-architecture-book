package ch060;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// 聚合根：Order。所有对订单的修改都经过它。
class AggregatesEntitiesValueObjects02 {

    static final class Order {
        private final UUID id;
        private final UUID customerId; // 只存 ID，不直接引用 Customer 聚合。

        private final List<OrderLine> lines = new ArrayList<>();

        Order(UUID id, UUID customerId) {
            this.id = id;
            this.customerId = customerId;
        }

        void addLine(Sku sku, int quantity, Money unitPrice) {
            // 不变量 1：数量必须为正。
            if (quantity <= 0)
                throw new DomainException("Quantity must be positive.");

            // 不变量 2：同一 SKU 只允许一行，改数量请走 changeQuantity。
            if (lines.stream().anyMatch(l -> l.sku().equals(sku)))
                throw new DomainException("SKU " + sku.value()
                    + " already exists; change its quantity instead.");

            lines.add(new OrderLine(lines.size() + 1, sku, quantity, unitPrice));
        }

        // 总额永远现场计算，不存、不缓存、不等人同步。
        Money total(String currency) {
            Money total = Money.zero(currency);
            for (OrderLine line : lines)
                total = total.add(line.lineTotal());
            return total;
        }

        List<OrderLine> lines() {
            return List.copyOf(lines);
        }
    }

    // OrderLine 是聚合内部实体：有身份（行号），但没有独立生命周期。
    // 包内可见的构造器：只有聚合根能创建它。
    static final class OrderLine {
        private final int lineNumber;
        private final Sku sku;
        private int quantity;
        private final Money unitPrice;

        OrderLine(int lineNumber, Sku sku, int quantity, Money unitPrice) {
            this.lineNumber = lineNumber;
            this.sku = sku;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        Sku sku() {
            return sku;
        }

        Money lineTotal() {
            return new Money(
                unitPrice.amount().multiply(BigDecimal.valueOf(quantity)),
                unitPrice.currency());
        }
    }

    record Money(BigDecimal amount, String currency) {
        static Money zero(String currency) {
            return new Money(BigDecimal.ZERO, currency);
        }

        Money add(Money other) {
            if (!currency.equals(other.currency))
                throw new DomainException("Cannot add " + currency + " to " + other.currency + ".");
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
