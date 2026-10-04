package ch100;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// 绞杀者：新旧两套实现并存，按规则把流量一点点切到新世界。
@Component
class EvolutionaryArchitectureAndStrangler01 {

    @Component
    static class StranglerFilter extends OncePerRequestFilter {
        private final StranglerRouter router;
        private final NewOrdersService newOrders;
        private final LegacyProxy legacy;

        StranglerFilter(StranglerRouter router, NewOrdersService newOrders,
                        LegacyProxy legacy) {
            this.router = router;
            this.newOrders = newOrders;
            this.legacy = legacy;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws Exception {
            if (router.useNewImplementation(request)) {
                // 走新世界。
                newOrders.handle(request, response);
                return;
            }

            // 否则继续走旧世界。
            legacy.forward(request, response);
        }
    }

    interface StranglerRouter {
        boolean useNewImplementation(HttpServletRequest request);
    }

    // 示例：先按端点迁移，再按比例，最后按租户。
    @Component
    static class EndpointBasedRouter implements StranglerRouter {
        public boolean useNewImplementation(HttpServletRequest request) {
            return request.getRequestURI().startsWith("/api/orders/v2");
        }
    }

    interface NewOrdersService {
        void handle(HttpServletRequest request, HttpServletResponse response) throws Exception;
    }

    interface LegacyProxy {
        void forward(HttpServletRequest request, HttpServletResponse response) throws Exception;
    }
}
