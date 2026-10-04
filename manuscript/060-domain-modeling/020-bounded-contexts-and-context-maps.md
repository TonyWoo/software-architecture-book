---
id: bounded-contexts-and-context-maps
title: "限界上下文与上下文映射图"
synopsis: 语言边界让一个模型只在一个范围内诚实，加上团队用来描述上下文关系的几种模式。
status: draft
role: body
unit: section
---

来看这个词：「订单」。在销售部，它是客户的一次购买；在仓库，它是一张拣货单；在财务，它是一笔可开票事件。三个部门，同一个词，三种含义，三套规则。如果你建一个 `Order` 类同时伺候三方，你没有建模领域，你造了一个对谁都撒谎的妥协品。

**限界上下文**就是某个模型为真的边界。在销售上下文里，`Order` 是客户的购买，模型自洽。仓库有自己的上下文和自己的模型。这个边界首先是语言上的 —— 标记词语在哪里变了意思 —— 然后才是技术上的：一个命名空间、一个模块、一个服务。

# 一个词，多种含义

这是 DDD 里最有用的诊断手段。当两个开发争论一个词是什么意思，而两边都对时，你就找到了一个上下文边界。这场争论不是要调和的分歧，而是一次发现。给每种含义一个自己的上下文，争论自然消失。

无视它的代价，就是大泥球最爱的那招：共享的 `Order` 实体长出 `WarehouseAisle`（库位）、`InvoiceNumber`（发票号）、`CustomerLoyaltyTier`（会员等级），直到没有团队敢改它而不弄坏另外两家。所有团队都减速到最谨慎的那个团队的速度。这就是「一个模型干三个活」要交的税。

# 画出地图

有了上下文，就要知道它们之间是什么关系。Evans 给了上下文映射（Context Map）—— 一张画出上下文及其关系的图。实践中最重要的几种模式：

**合作关系（Partnership）。** 两个团队一荣俱荣、一损俱损，于是紧密协作、共同演进共享接口。贵，但诚实。

**共享内核（Shared Kernel）。** 两个上下文共享一小部分模型 —— 比如一个公共的 `Money` 类型。便宜，但内核的每次改动都要两边同意，所以必须保持极小。

**客户方/供应方（Customer/Supplier）。** 上游上下文为下游提供服务。下游提需求，上游排期响应。只有上游团队真正对下游的需求做出承诺时才成立 —— 落成文字，否则迟早腐烂。

**遵奉者（Conformist）。** 下游原样采用上游的模型，不做翻译。快，适合上游是第三方或你动不了的祖传系统 —— 但你要接受他们的模型会塑造你的代码。

地图是活文档，不是墙上的装饰。关系变了 —— 供应方不再兑现承诺、合作关系解体 —— 地图要变，集成代码也要跟着变。

# 一个具体的例子

看一家电商公司。销售负责接单，仓库负责履约。这是合作关系：销售承诺次日达，仓库拣货跟不上，两边一起死。所以它们共享一个共同演进的接口 —— 但各自保留自己的模型。

在 C# 里，边界就是命名空间，合作关系就是一个两边共同拥有的翻译器：

```csharp
namespace Sales
{
    // 在销售上下文里，Order 是一次和客户的商业约定。
    public sealed record Order(
        Guid Id,
        CustomerId Customer,
        IReadOnlyList<OrderLine> Lines,
        Money Total,
        DateTimeOffset PlacedAt);
}

namespace Warehouse
{
    // 在仓库上下文里，"order" 是一张拣货单：SKU、数量、库位。
    // 同一个词，不同含义，不同模型。
    public sealed class PickList
    {
        public Guid SalesOrderId { get; }
        public IReadOnlyList<PickItem> Items { get; }

        private PickList(Guid salesOrderId, IReadOnlyList<PickItem> items)
        {
            SalesOrderId = salesOrderId;
            Items = items;
        }

        // 合作关系的接口：这个翻译两边团队共同拥有。
        public static PickList FromSalesOrder(Sales.Order order) =>
            new(order.Id,
                order.Lines
                    .Select(l => new PickItem(l.Sku, l.Quantity))
                    .ToList());
    }

    public sealed record PickItem(Sku Sku, int Quantity);
}
```

`PickList.FromSalesOrder` 就是整个合作关系，浓缩成一个方法。它显式、有版本、有测试。销售加了礼品包装，仓库团队会在自己评审的 PR 里看到翻译逻辑的变化 —— 而不是在凌晨两点发现共享表上莫名其妙多了一列。

# 反模式

**把上下文切成碎片。**

一旦学会「语言分叉处画边界」，有人就停不下来了。四十人的团队画出二十个上下文，每个小功能一个命名空间。诱人之处在于：它看起来很严谨 —— 边界越多，架构图越像教科书。

代价是翻译税。二十套翻译器、二十套版本、二十套同步，全是活代码，全要人养。更糟的是，大多数边界两侧说的根本是同一种话 —— 你为没人需要的区分买了单。边界是按语言的真实分裂来画的，不是按组织架构，也不是按「万一以后分开呢」。

**Trade-off:** 上下文边界是要花钱的。每个边界都是一段你要写、要维护、要做版本的翻译代码。上下文太少，你得到共享模型的泥潭，改一处坏一片；太多，你会被翻译器、事件和同步淹没，为没人需要的区分买单。只在语言真正分裂的地方画边界 —— 同一个词意思不同的地方 —— 别的地方不画。四十人的公司画二十个上下文，那不是严谨，是穿着戏服的 overhead。
