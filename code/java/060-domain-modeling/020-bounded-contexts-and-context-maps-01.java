package ch060;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

// 限界上下文：同一个词，在不同上下文里是不同的模型。
class BoundedContextsAndContextMaps01 {

    // 在销售上下文里，Order 是一次和客户的商业约定。
    static final class Sales {
        record Order(
            UUID id,
            UUID customerId,
            List<OrderLine> lines,
            Money total,
            OffsetDateTime placedAt) {}

        record OrderLine(String sku, int quantity) {}
        record Money(BigDecimal amount, String currency) {}
    }

    // 在仓库上下文里，"order" 是一张拣货单：SKU、数量、库位。
    // 同一个词，不同含义，不同模型——不要试图"统一"它们。
    static final class Warehouse {
        static final class PickList {
            private final UUID salesOrderId;
            private final List<PickItem> items;

            private PickList(UUID salesOrderId, List<PickItem> items) {
                this.salesOrderId = salesOrderId;
                this.items = items;
            }

            // 合作关系的接口：这个翻译两边团队共同拥有。
            static PickList fromSalesOrder(Sales.Order order) {
                var items = order.lines().stream()
                    .map(l -> new PickItem(l.sku(), l.quantity()))
                    .toList();
                return new PickList(order.id(), items);
            }
        }

        record PickItem(String sku, int quantity) {}
    }
}
