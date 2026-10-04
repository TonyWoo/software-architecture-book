// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-retry
package io.github.resilience4j.retry;

public class Retry {
    private Retry() {
    }

    public static Retry of(String name, RetryConfig config) {
        return new Retry();
    }

    public static Retry ofDefaults(String name) {
        return new Retry();
    }
}
