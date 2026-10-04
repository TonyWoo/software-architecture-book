// 编译桩：仅用于验证示例语法，对应真实依赖 io.micrometer:micrometer-observation
package io.micrometer.observation;

import java.util.function.Supplier;

public interface Observation {

    static Observation createNotStarted(String name, ObservationRegistry registry) {
        throw new UnsupportedOperationException("编译桩");
    }

    default void observe(Runnable action) {
        throw new UnsupportedOperationException("编译桩");
    }

    default <T> T observe(Supplier<T> action) {
        throw new UnsupportedOperationException("编译桩");
    }
}
