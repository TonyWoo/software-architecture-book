package ch050;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// 领域层：对 JPA 和 HTTP 一无所知
class LayeredNTier01 {

    record Order(UUID id, String customerName, List<OrderLine> lines, Money total) {}
    record OrderLine(String sku, int quantity, Money unitPrice) {}
    record Money(BigDecimal amount, String currency) {}

    // 数据层：把自己的持久化模型映射成领域类型
    @Repository
    static class OrderRepository {
        private final OrderJpaRepository jpa;

        OrderRepository(OrderJpaRepository jpa) {
            this.jpa = jpa;
        }

        Order findById(UUID id) {
            OrderEntity row = jpa.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
            return row.toDomain(); // 映射住在数据层，这是它的地盘
        }
    }

    interface OrderJpaRepository extends JpaRepository<OrderEntity, UUID> {}

    static class OrderEntity {
        UUID id;

        Order toDomain() {
            throw new UnsupportedOperationException("映射省略：行记录 -> 领域对象");
        }
    }

    static class OrderNotFoundException extends RuntimeException {
        OrderNotFoundException(UUID id) {
            super("订单不存在: " + id);
        }
    }
}
