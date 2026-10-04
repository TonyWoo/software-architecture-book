---
title: "经典案例：电商、Feed 流、支付"
description: "三个完整的架构设计实战：电商、信息流、支付——需求、决策、结构、数据选择，以及 10 倍规模时要推翻什么。"
sidebar:
  order: 780
  label: "经典案例：电商、Feed 流、支付"
  group:
    label: "Java 版 · 第10章 · 第 10 章 实践与沟通"
---

下面三个案例是架构师面试和真实项目里反复出现的题目。每个都按同一套路走：需求与驱动因素、关键决策与权衡、结构草图、数据与集成选择、10 倍规模时要重新审视什么。注意顺序——决定永远从驱动因素开始，而不是从技术开始。

## 案例一：电商系统

## 需求与驱动因素

一家区域零售商要做线上商城。功能清单很标准：商品目录、搜索、购物车、下单、支付、订单跟踪、退货。真正的驱动因素藏在数字里：

- **峰值是常态的 20 倍。** 平时每秒几十单，大促（双十一类）每秒上千单。架构必须为峰值设计，而不是为平均值。
- **钱不能错。** 库存超卖和重复扣款是红线，比慢 200 毫秒严重得多。
- **团队 15 人。** 没有平台组，没有 SRE 团队。运维复杂度是硬约束——选你半夜能修的东西。
- **变化快。** 促销规则每月变，营销团队要自己配，不能每次都发版。

## 关键决策与权衡

**决策 1：单体优先，模块化单体。** 15 人团队拆微服务，等于给每个人发一套分布式系统的坑。选 Spring Boot 模块化单体：按订单、商品、促销、用户划分模块，模块间只通过接口调用，数据库可以先共享、表按模块前缀隔离。部署是一个进程，开发是一套代码。

*权衡：* 牺牲了独立扩缩容和独立部署，换来调试简单、事务简单、部署简单。大促时整个单体横向扩——浪费一点机器，省下无数个分布式事务的坑。等某个模块真的成为瓶颈或需要独立团队时，再拆。

**决策 2：库存扣减用悲观锁 + 预扣库存。** 超卖是红线，所以库存走数据库行锁，不走"先查后减"的竞态写法。大促前把热销品库存预扣到独立的"库存预留"表，下单只减预留数，支付成功再真正扣减。

*权衡：* 行锁在高并发下会排队，吞吐有上限。用"预扣"把锁的粒度从整行库存变成预留池，排队变短。代价是多了一次对账逻辑——预留过期要回滚，这是用复杂度换正确性，值得。

**决策 3：促销规则做成规则引擎，不是 if-else。** 营销要自己配规则，"满 300 减 50"、"第二件半价"、"新用户首单 8 折"，还要叠加和互斥。规则存数据库，管理后台可视化配置，订单模块在结算时加载规则求值。

*权衡：* 规则引擎的学习和调试成本高于硬编码，但硬编码的促销逻辑是经典的技术债黑洞——三个月后没人敢动。规则求值要做沙箱和超时保护，防止一条配错的规则拖慢所有结算。

## 结构草图

```java
package ch110;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;

// 经典案例 · 电商：模块化单体——模块间只依赖接口，不直接引用实现。
class ClassicCasesCommerceFeedPayments01 {

    // 订单模块对外暴露的接口（商品、促销模块都只能调这个）
    interface OrderService {
        // 创建订单：只做校验 + 库存预留，不碰支付
        Order createOrder(CreateOrderRequest request);
        // 支付回调：确认扣减库存，发布 OrderPaid 事件
        void confirmPayment(String orderId, String paymentId);
    }

    // 库存预留：把行锁竞争从库存行转移到预留池
    interface InventoryReservation {
        // 预留成功返回 reservationId，失败抛 InsufficientStock
        UUID reserve(String sku, int quantity, Duration ttl);
        void commit(UUID reservationId);  // 支付成功：真正扣减
        void release(UUID reservationId); // 过期/取消：归还
    }

    // 促销规则：数据驱动，营销后台可配
    record PromotionRule(
        String id,
        String name,
        Predicate<Cart> condition,   // 什么时候生效
        Function<Cart, BigDecimal> discount, // 怎么算优惠
        int priority,                // 叠加顺序
        boolean exclusive) {}        // 是否互斥

    record CreateOrderRequest(String userId, List<String> lines) {}
    record Order(String id) {}
    record Cart(List<String> lines, BigDecimal total) {}
}
```

