package ch050;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

class EventDrivenCqrsAndEventSourcing02 {

    // 读侧：投影，又笨又快
    @Repository
    interface OrderSummaryRepository extends JpaRepository<OrderSummary, UUID> {
        // 没有领域逻辑，没有不变量，只有一个长得像页面的查询。
        // 方法名即查询：Spring Data 按命名规则生成实现，不用手写 SQL。
        List<OrderSummary> findByCustomerIdOrderByPlacedAtDesc(UUID customerId);
    }

    static class OrderSummary {
        UUID id;
        UUID orderId;
        UUID customerId;
        BigDecimal total;
        String status;
        Instant placedAt;
    }
}
