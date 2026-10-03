---
id: 020-sql-vs-nosql-drivers
title: SQL vs NoSQL Drivers
synopsis: 按访问模式、一致性需求和运维现实选存储，不按 hype 选。
status: draft
role: body
unit: section
---

# 按访问模式做决定

选数据库的诚实方法无聊得可笑：把你会跑的查询按频率列出来，选那个能原生回答它们的存储。其他的都是营销。

关系型数据库擅长回答任意查询。如果你的工作负载是"人会问一些我们没预测到的问题"，SQL 至今无人能敌。文档数据库擅长回答已知的、按键访问的路径，临时查询会逼它全表扫描。键值存储只回答一个问题——这个 key 的值是什么——但它回答得比谁都快，别的什么都不回答。列式存储几秒钟扫几十亿行，但讨厌行级写入。

没有谁更好，只有形状不同。hype 周期想让你相信一种存储能干所有事，它不能，假装它能的下场就是：拿 MongoDB 当关系型数据库用，join 写在应用代码里；或者拿 Postgres 当文档库，满屏 JSONB 列。两种一开始都能跑，跑着跑着就跑不动了。

# 四种形状

把选型空间看成四种粗糙的形状。关系型（Postgres、SQL Server）给你强一致性、丰富的查询和值得信任的事务，代价是写扩展难。文档型（MongoDB、Cosmos DB）给层级数据灵活的 schema 和容易的分布，代价是临时查询和 join 弱。键值型（Redis、DynamoDB）给你毫秒级的按键查找，代价是建模必须前置，因为访问模式就是 schema。列式（ClickHouse、BigQuery）给你分析型吞吐，代价是把写入当成批事件对待。

EF Core 能映射其中好几种，这让建模决策在代码里变得显式。同一个领域概念，配成关系表和配成文档容器的样子是不一样的，配置应该诚实地讲出你选的是哪一个。

```csharp
// 同一个概念，两种存储形状。配置本身就是决策。
public class CustomerProfile
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public List<Address> Addresses { get; set; } = new();
    public Dictionary<string, string> Preferences { get; set; } = new();
}

public class RelationalDbContext : DbContext
{
    public DbSet<CustomerProfile> Profiles => Set<CustomerProfile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomerProfile>(b =>
        {
            b.HasKey(p => p.Id);
            b.HasIndex(p => p.Email).IsUnique();   // 临时查询：给它建索引。
            b.OwnsMany(p => p.Addresses, a =>
                a.Property(x => x.City).HasMaxLength(100));
            // Preferences？在关系型形状里它值得一张独立的表，
            // 而不是一个假装成列的序列化 blob。
        });
    }
}

// 文档形状（比如 Cosmos DB provider）：聚合整体存储。
public class DocumentDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomerProfile>(b =>
        {
            b.ToContainer("profiles");
            b.HasPartitionKey(p => p.Id);
            b.HasKey(p => p.Id);
            // Addresses 和 Preferences 跟着文档一起走。
            // 如果你需要独立查询它们，说明形状选错了。
        });
    }
}
```

读这两份配置，问它们服务于什么查询。关系型那份在说：我按邮箱查，我 join 地址。文档那份在说：我每次按 id 取整个 profile。如果你的代码接下来开始在文档库里按偏好键跨分区查 profile，那就是选错了。代码会告诉你，只要你肯听。

# 运维现实本身就是一个特性

最好的数据库往往是你的团队已经运得好的那一个。数据库不只是一个引擎，它是备份、恢复、监控、故障演练、升级路径，以及凌晨三点被叫醒的那个人。运得烂的 Postgres 不如运得好的 SQL Server。

引入新存储之前，先数一数运维账：谁来建，谁来调，谁来恢复，恢复流程怎么测。如果四个答案都是"到时候再说"，那你还没准备好玩多语言持久化。先从你能运好的存储开始，下一个靠本事去挣。

**Trap:** 为你希望拥有的工作负载选存储。团队为了"互联网规模"选 Cassandra，结果每分钟 200 个请求，然后淹死在运维复杂度里——而这些复杂度，一台 Postgres 连眼皮都不会抬一下。规模是你想要拥有的问题，不是你想提前建好的问题。按今天的访问模式选，给明天留一扇门。