事件只在模块边界用：`OrderPaid` 发布出去，积分、通知、数仓各自订阅。模块内部调用走接口——同一个进程里用消息队列是脱裤子放屁，还丢了事务。

## 数据与集成

- **主库 PostgreSQL。** 订单、库存、用户要 ACID，一个库搞定。商品目录读多写少，单独做 Redis 缓存，缓存失效走"更新库后删缓存 + 短 TTL"双保险。
- **搜索用 OpenSearch。** 商品搜索的分词、纠错、排序，关系库做不好也不该做。商品变更通过 CDC（变更数据捕获）同步到索引，延迟秒级可接受。
- **支付走外部网关**（Stripe/支付宝类），自己只存支付单号和状态。**绝不自己存卡号**——PCI 合规是深不见底的坑，花钱买网关是最便宜的选择。
- **文件（商品图）扔对象存储**，CDN 加速。别把图片塞数据库，这是 2005 年的错误，2026 年别再犯。

## 10 倍规模时重新审视

- **拆订单模块。** 下单链路成为独立瓶颈时，把订单和库存从单体拆成独立服务——那时团队也该有 40 人了，拆得起。
- **读写分离 + 分库分表。** 订单表按时间/用户分区，读走从库。但记住：分片一旦做了就回不去，不到真瓶颈别动手。
- **库存预留池分片。** 按 SKU 哈希把预留池打散，单点排队变成多点并行。
- **促销规则求值下沉。** 规则量大了之后，结算时的规则求值从同步改异步预计算——用户加购时就把可用优惠算好存下来，结算只做校验。

**权衡：** 这个设计的灵魂是"用机器换人"。横向扩单体浪费机器，但 15 人团队最贵的是人的时间，不是云账单。等你有了 10 倍流量，你也有了 10 倍团队——那时再为拆分付学费。用今天的简单，换明天的选择权。

## 被否决的方案

**方案：一步到位拆微服务。** 订单、商品、促销、用户、支付各一个独立服务，各自独立数据库，服务间走 HTTP/gRPC + 消息。这个方案当时被认真讨论过——它"看起来"最符合教科书：大促时只扩订单服务，促销规则可以独立发布，团队按服务划分职责清晰。

被否决的原因有三条，每条都致命。第一，**人数**：15 人拆 5 个服务，等于每人背 1–2 个服务的分布式坑——部署、监控、链路追踪、跨服务调试，全是之前没人做过的事。第二，**事务**：下单链路要同时写订单、扣库存、调支付，拆开后变成分布式事务，得上 Saga 或 TCC——而"钱不能错"恰恰是红线，把最不能错的地方交给最复杂的机制，是倒果为因。第三，**运维**：没有 SRE 团队，半夜出问题时，修一个进程和修五个进程的网络分区，完全是两种人生。教科书没写的是：微服务把复杂度从代码里搬到了运维里，而这个团队运维只有兼职。

## ADR-301：电商系统采用模块化单体

```markdown
## ADR-301：电商系统采用模块化单体，暂不拆微服务

## 状态
已接受（2026-04-02）。

## 背景
区域零售商线上商城，峰值流量是常态 20 倍，库存超卖和
重复扣款是红线。团队 15 人，无平台组、无专职 SRE。
促销规则每月变，需营销人员自助配置。

## 决定
采用 Spring Boot 模块化单体：按订单、商品、促销、用户
划分模块，模块间只通过接口调用，数据库先共享、表按
模块前缀隔离，部署为单个进程。微服务方案（订单/商品/
促销/用户/支付独立服务）被否决：团队规模撑不起分布式
运维成本，且下单链路的分布式事务与"钱不能错"红线冲突。

## 后果
+ 调试、事务、部署都简单；大促横向扩整个单体即可。
+ 15 人团队的认知负担可控，半夜能修。
- 牺牲独立扩缩容与独立部署，大促时多花机器钱。
- 某模块成为瓶颈或需独立团队时再拆；触发条件：
  流量 10 倍或团队 40 人（见 ADR-301 替代记录）。
```

## 案例二：社交信息流系统

## 需求与驱动因素

一个兴趣社区 应用：用户发帖、关注、刷信息流、点赞评论。驱动因素和电商完全不同：

