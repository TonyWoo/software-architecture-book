// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.kafka:spring-kafka
package org.springframework.kafka.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RetryableTopic {
    int attempts() default 3;
    long backoff() default 1000;
}
