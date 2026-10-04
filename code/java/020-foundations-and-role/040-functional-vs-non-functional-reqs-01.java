package ch020;

import java.net.URI;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// NFR：下单 p99 < 800ms。支付网关 p99 约 1200ms。
// 决策（ADR-007）：同步接单并返回，通过 outbox 异步扣款。请求路径永不阻塞在第三方上。
class FunctionalVsNonFunctionalReqs01 {

    @RestController
    @RequestMapping("/orders")
    static class OrderController {
        private final OrderOutbox outbox;

        OrderController(OrderOutbox outbox) {
            this.outbox = outbox;
        }

        @PostMapping
        ResponseEntity<OrderAccepted> place(@RequestBody PlaceOrderRequest req) {
            var order = Order.create(req); // 纯领域逻辑，无 I/O
            outbox.enqueue(order);         // 一次快速的 DB 写入
            // 202 Accepted："收到了，正在处理。"扣款由后台任务完成。
            return ResponseEntity.accepted()
                .location(URI.create("/orders/" + order.id()))
                .body(new OrderAccepted(order.id()));
        }
    }

    record PlaceOrderRequest(String customerId, String sku, int quantity) {}
    record OrderAccepted(UUID orderId) {}

    static class Order {
        private final UUID id = UUID.randomUUID();
        private String status = "Accepted";

        UUID id() {
            return id;
        }

        static Order create(PlaceOrderRequest req) {
            if (req.customerId() == null || req.customerId().isBlank())
                throw new IllegalArgumentException("customerId 不能为空");
            if (req.quantity() <= 0)
                throw new IllegalArgumentException("quantity 必须为正");
            return new Order();
        }
    }

    interface OrderOutbox {
        void enqueue(Order order);
    }
}
