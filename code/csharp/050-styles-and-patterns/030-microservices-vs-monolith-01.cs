// 陷阱的缩影：同步调用链，零自治
public sealed class OrderService(IInventoryClient inventory, IPaymentClient payment)
{
    public async Task<Guid> PlaceOrderAsync(Cart cart, CancellationToken ct)
    {
        // 三次网络往返，干了单体里一个事务的活。
        // 每次往返都加延迟、加一种故障模式、加一个版本问题。
        var reserved = await inventory.ReserveAsync(cart.Items, ct);
        var charged  = await payment.ChargeAsync(cart.Total, ct);
        // 如果扣款在这里失败，谁来解冻库存？恭喜，你现在需要 saga 了，
        // 而 saga 就是分布式单体写给你的道歉信。
        return await SaveOrderAsync(cart, reserved, charged, ct);
    }
}
