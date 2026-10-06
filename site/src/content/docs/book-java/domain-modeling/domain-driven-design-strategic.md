---
title: "领域驱动设计（战略篇）"
description: "DDD 首先是一套驯服复杂度的战略 —— 给子域分类，把建模精力投在刀刃上。"
sidebar:
  order: 350
  label: "领域驱动设计（战略篇）"
  group:
    label: "Java 版 · 第5章 · 领域建模"
---

大多数项目把每个功能看得一样重。登录页和决定公司赚不赚钱的定价引擎，得到的是同等规格的架构关怀。结果就是：一个漂亮、测试覆盖率极高的认证模块，栓在一个没人敢碰的定价引擎上。DDD 的战略部分，就是来纠正这个错误的。

Eric Evans 的洞察很简单：复杂度才是真正的敌人，而你不可能在所有战线上同时开战。所以你要选战场：搞清楚系统的哪一部分就是业务本身 —— 软件做得更好公司就赢的那部分 —— 然后把建模精力砸进去。剩下的，用最便宜的够用方案解决。

## 核心、支撑、通用子域

任何大系统都能拆成三类子域。这个分类做对了，一半架构决策会自动成立。

**核心域**是公司存在的理由。货运公司是线路优化和定价，银行是风险评估。这里你要建丰富的领域模型，派最好的开发，做复杂度的取舍 —— 因为复杂度本身就是业务。

**支撑子域**为核心域服务，但不是差异化竞争力：货运公司的司机排班，银行的对账单生成。简单实现，朴素建模，不许镀金。

**通用子域**是已经被解决的问题：认证、邮件、支付。你去买、去租、用现成的库。你不建模、不创新，更不许高级开发花半年手写一套身份认证框架。

## 把钱花在疼的地方

分类决定人员、预算和代码评审标准。核心域的代码，要拉着领域专家一起写，大胆重构，测试覆盖拉满。通用子域的代码，就是对第三方库包一层薄薄的封装，外加一条铁律：这里永远不许加新功能。

看一个货运系统的例子。核心 —— 运费定价 —— 是充满业务规则的丰富模型。通用 —— 邮件通知 —— 是对基础设施的一行委托：

```java
package ch060;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// 核心子域：运费定价。公司在这里赢，也在这里输。
// 丰富模型，重投入，领域专家随叫随到。
class DomainDrivenDesignStrategic01 {

    static final class FreightQuote {
        private final Route route;
        private final CargoManifest manifest;
        private final List<Surcharge> surcharges = new ArrayList<>();

        FreightQuote(Route route, CargoManifest manifest) {
            this.route = route;
            this.manifest = manifest;
        }

        void applyFuelSurcharge(FuelIndex index) {
            // 燃油指数过期了就不能用来定价：这是业务规则，不是校验参数。
            if (index.isStale())
                throw new DomainException("Cannot price against a stale fuel index.");
            surcharges.add(Surcharge.fuel(index.currentRate(), route.distanceKm()));
        }

        Money total() {
            // 基价 × 计费重量：BigDecimal 精确计算，币种在这里定死。
            Money base = new Money(
                route.baseRate().multiply(BigDecimal.valueOf(manifest.billableWeightKg())),
                "CNY");
            Money total = base;
            for (Surcharge s : surcharges)
                total = total.add(s.amount());
            return total;
        }
    }

    record Route(BigDecimal baseRate, double distanceKm) {}
    record CargoManifest(double billableWeightKg) {}
    record FuelIndex(BigDecimal currentRate, boolean isStale) {}
    record Surcharge(Money amount) {
        static Surcharge fuel(BigDecimal rate, double distanceKm) {
            return new Surcharge(new Money(rate.multiply(BigDecimal.valueOf(distanceKm)), "CNY"));
        }
    }

    record Money(BigDecimal amount, String currency) {
        Money multiply(double factor) {
            return new Money(amount.multiply(BigDecimal.valueOf(factor)), currency);
        }

        Money add(Money other) {
            if (!currency.equals(other.currency))
                throw new DomainException("Cannot add " + currency + " to " + other.currency + ".");
            return new Money(amount.add(other.amount), currency);
        }
    }

    static class DomainException extends RuntimeException {
        DomainException(String message) {
            super(message);
        }
    }
}
```

```java
package ch060;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

// 通用子域：通知。已经被解决的问题，不许在这里创新。
// 用现成的 SMTP 客户端，别手写一个"更优雅的"邮件系统。
class DomainDrivenDesignStrategic02 {

    interface NotificationSender {
        void send(Notification notification);
    }

    record Notification(String to, String subject, String body) {}

    static final class SmtpNotificationSender implements NotificationSender {
        private final Session session;

        SmtpNotificationSender() {
            // 真实项目里 Session 来自 Spring 的 JavaMailSender 自动装配。
            this.session = Session.getInstance(new Properties());
        }

        public void send(Notification notification) {
            try {
                var mail = new MimeMessage(session);
                mail.setFrom(new InternetAddress("noreply@shop.example"));
                mail.setRecipient(Message.RecipientType.TO,
                    new InternetAddress(notification.to()));
                mail.setSubject(notification.subject());
                mail.setText(notification.body());
                Transport.send(mail);
            } catch (Exception e) {
                throw new IllegalStateException("邮件发送失败", e);
            }
        }
    }
}
```

注意这种不对称。核心域得到的是不变量、领域语言和行为；通用域得到的是一次委托。如果有人提议给通知发送器加上重试策略、模板引擎和数据分析，战略上的回答是：去买个服务，我们是货运公司。

## 大多数团队栽在哪里

经典死法是投资倒挂。团队把通用域打磨得锃亮 —— 漂亮的后台 UI、手写的认证系统 —— 而核心域烂在一个三千行的 "Manager" 类里，谁都不敢动。会这样是因为通用问题做着舒服，核心问题难。舒服不是战略。

第二种死法是拒绝分类。「什么都重要」这句话一出口，就注定什么都得不到应有的关注。分类是一场下注，下注可能错 —— 但一个可以复盘的明确下注，胜过一场你永远察觉不到的隐性忽视。

## 反模式

**战术先行，战略缺席。**

这是最体面的错误用法。实体、值对象、仓储、工厂 —— 每一块都写得漂亮，测试覆盖率高，评审会上人人点头。诱人之处在于：它是看得见的产出。画子域、排优先级、承认「这个功能不重要」—— 全是看不见的慢功夫，还得罪人。

代价在几年后结账。邮件模板的领域模型丰富精美，定价引擎还是个没人敢碰的存储过程。模式没有错，错的是你把最好的工匠派去了最不重要的战场 —— 而真正的战场，连张像样的地图都没有。

**陷阱：** 把 DDD 当成一套战术模式 —— 实体、仓储、工厂 —— 却跳过战略部分。结局是给错误的东西做了漂亮的结构：邮件模板的领域模型丰富精美、测试齐全，而决定公司生死的定价引擎至今还是个存储过程。没有战略的模式只是装饰。先分类，再建模。
