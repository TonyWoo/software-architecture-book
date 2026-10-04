// 核心：用例。只依赖端口和领域实体。
public sealed class PlaceOrder(IOrderRepository orders, IClock clock)
{
    public async Task<OrderId> Handle(PlaceOrderCommand cmd, CancellationToken ct)
    {
        var order = Order.Create(cmd.CustomerId, cmd.Lines, clock.UtcNow);

        await orders.SaveAsync(order, ct);

        return order.Id;
    }
}
