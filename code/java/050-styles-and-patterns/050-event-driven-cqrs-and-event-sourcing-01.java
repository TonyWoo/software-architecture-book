package ch050;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

class EventDrivenCqrsAndEventSourcing01 {

    // 写侧：命令，带着完整的领域逻辑处理
    record PlaceOrderCommand(UUID customerId, List<String> lines) {}

    // 领域事件：已经发生的事实，不可变
    record OrderPlaced(UUID orderId, BigDecimal total, Instant occurredAt) {}

    @Service
    static class PlaceOrderHandler {
        private final OrderRepository orders;
        private final ApplicationEventPublisher events;
        private final Clock clock;

        PlaceOrderHandler(OrderRepository orders, ApplicationEventPublisher events,
                          Clock clock) {
            this.orders = orders;
            this.events = events;
            this.clock = clock;
        }

        UUID handle(PlaceOrderCommand cmd) {
            var order = Order.create(cmd.customerId(), cmd.lines(), clock.instant());
            orders.save(order);

            // 写侧宣告事实。谁来反应，不归它管。
            events.publishEvent(new OrderPlaced(order.id(), order.total(), clock.instant()));

            return order.id();
        }
    }

    interface OrderRepository {
        void save(Order order);
    }

    static class Order {
        private final UUID id = UUID.randomUUID();

        UUID id() {
            return id;
        }

        BigDecimal total() {
            return BigDecimal.ZERO;
        }

        static Order create(UUID customerId, List<String> lines, Instant now) {
            return new Order();
        }
    }
}
