---
title: "通用语言"
description: "开发和业务专家说同一种语言 —— 含糊的词语如何变成真实的 缺陷，以及一次向领域词语靠拢的重命名。"
sidebar:
  order: 380
  label: "通用语言"
  group:
    label: "Java 版 · 第5章 · 领域建模"
---

每个项目都有两种语言：业务专家开会时说的，和开发写在代码里的。专家说「核保」，代码里叫 `LoanManager`；专家说「承运商」，代码里叫 `Vendor`。两种语言之间隔着一层翻译，而翻译是 缺陷 的温床。

**统一语言**就是拆掉这层翻译。开发和领域专家用同一套词语，词语出现在需求文档里，也一字不差地出现在类名、方法名和测试名里。语言不是文档，是模型本身 —— 代码就是用这套语言写成的可执行规格。

## 含糊的词语如何变成 缺陷

我见过一个真实的事故：需求里写「订单处理完成」。开发理解的「处理」是「数据校验通过」，客服理解的「处理」是「仓库已发货」。代码按前者实现，客服按后者承诺客户。结果：客户查到「已处理」的订单，仓库还没拣货。一次客诉潮，就为了一个没人较真的词。

这类 缺陷 的特点是：代码「按需求」是对的，测试全绿，但业务是错的。自动化测试救不了你，因为测试和代码用的是同一套被污染的词语。唯一的修复是回到源头 —— 让词语精确。

## 向领域的词语靠拢

做法不神秘：跟领域专家开会时，把他们的原话记下来；发现代码里的词和他们的词不一样，改代码，不是改他们的嘴。重命名是最便宜的建模工具。

看一个贷款审批的例子。开发最初按自己的理解写了个 `LoanManager`，方法叫 `Process` —— 程序员的词，意思模糊。跟信贷专家聊完才知道，这个岗位叫「核保人」，动作叫「 adjudicate（核定）」，产出叫「核定结论」，有「通过 / 有条件通过 / 拒绝」三种，每种的后续流程都不一样：

```java
package ch060;

import java.math.BigDecimal;

// 改名之前：程序员的词语。process 到底干了什么？没人说得清。
class UbiquitousLanguage01 {

    static class LoanManager {
        // 返回 bool？那"有条件通过"去哪了？被这个签名吃掉了。
        boolean process(LoanApplication app) {
            if (app.creditScore() < 600)
                return false;
            return true;
        }
    }

    record LoanApplication(int creditScore) {}
}

// 改名之后：领域的词语。每个名字都能在信贷手册里找到出处。
class UbiquitousLanguage01After {

    static final class Underwriter {
        Adjudication adjudicate(MortgageApplication application) {
            if (application.creditScore() < 600)
                return Adjudication.decline("Credit score below policy minimum.");

            if (application.debtToIncomeRatio().compareTo(new BigDecimal("0.43")) > 0)
                return Adjudication.conditional(
                    "DTI exceeds 43%; require additional collateral.");

            return Adjudication.approve();
        }
    }

    // 核定结论：三种结果，一种都不能少。bool 装不下这个业务。
    record Adjudication(DecisionKind kind, String reason) {
        static Adjudication approve() {
            return new Adjudication(DecisionKind.APPROVE, null);
        }

        static Adjudication conditional(String reason) {
            return new Adjudication(DecisionKind.CONDITIONAL, reason);
        }

        static Adjudication decline(String reason) {
            return new Adjudication(DecisionKind.DECLINE, reason);
        }
    }

    enum DecisionKind { APPROVE, CONDITIONAL, DECLINE }

    record MortgageApplication(int creditScore, BigDecimal debtToIncomeRatio) {}
}
```

```java
package ch060;

// 祖传 ERP 的形状：原样保留，一行都不许"顺手改"。
class UbiquitousLanguage02 {

    // ERP 的字段名：CUST_NO、FIRST_NM……这是它的语言，不是你的。
    record ErpCustomerRecord(
        String custNo,
        String firstNm,
        String lastNm,
        int statCd) {}

    // 你的领域概念：干净，用统一语言。
    static final class Customer {
        private final CustomerId id;
        private final PersonName name;
        private final CustomerStatus status;

        Customer(CustomerId id, PersonName name, CustomerStatus status) {
            this.id = id;
            this.name = name;
            this.status = status;
        }
    }

    record CustomerId(String value) {}
    record PersonName(String first, String last) {}
    enum CustomerStatus { ACTIVE, SUSPENDED, CLOSED }

    // 翻译器：整个系统里唯一同时懂两种模型的地方。
    static final class ErpCustomerTranslator {
        Customer toDomain(ErpCustomerRecord legacy) {
            return new Customer(
                new CustomerId(legacy.custNo().trim()),
                new PersonName(legacy.firstNm().trim(), legacy.lastNm().trim()),
                mapStatus(legacy.statCd()));
        }

        // 状态码 1–9 的含义只允许出现在这里，不许漏进领域。
        private static CustomerStatus mapStatus(int code) {
            return switch (code) {
                case 1, 2 -> CustomerStatus.ACTIVE;
                case 3, 4 -> CustomerStatus.SUSPENDED;
                default -> CustomerStatus.CLOSED; // 未知码按最保守处理：关户。
            };
        }
    }
}
```

这次重命名顺手抓出一个真 缺陷：原来的 `bool` 返回值根本表达不了「有条件通过」，业务规则在类型层面就被丢了。词语一精确，类型的形状自己就长出来了。这就是统一语言的威力：它不只是好听，它改变代码的形状。

## 让语言活在代码里

统一语言最怕的是「写在 wiki 里」。wiki 里的术语表，三个月后就没人看了，代码继续用老词。语言的唯一栖息地是代码：类名、方法名、测试名、提交信息。开评审会时，有人用了代码里没有的词，当场问：这是新概念吗？要进模型吗？

还有一个实践：让领域专家读你的测试名。`Adjudicate_DeclinesWhenCreditScoreBelowMinimum` 这种名字，信贷专家是能读懂的。如果他读不懂，说明你的语言还没统一。

## 反模式

**代码说一套，会议说一套。**

专家说「核保」，代码里还是 `LoanManager`；专家说「承运商」，代码里还是 `Vendor`。大家心照不宣：开会用他们的词，写代码用我们的词。诱人之处在于：重命名看起来是低价值的体力活 —— 「名字而已，功能又没变」。没人愿意为改名开评审会。

代价是翻译住进了每个人的脑子。新人要先学两套词典，再学它们之间的映射；映射没有文档，全靠口口相传。更隐蔽的代价是：程序员的词往往比领域的词更粗 —— `Process` 吃掉了「有条件通过」，`Status` 吃掉了状态机的规则。含糊的词长不出精确的类型，缺陷 就住在这种缝隙里。

**陷阱：** 把统一语言当成一次性活动 —— 开两次研讨会，产出一份术语表 PDF，然后各回各家。语言是活的：业务变，词就变，代码就得跟着改。拒绝重命名的团队，等于宣布「我们的模型从此不再学习」。重命名很便宜，IntelliJ IDEA 里按两下 Shift+F6；让错误的词语在代码里住上三年，很贵。
