// 编译桩：仅用于验证示例语法，对应真实依赖 org.slf4j:slf4j-api
package org.slf4j;

public final class LoggerFactory {
    private LoggerFactory() {
    }

    public static Logger getLogger(Class<?> clazz) {
        throw new UnsupportedOperationException("编译桩");
    }
}
