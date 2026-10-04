// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.kafka:spring-kafka
package org.springframework.kafka.config;

public class TopicBuilder {
    private TopicBuilder() {
    }

    public static TopicBuilder name(String name) {
        return new TopicBuilder();
    }

    public TopicBuilder partitions(int partitions) {
        return this;
    }

    public TopicBuilder replicas(int replicas) {
        return this;
    }

    public org.apache.kafka.clients.admin.NewTopic build() {
        throw new UnsupportedOperationException("编译桩");
    }
}
