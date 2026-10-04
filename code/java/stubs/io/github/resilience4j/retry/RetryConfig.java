// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-retry
package io.github.resilience4j.retry;

import io.github.resilience4j.core.IntervalFunction;
import java.time.Duration;
import java.util.function.Predicate;

public class RetryConfig {
    private RetryConfig() {
    }

    public static <T> Builder<T> custom() {
        return new Builder<>();
    }

    public static RetryConfig ofDefaults() {
        return new RetryConfig();
    }

    public static class Builder<T> {
        public Builder<T> maxAttempts(int maxAttempts) {
            return this;
        }

        public Builder<T> waitDuration(Duration waitDuration) {
            return this;
        }

        public Builder<T> intervalFunction(IntervalFunction intervalFunction) {
            return this;
        }

        public Builder<T> retryOnException(Predicate<Throwable> predicate) {
            return this;
        }

        public Builder<T> retryOnResult(Predicate<T> predicate) {
            return this;
        }

        public Builder<T> failAfterMaxAttempts(boolean failAfterMaxAttempts) {
            return this;
        }

        public RetryConfig build() {
            return new RetryConfig();
        }
    }
}
