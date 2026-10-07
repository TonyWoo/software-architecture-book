---
title: "模块化单体"
description: "一次部署、硬性的模块边界——大多数团队的正确默认选项，附 C# 隔离示例。"
---

> Documentation Index
> Fetch the complete documentation index at: https://tonywoo.github.io/software-architecture-book/llms.txt
> Use this file to discover all available pages before exploring further.

# 模块化单体

模块化单体是一个可部署单元，内部由边界清晰的模块组成。每个模块拥有自己的领域逻辑、自己的持久化、自己的公开接口。模块之间只通过显式发布的接口对话，其他一律私有。

再读一遍。这就是微服务的整套打法，只删掉了一行："然后把它们分开部署。"

它之所以重要，是因为大多数团队玩不转分布式系统，但玩得转单体。模块化单体给你两边的好处：设计的独立性、显式的边界、一次只推理一个模块的能力——而没有网络、没有最终一致性、没有运维马戏团。如果某条模块边界画错了，你用编译器重构它，而不是拿着跨十一个仓库的迁移计划去开会。

## 模块，不是文件夹

文件夹不是模块。模块是会还手的边界。

物理结构能帮上忙。解决方案里一个模块一个项目——`Billing.csproj`、`Shipping.csproj`、`Catalog.csproj`——项目引用形成单向图。`Billing` 可以引用 `Catalog.Contracts`（那个只装公开接口和 DTO 的小装配件），但不许引用 `Catalog` 本体。这条边界是构建系统强制执行的。凌晨两点赶发布，你也绕不过去。

模块内部，随便你怎么折腾。模块外部，只存在那个契约装配件。这正是分层架构求而不得的纪律：编译器会说不。

## C#的模块边界

模式很简单。每个模块对外暴露内部实现和公开契约，其他模块只能依赖契约。

```csharp
// Catalog.Contracts —— 被其他模块引用，只装契约，零逻辑
namespace Catalog.Contracts;

public sealed record ProductInfo(Guid Id, string Name, Money Price);

public interface ICatalogFacade
{
    Task<ProductInfo?> GetProductAsync(Guid id, CancellationToken ct);
}
```

```csharp
// Catalog 模块本体 —— 其他一切都是 internal
namespace Catalog;

internal sealed class CatalogFacade(
    CatalogDbContext db,
    IProductPolicy policy) : ICatalogFacade
{
    public async Task<ProductInfo?> GetProductAsync(Guid id, CancellationToken ct)
    {
        var product = await db.Products.FindAsync([id], ct);
        if (product is null || !policy.IsVisible(product))
            return null;

        return new ProductInfo(product.Id, product.Name, product.Price);
    }
}
```

```csharp
// Catalog 的装配入口 —— 除 Contracts 外唯一的公开接缝
public static class CatalogModule
{
    public static IServiceCollection AddCatalog(this IServiceCollection services)
    {
        services.AddDbContext<CatalogDbContext>(o => o.UseNpgsql(...));
        services.AddScoped<ICatalogFacade, CatalogFacade>();
        // CatalogFacade 是 internal 的：只能通过接口解析到它
        return services;
    }
}
```

看这买到了什么。`Billing` 调 `ICatalogFacade.GetProductAsync`，拿到一个 `ProductInfo` 记录。它碰不到 `CatalogDbContext`，看不见 `ProductPolicy`。哪天 Catalog 团队把整个模块换成外部服务，契约——那个接口和那条记录——就是迁移时要沿着走的接缝。今天不付分布式系统的税，迁移的路还留着。

## 为什么它是默认选项

创业公司不需要微服务，需要发货。模块化单体让五到五十人的团队跑得飞快：调试器好使、事务能跨模块、部署只有一个产物。

真正的选择题不是单体对微服务，而是模块对面糊。一个模块化良好的单体，日后可以沿着已经在生产环境验证过的边界，一个模块一个模块地拆成微服务。一大团泥球除了重写，什么都变不成。

## 反模式

模块化单体最常见的死法，叫"万能 Common"。开头拆得很漂亮：`Billing.csproj`、`Shipping.csproj`，边界清晰。三个月后，多出来一个 `Common.csproj`，装着"临时"的工具类、共享的 DTO、连着一张"临时"的表。半年后，所有模块都依赖 Common，Common 也反向依赖所有模块，构建图成了死结。模块边界不是被攻破的，是被一刀一刀"就这一次"放行的。

它诱人，是因为每一步都合理：拷一个工具类进 Common，比好好想想它到底归谁快多了。而真实的代价是隐形的：边界软了之后，你失去的是当初拆模块的全部理由。改 Common 一行，整个系统一起重编；"一次只推理一个模块"变成翻两个项目找引用。编译器再也说不了不了。

防范办法就一句话：契约装配件只装契约，其他的一律不许放。看到 `Common` 出现在解决方案里，第一个就该警惕。

**权衡：** 你放弃的是独立部署和按模块伸缩。换回来的是原子事务、随手可用的调试器、一条部署流水线。对绝大多数团队，这笔交易都该做。除非你能说出一个具体的、带日期的理由必须分开部署——工程师超过五十人、合规要求的隔离、真正的伸缩热点——否则你就是在为没挣来的复杂度付钱。

Source: https://tonywoo.github.io/software-architecture-book/book/styles-and-patterns/modular-monolith/index.mdx
