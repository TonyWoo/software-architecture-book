package ch050;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

// Catalog 模块本体 —— 其他一切都是包内可见
// （Java 里用包级可见性对应 C# 的 internal：模块外看不见实现）
class ModularMonolith02 {

    // 契约（见 020-modular-monolith-01）：模块间只通过它说话。
    record ProductInfo(UUID id, String name, Money price) {}
    record Money(BigDecimal amount, String currency) {}

    interface CatalogFacade {
        Optional<ProductInfo> getProduct(UUID id);
    }

    static class DefaultCatalogFacade implements CatalogFacade {
        private final ProductStore store;
        private final ProductPolicy policy;

        // 包内可见的构造器：模块外 new 不出来，只能通过接口拿到它。
        DefaultCatalogFacade(ProductStore store, ProductPolicy policy) {
            this.store = store;
            this.policy = policy;
        }

        public Optional<ProductInfo> getProduct(UUID id) {
            var product = store.findById(id);
            if (product.isEmpty() || !policy.isVisible(product.get()))
                return Optional.empty();
            var p = product.get();
            return Optional.of(new ProductInfo(p.id(), p.name(), p.price()));
        }
    }

    interface ProductStore {
        Optional<Product> findById(UUID id);
    }

    interface ProductPolicy {
        boolean isVisible(Product product);
    }

    record Product(UUID id, String name, Money price) {}
}
