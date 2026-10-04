---
title: "编舞与编排"
description: "业务流程由消息自己流转，还是由一个指挥者调度——两种组织业务逻辑的方式，两种调试人生。"
sidebar:
  order: 620
  label: "编舞与编排"
  group:
    label: "第8章 · 第 8 章 集成与 API"
---

## 谁来指挥业务流程

一个订单从“已下单”走到“已发货”，中间要经过支付、库存、物流、通知。问题是：这个流程由谁负责？

有两种答案。协同（choreography）：没有指挥，每个服务听到事件、做自己的事、再发出下一个事件，流程像多米诺骨牌一样自己走完。编排（orchestration）：有一个指挥者服务，手里拿着流程图，一步一步调用或通知各个参与者，流程的每一步都经过它。

这是组织业务逻辑的两种根本方式，选错的代价不在写代码那天，而在出事故和加需求的那天。写代码时两种都好看，差别在系统活过一年之后。

## 协同：没有指挥的舞蹈

协同里，知识是分散的。订单服务只知道“下单后发 OrderPlaced”。支付服务听到 OrderPlaced 就扣款，完事发 PaymentCaptured。仓库听到 PaymentCaptured 就拣货，发 GoodsPicked。没有一个地方能看到全貌，全貌只存在于所有服务的约定里——以及所有参与者的脑子里。

好处是解耦到极致。加一个新步骤——比如风控检查——只需要让它订阅已有的事件，不用改任何现有服务，不用求任何团队排期。团队各自独立，部署互不干扰。这是事件驱动架构最迷人的样子，也是它在大会演讲里永远好看的原因。

坏处是：流程变成了传说。出了问题，你想回答“这个订单卡在哪一步了”，得去翻五个服务的日志，拼出一条时间线。没人说得清完整的流程长什么样，因为完整流程不存在于任何一处代码里，只存在于人们的脑子里——而人们会离职、会忘记、会理解岔。需求一变，比如“支付失败要自动重试三次再转人工”，你得改好几个服务，还得保证它们对“失败”“重试”“人工”的理解一致。分布式知识没有版本管理，改起来全靠人肉对齐。

协同还有个隐性前提：事件的语义必须极其稳定。因为流程逻辑散落在各处对事件的理解里，事件一旦改含义，所有订阅者都要重新理解一遍。这就是为什么上一节讲的契约纪律在协同架构里是生死线——没有中央流程可以兜底，契约就是唯一的真相。

协同适合流程简单、稳定、参与者少的场景。事件纯天然扇出、没人需要全局视角时，它最美。通知、审计、数据同步这类“发生了就好”的流程，是协同的舒适区。

## 编排：指挥棒在谁手里

编排里，有一个服务是流程的主人。它知道“先调支付，成功了再锁库存，库存不够就退款并通知用户”。参与者变成执行具体步骤的工人，流程知识集中在一处，看得见、改得动。

好处是流程说得清。想知道订单卡在哪，看指挥者的状态机就行，一条完整的时间线，值班的人会感谢你。改流程只改一个地方：加重试、加补偿、加分支，都是指挥者的事，不用跨团队对齐五个服务对“失败”的理解。产品经理要加一步，指挥者里加一行，测试也有地方下手。

坏处是集中，而且集中是会增生的。指挥者知道得太多，容易长成上帝服务——今天管订单履约，明天顺手管退款，后天把通知也接过来。它挂了，整个流程停摆，所以它成了你最不能挂的服务，值班优先级最高。它还成了跨团队的瓶颈：每个流程变更都要经过拥有它的团队，其他团队只能提需求不能动手。

更隐蔽的坑：指挥者往往用同步调用指挥参与者，图省事。一步一步调，看起来清晰，一不小心就把第一讲的时间耦合全买回来了，还买一送一——现在是一个中心化的单点在同步等待所有人。编排不背这个锅，背锅的是用同步实现编排的人。指挥者应该发命令、等事件、维护状态，而不是抱着一堆 HTTP 连接不放。

编排适合流程复杂、多变、长周期的场景。步骤之间有条件分支、有补偿逻辑（saga）、有“等三天没反应就升级”这种时间维度时，你需要一个记得住流程的东西。人脑记不住，散落的事件也记不住，状态机记得住。

## 调试是真正的分水岭，以及代码长什么样

两种方案在白板上都好看，真正的分水岭在凌晨三点。协同的问题没有单点可查，你得有分布式追踪——correlation ID 从第一个事件一路带到最后一个——否则就是五个日志文件和一杯咖啡。编排的问题集中爆发，指挥者的状态就是答案，但你得先保证指挥者本身可观测：状态机、事件日志、每一步的耗时，一个都不能少。