- **读是写的 1000 倍。** 发帖是小事，几千万人同时刷才是大事。架构围绕读优化。
- **延迟是体验。** 信息流 300 毫秒内必须出来，慢了用户就划走了。正确性可以妥协（少一条帖子没人会死），延迟不行。
- **关系是数据。** "我关注的人发了什么"是核心查询，关注关系是系统里最热的数据。
- **热点极端不均匀。** 大 V 发一条，几百万粉丝的信息流都要更新；普通用户发一条，只有几十个人关心。

## 关键决策与权衡

**决策 1：推拉结合（fan-out on write + pull on read）。** 纯推（写扩散）：大 V 发帖要写几百万个收件箱，一次发帖拖垮写入。纯拉：刷信息流时要实时聚合所有关注人的帖子，读延迟爆炸。结合：普通用户发帖用推——直接写进粉丝的时间线缓存；大 V 发帖用拉——只存帖子，粉丝刷的时候实时拉取大 V 的帖子再合并。

*权衡：* 用复杂度换两端的最优。大 V 的判定阈值（比如粉丝 > 1 万）是运营参数，可调。合并逻辑要处理去重和排序，这是这个架构里最绕的一段代码，值得写最多的测试。

**决策 2：时间线存 Redis Sorted Set，不存关系库。** 信息流是"按时间排序的帖子 ID 列表"，这正是 Sorted Set 的天职：score 是时间戳，member 是帖子 ID，取最新 N 条是 O(log n)。关系库只存帖子正文和元数据，Redis 只存 ID 列表。

*权衡：* Redis 是内存，贵。但时间线只存 ID（每条几十字节），几千万人也吃得下。帖子正文走关系库 + CDN 缓存。冷数据（三个月前的帖子）从 Redis 淘汰，刷历史时回源到关系库——慢一点，没人天天翻三个月前的信息流。

**决策 3：点赞计数用近似 + 定期对账。** 点赞数不需要强一致——显示 1024 还是 1025 没人会在意。用 Redis 计数器累加，每分钟批量写回关系库。对账任务每小时跑一次，修正漂移。

*权衡：* 用精确性换写入吞吐。热门帖子的点赞写入是典型的热点行更新，直接打库会把行锁打爆。但**关注关系**和**帖子归属**必须强一致——"我取关了他还刷到他的帖子"是体验事故，"点赞数差 3"是四舍五入。分清楚什么能 approximate，什么是架构师的基本功。

## 结构草图

```java
package ch110;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

// 经典案例 · 信息流：推拉结合的核心逻辑
class ClassicCasesCommerceFeedPayments02 {

    interface TimelineService {
        // 刷信息流：合并"推来的"和"现拉的"
        List<Post> getTimeline(String userId, String cursor, int count);
        // 发帖：决定推还是存，供粉丝拉
        Post publishPost(String authorId, String content);
    }

    @Service
    static class DefaultTimelineService implements TimelineService {
        private static final int CELEBRITY_THRESHOLD = 10_000; // 粉丝数阈值：超过就是大V

        private final PostStore postStore;
        private final SocialGraph graph;
        private final TimelineCache timelineCache;
        private final CelebrityIndex celebrityIndex;

        DefaultTimelineService(PostStore postStore, SocialGraph graph,
                               TimelineCache timelineCache, CelebrityIndex celebrityIndex) {
            this.postStore = postStore;
            this.graph = graph;
            this.timelineCache = timelineCache;
            this.celebrityIndex = celebrityIndex;
        }

        public Post publishPost(String authorId, String content) {
            Post post = postStore.save(authorId, content);
            int followerCount = graph.getFollowerCount(authorId);

            if (followerCount > CELEBRITY_THRESHOLD) {
                // 大V：只记"某大V在某时间发了帖"，粉丝刷的时候现拉
                celebrityIndex.add(authorId, post.id(), post.createdAt());
            } else {
                // 普通用户：推模式，直接写进每个粉丝的时间线
                List<String> followers = graph.getFollowers(authorId);
                timelineCache.pushToMany(followers, post.id(), post.createdAt());
            }
            return post;
        }

        public List<Post> getTimeline(String userId, String cursor, int count) {
            // 1. 从 Redis 取推来的帖子 ID（Sorted Set 按时间倒序）
            List<String> pushed = timelineCache.getRange(userId, cursor, count);
            // 2. 现拉关注的大V的新帖
            List<String> celebrities = graph.getFollowedCelebrities(userId);
            List<String> pulled = celebrityIndex.getNewerThan(
                celebrities, timelineCache.getLastMergeTime(userId));
            // 3. 合并、去重、按时间排序，取前 N 个，再回源取正文
            var merged = new ArrayList<String>();
            merged.addAll(pushed);
            merged.addAll(pulled);
            return postStore.getMany(merged.stream().distinct().limit(count).toList());
        }
    }

    record Post(String id, String authorId, String content, Instant createdAt) {}

    interface PostStore {
        Post save(String authorId, String content);
        List<Post> getMany(List<String> ids);
    }

    interface SocialGraph {
        int getFollowerCount(String authorId);
        List<String> getFollowers(String authorId);
        List<String> getFollowedCelebrities(String userId);
    }

    interface TimelineCache {
        void pushToMany(List<String> userIds, String postId, Instant at);
        List<String> getRange(String userId, String cursor, int count);
        Instant getLastMergeTime(String userId);
    }

    interface CelebrityIndex {
        void add(String authorId, String postId, Instant at);
        List<String> getNewerThan(List<String> authorIds, Instant since);
    }
}
```

