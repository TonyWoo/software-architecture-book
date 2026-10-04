---
title: "康威定律与团队拓扑"
description: "系统终将长成组织结构图的模样——所以像设计系统一样设计组织结构图。"
sidebar:
  order: 150
  label: "康威定律与团队拓扑"
  group:
    label: "第2章 · 第 2 章 架构思维"
---

1967 年，Melvin Conway 发现：组织设计出来的系统，会镜像组织自身的沟通结构。三个后端团队加一个前端团队的公司，会以令人沮丧的可靠性，造出三个后端服务加一个前端。这就是康威定律，它不是建议，是重力。

常见反应是把它当诅咒："组织结构图毁了我们的架构。"架构师的做法是反过来用。既然系统无论如何都会镜像组织，那就*把组织设计成你想要的架构的镜像*。这叫逆康威策略，是你手里最有力的工具之一。

## 组织结构图就是设计文档

看一个经典翻车：管理层想要"松耦合的微服务"，却把开发者编进一个大团队、共用一个 待办清单。沟通又密又频繁。他们造出来的服务会共用一个数据库、互相调同步接口、一起部署——因为沟通结构只能产出这个。然后所有人怪技术选型。

解法不是换个更好的消息中间件。解法是让团队边界对上服务边界：小团队端到端拥有一个服务，团队之间的沟通走显式的 API——正是他们的服务之间用的那些显式 API。团队的接口*就是*服务的接口。对了这一步，架构和组织互相加固，而不是互掐。

## 团队拓扑：四种模式

Matthew Skelton 和 Manuel Pais 的《Team Topologies》给了我们描述理想组织的词汇：

**流对齐团队（stream-aligned teams）**是默认形态。跨职能团队端到端拥有一条工作流——一个产品、一个功能域、一条用户旅程。"你建的，你运维。"你大部分团队都应该是这个。

**平台团队（platform teams）**存在的意义是让流对齐团队更快。他们建内部平台：CI/CD、可观测性、部署基础设施。他们的客户是其他团队，就该拿出对待客户的样子——文档、SLA、产品思维。只发号施令不服务的平台团队，是披着好心外衣的瓶颈。

**赋能团队（enabling teams）**是临时专家，教完就走。安全团队嵌入一个季度把水位拉上去，然后撤。他们不拥有生产代码，只提升能力。

**复杂子系统团队（complicated-subsystem teams）**啃真正硬的骨头——计费引擎、物理仿真——深厚的专业知识没法摊到每个团队。慎用。每一个复杂子系统团队，都是一笔你主动选择支付的协调税。

经验法则：如果你的架构图和团队结构图看起来像两个系统，其中一张在撒谎，撒谎的通常是架构图。

## 把边界建模出来

逆康威策略 可以表达成一条设计约束——顺应本章的主题，也可以写成一条适应度函数：

```java
package ch030;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// 组织结构图即架构断言：
// 每条服务边界都必须对上一条团队边界。
class ConwaysLawAndTeamTopology01 {

    record Team(String name, List<String> ownedServices) {}

    static final List<Team> TEAMS = List.of(
        new Team("checkout", List.of("Checkout.Api", "Checkout.Worker")),
        new Team("billing", List.of("Billing.Api")),
        new Team("platform", List.of("Shared.Observability", "Shared.Deploy")));

    // 没有团队拥有的服务是孤儿。
    // 被两个团队拥有的服务是未来的故障。
    static List<String> validateOwnership(List<String> allServices) {
        var ownership = new HashMap<String, List<String>>();
        for (Team t : TEAMS)
            for (String s : t.ownedServices())
                ownership.computeIfAbsent(s, k -> new ArrayList<>()).add(t.name());

        var problems = new ArrayList<String>();
        for (String service : allServices) {
            var owners = ownership.get(service);
            if (owners == null)
                problems.add("孤儿：" + service + " 没有归属团队。");
            else if (owners.size() > 1)
                problems.add("共管：" + service + " 被 " + String.join("、", owners)
                    + " 共同拥有——拆了它，或者定一个主人。");
        }
        return problems;
    }
}
```

代码故意写得很简单。重点不在代码，在习惯：把团队结构当作架构的一部分，像其他东西一样可评审、可版本化。

## 反模式

最常见的错误用法是**重组表演**：每读完一本讲团队拓扑的畅销书，就重组一次组织结构图。盒子画对了，架构好像就对了。汇报材料里全是箭头和新名字。

它为什么诱人？因为重组看起来像果断行动。技术债难啃、架构难改，但发一封"组织调整"邮件只需要一个下午。领导力到位了，问题还在。

真实代价：每次重组都清空一批隐性知识——"那个服务为什么这么怪"的人走了，或者被分到了不相关的团队。交付停摆两三个月，所有人都在适应新汇报线。而架构和团队的错位一点没变，因为错位的原因从来不是盒子画得不够好看，是沟通结构和架构结构不匹配——你对齐了一次图纸，没对齐现实。

逆康威策略 是手术，不是健身操。只在目标架构稳定、错位的痛苦被量化（延迟、故障、扯皮工时）时动手。其他时候，忍住。

**陷阱：** 把重组当架构。改组织结构图很诱人，因为它感觉像果断行动，但每次重组都会摧毁隐性知识、让交付停摆几个月。逆康威策略 要*审慎而少用*：在目标架构已经稳定、错位的痛苦已经量化（而不是凭感觉）时，才对齐团队和架构。每年跟风重组一次追最新 团队拓扑 畅销书，那不叫演进，叫折腾——只不过带了参考文献。
