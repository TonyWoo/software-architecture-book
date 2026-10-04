// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-timelimiter
package io.github.resilience4j.timelimiter;

import java.time.Duration;

public class TimeLimiter {
    private TimeLimiter() {
    }

    public static TimeLimiter of(TimeLimiterConfig config) {
        return new TimeLimiter();
    }

    public static TimeLimiter of(Duration timeoutDuration) {
        return new TimeLimiter();
    }
}
