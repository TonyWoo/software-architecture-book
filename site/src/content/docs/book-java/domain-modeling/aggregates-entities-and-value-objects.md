---
title: "聚合、实体与值对象"
description: "一致性边界、聚合根的规矩，以及用 Java record 写值对象的 Order/OrderLine 实战。"
sidebar:
  order: 370
  label: "聚合、实体与值对象"
  group:
    label: "Java 版 · 第5章 · 领域建模"
---

对象图是无限的。订单有订单行，订单行有商品，商品有供应商，供应商有地址……如果你允许一次事务里随便改这张网上的任何节点，迟早有人在你更新订单行的时候改了商品的税率，而你的不变量检查还在睡大觉。

**聚合**就是你画的一条线：线里面，一次事务、一起存、一起保证一致；线外面，只能看，不能直接改。这条线不是技术划分，是业务的一致性边界 —— 哪些东西必须「要么一起对，要么一起错」。

## 实体与值对象：先分清身份

**实体**有身份。两个 `Customer` 对象即使所有字段都一样，只要 ID 不同，就是两个人。身份贯穿生命周期，属性可以变，人还是那个人。

**值对象**没有身份，只有值。`Money(100, "CNY")` 和另一个 `Money(100, "CNY")` 就是同一个东西，可以互换。值对象应该是不可变的：你不「改」一个金额，你用一个新的金额替换它。不可变消灭了一整类「谁改了我的对象」的 缺陷。

Java 的 `record` 几乎是为值对象量身定做的：值语义的相等、简洁的不可变声明，一个关键字解决：

```java
package ch060;

import java.math.BigDecimal;

// 值对象：没有身份，不可变，相等只看值。
class AggregatesEntitiesValueObjects01 {

    record Money(BigDecimal amount, String currency) {
        static Money zero(String currency) {
            return new Money(BigDecimal.ZERO, currency);
        }

        Money add(Money other) {
            // 不同币种不能直接相加：这是业务规则，不是类型体操。
            if (!currency.equals(other.currency))
                throw new DomainException(
                    "Cannot add " + currency + " to " + other.currency + ".");
            return new Money(amount.add(other.amount), currency);
        }
    }

    record Sku(String value) {}

    static class DomainException extends RuntimeException {
        DomainException(String message) {
            super(message);
        }
    }
}
```

## 聚合根的规矩

每个聚合有一个**聚合根** —— 唯一对外暴露的入口。规矩很简单，也很严格：

1. 外部只能通过聚合根改聚合内部。订单行没有独立的仓储，你想加行，走 `order.AddLine(...)`。
2. 聚合之间只许通过 ID 引用，不许直接持有对方的对象引用。`Order` 存 `CustomerId`，不存 `Customer`。
3. 一次事务只改一个聚合。需要跨聚合的「一致性」，用领域事件最终一致，而不是分布式事务。

违反这些规矩的代价很具体：聚合越画越大，加载一次订单拖出半个数据库；两个聚合互相引用，删一个级联出一场灾难。

## 实战：Order / OrderLine

订单是不变量的典型：行项目数量必须为正，同一个 SKU 不能出现两行（要改数量走改数量的方法），订单总额永远等于各行小计之和 —— 这个「之和」不能存在数据库列里等人去同步，它必须每次算出来。聚合根把这些规矩焊死在代码里：

