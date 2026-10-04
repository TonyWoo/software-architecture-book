// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-circuitbreaker
package io.github.resilience4j.circuitbreaker;

import java.time.Duration;
import java.util.function.Predicate;

public class CircuitBreakerConfig {
    private CircuitBreakerConfig() {
    }

    public static Builder custom() {
        return new Builder();
    }

    public static CircuitBreakerConfig ofDefaults() {
        return new CircuitBreakerConfig();
    }

    public static class Builder {
        public Builder failureRateThreshold(float failureRateThreshold) {
            return this;
        }

        public Builder minimumNumberOfCalls(int minimumNumberOfCalls) {
            return this;
        }

        public Builder slidingWindowSize(int slidingWindowSize) {
            return this;
        }

        public Builder waitDurationInOpenState(Duration waitDurationInOpenState) {
            return this;
        }

        public Builder permittedNumberOfCallsInHalfOpenState(int permittedNumberOfCallsInHalfOpenState) {
            return this;
        }

        @SafeVarargs
        public final Builder recordExceptions(Class<? extends Throwable>... classes) {
            return this;
        }

        public Builder recordResult(Predicate<Object> predicate) {
            return this;
        }

        public CircuitBreakerConfig build() {
            return new CircuitBreakerConfig();
        }
    }
}
