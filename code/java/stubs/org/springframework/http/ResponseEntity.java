// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework:spring-web
package org.springframework.http;

import java.net.URI;

public class ResponseEntity<T> {
    private ResponseEntity() {
    }

    public static <T> ResponseEntity<T> ok(T body) {
        return new ResponseEntity<>();
    }

    public static BodyBuilder accepted() {
        return new BodyBuilder();
    }

    public static HeadersBuilder<?> notFound() {
        return new HeadersBuilder<>();
    }

    public static BodyBuilder status(int status) {
        return new BodyBuilder();
    }

    public static class BodyBuilder {
        public BodyBuilder location(URI location) {
            return this;
        }

        public <T> ResponseEntity<T> body(T body) {
            return new ResponseEntity<>();
        }
    }

    public static class HeadersBuilder<B extends HeadersBuilder<B>> {
        @SuppressWarnings("unchecked")
        public B location(URI location) {
            return (B) this;
        }

        public <T> ResponseEntity<T> build() {
            return new ResponseEntity<>();
        }
    }
}
