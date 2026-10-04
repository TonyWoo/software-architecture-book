package ch070;

import java.util.UUID;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

class TransactionsSagasAndOutbox02 {

    // Saga 编排：跨服务的长事务，每一步都有补偿动作
    // 下单 → 扣库存 → 扣款，任一步失败就反向补偿

    @Service
    static class OrderSaga {
        private final InventoryClient inventory;
        private final PaymentClient payment;

        OrderSaga(InventoryClient inventory, PaymentClient payment) {
            this.inventory = inventory;
            this.payment = payment;
        }

        @KafkaListener(topics = "orders.events", groupId = "saga")
        void onOrderPlaced(String orderId) {
            var id = UUID.fromString(orderId);
            try {
                inventory.reserve(id);   // 步骤 1
                payment.charge(id);      // 步骤 2
                // 全部成功：Saga 完成
            } catch (Exception e) {
                compensate(id, e);       // 任一步失败：反向补偿
            }
        }

        private void compensate(UUID orderId, Exception cause) {
            // 补偿按反序执行：先退钱，再释放库存
            try {
                payment.refund(orderId);
            } finally {
                inventory.release(orderId);
            }
            throw new IllegalStateException("Saga 失败，已补偿: " + orderId, cause);
        }
    }

    interface InventoryClient {
        void reserve(UUID orderId);
        void release(UUID orderId);
    }

    interface PaymentClient {
        void charge(UUID orderId);
        void refund(UUID orderId);
    }
}
