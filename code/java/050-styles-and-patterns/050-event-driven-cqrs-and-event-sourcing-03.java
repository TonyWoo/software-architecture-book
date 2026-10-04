package ch050;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

class EventDrivenCqrsAndEventSourcing03 {

    // 极简事件存储草图：只追加，按聚合分流
    interface EventStore {
        void append(UUID streamId, long expectedVersion, List<Object> events);
        List<Object> readStream(UUID streamId);
    }

    static class OrderAggregate {
        private final List<Object> uncommitted = new ArrayList<>();
        private long version;
        private OrderStatus status;

        // 重建：把每条历史事件折叠进 apply
        static OrderAggregate rehydrate(List<Object> history) {
            var agg = new OrderAggregate();
            history.forEach(agg::apply);
            return agg;
        }

        void capturePayment(BigDecimal amount, Instant at) {
            if (status != OrderStatus.PLACED)
                throw new IllegalStateException("只有已下单的订单才能收款。");
            raise(new PaymentCaptured(amount, at)); // 先记下事实，再应用它
        }

        private void raise(Object e) {
            uncommitted.add(e);
            apply(e);
        }

        private void apply(Object e) {
            // Java 21 的模式匹配 switch：事件类型即分支，未知事件直接拦下
            switch (e) {
                case OrderPlaced p -> status = OrderStatus.PLACED;
                case PaymentCaptured p -> status = OrderStatus.PAID;
                case ShipmentSent s -> status = OrderStatus.SHIPPED;
                case null, default -> throw new IllegalArgumentException("未知事件: " + e);
            }
            version++;
        }

        List<Object> dequeueUncommitted() {
            var events = List.copyOf(uncommitted);
            uncommitted.clear();
            return events;
        }
    }

    enum OrderStatus { PLACED, PAID, SHIPPED }
    record OrderPlaced(UUID orderId) {}
    record PaymentCaptured(BigDecimal amount, Instant at) {}
    record ShipmentSent(UUID orderId, Instant at) {}
}
