// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-timelimiter
package io.github.resilience4j.timelimiter;

import java.time.Duration;

public class TimeLimiterConfig {
    private TimeLimiterConfig() {
    }

    public static Builder custom() {
        return new Builder();
    }

    public static class Builder {
        public Builder timeoutDuration(Duration timeoutDuration) {
            return this;
        }

        public TimeLimiterConfig build() {
            return new TimeLimiterConfig();
        }
    }
}
