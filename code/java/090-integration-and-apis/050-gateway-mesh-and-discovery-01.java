package ch090;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// 一个薄网关。只做路由和入口策略，业务逻辑一律不碰。
class GatewayMeshAndDiscovery01 {

    @Configuration
    static class GatewayConfig {
        @Bean
        RouteLocator routes(RouteLocatorBuilder builder) {
            return builder.routes()
                .route("orders", r -> r
                    .path("/api/orders/**")
                    .filters(f -> f
                        .stripPrefix(2)
                        // 订单服务熔断：挂了就走兜底，不再打过去
                        .circuitBreaker(c -> c
                            .setName("ordersCircuit")
                            .setFallbackUri("forward:/fallback/orders")))
                    // lb:// 走服务发现：网关不关心实例 IP，只认服务名
                    .uri("lb://order-service"))
                .route("products", r -> r
                    .path("/api/products/**")
                    .filters(f -> f.stripPrefix(2))
                    .uri("lb://product-service"))
                .build();
        }
    }

    // 入口统一限流：每个客户端每分钟 100 次。
    // 这件事在网关做一遍，所有服务都不用再关心。
    //（Spring Cloud Gateway 里用 RequestRateLimiter 过滤器 + Redis 实现，
    //  配置即代码，略去细节。）
}
