// 发件箱：事件和领域变更在同一个事务里持久化。
public sealed class OrderService
{
    private readonly OrdersDbContext _db;

    public OrderService(OrdersDbContext db) => _db = db;

    public async Task PlaceAsync(Order order, CancellationToken ct)
    {
        _db.Orders.Add(order);
        _db.OutboxMessages.Add(OutboxMessage.For(
            type: "OrderPlaced",
            payload: new { order.Id, order.Total },
            occurredAt: DateTimeOffset.UtcNow));

        // 一个事务。事件不可能脱离订单存在，
        // 订单也不可能脱离事件存在。
        await _db.SaveChangesAsync(ct);
    }
}

public sealed class OutboxRelay : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly IMessagePublisher _publisher;

    public OutboxRelay(IServiceProvider services, IMessagePublisher publisher)
    {
        _services = services;
        _publisher = publisher;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();

            var batch = await db.OutboxMessages
                .Where(m => m.ProcessedAt == null)
                .OrderBy(m => m.OccurredAt)
                .Take(100)
                .ToListAsync(ct);

            foreach (var message in batch)
            {
                await _publisher.PublishAsync(message.Type, message.Payload, ct);
                message.ProcessedAt = DateTimeOffset.UtcNow;
            }

            await db.SaveChangesAsync(ct);
            await Task.Delay(TimeSpan.FromSeconds(5), ct);
        }
    }
}
