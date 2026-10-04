---
id: dependency-inversion-ports-and-adapters
title: "依赖倒置 / 端口与适配器"
synopsis: 依赖抽象而非具体——端口放在领域里定义，适配器放在基础设施里实现。
status: draft
role: body
unit: section
---

# 依赖抽象，而不是具体

依赖倒置是 SOLID 里被误解最深的一个字母。它不是"到处用接口"，而是：高层策略不应该依赖低层细节。依赖的方向应该指向抽象，而抽象应该由高层模块拥有。

大多数代码都搞反了。你的订单处理逻辑直接引用了 SQL 数据库驱动。策略——真正重要的东西、公司为之付钱的东西——依赖着细节。细节一变，策略就坏。这就是依赖箭头指反了。

把它翻过来。领域自己定义它需要什么——一个端口，一个接口。基础设施提供实现它的适配器。领域永远不知道用的是哪个数据库、哪个队列、哪家云。它只知道自己写下的那份契约。

# C#里的端口与适配器

端口与适配器（六边形架构）就是依赖倒置的具体形态。应用核心坐在中间，它声明端口：描述它需要什么（订单存储、支付服务、时钟），以及它提供什么（外界可以调用的用例）。适配器住在外面：SQL 适配器、HTTP 适配器、控制台适配器，插到端口上。核心里的任何东西都不引用外面的任何东西。

```csharp
// --- 核心：端口。由领域拥有，按领域的需求塑形。 ---
public interface INotificationPort
{
    Task SendAsync(string recipient, string subject, string body);
}

public class OrderConfirmationService
{
    private readonly INotificationPort _notifications;

    public OrderConfirmationService(INotificationPort notifications)
        => _notifications = notifications;

    public async Task ConfirmAsync(Order order)
    {
        // 纯领域逻辑。这里看不到 SMTP、SendGrid、HTTP 客户端。
        var message = $"Order {order.Id} confirmed. Total: {order.Total:C}";
        await _notifications.SendAsync(order.CustomerEmail, "Order confirmed", message);
    }
}

// --- 基础设施：适配器。知道那些脏细节，但被端口藏在后面。 ---
public sealed class SmtpNotificationAdapter : INotificationPort
{
    private readonly SmtpClient _smtp;

    public SmtpNotificationAdapter(SmtpClient smtp) => _smtp = smtp;

    public async Task SendAsync(string recipient, string subject, string body)
    {
        using var mail = new MailMessage("noreply@shop.example", recipient, subject, body);
        await _smtp.SendMailAsync(mail);
    }
}
```

# 组合根：所有线汇合的地方

如果核心永远不引用基础设施，那总得有个地方把它们连起来。这个地方就是组合根——通常是你的 `Program.cs` 或启动代码。它是全系统唯一被允许知道一切的地方：它构造适配器，用这些适配器构造核心服务，然后启动应用。

这也是依赖注入容器的天然位置。端口到适配器的映射注册一次，容器负责组装整个对象图。组合根保持又薄又无聊：没有业务逻辑，没有条件分支，只有接线。哪天把 SMTP 换成 SendGrid，改的是一行注册。核心不用重新编译，不关心，也不知道。

# 反模式

最常见的错误用法是端口泛滥：给所有东西建端口——给一个从来不会换的单数据库建 `IRepository`，给只用过一次的时钟套个 `IClock`，给日志套 `ILoggingPort`。理由听上去无懈可击："方便测试""将来可替换"。

诱人之处是这个模式本身写起来很顺手。定义接口、写适配器、注册容器，行云流水。它还自带免死金牌：谁敢质疑解耦？

真实代价是每一处间接都让改动变远。看一个方法到底干了什么，要跳三次：调用处、端口、适配器。模拟 倒是方便了，但你 模拟 的大多是"永远不会换"的东西——付出真实的心智税，买虚构的保险。依赖倒置的目标是让策略独立于动荡的细节，把它用在无害的细节上，你买的是仪式，不是独立性。

**权衡：** 端口与适配器用间接层换独立性。每个端口都是要设计的接口、要写的适配器、要维护的映射。对一个稳定、单一数据库的 CRUD 应用来说，这套家伙纯属负担——直接调数据库就行。这个模式在外部世界动荡时才回本：多个部署目标、难 模拟 的依赖需要测试替身、基础设施真有可能被替换。把会疼的依赖倒置过来，无害的就放它一马。