所以选型的诚实问题是：这个流程未来一年会变几次？很少变、参与者各自独立——协同。经常变、有分支补偿、老板总想加一步——编排。还有中间路线：用协同做事件扇出（通知、分析），用编排管核心流程（下单、履约）。务实的人都这么干， 纯粹性 是演讲的需要，不是生产的需要。

一个极简的编排者草图：流程状态机集中在一处，参与者只暴露能力，不解释流程。

```java
package ch090;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

// 编排者：订单履约流程的主人。
// 顺序、分支、补偿都在这里，不散落在各处。改流程只改这一个文件。
class ChoreographyVsOrchestration01 {

    @Service
    static class FulfillmentOrchestrator {
        private final PaymentService payments;
        private final WarehouseService warehouse;
        private final Notifier notifier;
        private final OrderStore orders;

        FulfillmentOrchestrator(PaymentService payments, WarehouseService warehouse,
                                Notifier notifier, OrderStore orders) {
            this.payments = payments;
            this.warehouse = warehouse;
            this.notifier = notifier;
            this.orders = orders;
        }

        void run(UUID orderId) {
            Order order = orders.get(orderId);

            // 第一步：扣款。失败则直接通知用户，流程结束。
            if (!payments.charge(order.id(), order.total())) {
                notifier.tellUser(order.userId(), "支付失败，请重试");
                return;
            }

            // 第二步：锁库存。库存不够要补偿——把刚扣的钱退回去。
            // 这就是 saga 的雏形：没有分布式事务，用补偿动作保证最终一致。
            if (!warehouse.reserve(order.id(), order.lines())) {
                payments.refund(order.id(), order.total());
                notifier.tellUser(order.userId(), "库存不足，已退款");
                return;
            }

            order.markReadyToShip();
            orders.save(order);
        }
    }

    interface PaymentService {
        boolean charge(UUID orderId, BigDecimal total);
        void refund(UUID orderId, BigDecimal total);
    }

    interface WarehouseService {
        boolean reserve(UUID orderId, List<String> lines);
    }

    interface Notifier {
        void tellUser(String userId, String message);
    }

    interface OrderStore {
        Order get(UUID orderId);
        void save(Order order);
    }

    static class Order {
        private final UUID id = UUID.randomUUID();
        private final String userId = "";

        UUID id() {
            return id;
        }

        String userId() {
            return userId;
        }

        BigDecimal total() {
            return BigDecimal.ZERO;
        }

        List<String> lines() {
            return List.of();
        }

        void markReadyToShip() {
        }
    }
}
```

注意这个编排者没有发事件让流程“自己走”，每一步的顺序、分支、补偿都写在这里。想回答“订单卡在哪”，看它的执行记录就行。

## 反模式

反模式：用事件做请求-响应。

嘴上"事件驱动"，实际是这么玩的：服务 A 发"请求查库存"事件，然后原地等 B 发回"库存已查"，收到才继续。correlation ID 传来传去，超时、重试一个不少。诱人：既要"事件驱动"的好名声，又舍不得同步的确定性——发了事件，还要等答案。

代价是你买了两边的贵，丢了两边的好。时间耦合一点没少：B 挂了 A 照样卡死，和直接调 HTTP 没区别，只是耦合藏在事件里，更难看见。调试地狱翻倍：流程不在一处（编排的优点丢了），也没有真解耦（协同的优点丢了）。出问题要翻两个服务的日志、一个 消息代理 的投递记录，拼出一条伪装成事件的同步调用链。凌晨三点没人夸你架构先进。

更隐蔽的是语义污染：事件名变成动词——"请求验款""命令锁库存"。事件应该是"已经发生的事"，不是"请你做的事"。"事件"全是请求时，你建的不是事件驱动系统，是拿 消息代理 当 HTTP 用的分布式单体：延迟更高，还没有堆栈跟踪。

治法：发事件前问自己——"我发完能不能转身就走"。能，继续。不能，说明你要的是答案；要答案就画出流程，要么用真正的编排器管起来，要么承认在做同步调用并配好熔断。最怕既不敢承认要答案，又不肯给流程找主人。

**权衡：** 协同用可调试性换解耦——加步骤零成本，查问题全成本，流程的真相散落在五个代码库和几个离职员工的脑子里。编排用集中换清晰——流程一目了然、改动有地方下手，但指挥者成了单点知识、单点故障、跨团队瓶颈。诚实地估计流程的变化频率：稳定简单的流程值得协同的优雅，多变复杂的流程配得上编排的指挥棒。最危险的是嘴上说协同、实际靠人肉拼日志——那不是架构，那是传说，而传说在凌晨三点是最贵的。
