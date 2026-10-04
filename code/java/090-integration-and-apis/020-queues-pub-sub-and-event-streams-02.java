package ch090;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

// 消息基础设施的装配：主题、生产者，一处配好。
class QueuesPubSubAndEventStreams02 {

    @Configuration
    static class KafkaTopics {
        @Bean
        NewTopic chargePayments() {
            // 主题即契约：分区数、副本数在这里定，改它们是架构决策。
            return TopicBuilder.name("payments.charge")
                .partitions(6)
                .replicas(3)
                .build();
        }
    }

    @Component
    static class PaymentCommandPublisher {
        private final KafkaTemplate<String, String> kafka;

        PaymentCommandPublisher(KafkaTemplate<String, String> kafka) {
            this.kafka = kafka;
        }

        CompletableFuture<Void> requestCharge(UUID orderId, String payload) {
            // 键 = orderId：同一订单的命令进同一个分区，顺序有保障。
            return kafka.send("payments.charge", orderId.toString(), payload)
                .thenApply(r -> null);
        }
    }
}
