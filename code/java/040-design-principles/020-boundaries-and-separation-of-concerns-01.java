package ch040;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.UUID;

class BoundariesAndSeparationOfConcerns01 {

    // 没有边界：领域逻辑和某个具体的数据库 API 结了婚。
    static class OrderRepository {
        void save(Order order) throws Exception {
            // JDBC、PostgreSQL，写死了：换数据库要改领域代码。
            try (Connection conn = DriverManager.getConnection("jdbc:postgresql://db/orders");
                 PreparedStatement ps = conn.prepareStatement("INSERT INTO orders ...")) {
                ps.executeUpdate();
            }
        }
    }

    // 画出边界：领域只依赖自己定义的接口。
    // 换掉数据库不需要动领域代码的一行。
    interface OrderStore {
        void save(Order order);
        Order load(OrderId id);
    }

    static class PlaceOrderUseCase {
        private final OrderStore store;

        PlaceOrderUseCase(OrderStore store) {
            this.store = store;
        }

        void execute(Order order) {
            if (order.lines().isEmpty())
                throw new IllegalStateException("Empty order.");
            store.save(order);
        }
    }

    record OrderId(UUID value) {}
    record Order(OrderId id, List<String> lines) {}
}
