---
title: "SOLID、内聚与耦合"
description: "把五个 SOLID 规则讲成依赖管理，内聚与耦合才是底下真正的两股力量。"
---

> Documentation Index
> Fetch the complete documentation index at: https://tonywoo.github.io/software-architecture-book/llms.txt
> Use this file to discover all available pages before exploring further.

# SOLID、内聚与耦合

## 五条规则，底下是两股力量

SOLID 是五条原则。很多人背得下缩写，却很少问它们到底在讲什么。它们只讲一件事：依赖。谁知道谁，一个模块变了，哪些模块会跟着坏。SOLID 的每个字母都是一条排列依赖的规则，目的是让改动的影响停留在局部。

## 单一职责：只有一个改变的理由

一个类应该有且只有一个改变的理由。注意：不是"只做一件事"，而是"只有一个改变的理由"。一个既算账又生成 PDF 的报表类，会因为两种完全不同的需求被修改——业务规则变了要改它，输出格式变了也要改它，改它的可能是两个团队、两种节奏。每次动手都有可能弄坏另一边。

```java
package ch040;

import java.math.BigDecimal;

class SolidCohesionAndCoupling01 {

    // 两个改变的理由：计算逻辑和报表格式。
    // 违反单一职责：税率变了、PDF 样式变了，都会逼你改这个类。
    static class InvoiceService {
        BigDecimal calculateTotal(Order order) {
            return BigDecimal.ZERO;
        }

        String renderPdf(Invoice invoice) {
            return "";
        }
    }

    // 拆开。每个类现在只有一个变化轴。
    static class InvoiceCalculator {
        BigDecimal calculateTotal(Order order) {
            return BigDecimal.ZERO;
        }
    }

    static class InvoicePdfRenderer {
        String renderPdf(Invoice invoice) {
            return "";
        }
    }

    record Order() {}
    record Invoice() {}
}
```

## 开闭、里氏替换、接口隔离：扩展的三条规则

开闭原则说，软件实体应该对扩展开放、对修改关闭。加行为靠加代码，而不是改旧代码。下面的策略模式就是教科书做法：新的折扣政策以新类的形式到来，永远不需要在那个神圣方法里加 `if` 分支。

里氏替换说，子类型必须能在不破坏调用者的前提下替换基类型。如果你的 `ReadOnlyFile` 在 `Write` 时抛 `NotSupportedException`，那它就是在谎称自己是个 `File`。这个继承关系是个谎言，每个调用者都得防着它。

接口隔离说，客户端不应该依赖它不用的方法。一个臃肿的 `IWorker` 同时有 `Work()` 和 `Eat()`，会逼着机器人实现类去实现"吃午饭"。把接口拆开，客户端只依赖它真正调用的东西。

```java
package ch040;

import java.math.BigDecimal;

class SolidCohesionAndCoupling02 {

    interface DiscountPolicy {
        BigDecimal apply(BigDecimal amount);
    }

    static class NoDiscount implements DiscountPolicy {
        public BigDecimal apply(BigDecimal amount) {
            return amount;
        }
    }

    static class LoyaltyDiscount implements DiscountPolicy {
        public BigDecimal apply(BigDecimal amount) {
            return amount.multiply(new BigDecimal("0.9"));
        }
    }

    // 对修改关闭：新增折扣政策不需要动这里的一行代码。
    static class Checkout {
        private final DiscountPolicy policy;

        Checkout(DiscountPolicy policy) {
            this.policy = policy;
        }

        BigDecimal total(BigDecimal amount) {
            return policy.apply(amount);
        }
    }
}
```

## 内聚与耦合：真正的两股力量

先把缩写忘掉。真正主宰设计的只有两股力量。内聚：一起变的东西住在一起。耦合：一个东西变了，会坏掉多少东西。

高内聚意味着模块的各部分朝着同一个目标协作，一次变更请求只动一个模块。低耦合意味着模块之间彼此了解得很少，一个模块的改动不会涟漪般扩散到十个模块。SOLID 的每个字母都是战术：提高内聚、降低耦合，或者两者兼顾。单一职责提高内聚，依赖倒置降低耦合，开闭原则两者都做。哪天你忘了那些字母，记住这两股力量就行：一起变的东西放一起，依赖关系能少则少。

```java
package ch040;

import java.math.BigDecimal;
import java.util.List;

class SolidCohesionAndCoupling03 {

    // 低内聚、高耦合：Order 什么都懂——支付、邮件、库存。
    static class Order {
        void process() {
            chargeCreditCard(); // 支付方面的事
            sendEmail();        // 通知方面的事
            updateStock();      // 库存方面的事
        }

        private void chargeCreditCard() {}
        private void sendEmail() {}
        private void updateStock() {}

        BigDecimal total() {
            return BigDecimal.ZERO;
        }

        List<String> lines() {
            return List.of();
        }

        String customer() {
            return "";
        }
    }

    // 内聚、解耦：每个关注点管自己的行为，
    // 由协调者组装，而不是硬引用。
    static class OrderProcessor {
        private final PaymentGateway payments;
        private final Notifier notifier;
        private final Inventory inventory;

        OrderProcessor(PaymentGateway payments, Notifier notifier, Inventory inventory) {
            this.payments = payments;
            this.notifier = notifier;
            this.inventory = inventory;
        }

        void process(Order order) {
            payments.charge(order.total());
            inventory.reserve(order.lines());
            notifier.send(order.customer(), "Your order shipped.");
        }
    }

    interface PaymentGateway {
        void charge(BigDecimal amount);
    }

    interface Notifier {
        void send(String customer, String message);
    }

    interface Inventory {
        void reserve(List<String> lines);
    }
}
```

## 反模式

最常见的错误用法是 SOLID 仪式化：把原则当 检查清单，每个新类都要套一遍拆分、接口、策略，然后宣布"符合 SOLID"。这很诱人：它看起来专业，评审时没人敢反对——毕竟谁愿意承认自己反对"好原则"？它还给了你一个躲起来的地方：不确定需求到底怎么变的时候，"为了可扩展"是最安全的说辞。

真实的代价是改动变贵了。读代码的人要穿过五六个类才能找到那行真正干活的逻辑，调试时栈追踪跨十层接口，新同学三天才看懂一个本来半天能交付的功能。更讽刺的是，真需要扩展的那一天，你会发现抽象的方向根本不对——你预测的扩展轴从来没发生，发生的变全是当初没拆的那边。

**陷阱：** 把 SOLID 用在所有地方是一种病。为了实现一个函数的功能，搞出五个类三个接口，这不是设计，是仪式。这些规则用在改动真实发生的地方：边界上、易变的核心里。一个数据传输对象不需要接口。原则说的是"一个改变的理由"——如果什么都不会变，那就没有任何理由去拆。

Source: https://tonywoo.github.io/software-architecture-book/book-java/design-principles/solid-cohesion-and-coupling/index.mdx
