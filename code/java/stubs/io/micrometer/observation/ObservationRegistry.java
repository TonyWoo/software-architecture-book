// 编译桩：仅用于验证示例语法，对应真实依赖 io.micrometer:micrometer-observation
package io.micrometer.observation;

public class ObservationRegistry {
    private ObservationRegistry() {
    }

    public static ObservationRegistry create() {
        return new ObservationRegistry();
    }
}
