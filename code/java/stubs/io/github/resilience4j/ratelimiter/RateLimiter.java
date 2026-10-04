// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-ratelimiter
package io.github.resilience4j.ratelimiter;

public class RateLimiter {
    private RateLimiter() {
    }

    public static RateLimiter of(String name, RateLimiterConfig config) {
        return new RateLimiter();
    }

    public static RateLimiter ofDefaults(String name) {
        return new RateLimiter();
    }

    public void acquirePermission() {
        throw new UnsupportedOperationException("编译桩");
    }
}
