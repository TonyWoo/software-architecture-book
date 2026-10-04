package ch050;

import java.util.Optional;
import java.util.UUID;

class HexagonalOnionAndCleanArchitecture01 {

    // 核心：端口。归应用层所有，在外部实现。
    interface OrderRepository {
        Optional<Order> findById(OrderId id);
        void save(Order order);
    }

    interface Clock {
        java.time.Instant now();
    }

    record OrderId(UUID value) {}
    record Order(OrderId id) {}
}
