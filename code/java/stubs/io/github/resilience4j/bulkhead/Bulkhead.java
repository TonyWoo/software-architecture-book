// 编译桩：仅用于验证示例语法，对应真实依赖 io.github.resilience4j:resilience4j-bulkhead
package io.github.resilience4j.bulkhead;

public class Bulkhead {
    private Bulkhead() {
    }

    public static Bulkhead of(String name, BulkheadConfig config) {
        return new Bulkhead();
    }

    public static Bulkhead ofDefaults(String name) {
        return new Bulkhead();
    }
}
