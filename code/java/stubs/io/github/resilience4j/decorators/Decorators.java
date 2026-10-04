// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-decorators
package io.github.resilience4j.decorators;

import io.github.resilience4j.bulkhead.Bulkhead;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.timelimiter.TimeLimiter;
import java.util.concurrent.ScheduledExecutorService;
import java.util.function.Supplier;

public class Decorators {

    private Decorators() {
    }

    public static <T> DecorateSupplier<T> ofSupplier(Supplier<T> supplier) {
        return new DecorateSupplier<>();
    }

    public static <T> DecorateCheckedSupplier<T> ofCheckedSupplier(CheckedSupplier<T> supplier) {
        return new DecorateCheckedSupplier<>();
    }

    @FunctionalInterface
    public interface CheckedSupplier<T> {
        T get() throws Throwable;
    }

    public static class DecorateSupplier<T> {
        public DecorateSupplier<T> withRetry(Retry retry) {
            return this;
        }

        public DecorateSupplier<T> withRetry(Retry retry, ScheduledExecutorService scheduler) {
            return this;
        }

        public DecorateSupplier<T> withCircuitBreaker(CircuitBreaker circuitBreaker) {
            return this;
        }

        public DecorateSupplier<T> withBulkhead(Bulkhead bulkhead) {
            return this;
        }

        public DecorateSupplier<T> withRateLimiter(RateLimiter rateLimiter) {
            return this;
        }

        public DecorateSupplier<T> withTimeLimiter(TimeLimiter timeLimiter,
                ScheduledExecutorService scheduler) {
            return this;
        }

        public Supplier<T> decorate() {
            throw new UnsupportedOperationException("编译桩");
        }

        public Supplier<T> get() {
            throw new UnsupportedOperationException("编译桩");
        }
    }

    public static class DecorateCheckedSupplier<T> {
        public DecorateCheckedSupplier<T> withRetry(Retry retry) {
            return this;
        }

        public DecorateCheckedSupplier<T> withRetry(Retry retry, ScheduledExecutorService scheduler) {
            return this;
        }

        public DecorateCheckedSupplier<T> withCircuitBreaker(CircuitBreaker circuitBreaker) {
            return this;
        }

        public DecorateCheckedSupplier<T> withBulkhead(Bulkhead bulkhead) {
            return this;
        }

        public DecorateCheckedSupplier<T> withRateLimiter(RateLimiter rateLimiter) {
            return this;
        }

        public DecorateCheckedSupplier<T> withTimeLimiter(TimeLimiter timeLimiter,
                ScheduledExecutorService scheduler) {
            return this;
        }

        public CheckedSupplier<T> decorate() {
            throw new UnsupportedOperationException("编译桩");
        }

        public CheckedSupplier<T> get() {
            throw new UnsupportedOperationException("编译桩");
        }
    }
}
