---
title: "多语言持久化"
description: "每份工作配最合适的存储很强大，也很贵：让这种 sprawl 保持故意。"
sidebar:
  order: 470
  label: "多语言持久化"
  group:
    label: "C# 版 · 第6章 · 第 6 章 数据与持久化"
---

## 给每份工作配合适的工具

多语言持久化的想法很诱人：交易数据进 Postgres，全文搜索进 Elasticsearch，会话进 Redis，事件流进 Kafka，分析进列式存储。每个工具干它最擅长的事，系统整体看起来像一把瑞士军刀。

这想法没错。错的是以为它是免费的。每引入一种存储，你都在买一份长期的运维合同：备份恢复、监控告警、版本升级、容量规划、故障演练，外加至少一个人真的懂它。三种存储就是三份合同，五种就是五份。小团队养五种存储的下场通常是：五种都运得半吊子，半夜出问题的时候没人敢动。

所以第一条规则：先证明你需要它。"Elasticsearch 做全文搜索"在 Postgres 全文检索撑不住之前，只是个愿望。把每种新存储当成一次架构决策记录（ADR）：写下它解决什么问题、备选方案为什么不行、谁来运维。写不出来，就别引入。

## 运维税是按复利收的

存储的运维成本不是线性叠加的。两种存储不只是两份备份工作，它们还会互相作用：跨存储的一致性、跨存储的查询、跨存储的故障排查。一个 缺陷 横跨 Postgres 和 Redis 的时候，排查难度不是翻倍，是两个系统的心智模型在你脑子里打架。

还有人的问题。每种存储都有自己的查询语言、调优手段和故障模式，团队的知识被切成碎片。新人入职要学的不是"我们的数据层"，而是"我们的数据层们"。招聘也一样：找一个同时精通 Postgres、Elasticsearch 和 Cassandra 的人，要么贵，要么不存在。

代码里也要诚实。看看下面这个"每份工作配合适工具"的服务：三个存储，三个客户端，三种故障模式，三种重试策略。功能是对的，账单也是真的。

```csharp
// 三种存储，各司其职——以及三份运维合同。
public sealed class ProductCatalogService
{
    private readonly CatalogDbContext _db;      // Postgres：事实来源
    private readonly ISearchIndex _search;      // Elasticsearch：全文搜索
    private readonly IDistributedCache _cache; // Redis：热点读缓存

    public ProductCatalogService(
        CatalogDbContext db,
        ISearchIndex search,
        IDistributedCache cache)
    {
        _db = db;
        _search = search;
        _cache = cache;
    }

    public async Task<Product?> GetAsync(Guid id, CancellationToken ct)
    {
        // 热路径：先读缓存，Redis 挂了就降级到数据库。
        var cached = await _cache.GetStringAsync($"product:{id}", ct);
        if (cached is not null)
            return JsonSerializer.Deserialize<Product>(cached);

        var product = await _db.Products.FindAsync([id], ct);
        if (product is not null)
            await _cache.SetStringAsync($"product:{id}",
                JsonSerializer.Serialize(product),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                }, ct);
        return product;
    }

    public async Task UpdateAsync(Product product, CancellationToken ct)
    {
        _db.Products.Update(product);
        // 同一事务写发件箱，relay 负责同步搜索索引——
        // 跨存储的一致性，靠的是第 040 节的模式，不是运气。
        _db.OutboxMessages.Add(OutboxMessage.For(
            "ProductUpdated", new { product.Id }, DateTimeOffset.UtcNow));
        await _db.SaveChangesAsync(ct);

        // 缓存失效必须发生，但它不在事务里：接受短暂的不一致，
        // 或者让 relay 也管缓存。没有免费的选项。
        await _cache.RemoveAsync($"product:{product.Id}", ct);
    }
}
```

注意 `UpdateAsync` 里藏着的三个一致性窗口：搜索索引靠发件箱最终同步，缓存靠主动失效（可能失败），数据库是唯一的事实来源。每个窗口都是一个需要被说出来、被接受的决策，不是一句"最终一致"就能糊弄过去的。

## 让 蔓延 保持故意

多语言持久化本身不是敌人，无意识的 蔓延 才是。守住三条线，它就是利器。

第一，每种存储有主人。没有主人的存储就是没人敢升级、没人敢删的祖传系统。第二，默认说不。新存储的引入门槛应该高到让人先去试试现有工具：Postgres 的全文检索、JSONB、物化视图，能撑很久。第三，定期算账。每半年问一次：这五种存储里，有没有哪种的实际用量已经不值得它的运维成本？敢删，才是真懂。

## 反模式

最常见的死法叫"顺手引入"。搜索功能要全文检索，"Elasticsearch 吧，顺手就装了"。其实 Postgres 的全文检索能撑到日活翻十倍，但没人去试。三年后：Elasticsearch 的索引没人敢重建，分片策略是前员工的遗产，升级文档上写着"别碰"。

第二个：存储没有主人。Redis 是"大家一起用"的缓存，挂了之后每个人都觉得是别人的事。没有主人的存储，就是没人敢删、没人敢升级的祖传系统。

第三个：跨存储一致性靠运气。写 Postgres 成功、写 Elasticsearch 失败，搜索结果和数据库对不上。没人设计这个窗口，没人监控它，没人告诉用户。排查的时候，两个系统的心智模型在你脑子里打架。

诱人是因为引入的那一刻确实爽：每个工具都干它最擅长的事，演示 跑得飞快。账单是分期付的：备份、升级、容量规划、故障演练，一期都不能少。小团队养五种存储的下场，通常是五种都半吊子。

**权衡：** 合适的工具让每种工作负载都跑在它最舒服的形状上，系统更快、更清晰；代价是运维税按复利收，知识被切碎，一致性窗口到处开花。三种存储是甜点区，超过五种你最好有个平台团队。记住：你不是在选数据库，你是在雇佣它们，每一个都要发工资——工资的名字叫 值班。
