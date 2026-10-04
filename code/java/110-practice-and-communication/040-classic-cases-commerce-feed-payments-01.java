package ch110;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;

// 经典案例 · 电商：模块化单体——模块间只依赖接口，不直接引用实现。
class ClassicCasesCommerceFeedPayments01 {

    // 订单模块对外暴露的接口（商品、促销模块都只能调这个）
    interface OrderService {
        // 创建订单：只做校验 + 库存预留，不碰支付
        Order createOrder(CreateOrderRequest request);
        // 支付回调：确认扣减库存，发布 OrderPaid 事件
        void confirmPayment(String orderId, String paymentId);
    }

    // 库存预留：把行锁竞争从库存行转移到预留池
    interface InventoryReservation {
        // 预留成功返回 reservationId，失败抛 InsufficientStock
        UUID reserve(String sku, int quantity, Duration ttl);
        void commit(UUID reservationId);  // 支付成功：真正扣减
        void release(UUID reservationId); // 过期/取消：归还
    }

    // 促销规则：数据驱动，营销后台可配
    record PromotionRule(
        String id,
        String name,
        Predicate<Cart> condition,   // 什么时候生效
        Function<Cart, BigDecimal> discount, // 怎么算优惠
        int priority,                // 叠加顺序
        boolean exclusive) {}        // 是否互斥

    record CreateOrderRequest(String userId, List<String> lines) {}
    record Order(String id) {}
    record Cart(List<String> lines, BigDecimal total) {}
}
