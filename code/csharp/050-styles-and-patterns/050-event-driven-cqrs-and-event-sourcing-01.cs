// 写侧：命令，带着完整的领域逻辑处理
public sealed record PlaceOrderCommand(Guid CustomerId, IReadOnlyList<OrderLine> Lines);

public sealed class PlaceOrderHandler(
    IOrderRepository orders,
    IEventBus bus,
    IClock clock)
{
    public async Task<OrderId> Handle(PlaceOrderCommand cmd, CancellationToken ct)
    {
        var order = Order.Create(cmd.CustomerId, cmd.Lines, clock.UtcNow);
        await orders.SaveAsync(order, ct);

        // 写侧宣告事实。谁来反应，不归它管。
        await bus.PublishAsync(new OrderPlaced(order.Id, order.Total, clock.UtcNow), ct);

        return order.Id;
    }
}
