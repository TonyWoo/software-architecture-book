// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-core
package io.github.resilience4j.core;

import java.util.function.Function;

public interface IntervalFunction extends Function<Integer, Long> {

    static IntervalFunction of(long intervalMillis) {
        return attempt -> intervalMillis;
    }

    static IntervalFunction ofExponentialBackoff(long initialIntervalMillis, double multiplier) {
        return attempt -> (long) (initialIntervalMillis * Math.pow(multiplier, attempt - 1));
    }

    static IntervalFunction ofDefaults() {
        return of(500L);
    }
}
