package ch070;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// Ordering 限界上下文：拥有 Order，把 Product 数据当作本地投影来借用。
class DataOwnershipAndModeling01 {

    @Embeddable
    static class Money {
        @Column(name = "amount")
        private BigDecimal amount;

        protected Money() {
        }

        Money(BigDecimal amount) {
            this.amount = amount;
        }
    }

    @Embeddable
    static class OrderLine {
        @Column(name = "product_id")
        private UUID productId;

        // 本地反规范化副本，所有权归 Catalog，Ordering 永远不写它。
        // 只在下单瞬间快照，之后 Catalog 改名不影响历史订单。
        @Column(name = "product_name", length = 200)
        private String productName;

        private int quantity;

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

        @ElementCollection
        private List<OrderLine> lines = new ArrayList<>();

        @Embedded
        private Money total;

        private OffsetDateTime placedAt;

        protected Order() {
        }
    }
}