注意 `GetLastMergeTimeAsync` 这个细节：拉模式需要知道"上次合并到什么时候"，否则每次都全量拉大 V 的历史。这个水位线存在 Redis 里，随用户走。

## 数据与集成

- **关系图谱（谁关注谁）存图数据库或关系库的邻接表。** 关注关系是强一致数据，量相对小（边数远小于帖子数），PostgreSQL 的邻接表 + 索引够用到很大规模。
- **帖子正文存 PostgreSQL**（结构化、可搜索），**图片/视频走对象存储 + CDN**。视频转码是异步任务，扔给消息队列慢慢做——发帖接口不等转码完成就返回，"处理中"状态由客户端轮询。
- **Redis Cluster 存时间线和计数器**，按用户 ID 分片。热点 键（大 V 的计数器）用本地缓存 + 短 TTL 挡一层。
- **推荐流（"你可能感兴趣"）独立服务**，走离线计算 + 在线排序，和关注流分开。这是另一个系统，别和核心信息流耦合。

## 10 倍规模时重新审视

- **推模式的分片写入。** 普通用户的粉丝也可能到几十万，单次推写几十万个 Redis 键 会超时。改成分片批量 + 异步队列慢慢推，粉丝看到延迟几秒可接受。
- **多级缓存。** 时间线加一层本地进程缓存（Caffeine 类），挡住重复刷新的读。
- **读写地域化。** 用户跨大洲时，时间线缓存按地域部署，写走中心、读走边缘。冲突？信息流没有冲突，只有延迟——这是它比电商好做 10 倍的原因。
- **大 V 阈值动态化。** 固定阈值在 10 倍规模下会失灵，改成按"发帖频率 × 粉丝数"的综合分数动态判定推还是拉。

**权衡：** 这个设计的灵魂是"承认不一致"。信息流系统里，精确是奢侈品，延迟是必需品。架构师的工作不是消灭不一致，而是决定*哪里*可以不一致、*多久*可以不一致，并把这些决定写下来——因为产品经理迟早会问"为什么点赞数对不上"，你最好有 ADR 回答他。

## 被否决的方案

**方案：纯推模式（fan-out on write only）。** 发帖时把帖子 ID 直接写进所有粉丝的时间线缓存，刷信息流时只读自己的那份缓存，不做任何合并。这个方案当时很有吸引力——读路径简单到极致：一次 Redis 查询，没有合并逻辑，没有水位线，没有"推拉两套代码"的心智负担。读是写的 1000 倍，为读优化到极致，听起来完全正确。

被否决的原因是**写入放大杀死了它**。算一笔账：一个百万粉丝的大 V 发一条帖子，要写一百万个 Redis 键；大 V 一天发十条，就是一千万次写入——而这只是"写"，还没算粉丝取关、删帖时的清理。更糟的是突发：大 V 在热点事件时连发三条，写入队列直接被打爆，普通用户的发帖也被堵在后面。存储也一样：帖子 ID 要在每个粉丝的时间线里存一份，数据量随"粉丝数 × 发帖量"膨胀。纯推把读做到了极致，代价是写路径在第一个大 V 出现时就崩了。简单，但只在小规模时简单。

