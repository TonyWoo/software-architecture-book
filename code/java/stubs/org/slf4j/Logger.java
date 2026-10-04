// 编译桩：仅用于验证示例语法，对应真实依赖 org.slf4j:slf4j-api
package org.slf4j;

public interface Logger {
    void trace(String format, Object... args);

    void debug(String format, Object... args);

    void info(String format, Object... args);

    void warn(String format, Object... args);

    void error(String format, Object... args);
}
