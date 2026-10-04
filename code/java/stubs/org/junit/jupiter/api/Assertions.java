// 编译桩：仅用于验证示例语法，对应真实依赖 org.junit.jupiter:junit-jupiter-api
package org.junit.jupiter.api;

public final class Assertions {
    private Assertions() {
    }

    public static void assertTrue(boolean condition, String message) {
        if (!condition) {
            throw new AssertionError(message);
        }
    }

    public static void assertTrue(boolean condition) {
        assertTrue(condition, "期望为 true");
    }

    public static void assertEquals(Object expected, Object actual, String message) {
        if (!java.util.Objects.equals(expected, actual)) {
            throw new AssertionError(message + " 期望: " + expected + ", 实际: " + actual);
        }
    }
}
