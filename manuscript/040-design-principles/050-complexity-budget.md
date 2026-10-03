---
id: complexity-budget
title: Complexity Budget
synopsis: 每个系统能负担的复杂度都是有限的——花在能让你赢的地方。
status: draft
role: body
unit: section
---

# 复杂度是有限资源

每个系统都有一笔复杂度预算。它是团队在不把整个东西搞塌的前提下，能理解、能维护、能 debug 的聪明总量。预算由团队规模、经验、工具链和领域共同决定。借不来，超了就得还：线上事故、归零的迭代速度、不敢碰代码的开发者。

预算这个视角会改变问题。不再是"这个设计好不好"，而是"这个设计值不值"。分布式 saga 是个不错的设计，它值预算的百分之十吗？如果订单履约是你的竞争优势，也许值。如果只是发一封欢迎邮件，肯定不值。

# 本质复杂度 vs. 偶然复杂度

Fred Brooks 把复杂度分成两种。本质复杂度属于问题本身：税法是真的复杂，你的税务引擎也会复杂。偶然复杂度属于解法：你的税务引擎里的偶然复杂度，是那个手写的 ORM，是包着布尔值的四层抽象，是给一个本来没有网络分区问题的地方做微服务拆分、凭空造出来的网络分区。

本质复杂度消灭不了，只能管理——隔离它、命名它、派最强的人去啃。偶然复杂度是纯浪费，猎杀它是架构师的本职工作。你加的每一层、每个服务、每个框架，在自证清白之前都是偶然复杂度。让它自证：它吸收了哪部分本质复杂度？如果答案是"没有，但以后也许有用"，删掉它。

```csharp
// 偶然复杂度：一个函数就能干的事，非要上个框架。
// 三个接口、两个装饰器、一个工厂——就为了校验个邮箱。
public interface IValidationRule<T> { bool IsValid(T value); }
public interface IValidationPipeline<T> { bool Run(T value); }

public sealed class EmailRule : IValidationRule<string>
{
    public bool IsValid(string value) => value.Contains('@');
}

public sealed class ValidationPipeline<T> : IValidationPipeline<T>
{
    private readonly IEnumerable<IValidationRule<T>> _rules;
    public ValidationPipeline(IEnumerable<IValidationRule<T>> rules) => _rules = rules;
    public bool Run(T value) => _rules.All(r => r.IsValid(value));
}

// 本质复杂度，诚实地表达：规则就是规则。
public static class EmailValidation
{
    public static bool IsValid(string email) =>
        !string.IsNullOrWhiteSpace(email) && email.Contains('@');
}
```

# 把预算花在能让你赢的地方

纪律是这样的：有意识地分配复杂度。系统里让你赢的部分——定价引擎、推荐算法、客户为之付钱的东西——拿最大头的预算。它们配得上精巧的设计、考究的抽象和最强的工程师。其他一切都用最简单的东西：无聊的 CRUD、现成的库、一张数据库表。

但大多数团队的做法正好反过来。预算平均分配，或者更糟，花在基础设施的流行款上——给配置页面上事件溯源，给定时任务上 Kubernetes——而真正的业务逻辑烂在一个人人看不懂的三千行方法里。审计你的代码库就问一个问题：复杂度花哪儿了？如果花在了没差异化的地方，你被抢劫了，劫匪就是你自己的架构。

```csharp
// 预算花得值：复杂度集中在差异化点上。
// 这个定价引擎就是业务本身，它配得上这份讲究。
public sealed class DynamicPricingEngine
{
    public Money Quote(Order order, MarketConditions market)
    {
        var base_ = order.Lines.Sum(l => l.UnitPrice * l.Quantity);
        var demandFactor = market.DemandIndex switch
        {
            > 0.8m => 1.15m,
            > 0.5m => 1.05m,
            _ => 0.95m,
        };
        var loyaltyDiscount = order.Customer.Tier switch
        {
            Tier.Gold => 0.90m,
            Tier.Silver => 0.95m,
            _ => 1.0m,
        };
        return new Money(base_ * demandFactor * loyaltyDiscount);
    }
}

// 预算省下来：审计日志是没差异化的管道。
// 无聊、直白、一个方法，不上框架。
public sealed class AuditLog
{
    private readonly string _path;
    public AuditLog(string path) => _path = path;

    public void Append(string entry) =>
        File.AppendAllText(_path, $"{DateTime.UtcNow:o} {entry}{Environment.NewLine}");
}
```

# 反模式

最常见的错误用法是预算错配，而且永远是同一个方向：钱花在看得见的、时髦的地方，而不是赚回钱的地方。给配置页上事件溯源，给定时任务上 Kubernetes，给日志系统写一套插件架构——而核心的定价逻辑烂在一个三千行的方法里，没人敢动。

诱人之处很实在：这是"展示型"复杂度。技术分享、招聘、代码评审，都能拿出来讲。一个默默把定价引擎收拾干净的改动，谁夸你？

真实的代价是复式记账。展示型复杂度占的心智成本全是真的——部署、监控、升级、debug，超预算的地方最后以线上事故结账。而真正的差异化部分因为预算被挤占，只能继续在泥浆里滚——你的护城河，就这样被自己的架构偷走了。

**Trade-off:** 复杂度预算是个判断，不是测量。没人能告诉你预算是 100 个单位、saga 花 12 个。它的价值在于逼出那场对话：这东西花我们多少，值吗？从不问这个问题的团队闭着眼花钱，在生产环境里发现透支。问了的团队——哪怕在设计评审里粗估、哪怕靠拍脑袋——最终会把复杂度集中在赚得回本的地方。预算不是一个数字，是一种习惯。
