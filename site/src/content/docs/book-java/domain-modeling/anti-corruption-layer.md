---
title: "防腐层"
description: "用翻译层把你的模型和祖传/外部模型隔开 —— Java实战，以及这笔钱什么时候值得花。"
sidebar:
  order: 390
  label: "防腐层"
  group:
    label: "Java 版 · 第5章 · 领域建模"
---

你的新系统再漂亮，总要和不漂亮的东西打交道：一套二十年的 ERP，它的「客户」叫 `CUST_MSTR`，地址拆成 `ADDR1`、`ADDR2`、`ADDR3`，状态是个 1 到 9 的数字；或者一个第三方物流 API，把重量叫 `wgt`，单位有时是公斤有时是磅，看它的心情。

如果你让这些模型直接流进你的领域，你的模型就烂了。`if (erpStatus == 7)` 这种代码会出现在你的订单逻辑里，三个月后没人记得 7 是什么意思。祖传系统的概念会像霉菌一样爬进你的聚合，统一语言当场去世。

**防腐层（Anti-Corruption Layer, ACL）**就是一道隔离带：你的模型和他们的模型之间，站着一层翻译。你的领域只和翻译后的干净概念打交道，永远看不到 `CUST_MSTR`。

## 防腐层由三部分组成

**外观（Facade）**：给外部系统一个单一的、符合你用法的入口，屏蔽它难用的 API 形状。**适配器（Adapter）**：把外部系统的协议、认证、分页、重试这些脏活包起来。**翻译器（Translator）**：核心，把外部模型转成你的领域概念 —— 也是唯一允许「懂」两种模型的地方。

三层可以很薄，也可以各自独立部署。关键原则只有一条：依赖方向只能从防腐层指向外部系统，你的领域模型对外部系统一无所知。

## 实战：把 ERP 的客户翻译成你的客户

假设祖传 ERP 的客户记录长这样：`CUST_NO` 是客户号，`FIRST_NM`/`LAST_NM` 是姓名，`STAT_CD` 是 1–9 的状态码。你的领域里，客户是 `Customer`，姓名是值对象 `PersonName`，状态是枚举 `CustomerStatus`。翻译器是两种世界唯一的交界：

```java
package ch060;

import java.util.Optional;
import java.util.UUID;

// 防腐层：领域代码只调这个外观，永远碰不到 ERP 的 API。
// ERP 的怪形状被拦在翻译器里，进不了领域。
class AntiCorruptionLayer01 {

    // 外观：领域只依赖这个接口。
    interface CustomerDirectory {
        Optional<Customer> findById(CustomerId id);
    }

    // 实现：唯一知道 ERP 存在的地方。
    static final class ErpCustomerDirectory implements CustomerDirectory {
        private final LegacyErpClient erp;
        private final ErpCustomerTranslator translator;

        ErpCustomerDirectory(LegacyErpClient erp, ErpCustomerTranslator translator) {
            this.erp = erp;
            this.translator = translator;
        }

        public Optional<Customer> findById(CustomerId id) {
            // ERP 的怪字段、怪状态码，在这里被翻译掉。
            return erp.fetchCustomer(id.value()).map(translator::toDomain);
        }
    }

    // 祖传 ERP 客户端：返回 ERP 的原生形状。
    interface LegacyErpClient {
        Optional<ErpCustomerRecord> fetchCustomer(String customerNo);
    }

    record ErpCustomerRecord(String custNo, String firstNm, String lastNm, int statCd) {}

    record CustomerId(String value) {}
    record PersonName(String first, String last) {}
    enum CustomerStatus { ACTIVE, SUSPENDED, CLOSED }

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

    static final class ErpCustomerTranslator {
        Customer toDomain(ErpCustomerRecord legacy) {
            return new Customer(
                new CustomerId(legacy.custNo().trim()),
                new PersonName(legacy.firstNm().trim(), legacy.lastNm().trim()),
                switch (legacy.statCd()) {
                    case 1, 2 -> CustomerStatus.ACTIVE;
                    case 3, 4 -> CustomerStatus.SUSPENDED;
                    default -> CustomerStatus.CLOSED;
                });
        }
    }
}
```

注意 `MapStatus` 里的 `_ => Closed`：翻译器必须对未知输入有立场。祖传系统哪天加了个状态码 10，你的翻译器按保守策略处理并告警，而不是让一个没人认识的数字流进领域。这是防腐层的本职工作：把外部的不确定性挡在门外。

## 这笔钱什么时候值得花

防腐层是纯成本：多一层代码、多一层测试、多一个要维护的映射。花这笔钱的条件有两个，满足一条就值得：

第一，**你的模型是核心域**。核心域是公司赢的地方，值得用隔离带来保护。如果只是个支撑子域去读 ERP，不如做个遵奉者（Conformist），直接用它的模型，别折腾。

第二，**外部模型在变，或者烂得超出你的控制**。第三方 API 一年改三次字段名，祖传系统没人敢动 —— 这种时候，没有防腐层，每次外部变化都是一次全代码库的地震。有了它，地震被收敛到翻译器里。

反过来，如果外部系统稳定、简单、而且你能影响它（比如兄弟团队的服务），防腐层就是过度设计。直接对话，签好契约，把精力省下来。

## 反模式

**到处都是「顺手」的翻译。**

没人正式建防腐层，但每个服务里都有一小段 `MapStatus`、`ParseErpCode`。诱人之处在于：它看起来务实 —— 「就三行代码，不值得建一层」。每个团队都觉得自己那三行是特例。

代价是霉菌式扩散。祖传模型的概念从几十个「顺手」的小口子渗进领域：`if (status == 7)` 出现在订单逻辑里，`ADDR1` 出现在报表里。外部系统一改字段，你要翻遍全库找散落的映射 —— 而测试只覆盖了其中一半。防腐层省掉的每一分钱，都会在第一次外部变更时加倍讨回来。

**权衡：** 防腐层最大的风险不是写它，而是养它。翻译器是活的：外部系统加字段、改含义，映射就要跟进，而跟进的人往往不是当初写它的人。对策是两条铁律：翻译逻辑集中在一处，不许散落；每个映射都要有测试，外部样本变了测试先红。做不到这两条，防腐层自己会先腐烂 —— 到时候你有两个烂模型，而不是一个。
