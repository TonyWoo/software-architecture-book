package ch100;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

// OpenTelemetry 接入（Spring Boot 3 路线）：
// 依赖 micrometer-tracing-bridge-otel + opentelemetry-exporter-otlp，
// 配置 management.otlp.tracing.endpoint 指向收集器（Jaeger / Tempo / 厂商），
// 代码里只用 Observation API 埋点，span 自动进 OTel。
class ObservabilityLogsMetricsTraces02 {

    @Configuration
    static class TracingConfig {
        @Bean
        ObservationRegistry observationRegistry() {
            // 真实项目里 Spring Boot 自动装配，这里显式声明示意接线位置。
            return ObservationRegistry.create();
        }
    }

    @Service
    static class CheckoutService {
        private final ObservationRegistry registry;

        CheckoutService(ObservationRegistry registry) {
            this.registry = registry;
        }

        void checkout(String orderId) {
            // 一个 Observation = 一段被追踪的操作：
            // 入站请求、出站 HTTP、数据库查询都会自动产生子 span。
            Observation.createNotStarted("checkout", registry)
                .observe(() -> {
                    // ... 业务逻辑 ...
                });
        }
    }
}
