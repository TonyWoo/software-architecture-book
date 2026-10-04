// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.data:spring-data-mongodb
package org.springframework.data.mongodb.core.mapping;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Document {
    String collection() default "";
    String value() default "";
}
