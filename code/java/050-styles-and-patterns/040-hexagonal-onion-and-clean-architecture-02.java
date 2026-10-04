package ch050;

import java.time.Clock;
import java.util.List;
import java.util.UUID;

class HexagonalOnionAndCleanArchitecture02 {

    // 核心：用例。只依赖端口和领域实体。
    static class PlaceOrder {
        private final OrderRepository orders;
        private final Clock clock; // java.time.Clock 就是 JDK 自带的时间端口，不用自己定义

        PlaceOrder(OrderRepository orders, Clock clock) {
            this.orders = orders;
            this.clock = clock;
        }

        OrderId handle(PlaceOrderCommand cmd) {
            var order = Order.create(cmd.customerId(), cmd.lines(), clock.instant());
            orders.save(order);
            return order.id();
        }
    }

    interface OrderRepository {
        void save(Order order);
    }

    record PlaceOrderCommand(UUID customerId, List<String> lines) {}
    record OrderId(UUID value) {}

    static class Order {
        private final OrderId id;

        private Order(OrderId id) {
            this.id = id;
        }

        static Order create(UUID customerId, List<String> lines, java.time.Instant now) {
            return new Order(new OrderId(UUID.randomUUID()));
        }

        OrderId id() {
            return id;
        }
    }
}
