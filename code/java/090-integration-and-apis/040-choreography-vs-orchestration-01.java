package ch090;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

// 编排者：订单履约流程的主人。
// 顺序、分支、补偿都在这里，不散落在各处。改流程只改这一个文件。
class ChoreographyVsOrchestration01 {

    @Service
    static class FulfillmentOrchestrator {
        private final PaymentService payments;
        private final WarehouseService warehouse;
        private final Notifier notifier;
        private final OrderStore orders;

        FulfillmentOrchestrator(PaymentService payments, WarehouseService warehouse,
                                Notifier notifier, OrderStore orders) {
            this.payments = payments;
            this.warehouse = warehouse;
            this.notifier = notifier;
            this.orders = orders;
        }

        void run(UUID orderId) {
            Order order = orders.get(orderId);

            // 第一步：扣款。失败则直接通知用户，流程结束。
            if (!payments.charge(order.id(), order.total())) {
                notifier.tellUser(order.userId(), "支付失败，请重试");
                return;
            }

            // 第二步：锁库存。库存不够要补偿——把刚扣的钱退回去。
            // 这就是 saga 的雏形：没有分布式事务，用补偿动作保证最终一致。
            if (!warehouse.reserve(order.id(), order.lines())) {
                payments.refund(order.id(), order.total());
                notifier.tellUser(order.userId(), "库存不足，已退款");
                return;
            }

            order.markReadyToShip();
            orders.save(order);
        }
    }

    interface PaymentService {
        boolean charge(UUID orderId, BigDecimal total);
        void refund(UUID orderId, BigDecimal total);
    }

    interface WarehouseService {
        boolean reserve(UUID orderId, List<String> lines);
    }

    interface Notifier {
        void tellUser(String userId, String message);
    }

    interface OrderStore {
        Order get(UUID orderId);
        void save(Order order);
    }

    static class Order {
        private final UUID id = UUID.randomUUID();
        private final String userId = "";

        UUID id() {
            return id;
        }

        String userId() {
            return userId;
        }

        BigDecimal total() {
            return BigDecimal.ZERO;
        }

        List<String> lines() {
            return List.of();
        }

        void markReadyToShip() {
        }
    }
}
