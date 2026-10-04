// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-bulkhead
package io.github.resilience4j.bulkhead;

import java.time.Duration;

public class BulkheadConfig {
    private BulkheadConfig() {
    }

    public static Builder custom() {
        return new Builder();
    }

    public static BulkheadConfig ofDefaults() {
        return new BulkheadConfig();
    }

    public static class Builder {
        public Builder maxConcurrentCalls(int maxConcurrentCalls) {
            return this;
        }

        public Builder maxWaitDuration(Duration maxWaitDuration) {
            return this;
        }

        public BulkheadConfig build() {
            return new BulkheadConfig();
        }
    }
}
