package ch030;

import io.github.resilience4j.core.IntervalFunction;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import java.io.IOException;

class TradeOffAnalysisNoFreeLunch01 {

    static Retry pricingRetry() {
        // 把权衡写进代码：Resilience4j 策略精确声明了
        // 你愿意承受多少延迟之痛，来换取可靠性。
        return Retry.of("pricing", RetryConfig.<Object>custom()
            .maxAttempts(4) // 1 次尝试 + 3 次重试
            .intervalFunction(IntervalFunction.ofExponentialBackoff(100, 2.0)) // 100ms、200ms、400ms
            .retryOnException(e -> e instanceof IOException)
            .build());
    }

    // 你买到了韧性，付出的是延迟：最坏约 700 毫秒的额外等待。
    // 如果你的 SLA 是 200 毫秒，这个策略本身就是违约。
}
