---
id: 050-event-driven-cqrs-and-event-sourcing
title: "事件驱动、命令查询职责分离与事件溯源"
synopsis: 以事件为系统脊梁、CQRS 读写分离、事件溯源的机制与代价，附 C# 草图。
status: draft
role: body
unit: section
---

在事件驱动系统里，组件之间不直接调用，而是宣告发生了什么。一个 `OrderPlaced` 事件发出去，关心它的——计费、发货、通知——各自反应。生产者根本不知道消费者存在。

这把通常的耦合反过来了。在调用式系统里，加一个消费者意味着改生产者；在事件驱动系统里，加一个消费者意味着订阅。生产者不用再改了。这就是全部卖点，而且是个好卖点——直到你想起，"不用再改"也意味着你看不见谁依赖你，调试器里跟不完一个流程，"这个事件发出后会发生什么"只能靠搜索回答，靠调用图回答不了。

它之所以重要，是因为有些问题天生就是事件形状的：随时间发生的事、多方反应、审计轨迹、彼此不能认识的系统之间的集成。对这些问题，事件是诚实的模型。对简单的请求/响应流程，它是仪式感。

# 事件作为脊梁

纪律很小，但很严。事件是关于过去的事实，用过去时命名：`OrderPlaced`、`PaymentCaptured`、`ShipmentDelayed`。它们不可变，只陈述发生了什么，不下达"该做什么"的指令。消费者需要不同的数据，就发不同的事件——不许改那个大家共享的契约。

陷阱是把事件当命令使，只是换了个好听的名字。`ChargeCustomer` 不是事件，它是穿了过去时外衣的命令，耦合又回来了：生产者开始关心有没有人行动。让事件保持事实性、让消费者保持自治，做不到就承认自己在用 RPC，别交消息税。

# CQRS：读写分离

CQRS——命令查询职责分离——说的是：处理写操作的模型，不必和服务读操作的模型是同一个。写走富领域逻辑，落进规范化存储；读走专用投影：扁平、反规范化、快。

当读和写的需求分叉，这一刀就值了。写侧关心不变量：没付款的订单不能发货。读侧关心速度：订单历史页 50 毫秒内出来。一个模型同时伺候两个主子，最后哪个都伺候不好。

诚实的 CQRS 无聊但有用：命令由用例处理，查询由简单的投影回答，读库分开也行，不分也行。

```csharp
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
```

```csharp
// 读侧：投影，又笨又快
public sealed class OrderHistoryProjection(AppDbContext db)
{
    public Task<List<OrderSummaryDto>> GetForCustomerAsync(Guid customerId, CancellationToken ct)
        => db.OrderSummaries
            .Where(s => s.CustomerId == customerId)
            .OrderByDescending(s => s.PlacedAt)
            .Select(s => new OrderSummaryDto(s.OrderId, s.Total, s.Status, s.PlacedAt))
            .ToListAsync(ct);
    // 没有领域逻辑，没有不变量，只有一个长得像页面的查询。
}
```

CQRS 不需要事件溯源，不需要分开的数据库。它只需要一条纪律：别再拿写模型当读模型使。

# 事件溯源：状态是历史的折叠

事件溯源把事件思想推到极致：当前状态根本不存，只存产生它的事件序列。一个订单的当前状态，就是 `OrderPlaced`、`PaymentCaptured`、`ItemShipped` 在一个空起点上折叠出来的结果。

回报是真实的。完整的审计轨迹白送——每次状态变更都是一条带时间戳的事实记录。你能重建任意时间点的状态：上周二这个账户长什么样？你能修好投影里的 缺陷 然后重放历史来纠正。对那些历史本身就是产品的领域——银行、审计、合规——这不是功能，这是需求。

代价同样真实，动手前先数清楚。你的"数据库"现在是一个只追加的日志，意味着重放变慢了你就得做快照。模式演进变成事件版本管理：老事件永远活着，你的代码必须能读懂历史上写过的每一个版本。调试意味着重放。而读侧照样需要投影，因为没人会为了渲染一个页面去折叠一万个事件。

```csharp
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
```

`expectedVersion` 参数在干最重的并发活：两个写者同时往同一条流追加，一个赢、一个重试。这就是你的乐观并发控制，而且是承重的，别跳过它。

# 反模式

事件驱动最常见的烂法，是把所有流程都做成事件。一个"用户点保存"按钮，要经过五个订阅者、三个队列，页面刷新还得靠轮询。流程的可读性死了：想知道"下单之后发生什么"，得 grep 全仓库的订阅者；出一个 缺陷，调试器跟一半就断了——断在消息队列的另一头。

它诱人，是因为解耦的叙事太好听："生产者不用知道谁消费，以后加功能不用改旧代码。"真实的代价是看不见的耦合和运维地狱：消息顺序、重复投递、死信队列、某个消费者挂了没人发现、两个消费者对同一事件理解不一致。最惨的是排查：凌晨三点订单状态卡住，你面前是五个服务的日志和一句"消息可能丢了"。

更隐蔽的烂法是把事件当 RPC：`ChargeCustomer` 这种"命令穿过去时装"，让生产者开始关心"有人行动了吗"——耦合全回来了，消息的税一分没少交。如果你的流程是线性的、同步的、需要即时反馈的，老老实实用一次调用。事件是给"随时间发生、彼此不能认识"的系统准备的。

**陷阱：** 因为"审计轨迹听起来很美"而上事件溯源。审计轨迹是最便宜的部分——一张 outbox 表加十行代码就有了。事件溯源只有在你需要时间旅行查询（"重建 X 日期当天的状态"）、需要可重放的投影作为核心能力时才挣回成本。否则你就是拿一个你懂的数据库，换了一个你要去运维、做版本、做快照、还要给每个新人解释的日志。先让事件跑在骨干上，底下用普通数据库。等历史本身变成需求而不是好奇，再升级成事件溯源。
