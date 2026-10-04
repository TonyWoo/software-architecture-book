// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-circuitbreaker
package io.github.resilience4j.circuitbreaker;

public class CircuitBreaker {
    private CircuitBreaker() {
    }

    public static CircuitBreaker of(String name, CircuitBreakerConfig config) {
        return new CircuitBreaker();
    }

    public static CircuitBreaker ofDefaults(String name) {
        return new CircuitBreaker();
    }
}
