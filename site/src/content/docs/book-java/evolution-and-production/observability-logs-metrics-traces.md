---
title: "可观测性：日志、指标、追踪"
description: "日志、指标、链路告诉你系统在干什么；先把结构化、基数和上下文做对。"
sidebar:
  order: 680
  label: "可观测性：日志、指标、追踪"
  group:
    label: "Java 版 · 第9章 · 演进与生产"
---

你看不见的东西，你就架构不了。在生产环境里，你的架构图是小说，你的假设是猜测。可观测性就是一门让运行中的系统回答这个问题的纪律：你到底在干什么，为什么慢、为什么坏？

三大支柱，各回答一个不同的问题。日志回答"发生了什么"。指标回答"趋势怎么样"。链路回答"这个请求经过了哪里，哪一跳最慢"。三个都要。只有一个日志的系统，是个靠半夜 grep 抢救的黑盒。只有指标的系统，是个只会说"出问题了"但不说"哪儿出问题了"的仪表盘。只有链路的系统，是张漂亮的地图，但树上都没挂牌子。

## 结构化日志：记事件，不记字符串

第一个升级最便宜、杠杆最高：别再写字符串了，开始记录事件。一条结构化日志是一个时间戳加一组命名字段，它可以被查询、被聚合、能和链路关联。一段扁平字符串只是个纪念品。

```java
package ch100;

import java.math.BigDecimal;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

// 别这么写：
//   log.info("Order " + orderId + " placed by user " + userId + " for " + total);
// 字符串拼接在日志关掉时也照算，还没法按字段查。

// 要这么写：结构化日志，占位符 + 参数。
class ObservabilityLogsMetricsTraces01 {

    @Service
    static class OrderService {
        private static final Logger log = LoggerFactory.getLogger(OrderService.class);

        void placeOrder(UUID orderId, String userId, BigDecimal total, int itemCount) {
            // 参数化：日志级别关掉时零开销；收集器按字段索引，能查"某用户的所有订单"。
            log.info("Order placed. orderId={} userId={} total={} itemCount={}",
                orderId, userId, total, itemCount);
        }
    }
}
```

看起来差别微不足道，但在生产环境里这是天壤之别。有了结构化字段，你可以用一条查询问："过去一小时，所有超过 500 美元且支付失败的订单"。用字符串，你只能 grep、眯眼、凌晨三点手写正则。

结构化还有一个被低估的好处：它强迫你在写代码时就想清楚"这条日志将来要回答什么问题"。字段名就是你对未来的提问。一个叫 `PaymentFailed` 带 `Reason` 和 `RetryCount` 的事件，比十段"支付好像出问题了"的字符串值钱一百倍。日志不是给人读的日记，是给机器查的数据。

## 链路上下文：把散落的点连起来

分布式系统终结了最古老的调试工具：因果关系。请求 A 调用服务 B，B 发了个消息，C 在四十秒后才处理。出了故障，三个仪表盘讲三个故事。链路上下文传播解决的就是这个问题：每个调用链注入 trace ID 和 span ID，让一个请求的完整旅程变成一个可查询的整体。

在 Java 里，OpenTelemetry 让这件事几乎零成本。接一次，所有 HttpClient 调用、数据库查询、发出去的队列消息都自动带上上下文：

```java
package ch100;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

// OpenTelemetry 接入（Spring Boot 3 路线）：
// 依赖 micrometer-tracing-bridge-otel + opentelemetry-exporter-otlp，
// 配置 management.otlp.tracing.endpoint 指向收集器（Jaeger / Tempo / 厂商），
// 代码里只用 Observation API 埋点，span 自动进 OTel。
class ObservabilityLogsMetricsTraces02 {

    @Configuration
    static class TracingConfig {
        @Bean
        ObservationRegistry observationRegistry() {
            // 真实项目里 Spring Boot 自动装配，这里显式声明示意接线位置。
            return ObservationRegistry.create();
        }
    }

    @Service
    static class CheckoutService {
        private final ObservationRegistry registry;

        CheckoutService(ObservationRegistry registry) {
            this.registry = registry;
        }

        void checkout(String orderId) {
            // 一个 Observation = 一段被追踪的操作：
            // 入站请求、出站 HTTP、数据库查询都会自动产生子 span。
            Observation.createNotStarted("checkout", registry)
                .observe(() -> {
                    // ... 业务逻辑 ...
                });
        }
    }
}
```

四个 埋点 包加一个 导出器，你就从"请求有点慢"进化到"结账链路的 p99 主要耗在 3 号分片的库存查询上"。这一句话，顶得上一周的架构评审会。

## 先给什么埋点：少，但准

先从哪里下手：边界。每个入站 HTTP 请求记录耗时、状态码、路由。每个出站依赖调用记录同样的三样。队列的发布和消费记录延迟。就这五处，给你黄金信号和依赖关系图，覆盖了八成真实故障。

埋点的顺序也有讲究：先让所有服务都发出最基础的请求指标，再去做精细化的业务指标。一个连"哪个端点慢"都回答不了的团队，不配谈"哪个 SKU 转化率掉了"。基础覆盖面优先于单点深度。

还有一个经常被忽略的点：可观测性数据本身也要当作资产来治理。日志保留多久、采样率多少、哪些 追踪 全量保留，这些决定直接影响你的存储账单和故障复盘能力。我的建议是：错误和慢请求全量保留，正常请求采样 1%-10%。出事时你最需要的，恰恰是那些异常样本的完整上下文。

## 反模式

把日志当廉价仓库。"都记下来，以后再查"，是生产环境最贵的幻觉。于是每个请求打二十个字段，`UserId` 顺手塞进指标标签。它诱人，是因为它把决策推迟了：今天不用想清要回答什么问题，先存下来再说，心理上等于零成本。

代价三个月后一次到账：存储账单翻倍，故障时找一条 追踪 得先从几个 TB 的噪声里捞。更糟的是高基数进指标：标签值爆炸打挂指标后端那天，你丢掉的是正在故障中急需的实时视图——系统挂了，仪表盘也挂了。

记之前先问：这条记录将来要回答哪个问题？回答不了的，别记。采集和存储都有价格，"以后再说"是最贵的那句。

**陷阱：** 基数（cardinality）。标签值无界的指标（用户 ID、订单 ID、邮箱地址塞进 标签）会炸掉你的指标后端和你的账单。高基数数据属于日志和链路，永远不属于指标标签。规则很简单：如果一个标签可能取几千种不同的值，就别把它放进指标里。