```java
package ch060;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// 聚合根：Order。所有对订单的修改都经过它。
class AggregatesEntitiesValueObjects02 {

    static final class Order {
        private final UUID id;
        private final UUID customerId; // 只存 ID，不直接引用 Customer 聚合。

        private final List<OrderLine> lines = new ArrayList<>();

        Order(UUID id, UUID customerId) {
            this.id = id;
            this.customerId = customerId;
        }

        void addLine(Sku sku, int quantity, Money unitPrice) {
            // 不变量 1：数量必须为正。
            if (quantity <= 0)
                throw new DomainException("Quantity must be positive.");

            // 不变量 2：同一 SKU 只允许一行，改数量请走 changeQuantity。
            if (lines.stream().anyMatch(l -> l.sku().equals(sku)))
                throw new DomainException("SKU " + sku.value()
                    + " already exists; change its quantity instead.");

            lines.add(new OrderLine(lines.size() + 1, sku, quantity, unitPrice));
        }

        // 总额永远现场计算，不存、不缓存、不等人同步。
        Money total(String currency) {
            Money total = Money.zero(currency);
            for (OrderLine line : lines)
                total = total.add(line.lineTotal());
            return total;
        }

        List<OrderLine> lines() {
            return List.copyOf(lines);
        }
    }

    // OrderLine 是聚合内部实体：有身份（行号），但没有独立生命周期。
    // 包内可见的构造器：只有聚合根能创建它。
    static final class OrderLine {
        private final int lineNumber;
        private final Sku sku;
        private int quantity;
        private final Money unitPrice;

        OrderLine(int lineNumber, Sku sku, int quantity, Money unitPrice) {
            this.lineNumber = lineNumber;
            this.sku = sku;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        Sku sku() {
            return sku;
        }

        Money lineTotal() {
            return new Money(
                unitPrice.amount().multiply(BigDecimal.valueOf(quantity)),
                unitPrice.currency());
        }
    }

    record Money(BigDecimal amount, String currency) {
        static Money zero(String currency) {
            return new Money(BigDecimal.ZERO, currency);
        }

        Money add(Money other) {
            if (!currency.equals(other.currency))
                throw new DomainException("Cannot add " + currency + " to " + other.currency + ".");
            return new Money(amount.add(other.amount), currency);
        }
    }

    record Sku(String value) {}

    static class DomainException extends RuntimeException {
        DomainException(String message) {
            super(message);
        }
    }
}
```

注意 `OrderLine` 的构造函数是 `internal` 的：聚合之外连 `new` 都不许，只能求聚合根办事。这就是「入口唯一」在代码里的样子。

持久化时，`Money` 这种值对象不需要自己的表。JPA 的 @Embeddable 正好表达「它是父实体的一部分」：

```java
package ch060;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// JPA 映射：Money 作为 OrderLine 的内嵌值对象，没有独立表。
// 配置本身就是决策：值对象内嵌，实体才有表。
class AggregatesEntitiesValueObjects03 {

    @Embeddable
    static class Money {
        @Column(name = "amount")
        private BigDecimal amount;

        @Column(name = "currency", length = 3)
        private String currency;

        protected Money() {
        } // JPA 需要无参构造器

        Money(BigDecimal amount, String currency) {
            this.amount = amount;
            this.currency = currency;
        }
    }

    @Embeddable
    static class Sku {
        @Column(name = "sku", length = 64)
        private String value;

        protected Sku() {
        }

        Sku(String value) {
            this.value = value;
        }
    }

    @Embeddable
    static class OrderLine {
        @Embedded
        private Sku sku;

        private int quantity;

        // 内嵌的值对象：列直接铺在 OrderLine 的"表"里，没有外键。
        @Embedded
        private Money unitPrice;

        protected OrderLine() {
        }
    }

    @Entity
    @Table(name = "orders")
    static class Order {
        @Id
        private UUID id;

        // 值对象集合：跟着聚合根一起存取，没有独立生命周期。
        @ElementCollection
        private List<OrderLine> lines = new ArrayList<>();

        protected Order() {
        }
    }
}
```

## 反模式

**一个聚合装下全世界。**

订单聚合里塞着客户、商品、库存、发票 —— 「反正都在一个事务里才安全」。诱人之处在于：原子一致性让人安心。你不用想最终一致，不用写补偿，不用跟业务解释中间状态。一次提交，全世界都对了。

代价有三笔。第一笔是性能：加载一个订单拖出半个数据库。第二笔是并发：两个人改同一个大聚合的不同角落，照样打架，冲突率随聚合大小一起涨。第三笔最贵：删除和级联变成一场灾难，没人敢动。聚合的本意是「最小的一致性边界」，不是「最大的方便」。

**权衡：** 聚合的大小是个永恒的两难。聚合画大了，一次加载拖出太多数据，并发冲突变多 —— 两个人同时改同一个大聚合的不同部分，照样打架。画小了，本该原子保证的不变量被迫拆成最终一致，业务就得接受「中间状态」。经验法则：从小的开始，只把真正必须同生共死的东西圈进来。当你发现自己在为「跨聚合一致性」写补偿逻辑时，先问一句：这俩当初是不是就不该分开？
