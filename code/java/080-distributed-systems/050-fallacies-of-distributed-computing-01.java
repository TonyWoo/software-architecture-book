package ch080;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.core.IntervalFunction;
import io.github.resilience4j.decorators.Decorators;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadLocalRandom;

// 不相信谬论的调用长这样——超时、退避、抖动、熔断，一样都不缺。
class FallaciesOfDistributedComputing01 {

    static String getWithResilience(HttpClient http, URI url) throws Exception {
        var retry = Retry.of("downstream", RetryConfig.<HttpResponse<String>>custom()
            .maxAttempts(4) // 1 次尝试 + 3 次重试
            // 指数退避 + 抖动：避免所有客户端步调一致地重试
            .intervalFunction(attempt ->
                (long) (Math.pow(2, attempt) * 1000)
                    + ThreadLocalRandom.current().nextLong(0, 500))
            .retryOnException(e -> e instanceof IOException)
            .retryOnResult(r -> r.statusCode() >= 500)
            .build());

        var breaker = CircuitBreaker.of("downstream", CircuitBreakerConfig.custom()
            // 依赖持续失败就停手，别陪它一起死
            .failureRateThreshold(50)
            .minimumNumberOfCalls(10) // 样本太少时不触发
            .waitDurationInOpenState(Duration.ofSeconds(60))
            .build());

        // Decorators：后加的在外层——重试包着熔断，熔断包着单次超时。
        // 受检异常在 lambda 里转成非受检：策略只关心"失败"，不关心异常类型。
        var decorated = Decorators
            .ofSupplier(() -> {
                try {
                    var request = HttpRequest.newBuilder(url)
                        .timeout(Duration.ofSeconds(5)) // 延迟永远不为零，先设上限
                        .GET()
                        .build();
                    return http.send(request, HttpResponse.BodyHandlers.ofString());
                } catch (IOException | InterruptedException e) {
                    throw new IllegalStateException("下游调用失败", e);
                }
            })
            .withTimeLimiter(
                TimeLimiter.of(TimeLimiterConfig.custom()
                    .timeoutDuration(Duration.ofSeconds(5))
                    .build()),
                Executors.newSingleThreadScheduledExecutor())
            .withCircuitBreaker(breaker)
            .withRetry(retry)
            .decorate();

        try {
            return decorated.get().body();
        } catch (Throwable t) {
            // CheckedSupplier.get() 声明抛 Throwable，这里转成运行时异常。
            throw new RuntimeException("下游调用失败", t);
        }
    }
}
