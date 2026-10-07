---
title: "边界与关注点分离"
description: "边界是什么、画在哪里，以及为什么\"变化\"才是唯一诚实的向导。"
sidebar:
  order: 200
  label: "边界与关注点分离"
  group:
    label: "Java 版 · 第3章 · 设计原则"
---

## 边界是变化到此为止的地方

边界是一条线，变化传到这条线就停了。线的一边是业务规则，另一边是数据库、UI 框架、第三方 SDK——那些会因为你控制不了的原因而变化的东西。供应商发了个破坏性版本，伤害停在边界处，你的核心逻辑毫不知情。

关注点分离，就是有意识地画这些线的纪律。不是按分层——"UI、业务、数据"像千层饼一样叠起来——而是按变化的轴线来分。问自己：什么东西会一起变，因为什么理由？那就是线的两边。

## 边界画在变化发生的地方

有个不太舒服的真相：你不可能在前期把所有边界都画对。针对想象中的未来变化画的边界，只是复杂度而已。正确的边界会在变化真实发生的地方自己显现——每个 迭代 都要改的那个模块，每个季度坏一次的供应商 SDK，发布节奏不一样的那个团队。

把边界画在易变的东西周围。支付供应商一年换两次，边界就画在结账逻辑和支付供应商之间。报表查询每周变，订单处理很稳定，那也是一条缝。你的组织和市场里的变化形态，会告诉你线画在哪里。无视它，你就会画出漂亮的分层，然后在第一个真实需求面前碎掉。

```java
package ch040;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.UUID;

class BoundariesAndSeparationOfConcerns01 {

    // 没有边界：领域逻辑和某个具体的数据库 API 结了婚。
    static class OrderRepository {
        void save(Order order) throws Exception {
            // JDBC、PostgreSQL，写死了：换数据库要改领域代码。
            try (Connection conn = DriverManager.getConnection("jdbc:postgresql://db/orders");
                 PreparedStatement ps = conn.prepareStatement("INSERT INTO orders ...")) {
                ps.executeUpdate();
            }
        }
    }

    // 画出边界：领域只依赖自己定义的接口。
    // 换掉数据库不需要动领域代码的一行。
    interface OrderStore {
        void save(Order order);
        Order load(OrderId id);
    }

    static class PlaceOrderUseCase {
        private final OrderStore store;

        PlaceOrderUseCase(OrderStore store) {
            this.store = store;
        }

        void execute(Order order) {
            if (order.lines().isEmpty())
                throw new IllegalStateException("Empty order.");
            store.save(order);
        }
    }

    record OrderId(UUID value) {}
    record Order(OrderId id, List<String> lines) {}
}
```

## 局部边界：整面墙太贵的时候

有时候你知道边界迟早要画，但变化还没来。整套家伙——接口、适配器、控制反转——今天就要付出真金白银的成本，回报却可能永远不来。局部边界就是折中方案。

经典的局部边界是策略模式：接口先定义好，实现先上一个，缝留着。或者外观模式：一个简单的类把领域和易变的库隔开，将来随时可以升级成完整的端口-适配器墙。花小钱买个缝，不搭脚手架。变化真来了，沿着这条缝扩展就行，不用对着一个早就僵化的代码库动大手术。

纪律在于分清两者。局部边界是一次下注："这东西大概率会变，我要一个便宜的转身。"把注下在有变化前科的东西上——供应商 SDK、序列化格式、通知渠道。别下在自己稳定的领域逻辑上。

## 反模式

最常见的错误用法是防御性画线：在第一个真实变化到来之前，就给每个可能变化的地方建起接口、适配器和分包。架构评审会上没人会骂你——"为扩展预留"是政治正确。更微妙的是，它给了你"我已经想过架构了"的错觉，而实际上你只是在猜。

真实的代价是迷宫。改一个简单的需求要动五个文件、穿过四条缝，你得先把系统在脑子里全拼起来才能动手。边界本该让变化停在局部，可过多的边界让一切都在局部里迷路。更糟的是，真实的变化来了，你发现那些精心画好的线根本不在正确的位置——变化从你没画线的地方流过去了，你只能绕着自己的脚手架再打补丁。

**权衡：** 每条边界都是成本。间接层、文件、接口、认知负担，一样都少不了。边界太多的系统是个迷宫，改个简单的东西要动五个文件、理解四条缝。边界只有在变化真的从它上面流过时才回本。画少了，供应商的折腾会感染你的核心；画多了，架构本身就成了摩擦力。从少而锋利的边界开始，围住你确定会变的东西——剩下的让它自然长出来。
