// 低内聚、高耦合：Order 什么都懂——支付、邮件、库存。
public class Order
{
    public void Process()
    {
        ChargeCreditCard();   // 支付方面的事
        SendEmail();          // 通知方面的事
        UpdateStock();        // 库存方面的事
    }
    /* ... */
}

// 内聚、解耦：每个关注点管自己的行为，
// 由协调者组装，而不是硬引用。
public class OrderProcessor
{
    private readonly IPaymentGateway _payments;
    private readonly INotifier _notifier;
    private readonly IInventory _inventory;

    public OrderProcessor(IPaymentGateway p, INotifier n, IInventory i)
        => (_payments, _notifier, _inventory) = (p, n, i);

    public void Process(Order order)
    {
        _payments.Charge(order.Total);
        _inventory.Reserve(order.Lines);
        _notifier.Send(order.Customer, "Your order shipped.");
    }
}
