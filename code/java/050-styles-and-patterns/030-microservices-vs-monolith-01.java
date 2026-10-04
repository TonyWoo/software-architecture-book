package ch050;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

class MicroservicesVsMonolith01 {

    // 陷阱的缩影：同步调用链，零自治
    static class OrderService {
        private final InventoryClient inventory;
        private final PaymentClient payment;

        OrderService(InventoryClient inventory, PaymentClient payment) {
            this.inventory = inventory;
            this.payment = payment;
        }

        CompletableFuture<UUID> placeOrder(Cart cart) {
            // 三次网络往返，干了单体里一个事务的活。
            // 每次往返都加延迟、加一种故障模式、加一个版本问题。
            return inventory.reserve(cart.items())
                .thenCompose(reserved -> payment.charge(cart.total())
                .thenCompose(charged -> {
                    // 如果扣款在这里失败，谁来解冻库存？恭喜，你现在需要 saga 了，
                    // 而 saga 就是分布式单体写给你的道歉信。
                    return saveOrder(cart, reserved, charged);
                }));
        }

        private CompletableFuture<UUID> saveOrder(Cart cart, String reserved, String charged) {
            return CompletableFuture.completedFuture(UUID.randomUUID());
        }
    }

    interface InventoryClient {
        CompletableFuture<String> reserve(List<String> items);
    }

    interface PaymentClient {
        CompletableFuture<String> charge(BigDecimal total);
    }

    record Cart(List<String> items, BigDecimal total) {}
}
