---
id: functional-vs-non-functional-reqs
title: Functional vs Non-Functional Reqs
synopsis: 行为是系统做什么，约束是系统必须扛住什么——约束才是架构师真正的活。
status: draft
role: body
unit: section
---

功能需求描述行为："用户可以下单。"非功能需求描述对行为的约束："下单 99 分位延迟必须低于 800ms，且任何订单都不许被重复扣款。"

开发者爱功能需求，具体、可测、能演示。产品经理写它们，干系人看得懂。而它们在架构上恰恰是简单的部分：几乎任何合理的结构都能下单。能同时做到 800ms 内下单、扛住机房故障、还产出审计轨迹的结构，没几个。

# 行为是演示，约束才是系统

有个扎心的真相：搞死项目的很少是功能需求，项目都死在非功能上。功能在演示里跑得好好的，到生产就化了；QA 全过，安全审计挂了；发布成功，第一次流量高峰就把系统拍死了。

非功能需求是架构师真正的活，因为约束结构的是它们。延迟预算逼着设计里出现异步处理和缓存；可审计性逼着核心里出现事件日志；"发布不停机"逼着向后兼容的契约和蓝绿基础设施。这些东西不会从"一个 ticket 一个功能"里长出来，必须一开始就设计进去，因为事后补等于穿着维护外衣的重写。

# 一个 NFR 如何塑造真实代码

假设延迟预算：下单接口 p99 必须低于 800ms。天真的实现是同步调支付网关——简单、正确，而且慢到 1200ms。NFR 逼出一个结构决策：先同步接单，异步扣款。

```csharp
// NFR：下单 p99 < 800ms。支付网关 p99 约 1200ms。
// 决策（ADR-007）：同步接单并返回，
// 通过 outbox 异步扣款。请求路径永不阻塞在第三方上。

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IOrderOutbox, SqlOrderOutbox>();
builder.Services.AddHostedService<PaymentProcessor>();
var app = builder.Build();

app.MapPost("/orders", async (PlaceOrderRequest req, IOrderOutbox outbox) =>
{
    var order = Order.Create(req);          // 纯领域逻辑，无 I/O
    await outbox.EnqueueAsync(order);       // 一次快速的 DB 写入
    return Results.Accepted($"/orders/{order.Id}", new { order.Id });
    // 202 Accepted："收到了，正在处理。"
    // 扣款由 PaymentProcessor 在后台完成。
});

app.Run();

public sealed record PlaceOrderRequest(string CustomerId, string Sku, int Quantity);

public sealed class Order
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Status { get; private set; } = "Accepted";

    private Order() { }

    public static Order Create(PlaceOrderRequest req)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(req.CustomerId);
        if (req.Quantity <= 0) throw new ArgumentOutOfRangeException(nameof(req.Quantity));
        return new Order();
    }
}
```

看 NFR 干了什么：它改了 HTTP 语义（202 而不是 200），引入了 outbox，加了后台 worker，还逼着领域模型把"已接单但未扣款"做成一等状态。这些没有一条来自功能需求"用户可以下单"，全部来自八百毫秒。

为什么重要：每个 NFR 都是这个套路。安全需求加认证边界，可用性需求加冗余，可审计性加事件日志。如果你指着代码说不出"这行存在是因为那条约束"，那条约束就不是真的，是 wiki 上的装饰。

# 反模式

典型错误用法：会上当好好先生，接英雄级 NFR。

产品方问"能不能 99.999%？"，架构师点头。没人提，工程师也会自己加戏："这系统得抗双十一"，实际日单两百。

诱人之处：点头不用算账。

真实代价：英雄级 NFR 一出口就是终身税。99.999% 要多活、演练、值班，三人玩不起，只能偷工。自己加戏更隐蔽：为不存在的流量，复杂三倍。

**Trade-off:** 你接受的每条 NFR，都是对它之下所有功能的征税。上面的 outbox 方案对延迟预算是对的——但它让"下个单"这件事的编写、测试、调试复杂度翻了三倍。最终一致性会漏进 UI（"您的支付处理中"）、漏进客服工具、漏进每个新人的 onboarding。所以谈 NFR 要像谈需求范围一样谈，因为它就是范围。"800ms 以内"是带着工程成本的产品决策，让产品方签字。陷阱是为了在会上显得好说话而接下英雄级 NFR，然后在系统的整个生命周期里连本带利地还。
