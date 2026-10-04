---
id: 030-fitness-functions
title: "适应度函数"
synopsis: 把你的架构规则自动化，让它们熬过人员流动、工期压力和善意的走捷径。
status: draft
role: body
unit: section
---

每个架构都有规矩。展示层不许碰数据库。不许依赖已废弃的模块。消息必须向后兼容。

每个架构也都有工期。发布前夜十一点，某个开发者会为了上线绕过你的规矩。不是恶意，是务实。问题是绕过去就再也没绕回来，三年后没人记得它当初应该是临时的。

适应度函数（fitness function）就是守护架构意图的自动化测试。这个词来自演化式架构（Ford、Parsons、Kua）：像遗传学里的适应度函数一样，它持续评估系统是否还"适应"预期的形态。它把你的架构从一张图，变成一条可执行的断言。

# 好的适应度函数长什么样

好的适应度函数有三个特征。**客观**——通过就是通过，失败就是失败，没有"酌情"。**自动化**——每次提交都在 CI 里跑，而不是在季度评审里靠人看。**聚焦**——只守一条具体的架构特性，比如分层、耦合度或者性能预算。

能收租的例子：`Web` 项目里任何命名空间不许引用 `Data` 项目里的命名空间。单个服务暴露的同步 API 不许超过三个消费者。结账接口的 P99 延迟必须低于 400 毫秒。支付模块的测试覆盖率必须保持在 85% 以上。

它们的共同点：每一条都曾经是架构文档里的一句话，所有人都点头，没人执行。

# C# 里的架构测试

最常见的适应度函数是依赖规则。下面这条用反射写成 xUnit 测试，不需要任何第三方库：

```csharp
using System.Reflection;
using Xunit;

public class ArchitectureFitnessTests
{
    private static readonly Assembly WebAssembly =
        typeof(Web.Startup).Assembly;

    [Fact]
    public void WebLayer_MustNotReferenceDataLayer_Directly()
    {
        // Web 层不许直接引用数据层：必须经过应用层。
        var dataNamespace = typeof(Data.DbContext).Namespace;
        var webNamespace = typeof(Web.Startup).Namespace;

        var violations = WebAssembly.GetTypes()
            .Where(t => t.Namespace?.StartsWith(webNamespace!) == true)
            .SelectMany(t => t.GetMethods(
                BindingFlags.Public | BindingFlags.NonPublic |
                BindingFlags.Instance | BindingFlags.Static))
            .Where(m => m.ReturnType.Namespace?.StartsWith(dataNamespace!) == true
                     || m.GetParameters().Any(p =>
                         p.ParameterType.Namespace?.StartsWith(dataNamespace!) == true))
            .Select(m => $"{m.DeclaringType?.Name}.{m.Name}")
            .ToList();

        Assert.True(violations.Count == 0,
            "UI 层绕过了应用层，直连数据层：\n - " +
            string.Join("\n - ", violations));
    }
}
```

这条测试只做一件事：有人把数据访问类型直接连进 Web 层的那一刻，构建就失败。那个深夜十一点写捷径的开发者，第二天早上会看到失败信息，连同违规的方法名一起。架构自己执行自己。

真实项目里常用 NetArchTest.Rules，API 更干净，但原理一模一样：架构意图即代码。

# 适应度函数不是单元测试

别搞混。单元测试验证行为：给定这个输入，期望那个输出。适应度函数验证*结构*：系统演化的过程中，形态是否还符合架构师的意图。单元测试回答"它能工作吗"，适应度函数回答"它还是我们想建的那个系统吗"。

这个区分很重要，因为结构腐化对功能测试是隐形的。你的结账流程可以全绿，同时代码库正慢慢塌成一团大泥球。适应度函数就是发现这一点的免疫系统。

# 反模式

最常见的错误用法叫**警报装饰**：适应度函数写了一大堆，CI 面板红了一片，团队的统一动作是点"稍后修复"放行。红灯常亮，没人抬头看一眼。

它为什么诱人？因为写测试比守住测试容易得多。把规矩写成代码的那一刻，架构师感觉自己尽到了责任——"我守了"。守不住的守，是表演。

真实代价是双重的。第一层：架构继续腐化，只是现在你手里多了一张没人看的腐化清单。第二层更毒：团队学会了无视红灯——连带真正的回归测试一起。一次放行，败坏的是整套自动化的信誉。往后你再写任何自动化，团队的第一反应都是"反正会放行"。

适应度函数的数量上限，就是团队愿意被它拦住的数量。一条被执行到底的规矩，胜过五十条"建议"。先从一条开始，让它快、让它正当、让它失败就拦住合并——守住一条，团队才信第二条。

**Trap:** 适应度函数表演——一堆架构测试，所有人都不理，因为它们 flaky、跑得慢，或者守的是没人认同的规矩。适应度函数必须快到每次提交都能跑，正当到失败能拦住合并。如果团队习惯性点"稍后修复"放行失败，你就没有适应度函数，你只有建议。
