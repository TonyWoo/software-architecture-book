package ch050;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Catalog 的装配入口 —— 除契约外唯一的公开接缝
// （Spring 里用 @Configuration 把模块的 bean 组装起来）
class ModularMonolith03 {

    @Configuration
    static class CatalogModule {
        @Bean
        CatalogFacade catalogFacade(ProductStore store, ProductPolicy policy) {
            // DefaultCatalogFacade 是包内可见的：外部只能通过接口拿到它
            return new DefaultCatalogFacade(store, policy);
        }
    }

    interface CatalogFacade {}
    interface ProductStore {}
    interface ProductPolicy {}

    static class DefaultCatalogFacade implements CatalogFacade {
        DefaultCatalogFacade(ProductStore store, ProductPolicy policy) {
        }
    }
}
