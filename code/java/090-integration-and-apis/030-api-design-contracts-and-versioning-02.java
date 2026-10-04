package ch090;

import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 消费者侧的宽容读取：未知字段忽略，缺失的可选字段给默认值。
// 新增字段永远打不 broken 老的读取方，这就是加法演进的底气。
class ApiDesignContractsAndVersioning02 {

    @RestController
    @RequestMapping("/v1/orders")
    static class OrdersV1Controller {
        private final OrderStore store;

        OrdersV1Controller(OrderStore store) {
            this.store = store;
        }

        @GetMapping("/{id}")
        ResponseEntity<OrderDtoV1> get(@PathVariable UUID id) {
            Order order = store.get(id);
            return order == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(new OrderDtoV1(
                    order.id(), order.total(), order.status()));
        }
    }

    @RestController
    @RequestMapping("/v2/orders")
    static class OrdersV2Controller {
        private final OrderStore store;

        OrdersV2Controller(OrderStore store) {
            this.store = store;
        }

        @GetMapping("/{id}")
        ResponseEntity<OrderDtoV2> get(@PathVariable UUID id) {
            Order order = store.get(id);
            return order == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(new OrderDtoV2(
                    order.id(), order.total(), order.status(),
                    order.trackingNumber()));
        }
    }

    interface OrderStore {
        Order get(UUID id);
    }

    record Order(UUID id, BigDecimal total, String status, String trackingNumber) {}
    record OrderDtoV1(UUID id, BigDecimal total, String status) {}
    record OrderDtoV2(UUID id, BigDecimal total, String status, String trackingNumber) {}
}
