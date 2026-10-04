package ch100;

import io.github.resilience4j.bulkhead.Bulkhead;
import io.github.resilience4j.bulkhead.BulkheadConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.decorators.Decorators;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.Executors;

// 分层叠加（由外到内）：超时 → 舱壁 → 熔断。
// 读法：超时限定总等待；舱壁隔离这个依赖的并发；熔断在依赖持续失败时直接短路。
class ResilienceBreakerBulkheadTimeout01 {

    static String getStock(HttpClient http, URI url) throws Exception {
        // 最外层：限定总等待时间。
        var timeout = TimeLimiter.of(TimeLimiterConfig.custom()
            .timeoutDuration(Duration.ofSeconds(10))
            .build());

        // 中间层：隔离这个依赖的并发数。
        var bulkhead = Bulkhead.of("inventory", BulkheadConfig.custom()
            .maxConcurrentCalls(20) // 最多 20 个并发
            .maxWaitDuration(Duration.ofMillis(500)) // 再多就直接拒绝
            .build());

        // 最内层：依赖持续失败时直接短路，不再发请求。
        var breaker = CircuitBreaker.of("inventory", CircuitBreakerConfig.custom()
            .failureRateThreshold(50) // 30 秒窗口内失败率超 50%
            .minimumNumberOfCalls(10) // 样本太少时不触发
            .waitDurationInOpenState(Duration.ofSeconds(60)) // 打开 60 秒后放探测请求
            .recordExceptions(IOException.class)
            .build());

        // Decorators：先写的先执行 → 靠内的策略先写。
        // withTimeLimiter 最后 → 超时最外；withCircuitBreaker 最先 → 熔断最内。
        // 受检异常在 lambda 里转成非受检：策略只关心"失败"，不关心异常类型。
        var decorated = Decorators
            .ofSupplier(() -> {
                try {
                    var request = HttpRequest.newBuilder(url).GET().build();
                    return http.send(request, HttpResponse.BodyHandlers.ofString());
                } catch (IOException | InterruptedException e) {
                    throw new IllegalStateException("下游调用失败", e);
                }
            })
            .withCircuitBreaker(breaker)
            .withBulkhead(bulkhead)
            .withTimeLimiter(timeout,
                Executors.newSingleThreadScheduledExecutor())
            .decorate();

        final HttpResponse<String> response;
        try {
            response = decorated.get();
        } catch (Throwable th) {
            // CheckedSupplier.get() 声明抛 Throwable，这里转成运行时异常。
            throw new RuntimeException("下游调用失败", th);
        }
        if (response.statusCode() >= 500)
            throw new IOException("下游 5xx: " + response.statusCode());
        return response.body();
    }
}