## ADR-302：信息流采用推拉结合

```markdown
## ADR-302：信息流采用推拉结合（fan-out on write + pull on read）

## 状态
已接受（2026-05-19）。

## 背景
兴趣社区 App，读是写的 1000 倍，信息流 300 毫秒内必须
返回。热点极端不均匀：大 V 一条帖子触达几百万粉丝，
普通用户一条帖子只有几十人关心。

## 决定
推拉结合：普通用户发帖用推模式，直接写进粉丝时间线
缓存（Redis Sorted Set）；粉丝数超阈值（1 万）的大 V
发帖只记索引，粉丝刷信息流时实时拉取合并。纯推方案
被否决：大 V 发帖的写入放大（百万级 key/条）会拖垮
写入路径；纯拉方案被否决：刷信息流时实时聚合的读
延迟无法满足 300 毫秒要求。

## 后果
+ 读延迟和写放大各取最优，大 V 不再是系统杀手。
+ 大 V 阈值是运营参数，可调。
- 合并、去重、水位线逻辑是全系统最绕的一段代码，
  测试投入最大。
- 点赞计数等非关键数据允许近似：Redis 计数器累加，
  每分钟批量写回，每小时对账修正漂移。
```

## 案例三：支付系统

## 需求与驱动因素

为电商平台做自营支付网关：接多种支付方式（卡、钱包、银行转账），处理支付、退款、对账。驱动因素一句话：**钱错一分都是事故**。

- **一致性压倒一切。** 延迟高 500 毫秒没人投诉，重复扣款一次就上新闻。在这里，CAP 里选 C。
- **可审计。** 每一分钱从哪来、到哪去，必须能重放、能对账。监管和财务会查，查的时候你拿不出来就是灾难。
- **外部依赖不可靠。** 银行网关超时、掉单、对账文件迟到——把"对方会犯错"当作设计输入。
- **不能丢、不能重。** 网络重试是常态，同一笔支付可能被提交五次，系统必须只执行一次。

## 关键决策与权衡

**决策 1：幂等键是第一公民。** 每个支付请求带客户端生成的幂等键（`Idempotency-Key`），服务端用唯一索引保证同一键只执行一次。重试、超时重发、用户连点两次——全部被幂等键消化。这是整个系统最重要的三行代码。

*权衡：* 客户端必须配合生成稳定的键（订单号 + 支付尝试号），这是跨团队的契约，要写进集成文档。键的存储要和业务数据同事务，否则"执行了但没记键"会造成重复扣款。

**决策 2：状态机 + 事件溯源记账。** 支付单是一个严格的状态机：`待支付 → 支付中 → 成功/失败 → 已退款/部分退款`，非法跃迁直接拒绝。资金变动不直接改余额，而是记账事件流（借/贷），余额是事件的折叠。每一笔钱都有完整的事件链，可重放、可审计。

*权衡：* 事件溯源的学习曲线陡，查询当前状态要折叠事件（用快照缓解）。但换来的是：对账变成"重放事件流对比"，差一分钱都能定位到具体事件。财务系统几百年都这么记账，不是没有原因的。

**决策 3：与外部网关的交互全部异步 + 对账兜底。** 调用银行网关走"发起 → 轮询/回调确认 → 对账文件核对"三层。网关超时不代表失败——可能是"对方执行了但没回你"。所以超时后不能直接标记失败，要进"未知"状态，由对账任务最终确认。

*权衡：* 用户看到的支付结果有延迟（"处理中"状态），体验打折。但替代方案——超时就判失败——会导致"用户被扣了钱，我们显示失败，用户再付一次"的双重扣款。在支付里，慢而准永远胜过快而错。

## 结构草图

