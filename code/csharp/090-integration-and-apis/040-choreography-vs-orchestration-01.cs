// 编排者：订单履约流程的主人。
// 顺序、分支、补偿都在这里，不散落在各处。改流程只改这一个文件。
public class FulfillmentOrchestrator
{
    private readonly IPaymentService _payments;
    private readonly IWarehouseService _warehouse;
    private readonly INotifier _notifier;
    private readonly IOrderStore _orders;

    public FulfillmentOrchestrator(
        IPaymentService payments, IWarehouseService warehouse,
        INotifier notifier, IOrderStore orders)
        => (_payments, _warehouse, _notifier, _orders)
            = (payments, warehouse, notifier, orders);

    public async Task RunAsync(Guid orderId)
    {
        var order = await _orders.GetAsync(orderId);

        // 第一步：扣款。失败则直接通知用户，流程结束。
        if (!await _payments.ChargeAsync(order.Id, order.Total))
        {
            await _notifier.TellUserAsync(order.UserId, "支付失败，请重试");
            return;
        }

        // 第二步：锁库存。库存不够要补偿——把刚扣的钱退回去。
        // 这就是 saga 的雏形：没有分布式事务，用补偿动作保证最终一致。
        if (!await _warehouse.ReserveAsync(order.Id, order.Lines))
        {
            await _payments.RefundAsync(order.Id, order.Total);
            await _notifier.TellUserAsync(order.UserId, "库存不足，已退款");
            return;
        }

        order.MarkReadyToShip();
        await _orders.SaveAsync(order);
    }
}
