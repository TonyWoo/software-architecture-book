---
id: 040-transactions-sagas-and-outbox
title: Transactions, Sagas & Outbox
synopsis: 当 ACID 走到服务边界就停了：C# 里的 saga 模式与事务性发件箱。
status: draft
role: body
unit: section
---

# ACID 在边界处终结

数据库事务是个美好的东西：原子、一致、隔离、持久。它也是本地的。业务操作一旦跨过两个服务，事务就跟不过去了。不存在一个能覆盖两个数据库的 `BEGIN`，跨服务的两阶段提交则是用可用性换一致性的协调噩梦，而大多数业务流程根本不需要那种一致性。

所以别再装了。跨服务的操作不是原子的，它是一串各自独立提交的本地事务，外加一套"中间某步失败了怎么办"的预案。这套预案就叫 saga。

接受这一点会改变你的设计方式。不再是"这些要么全发生要么全不发生"，而是"每一步都会发生，后面的步骤失败了，前面的步骤用补偿动作撤销"。订单服务扣款，库存服务锁库存，物流服务打面单。物流失败了，你不是回滚一个事务，而是跑补偿动作：释放库存锁，退回扣款。业务流程本身成了事务，它住在你的代码里。

# 编排 vs 协同

saga 有两种味道。协同式里，每个服务监听事件然后行动：OrderPlaced 触发支付扣款，PaymentCharged 触发库存锁定。没有中央控制器，上手简单，调试要命。流程卡住的时候，saga 的状态被抹在十几个服务的日志里，"到底卡在哪一步"成了一场分布式考古。

编排式里，一个 saga 编排器拥有整个流程。它发命令、跟踪状态、决定失败时补偿什么。代码更多，但流程看得见：状态机在一处，卡在哪一步也在一处。

```csharp
// 编排式 saga：流程顺序和补偿计划住在同一个地方。
public sealed class PlaceOrderSaga
{
    private readonly IPaymentService _payments;
    private readonly IInventoryService _inventory;
    private readonly IShippingService _shipping;
    private readonly SagaState _state = new();

    public PlaceOrderSaga(
        IPaymentService payments,
        IInventoryService inventory,
        IShippingService shipping)
    {
        _payments = payments;
        _inventory = inventory;
        _shipping = shipping;
    }

    public async Task<Result> ExecuteAsync(Order order, CancellationToken ct)
    {
        _state.PaymentId = await _payments.ChargeAsync(order.Total, ct);
        try
        {
            _state.ReservationId = await _inventory.ReserveAsync(order.Lines, ct);
            try
            {
                _state.ShipmentId = await _shipping.BookLabelAsync(order, ct);
                return Result.Ok();
            }
            catch
            {
                await _inventory.ReleaseAsync(_state.ReservationId, ct);
                throw;
            }
        }
        catch
        {
            await _payments.RefundAsync(_state.PaymentId, ct);
            throw;
        }
    }

    private sealed class SagaState
    {
        public Guid PaymentId { get; set; }
        public Guid ReservationId { get; set; }
        public Guid ShipmentId { get; set; }
    }
}
```

读这个嵌套结构：每一步的补偿只覆盖已经成功的步骤。这个结构就是全部思想：向前推进，每一步都有定义好的回头路。生产环境里这个状态必须是持久的——步骤之间崩溃不能丢了 saga 的位置——但上面的形状是核心。流程重要到需要被观察时，先用编排。协同式留给那些发出去就不用管、永远没人问"我的订单去哪了"的流程。

# 事务性发件箱

同一个服务内部有个更小、更阴险的版本：你往数据库里存，同时往消息 broker 发事件，这是两个独立系统。先存后发，中间崩溃会丢事件；先发后存，可能发出去了但数据根本没提交。两种都错。

事务性发件箱用一个洞察解决它：事件和业务数据写进同一张数据库表、同一个事务，然后由一个独立的 relay 进程读发件箱表再发布。数据库事务是你本来就信任的原子性，relay 是至少一次投递，对端消费者做幂等。

```csharp
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
```

两个细节要紧。第一，消费者必须幂等，因为 relay 可能发两次——发布和标记已处理之间崩溃就会。第二，relay 是你现在要自己养的基础设施：它的延迟、它的故障、它的监控。但这仍然比丢事件便宜。

**Trap:** 把"最终一致性"当成一句含糊的咒语。每个 saga、每个发件箱都会引入一段系统自己跟自己不一致的时间窗口。把这些窗口说出来，讲给产品听："最多 N 秒，订单存在但库存还没锁。" 如果业务容忍不了这个窗口，那你面对的不是架构问题，是范围问题——这个操作本来就该待在一个服务里、一个事务里。
