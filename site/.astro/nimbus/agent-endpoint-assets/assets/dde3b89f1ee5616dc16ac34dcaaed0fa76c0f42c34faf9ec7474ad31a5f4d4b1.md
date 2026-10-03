---
title: "Key Takeaways"
description: "本章核心结论一览：分区时选边，平时付延迟，永远假设部分故障。"
---

> Documentation Index
> Fetch the complete documentation index at: https://example.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Key Takeaways

- **分区发生时，CAP 逼你选边；没分区时，PACELC 逼你付账。** 一致性不是系统属性，是每个操作、每个用例的决策——先让业务方说出"不一致的代价"，再选 AP 还是 CP。
- **R + W > N 是强一致最便宜的门票。** 读写仲裁必须交叠，否则读到过期数据不是 bug，是数学允许的结果。调 R 和 W 就是在调延迟和安全的配比。
- **部分故障是常态，超时不等于"没发生"。** 按"至少一次"构建系统，用幂等键让"两次"无害；重试必须带指数退避、抖动和熔断，否则重试就是故障放大器。
- **共识很贵，所以只用在小而关键的地方。** 领导者选举、配置、锁——控制面用 Raft 这类协议保证确定，数据面保持快速宽松。多数派往返是买一致的代价，不是免费的。
- **八个谬论在开发环境里全是真的，在生产环境里全是假的。** 所有远程调用第一天就要有超时、重试、熔断；为依赖的故障写降级；在 staging 里先看到它坏的样子。

Source: https://example.com/book/distributed-systems/key-takeaways/index.mdx
