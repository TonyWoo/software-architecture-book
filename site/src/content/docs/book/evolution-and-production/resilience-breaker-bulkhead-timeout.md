---
title: "Resilience (Breaker, Bulkhead, Timeout)"
description: "用熔断器快速失败、用舱壁隔离故障、用超时限定等待——三种保命模式。"
sidebar:
  order: 620
  label: "Resilience (Breaker, Bulkhead, Timeout)"
  group:
    label: "第9章 · Evolution & Production"
---

你的依赖一定会挂。不是可能，是一定。网络会分区，数据库会锁死，第三方 API 会在最要命的时刻开始吐 500。弹性不是防止故障，而是提前决定好：故障到来时，你的系统该是什么表现。

三个模式覆盖了绝大多数真实世界的求生场景。超时限定你愿意等多久。熔断器让你别再去 hammer 一个已经倒下的依赖。舱壁把故障隔离开，让一个慢依赖淹不死整个进程。三者加起来，就是"某个功能降级"和"凌晨两点全站雪崩"的区别。

## 超时：给等待设上限

每次调用外部服务都必须有超时。没有超时，一个 hang 住的依赖会永远占着你的线程，而线程是有限的。一个没有超时的服务，就是一个攒着无限等待工作的服务——那只是慢动作的崩溃。

但光有超时是危险的。超时触发时，调用方放弃了，被调用方可能还在干活。这时候去重试，你可能在依赖最虚弱的时候把负载翻倍。所以：超时必须有，重试必须带退避和抖动，而且非幂等的请求不要重试——除非你喜欢重复扣款。

超时还有一条铁律：内层超时必须比外层短，层层递减。如果外层 5 秒超时、内层配了 10 秒，那内层的超时永远触发不了，配了等于没配。整条调用链的超时要像俄罗斯套娃一样从外到内收紧。

## 熔断与舱壁：快速失败，隔离损害

熔断器盯着一个依赖的失败率。超过阈值就打开：调用直接失败，不再碰网络。冷却一段时间后，放一个探测请求过去。探测成功，电路闭合，流量恢复。目的就是快速失败，给依赖留出喘息恢复的空间，而不是把一堆超时请求砸向一个已经跪了的服务。

舱壁限制一个依赖能吃掉你多少容量。推荐引擎 hang 住了，就烧它自己的线程池和连接预算，别动结账用的那份。名字来自造船：一个舱室进水，不该沉掉整条船。

Polly 是 .NET 的标准弹性库，能把三个模式编成一条管线：

```csharp
using Polly;
using Polly.CircuitBreaker;
using Polly.Timeout;

var pipeline = new ResiliencePipelineBuilder<HttpResponseMessage>()
    // 最外层：限定总等待时间。
    .AddTimeout(TimeSpan.FromSeconds(10))
    // 中间层：隔离这个依赖的并发数。
    .AddBulkhead(new BulkheadStrategyOptions
    {
        MaxParallelization = 20,  // 最多 20 个并发
        MaxQueuedActions = 40     // 再多就直接拒绝
    })
    // 最内层：依赖持续失败时直接短路，不再发请求。
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions<HttpResponseMessage>
    {
        FailureRatio = 0.5,                          // 30 秒窗口内失败率超 50%
        MinimumThroughput = 10,                      // 样本太少时不触发
        SamplingDuration = TimeSpan.FromSeconds(30),
        BreakDuration = TimeSpan.FromSeconds(60),    // 打开 60 秒后放探测请求
        ShouldHandle = new PredicateBuilder<HttpResponseMessage>()
            .HandleResult(r => (int)r.StatusCode >= 500)
            .Handle<TimeoutRejectedException>()
    })
    .Build();

var response = await pipeline.ExecuteAsync(
    async token => await httpClient.GetAsync("https://inventory/api/stock", token));
```

顺序很重要：超时在最外，舱壁在中间，熔断在最内。超时封顶总等待（含排队），舱壁封顶单个依赖的并发，熔断在依赖已知不可用时连网络都不碰、直接短路。

## 为什么这很重要

缺了弹性，具体后果就是级联故障：A 等 B，B 等 C，C 很慢，于是 A 的线程池被一堆注定超时的请求耗尽。一个慢依赖，变成所有间接依赖它的服务的全站故障。我见过一个推荐位小挂件拖垮整个结账。挂件不重要，缺的那个舱壁才重要。

还有一个细节：降级路径本身就是产品决策。熔断器打开后用户看到什么？是友好的"推荐暂时不可用"，还是直接 500？这个 fallback 的内容和体验，应该在需求评审时就定下来，而不是等故障时由工程师临场发挥。弹性不仅是技术模式，也是用户体验设计。

**Trade-off:** 弹性带来必须运维的复杂度。熔断器阈值要调：太敏感会频繁抖动，太迟钝等于摆设。舱壁大小要做容量规划。超时要全链路对齐，否则外层先超时，内层的调优就是演戏。而且每条降级路径都是很少跑到的代码——很少跑到的代码就是很少被测试的代码。要么在混沌演练里测你的降级路径，要么在生产环境里被它教育。
