---
id: 010-evolutionary-architecture-and-strangler
title: "演进式架构与绞杀者模式"
synopsis: 架构是持续的活动而非阶段；用绞杀榕模式一块一块替换遗留系统。
status: draft
role: body
unit: section
---

架构不是一个阶段。项目里不存在"做架构"这个环节——画完图、签完字，就把代码交给施工队。架构就是系统在每一个时刻的*样子*，而它每天都在变。唯一的问题是：你是主动地改变它，还是任由它烂掉。

大多数遗留系统一开始并不是遗留系统。它们曾经也很干净。然后上百个出于好意、在压力下做出的决定，累积成了一个没人能完全理解的东西。这不是最初设计的失败，而是一个活得足够久的软件的自然熵增。对抗它的方法，是把演进当作一等公民：适应度函数、架构测试，以及偿还技术债的纪律。

当债务大到一定程度，诱惑就出现了：重写。推倒重来，这次一定做好。这几乎从不奏效。重写失败的原因是，旧系统里编码了十年都没人记得的边界情况，而业务还得在你重建的时候继续运转。业务不可能停摆十八个月，就为了让工程团队拿一张干净的白纸。

# 绞杀它，别重写它

绞杀榕是一种缠绕着现有大树生长、最终取而代之的树。用在软件上就是：在遗留系统前面放一个门面（facade），所有流量都经过它，然后一次抠掉一块功能。新实现住在门面后面，旧系统继续服务那些你还没替换的部分。在任何时刻，系统都是好的。

门面一开始只是一个傻代理。然后你一次路由一个端点、一个限界上下文、一个聚合。新旧实现各自独立上线、各自可回滚。某一块出了问题，把路由拨回去就行。进度是可衡量的："40% 的流量已经走到新实现上"，这是管理者能听懂的事实。

下面是一个 ASP.NET Core 里的最小绞杀器。门面检查请求，按路由规则把它送到遗留代理或新实现：

```csharp
public sealed class StranglerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IStranglerRouter _router;

    public StranglerMiddleware(RequestDelegate next, IStranglerRouter router)
    {
        _next = next;
        _router = router;
    }

    public async Task InvokeAsync(HttpContext context, LegacyProxy legacy, NewOrdersService newOrders)
    {
        if (_router.UseNewImplementation(context))
        {
            // 走新世界。
            var result = await newOrders.HandleAsync(context);
            await result.WriteAsync(context);
            return;
        }

        // 否则继续走旧世界。
        await legacy.ForwardAsync(context);
    }
}

public interface IStranglerRouter
{
    bool UseNewImplementation(HttpContext context);
}

// 示例：先按端点迁移，再按比例，最后按租户。
public sealed class EndpointBasedRouter : IStranglerRouter
{
    public bool UseNewImplementation(HttpContext context) =>
        context.Request.Path.StartsWithSegments("/api/orders/v2");
}
```

路由器就是策略。先用按端点的路由替换低风险的读路径，再用带特性开关的按比例路由处理风险更高的部分，最后按租户路由，让你最大的客户最后一个迁移。每个路由器二十行代码，完全可逆。

# 为什么这很重要

重写是一个赌注：赌你足够理解旧系统，能把它完整复刻出来。你做不到。绞杀是另一个赌注：赌你足够理解*其中一块*，能把它替换掉。这个赌注你能赢，一次又一次，胜利会复利。

具体后果：用绞杀的团队几周内就上线第一个替换块，从生产反馈中学习。用重写的团队消失一年，最后交付一个把没理解的部分原样抄错的复制品。

绞杀还有一个组织上的好处：它让迁移进度对非技术人员可见。每个被替换的端点都是一次可演示的胜利，业务方看得到进展，就愿意继续给时间和预算。重写恰恰相反——在最后一天之前没有任何东西可看，而最后一天往往永远不会到来。架构决策很少纯粹是技术决策，能持续拿到信任的方案才是好方案。

# 反模式

门面变成永久居民。最常见的烂尾：门面立起来了，开局顺利，然后业务追新需求，旧系统剩下的 70% 再没人碰——名义上"过渡架构"，实际上长期设计。

它诱人，是因为看起来零风险：业务没停摆，代码没推倒。但代价按月付：两套数据模型、两套流水线，防腐层从临时翻译变成永久翻译税，每个新人都要理解两套世界。

另一个变体是穿马甲的重写：整块"完美复刻"再切流量，面积太大照样回不去。治这两种病的药是同一种：开工前写下旧系统下线的日期，放进路线图评审。没有死线的绞杀，注定烂尾。

**Trade-off:** 绞杀意味着迁移期间两套系统同时活着，两套系统就是两套数据模型、两套部署流水线，以及新旧世界之间的同步。你必须为防腐层和双写预留预算，并且必须下决心做完。一个绞杀到一半的系统，比干净的遗留系统和干净的重写都糟糕，因为现在你有两样东西要理解。
