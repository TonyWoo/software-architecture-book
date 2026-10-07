---
title: "分层架构 / N 层架构"
description: "经典的分层架构、它的依赖规则，以及让分层名存实亡的那些漏洞。"
sidebar:
  order: 270
  label: "分层架构 / N 层架构"
  group:
    label: "Java 版 · 第4章 · 风格与模式"
---

分层是书里最老的把戏。你把系统切成水平的薄片——表现层、业务逻辑层、数据访问层，上面可能再加个服务层——然后宣布一条简单的规则：每一层只能依赖它正下方的那一层。

这条规则就是整个架构。其他的都是注释。

它之所以重要，是因为它给了你一套问责的词汇。UI 出了问题，看表现层；SQL 跑得慢，看数据层。对一个做业务系统的小团队来说，这往往就够了。没人会迷路，代码的形状和心智模型一致，而这个心智模型能装进一个人的脑子里。

但依赖规则是承诺，不是编译器检查。而承诺是会随时间失效的。

## 依赖规则

规则是这么说的：第 N 层只认识第 N-1 层，不反向认识，也不许跳层。表现层调业务层，业务层调数据层，谁都不许插队。

实际操作中，要看层与层之间到底在传什么。当你的"业务实体"和 JPA/Hibernate 的模型是同一个类，又被直接序列化成 JSON 吐给 API 时，你并没有三层。你只有一层，穿了三件衣服。编译器看不出区别，因为根本没有区别。

真正的层有自己的类型。领域层定义 `Order`，数据层把自己的 `OrderRow` 映射成这个 `Order`，API 层再把 `Order` 映射成 `OrderDto`。三遍映射看着像浪费，直到某天数据库表结构变了，你才发现只有一层需要改。

```java
package ch050;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// 领域层：对 JPA 和 HTTP 一无所知
class LayeredNTier01 {

    record Order(UUID id, String customerName, List<OrderLine> lines, Money total) {}
    record OrderLine(String sku, int quantity, Money unitPrice) {}
    record Money(BigDecimal amount, String currency) {}

    // 数据层：把自己的持久化模型映射成领域类型
    @Repository
    static class OrderRepository {
        private final OrderJpaRepository jpa;

        OrderRepository(OrderJpaRepository jpa) {
            this.jpa = jpa;
        }

        Order findById(UUID id) {
            OrderEntity row = jpa.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
            return row.toDomain(); // 映射住在数据层，这是它的地盘
        }
    }

    interface OrderJpaRepository extends JpaRepository<OrderEntity, UUID> {}

    static class OrderEntity {
        UUID id;

        Order toDomain() {
            throw new UnsupportedOperationException("映射省略：行记录 -> 领域对象");
        }
    }

    static class OrderNotFoundException extends RuntimeException {
        OrderNotFoundException(UUID id) {
            super("订单不存在: " + id);
        }
    }
}
```

注意 `IOrderRepository` 这个接口是谁定义的：领域层。实现住在数据层。依赖的方向朝下。这个方向就是一切。

## 它在哪里走样

分层走样的方式是可以预测的。

第一，漏水的层。有人要在 UI 里取一小块数据库里的数据，于是"就这一次"绕过业务层直连数据库。然后又有下一次。一年之内，表现层直接查库，业务层变成透传，架构图成了虚构文学。每一个捷径，都是投给废除规则的一票。

第二，贫血的耦合。业务层最后变成一袋事务脚本——`OrderService` 里五十个方法，每个都是 仓储 调用的薄包装——因为真正的逻辑没地方住。层与层之间按流程分了家，没按职责分家。你付了架构的仪式感，没拿到架构的好处。

第三，测试的谎言。团队宣称"分层是可单元测试的"，但层与层之间通过具体类、用 DI 容器硬连线。要给测试替掉某一层，需要的是当初没人写的那些接口。

## 反模式

分层最常见的烂法，是把"分层"当成仪式。每个请求不管简单到什么程度，都要过 DTO → Service → Repository → EF 四层大军，中间还站着个 `XxxManager` 传话。真正的业务逻辑只有两行，被一百行穿线代码淹没。改一个字段，四个文件一起改。团队每天花大价钱"走流程"，买到的只是"看着像架构"的安心。

这套戏诱人，是因为它便宜好教。新人看一周就会模仿，代码评审不用动脑子——"有没有三层？有，过。"但分层的全部价值在于依赖的方向。一旦 DTO 和 EF 实体是同一批类，一旦业务层只是转发调用，你的四层就是一层。付了穿线的税，没拿到隔离的好处。仪式感是最贵的空头支票。

**权衡：** 分层便宜、好讲，所以它能活到今天。但依赖规则只靠纪律维持，而纪律是 交付期限 到来时第一个被花掉的东西。如果你的团队说不出用什么机制防止跳层——代码评审、依赖检查测试、物理上的包隔离——那你就没有分层架构，你只有一个愿望。
