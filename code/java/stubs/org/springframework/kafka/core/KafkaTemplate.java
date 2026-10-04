// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.kafka:spring-kafka
package org.springframework.kafka.core;

import java.util.concurrent.CompletableFuture;

public class KafkaTemplate<K, V> {
    public CompletableFuture<SendResult<K, V>> send(String topic, K key, V data) {
        throw new UnsupportedOperationException("编译桩");
    }

    public static class SendResult<K, V> {
    }
}
