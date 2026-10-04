// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework:spring-context
package org.springframework.context;

public interface ApplicationEventPublisher {
    void publishEvent(Object event);
}
