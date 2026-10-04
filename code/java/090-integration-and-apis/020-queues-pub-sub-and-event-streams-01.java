package ch090;

import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.stereotype.Component;

// 命令消费者：一个活儿，一个工人。幂等是你的活儿，框架替不了。
class QueuesPubSubAndEventStreams01 {

    @Component
    static class ChargePaymentConsumer {
        private final PaymentGateway gateway;
        private final OrderStore orders;

        ChargePaymentConsumer(PaymentGateway gateway, OrderStore orders) {
            this.gateway = gateway;
            this.orders = orders;
        }

        // 失败先重试 3 次（退避 1s→2s→4s），实在不行进死信主题人工看，别直接丢。
        @RetryableTopic(attempts = 3, backoff = 1000)
        @KafkaListener(topics = "payments.charge", groupId = "payments")
        void consume(ChargePayment command) {
            Order order = orders.get(command.orderId());

            // at-least-once 意味着这段代码可能跑两遍。
            // 这个守卫就是"效果上的恰好一次"，删掉它等于允许重复扣款。
            if (order.paymentStatus() == PaymentStatus.CHARGED)
                return;

            gateway.charge(order.id(), order.total());
            order.markCharged();
            orders.save(order);
        }

        // 死信：重试耗尽后来这里——记日志、报警、人工介入。
        @DltHandler
        void handleDeadLetter(ChargePayment command) {
            throw new UnsupportedOperationException(
                "演示用：记录死信并报警，等待人工处理: " + command.orderId());
        }
    }

    record ChargePayment(UUID orderId) {}

    enum PaymentStatus { PENDING, CHARGED }

    interface PaymentGateway {
        void charge(UUID orderId, BigDecimal total);
    }

    interface OrderStore {
        Order get(UUID orderId);
        void save(Order order);
    }

    static class Order {
        private final UUID id = UUID.randomUUID();
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;

        UUID id() {
            return id;
        }

        BigDecimal total() {
            return BigDecimal.ZERO;
        }

        PaymentStatus paymentStatus() {
            return paymentStatus;
        }

        void markCharged() {
            paymentStatus = PaymentStatus.CHARGED;
        }
    }
}
