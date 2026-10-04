package ch060;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// JPA 映射：Money 作为 OrderLine 的内嵌值对象，没有独立表。
// 配置本身就是决策：值对象内嵌，实体才有表。
class AggregatesEntitiesValueObjects03 {

    @Embeddable
    static class Money {
        @Column(name = "amount")
        private BigDecimal amount;

        @Column(name = "currency", length = 3)
        private String currency;

        protected Money() {
        } // JPA 需要无参构造器

        Money(BigDecimal amount, String currency) {
            this.amount = amount;
            this.currency = currency;
        }
    }

    @Embeddable
    static class Sku {
        @Column(name = "sku", length = 64)
        private String value;

        protected Sku() {
        }

        Sku(String value) {
            this.value = value;
        }
    }

    @Embeddable
    static class OrderLine {
        @Embedded
        private Sku sku;

        private int quantity;

        // 内嵌的值对象：列直接铺在 OrderLine 的"表"里，没有外键。
        @Embedded
        private Money unitPrice;

        protected OrderLine() {
        }
    }

    @Entity
    @Table(name = "orders")
    static class Order {
        @Id
        private UUID id;

        // 值对象集合：跟着聚合根一起存取，没有独立生命周期。
        @ElementCollection
        private List<OrderLine> lines = new ArrayList<>();

        protected Order() {
        }
    }
}