```java
package ch110;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

// 经典案例 · 支付核心：幂等 + 状态机 + 事件记账
class ClassicCasesCommerceFeedPayments03 {

    enum PaymentStatus {
        PENDING,    // 待支付：订单已创建，未发起网关调用
        PROCESSING, // 支付中：已发网关，等确认（可停留很久）
        SUCCEEDED,  // 成功：终态
        FAILED,     // 失败：终态，可重新发起（新幂等键）
        UNKNOWN,    // 未知：网关超时，等对账裁决（关键状态！）
        REFUNDED,   // 已退款：终态
    }

    // 状态跃迁表：非法跃迁直接抛异常，代码即文档
    static final class PaymentTransitions {
        private static final Map<PaymentStatus, Set<PaymentStatus>> ALLOWED =
            new EnumMap<>(PaymentStatus.class);

        static {
            ALLOWED.put(PaymentStatus.PENDING,
                Set.of(PaymentStatus.PROCESSING, PaymentStatus.FAILED));
            ALLOWED.put(PaymentStatus.PROCESSING,
                Set.of(PaymentStatus.SUCCEEDED, PaymentStatus.FAILED, PaymentStatus.UNKNOWN));
            // 只有对账能裁决 UNKNOWN
            ALLOWED.put(PaymentStatus.UNKNOWN,
                Set.of(PaymentStatus.SUCCEEDED, PaymentStatus.FAILED));
            ALLOWED.put(PaymentStatus.SUCCEEDED, Set.of(PaymentStatus.REFUNDED));
            ALLOWED.put(PaymentStatus.FAILED, Set.of());   // 终态：重付走新单
            ALLOWED.put(PaymentStatus.REFUNDED, Set.of()); // 终态
        }

        static void ensureAllowed(PaymentStatus from, PaymentStatus to) {
            if (!ALLOWED.get(from).contains(to))
                throw new InvalidPaymentTransitionException(from, to);
        }
    }

    static class InvalidPaymentTransitionException extends RuntimeException {
        InvalidPaymentTransitionException(PaymentStatus from, PaymentStatus to) {
            super("非法的支付状态跃迁: " + from + " -> " + to);
        }
    }

    interface PaymentService {
        // 幂等键唯一索引保证：同键重复调用直接返回上次结果，不重新执行
        Payment pay(String idempotencyKey, PaymentRequest request);
    }

    // 记账事件：钱只通过事件流动，余额是折叠出来的
    record LedgerEvent(
        UUID eventId,
        String paymentId,
        String debitAccount,   // 借方科目
        String creditAccount,   // 贷方科目
        BigDecimal amount,
        Instant occurredAt) {}

    record PaymentRequest(BigDecimal amount, String currency) {}
    record Payment(String id, PaymentStatus status) {}
}
```

`Unknown` 状态是整段代码里最重要的设计。大多数支付 缺陷 都来自"超时了，算成功还是失败"的二选一——正确答案是"不知道，等对账告诉我"。给"不知道"一个正式的状态，系统就诚实了。

## 数据与集成

- **支付库独立，与业务库物理隔离。** 钱的数据不跟商品、订单挤一个库——权限、备份、审计要求都不同。PostgreSQL，同步复制，宁可慢。
- **幂等键表**和支付单同库同事务，用唯一约束做并发守卫。这是数据库在替你做分布式锁，别自己造轮子。
- **对账三路：** 我方账（事件流）、网关账（对账文件）与银行账（结算单）。三方对不上就报警，人工介入。对账任务是独立的后台服务，每天跑，失败重试、留痕。
- **通知下游用 outbox 模式。** 支付成功要通知订单、积分、风控——先把事件写进本库的 outbox 表（同事务），再由 中继进程 发布到消息队列。防止"钱扣了，通知丢了"。
- **密钥和证书走 KMS/HSM**，应用服务器上不落盘。这是合规红线，不是优化项。

## 10 倍规模时重新审视

- **按商户/币种分片。** 支付单表按商户 ID 分片，对账任务也按分片并行。但注意：分片后"全平台资金汇总"变成跨片查询，要走数仓，不要在线算。
- **网关调用连接池 + 熔断。** 10 倍流量下，银行网关先成为瓶颈。熔断器防止网关抖动拖垮你的线程池，降级策略是"排队等待"，不是"直接失败"。
- **事件流归档。** 账本事件只增不减，三年前的事件折叠一次存快照，在线只保留热数据。审计要查历史？从归档重放，慢但全。
- **多活部署。** 支付是公司的现金流，单机房是不可接受的。但多活下的幂等和状态机要重新验证——"同键双写"在跨机房复制延迟下是真实风险，用中心化的键仲裁服务守住。

**权衡：** 这个设计的灵魂是"悲观"。默认网络会失败、对方会犯错、重试会重复——然后让每一层都为此准备答案。电商为峰值设计，信息流为延迟设计，支付为*正确*设计。三个系统，三种灵魂——这就是为什么架构没有银弹，只有驱动因素。

