package ch070;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

class TransactionsSagasAndOutbox01 {

    // 事务发件箱：业务写库 + 事件入箱在同一个本地事务里
    static class OutboxMessage {
        UUID id = UUID.randomUUID();
        String aggregateType;
        UUID aggregateId;
        String eventType;
        String payload;
        Instant createdAt = Instant.now();
        Instant publishedAt; // null = 待发布
    }

    @Repository
    interface OutboxRepository extends JpaRepository<OutboxMessage, UUID> {
        // 找出待发布的消息：Spring Data 按方法名生成查询
        java.util.List<OutboxMessage> findTop100ByPublishedAtIsNullOrderByCreatedAtAsc();
    }

    @Service
    static class OrderService {
        private final OutboxRepository outbox;

        OrderService(OutboxRepository outbox) {
            this.outbox = outbox;
        }

        // 本地事务：订单入库 + 事件入箱，要么一起成功，要么一起回滚
        @Transactional
        void placeOrder(String orderId, String payload) {
            // 1. 写业务表（略）
            // 2. 事件入箱：同一个事务
            var msg = new OutboxMessage();
            msg.aggregateType = "Order";
            msg.aggregateId = UUID.fromString(orderId);
            msg.eventType = "OrderPlaced";
            msg.payload = payload;
            outbox.save(msg);
        }
    }

    // 中继器：定时把箱里的事件发出去，发完标记 publishedAt
    @Service
    static class OutboxRelay {
        private final OutboxRepository outbox;
        private final KafkaTemplate<String, String> kafka;

        OutboxRelay(OutboxRepository outbox, KafkaTemplate<String, String> kafka) {
            this.outbox = outbox;
            this.kafka = kafka;
        }

        @Scheduled(fixedDelay = 1000)
        @Transactional
        void relay() {
            for (var msg : outbox.findTop100ByPublishedAtIsNullOrderByCreatedAtAsc()) {
                kafka.send("orders.events", msg.aggregateId.toString(), msg.payload).join();
                msg.publishedAt = Instant.now();
                outbox.save(msg);
            }
        }
    }
}
