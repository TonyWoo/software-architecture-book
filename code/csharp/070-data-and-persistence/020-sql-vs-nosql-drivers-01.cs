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
