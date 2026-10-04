// 模块化单体：模块间只依赖接口，不直接引用实现。
// 注释说明每个模块的职责边界。

// 订单模块对外暴露的接口（商品、促销模块都只能调这个）
public interface IOrderService
{
    // 创建订单：只做校验 + 库存预留，不碰支付
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
    // 支付回调：确认扣减库存，发布 OrderPaid 事件
    Task ConfirmPaymentAsync(string orderId, string paymentId);
}

// 库存预留：把行锁竞争从库存行转移到预留池
public interface IInventoryReservation
{
    // 预留成功返回 reservationId，失败抛 InsufficientStock
    Task<Guid> ReserveAsync(string sku, int quantity, TimeSpan ttl);
    Task CommitAsync(Guid reservationId);   // 支付成功：真正扣减
    Task ReleaseAsync(Guid reservationId);  // 过期/取消：归还
}

// 促销规则：数据驱动，营销后台可配
public record PromotionRule(
    string Id,
    string Name,
    Func<Cart, bool> Condition,   // 什么时候生效
    Func<Cart, decimal> Discount, // 怎么算优惠
    int Priority,                 // 叠加顺序
    bool Exclusive);              // 是否互斥
