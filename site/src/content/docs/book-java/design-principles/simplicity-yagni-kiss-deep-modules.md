---
title: "简单之道：YAGNI、KISS、深模块"
description: "别为想象中的未来造东西；要深模块不要浅模块；简单不等于容易。"
sidebar:
  order: 220
  label: "简单之道：YAGNI、KISS、深模块"
  group:
    label: "Java 版 · 第3章 · 设计原则"
---

## YAGNI：你不会需要它

每个开发者都有一个抽象的坟场，埋的都是为从未到来的未来造的东西。给只带了一个插件的产品做的通用插件框架，给从没变过的配置做的配置引擎。YAGNI（You Aren't Gonna Need It，你不会需要它）就是不造这些东西的纪律。

投机性通用化的代价，不只是写它花掉的几个小时。而是之后每个读它、绕开它、在它里面 调试 的人，在整个代码库生命周期里持续付出的税。一个"以防万一"的功能，不管用不用得上，都会对每一次未来的改动征税。按今天的需求造，保持明天好改。这就是全部诀窍：简单且好改的代码，胜过猜中了变化的复杂代码。

## KISS，以及"简单"和"容易"的区别

保持简单，笨蛋。但简单不等于容易。Rich Hickey 划过这条线：simple（简单）是单股、不纠缠；easy（容易）是熟悉、顺手。把同样的五行代码复制到三个地方，很容易——你闭着眼都会。把共享的概念抽出来，很简单——改动只有一处——但需要动脑子。

代码会被读、会被改很多次，也就是说几乎永远：选简单，别选容易。容易的路会利滚利。三个副本变成三十个，每个都差一点点，每个都是陷阱——专坑那个改了二十九处就发布的倒霉蛋。

```java
package ch040;

import java.math.BigDecimal;

class SimplicityYagniKissDeepModules01 {

    // 容易：顺手、复制粘贴、正在悄悄分叉。
    // 三个方法长得一样，将来改折扣逻辑要改三处，总有一处会漏。
    static BigDecimal priceForMembers(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.9"));
    }

    static BigDecimal priceForVip(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.85"));
    }

    static BigDecimal priceForStaff(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.8"));
    }

    // 简单：一个概念，一个改动点。
    static BigDecimal applyDiscount(BigDecimal amount, BigDecimal rate) {
        return amount.multiply(rate);
    }

    static class DiscountRates {
        static final BigDecimal MEMBER = new BigDecimal("0.9");
        static final BigDecimal VIP = new BigDecimal("0.85");
        static final BigDecimal STAFF = new BigDecimal("0.8");
    }
}
```

## 深模块，而不是浅模块

John Ousterhout 的定义最锋利：最好的模块是深的——小接口藏着大实现。浅模块反过来：大接口配小实现。浅模块是代码库的税吏，写起来便宜，用起来贵，因为它本该藏起来的复杂度全从臃肿的接口里漏了出来。

数一数你的类有多少公开方法。一个四十个公开方法、两百行代码的类是浅的——它把复杂度推给了调用者，调用者想干点啥都得先学完整套接口。一个三个公开方法、两千行代码的类是深的——它靠吸收复杂度证明自己的存在。设计模块时问自己：接口暴露了多少，实现藏起了多少？把这个比例做大。

```java
package ch040;

import java.util.List;

class SimplicityYagniKissDeepModules02 {

    // 浅：活儿都是调用者在干。这个"模块"只是个薄包装，
    // 套着四十个它不肯替你做决定的配置开关。
    static class ShallowReportBuilder {
        String font = "Arial";
        int fontSize = 11;
        String headerText = "";
        boolean showPageNumbers;
        String dateFormat = "yyyy-MM-dd";
        // ... 还有三十个开关 ...
        String build(List<Row> rows) {
            return "";
        }
    }

    // 深：三个方法，所有格式决策模块自己扛。
    static class InvoiceReport {
        InvoiceReport(List<Invoice> invoices) {
        }

        String toPdf() {
            return "";
        }

        String toCsv() {
            return "";
        }
    }

    record Row() {}
    record Invoice() {}
}
```

## 反模式

最常见的错误用法有两种，都打着简单的旗号。一种是拿"简单"当不设计的借口："先 取巧 上线再说，别过度设计"——结果是复制粘贴满天飞，三个月后每个副本都长出自己的小特例，谁改都心慌。另一种是迷信行数：以为代码越短越简单，于是把一个 60 行的解析器压成 20 行正则，全队只有写的那个人能看懂。

它们都诱人：前者让你今天交付得更快，后者让你在评审里赢得"简洁"的夸奖。代价都发生在未来：前者让每一次改动都变成寻宝游戏，后者让接手的人不敢碰那行"聪明"代码，只能绕着写。

**陷阱：** 简单不是不设计。"先 取巧 上线再说"写出来的代码好写难改——和简单正好相反。真正的简单需要更多的思考，而不是更少：在三个特例背后找到那一个概念，选出深的接口，删掉投机造的框架。陷阱在于把"代码少"当成"简单"。一个 20 行的正则可能比一个 60 行的解析器更难改。简单的意思是：好懂，改着不心慌。按这个量，别按行数。
