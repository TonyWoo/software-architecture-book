// 极简事件存储草图：只追加，按聚合分流
public interface IEventStore
{
    Task AppendAsync(Guid streamId, long expectedVersion,
        IReadOnlyList<object> events, CancellationToken ct);
    Task<IReadOnlyList<object>> ReadStreamAsync(Guid streamId, CancellationToken ct);
}

public sealed class OrderAggregate
{
    private readonly List<object> _uncommitted = [];
    public long Version { get; private set; }
    public OrderStatus Status { get; private set; }

    // 重建：把每条历史事件折叠进 Apply
    public static OrderAggregate Rehydrate(IEnumerable<object> history)
    {
        var agg = new OrderAggregate();
        foreach (var e in history)
            agg.Apply(e);
        return agg;
    }

    public void CapturePayment(Money amount, DateTimeOffset at)
    {
        if (Status != OrderStatus.Placed)
            throw new InvalidOperationException("只有已下单的订单才能收款。");

        Raise(new PaymentCaptured(amount, at)); // 先记下事实，再应用它
    }

    private void Raise(object e) { _uncommitted.Add(e); Apply(e); }

    private void Apply(object e)
    {
        switch (e)
        {
            case OrderPlaced:      Status = OrderStatus.Placed; break;
            case PaymentCaptured:  Status = OrderStatus.Paid; break;
            case ShipmentSent:     Status = OrderStatus.Shipped; break;
        }
        Version++;
    }

    public IReadOnlyList<object> DequeueUncommitted()
    {
        var events = _uncommitted.ToList();
        _uncommitted.Clear();
        return events;
    }
}
