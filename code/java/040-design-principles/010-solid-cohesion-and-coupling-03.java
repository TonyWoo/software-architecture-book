package ch040;

import java.math.BigDecimal;
import java.util.List;

class SolidCohesionAndCoupling03 {

    // 低内聚、高耦合：Order 什么都懂——支付、邮件、库存。
    static class Order {
        void process() {
            chargeCreditCard(); // 支付方面的事
            sendEmail();        // 通知方面的事
            updateStock();      // 库存方面的事
        }

        private void chargeCreditCard() {}
        private void sendEmail() {}
        private void updateStock() {}

        BigDecimal total() {
            return BigDecimal.ZERO;
        }

        List<String> lines() {
            return List.of();
        }

        String customer() {
            return "";
        }
    }

    // 内聚、解耦：每个关注点管自己的行为，
    // 由协调者组装，而不是硬引用。
    static class OrderProcessor {
        private final PaymentGateway payments;
        private final Notifier notifier;
        private final Inventory inventory;

        OrderProcessor(PaymentGateway payments, Notifier notifier, Inventory inventory) {
            this.payments = payments;
            this.notifier = notifier;
            this.inventory = inventory;
        }

        void process(Order order) {
            payments.charge(order.total());
            inventory.reserve(order.lines());
            notifier.send(order.customer(), "Your order shipped.");
        }
    }

    interface PaymentGateway {
        void charge(BigDecimal amount);
    }

    interface Notifier {
        void send(String customer, String message);
    }

    interface Inventory {
        void reserve(List<String> lines);
    }
}