## 被否决的方案

**方案：网关超时直接判失败，用户重试。** 调用银行网关走同步请求，超时（比如 5 秒）就直接标记支付失败，前端提示用户"支付失败，请重试"。这个方案当时被认真考虑过——它对体验最友好：用户立刻知道结果，没有悬而未决的"处理中"状态；实现也最简单：一次调用、一个超时、一个明确的失败，没有状态机，没有对账任务，没有 `Unknown` 这个别扭的状态。

被否决的原因是一句话：**超时不等于失败**。银行网关最常见的故障模式恰恰是"执行了但没回你"——钱已经扣了，响应丢在半路上。超时判失败，用户点"重试"，第二次请求又扣一次钱。一次大促里的网关抖动，就能量产双重扣款，而每一笔都是要上新闻、要赔付、要监管约谈的事故。体验上"快而明确"的代价，是正确性上不可接受的赌博。在支付里，慢而准永远胜过快而错——"处理中"三个字难看，但它诚实。

## ADR-303：支付采用状态机 + 事件溯源 + 对账兜底

```markdown
## ADR-303：支付采用状态机 + 事件记账 + 对账兜底

## 状态
已接受（2026-06-30）。

## 背景
自营支付网关，接多种支付方式。驱动因素：钱错一分都是
事故；每一分钱必须可审计、可重放；银行网关会超时、
掉单、对账文件会迟到；网络重试是常态，同一笔支付
可能被提交五次。

## 决定
支付单建模为严格状态机（含 Unknown 状态：网关超时后
的"不知道"，只能由对账任务裁决）；资金变动记为借贷
事件流（事件溯源），余额由事件折叠；每个请求带幂等键，
服务端用唯一索引保证只执行一次；与外部网关的交互全部
异步，超时进 Unknown，对账文件最终确认。"超时直接判
失败"方案被否决：网关"执行了但没回你"是常见故障，
判失败会导致用户重试造成双重扣款。

## 后果
+ 重复扣款被幂等键消灭；对账变成重放事件流，差一分
  钱可定位到具体事件。
+ 给"不知道"一个正式状态，系统诚实了，大多数支付
  缺陷 的根源被消除。
- 用户看到"处理中"状态，体验打折。
- 事件溯源学习曲线陡，查询靠快照缓解；下游通知必须
  走 outbox 模式，防止"钱扣了通知丢了"。
```

## 三个案例的共同课

回头看，三个案例用的是同一套动作：先写驱动因素，再做决定，每个决定写下代价，最后问"10 倍时会断在哪"。技术选型（PostgreSQL 还是 MongoDB、推还是拉）只是动作的输出，不是动作本身。

另一个共同点：每个设计都有一个"灵魂"——电商用机器换人，信息流承认不一致，支付保持悲观。好的架构都有灵魂，坏的架构只有技术清单。下次你评审一个设计，先问它的灵魂是什么。如果作者答不上来，设计还没完成。

## 反模式

读完三个案例，最常见的错误用法是**抄答案**。电商用模块化单体？好，我们也单体。信息流推拉结合？好，我们也推拉。支付事件溯源？好，我们也事件溯源。案例里的每个选型，都被当成"最佳实践"照搬。

它为什么诱人？因为抄答案最省脑子。驱动因素分析是脏活：要量化峰值，要承认 15 人撑不起微服务——每项都在逼你面对现实。而抄一个"大厂都在用"的方案，既显专业，又不用负责。

真实代价：你抄走了答案，抄不走约束。电商选单体是因为 15 人团队、峰值 20 倍、钱不能错——你的团队 60 人流量平稳，抄单体等于把团队锁进发布火车。信息流承认不一致是因为延迟就是体验——你的系统是财务对账，抄"近似计数"就是事故。每个选型都是约束的函数，约束变了，答案就该变。

三个案例真正的共同点：不是 PostgreSQL、Redis 或事件溯源，而是"先写驱动因素，再做决定，每个决定写下代价"。抄走动作，扔掉答案。

**权衡：** 这个设计的灵魂是"悲观"。默认网络会失败、对方会犯错、重试会重复——然后让每一层都为此准备答案。电商为峰值设计，信息流为延迟设计，支付为*正确*设计。三个系统，三种灵魂——这就是为什么架构没有银弹，只有驱动因素。
