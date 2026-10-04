---
title: "分布式计算的谬误"
description: "八个经典谬论，每一个都对应一种生产事故——停止相信它们，你的设计会彻底改变。"
sidebar:
  order: 550
  label: "分布式计算的谬误"
  group:
    label: "Java 版 · 第7章 · 第 7 章 分布式系统"
---

## 这份清单的来历

1994 年，Sun 实验室的 Peter Deutsch 列出八条"分布式计算的谬论"——每个分布式新手都相信、每个老手都被它们坑过的假设。三十年过去，云和容器把坑挖得更深了，但谬论一条没变。下面每条谬论后面，都跟着它在生产环境里制造的事故。

**1. 网络是可靠的。** 它不是。光纤被挖断、交换机抽风、云厂商整个可用区失联。你不做超时和重试的调用链，第一次网络抖动就会级联成全站故障。设计时就当网络*会*断，而不是*可能*断。

**2. 延迟为零。** 它不是。同机房几毫秒，跨洋几百毫秒。把"远程调用"当"本地调用"写的代码——循环里调 50 次微服务接口——在生产环境慢得像爬。你要么批量，要么并行，要么别跨网络。

**3. 带宽是无限的。** 它不是。返回 10MB JSON 的接口在测试环境飞快，在生产环境被一千个客户端同时调用时把网卡打满。分页、压缩、只传需要的字段——带宽是钱，流量是账单。

**4. 网络是安全的。** 它不是。服务间明文传 令牌、内网接口不鉴权——"内网"只是你的一厢情愿。零信任不是口号：每条服务间调用都要认证、鉴权、加密。被横向渗透一次，你就懂了。

**5. 拓扑不会变。** 它会变。容器漂移、IP 变化、服务上下线。写死 IP 和主机名的配置，是第一批在扩缩容时爆炸的东西。服务发现和 DNS 不是锦上添花，是入场券。

**6. 只有一个管理员。** 从来没有。你的服务依赖云厂商、CDN、DNS 提供商、第三方 API——每个都有自己的变更窗口和故障。别人的事故就是你的事故。为依赖的故障设计降级，而不是为它们的正常运行设计。

**7. 传输成本为零。** 它不是。跨可用区、跨区域流量要收钱，序列化/反序列化要 CPU。那个"为了整洁"每请求多调三次服务的抽象，每月账单上都有它的名字。架构评审要看流量图，不只看调用图。

**8. 网络是同质的。** 它不是。你的客户端有 5G、有电梯里的 2G、有企业代理、有 IPv6 only。只在办公室 WiFi 下测试的 应用，在真实世界里超时、断连、乱序全占。按最差的网络设计，按最好的网络优化。

## 停止相信之后，设计变成什么样

不信这八条，你的设计会发生几个具体变化。第一，所有远程调用都有超时、重试（带退避和抖动）、熔断——不是"以后再加"，是第一天就有。第二，关键路径上的跨服务调用被数出来、被质疑：这个调用真的必要吗？能批量吗？能缓存吗？第三，你为依赖的故障写降级逻辑：推荐服务挂了，首页显示默认推荐而不是 500；支付回调丢了，对账任务兜底。第四，你给系统做混沌演练：随机杀节点、注入延迟、分区网络——在 预发环境 里先看到它坏的样子，而不是在生产环境里第一次见。

最重要的是心态变化：单机思维问"它工作吗？"，分布式思维问"它*部分*坏了的时候还工作吗？"。第二个问题难回答得多，但只有它值得回答。

```java
package ch080;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.core.IntervalFunction;
import io.github.resilience4j.decorators.Decorators;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadLocalRandom;

// 不相信谬论的调用长这样——超时、退避、抖动、熔断，一样都不缺。
class FallaciesOfDistributedComputing01 {

    static String getWithResilience(HttpClient http, URI url) throws Exception {
        var retry = Retry.of("downstream", RetryConfig.<HttpResponse<String>>custom()
            .maxAttempts(4) // 1 次尝试 + 3 次重试
            // 指数退避 + 抖动：避免所有客户端步调一致地重试
            .intervalFunction(attempt ->
                (long) (Math.pow(2, attempt) * 1000)
                    + ThreadLocalRandom.current().nextLong(0, 500))
            .retryOnException(e -> e instanceof IOException)
            .retryOnResult(r -> r.statusCode() >= 500)
            .build());

        var breaker = CircuitBreaker.of("downstream", CircuitBreakerConfig.custom()
            // 依赖持续失败就停手，别陪它一起死
            .failureRateThreshold(50)
            .minimumNumberOfCalls(10) // 样本太少时不触发
            .waitDurationInOpenState(Duration.ofSeconds(60))
            .build());

        // Decorators：后加的在外层——重试包着熔断，熔断包着单次超时。
        // 受检异常在 lambda 里转成非受检：策略只关心"失败"，不关心异常类型。
        var decorated = Decorators
            .ofSupplier(() -> {
                try {
                    var request = HttpRequest.newBuilder(url)
                        .timeout(Duration.ofSeconds(5)) // 延迟永远不为零，先设上限
                        .GET()
                        .build();
                    return http.send(request, HttpResponse.BodyHandlers.ofString());
                } catch (IOException | InterruptedException e) {
                    throw new IllegalStateException("下游调用失败", e);
                }
            })
            .withTimeLimiter(
                TimeLimiter.of(TimeLimiterConfig.custom()
                    .timeoutDuration(Duration.ofSeconds(5))
                    .build()),
                Executors.newSingleThreadScheduledExecutor())
            .withCircuitBreaker(breaker)
            .withRetry(retry)
            .decorate();

        try {
            return decorated.get().body();
        } catch (Throwable t) {
            // CheckedSupplier.get() 声明抛 Throwable，这里转成运行时异常。
            throw new RuntimeException("下游调用失败", t);
        }
    }
}
```

## 反模式

最普遍的误用，是把韧性当成"二期需求"。"先跑起来，超时重试熔断以后再加。"诱人之处在于它是诚实的偷懒：需求评审时没人会为"以后加"吵架，代码 评审 时也没人拦得住。代价在第一次网络抖动时一次性结清：没有超时的调用链，线程池被拖死；没有熔断的依赖，局部故障变成全站故障。你以为省了两周，其实是把两周的利息利滚利，换成了一次 P0。

第二个误用是反方向的过度补偿：被谬论吓到之后，给每个调用都套上全套韧性——重试 5 次、熔断、舱壁、降级，一个 GET 接口配 200 行 Resilience4j。结果是系统行为没人能预测：重试和熔断互相打架，超时设置互相嵌套，排查问题时先花半天搞清楚"到底是哪一层在重试"。韧性是有成本的复杂性，只配给配得上它的调用。

真正的纪律是第一天就有，但只给关键路径。数出你的跨服务调用，问每个调用"它挂了会怎样"，然后按答案配装备——而不是按恐惧。

**陷阱：** 这八条谬论最阴险的地方在于：开发环境里它们全都是真的。本地网络可靠、延迟为零、拓扑不变——所以你的代码在笔记本上跑得完美，在生产环境里死得难看。凡是只在开发环境验证过的分布式假设，一律视为谎言，直到混沌演练证明它是真的。
