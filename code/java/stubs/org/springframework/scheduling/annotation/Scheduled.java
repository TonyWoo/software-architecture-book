// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework:spring-context
package org.springframework.scheduling.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Scheduled {
    long fixedDelay() default -1;
    String fixedDelayString() default "";
    long fixedRate() default -1;
    String cron() default "";
}
