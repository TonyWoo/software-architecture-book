// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.cloud:spring-cloud-gateway-server
// 只覆盖示例用到的 DSL 方法，形状与真实 RouteLocatorBuilder 一致。
package org.springframework.cloud.gateway.route;

import java.util.function.Function;

public class RouteLocatorBuilder {
    public RouteBuilder routes() {
        return new RouteBuilder();
    }

    public static class RouteBuilder {
        public RouteBuilder route(String id, Function<RouteSpec, RouteSpec> fn) {
            fn.apply(new RouteSpec());
            return this;
        }

        public RouteLocator build() {
            return new RouteLocator();
        }
    }

    public static class RouteSpec {
        public RouteSpec path(String pattern) {
            return this;
        }

        public RouteSpec filters(
                java.util.function.Function<GatewayFilterSpec, GatewayFilterSpec> fn) {
            fn.apply(new GatewayFilterSpec());
            return this;
        }

        public RouteSpec uri(String uri) {
            return this;
        }
    }

    // 编译桩：对应真实依赖的 GatewayFilterSpec，形状与真实 DSL 一致。
    public static class GatewayFilterSpec {
        public GatewayFilterSpec stripPrefix(int parts) {
            return this;
        }

        public GatewayFilterSpec circuitBreaker(
                java.util.function.Consumer<CircuitBreakerSpec> configurer) {
            configurer.accept(new CircuitBreakerSpec());
            return this;
        }
    }

    // 编译桩：对应 Spring Cloud Gateway 的熔断过滤器配置项。
    public static class CircuitBreakerSpec {
        public CircuitBreakerSpec setName(String name) {
            return this;
        }

        public CircuitBreakerSpec setFallbackUri(String fallbackUri) {
            return this;
        }
    }
}
