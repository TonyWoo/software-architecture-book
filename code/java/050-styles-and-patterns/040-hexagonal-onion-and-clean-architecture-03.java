package ch050;

import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

// 外圈：适配器。住在基础设施包里。
class HexagonalOnionAndCleanArchitecture03 {

    @Repository
    static class SqlOrderRepository implements OrderRepository {
        private final JdbcTemplate jdbc;

        SqlOrderRepository(JdbcTemplate jdbc) {
            this.jdbc = jdbc;
        }

        public Optional<Order> findById(OrderId id) {
            var rows = jdbc.query("SELECT id FROM orders WHERE id = ?",
                (rs, n) -> new Order(new OrderId(rs.getObject("id", UUID.class))),
                id.value());
            return rows.stream().findFirst(); // 行记录到领域对象的映射只住在这里
        }

        public void save(Order order) {
            jdbc.update("INSERT INTO orders (id) VALUES (?)", order.id().value());
        }
    }

    interface OrderRepository {
        Optional<Order> findById(OrderId id);
        void save(Order order);
    }

    record OrderId(UUID value) {}
    record Order(OrderId id) {}
}
