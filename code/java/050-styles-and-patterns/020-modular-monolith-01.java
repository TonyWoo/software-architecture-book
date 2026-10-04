package ch050;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

// Catalog.Contracts —— 被其他模块引用，只装契约，零逻辑
// （Java 里对应一个只含接口与 DTO 的 api 包 / 模块）
class ModularMonolith01 {

    record ProductInfo(UUID id, String name, Money price) {}
    record Money(BigDecimal amount, String currency) {}

    interface CatalogFacade {
        Optional<ProductInfo> getProduct(UUID id);
    }
}
