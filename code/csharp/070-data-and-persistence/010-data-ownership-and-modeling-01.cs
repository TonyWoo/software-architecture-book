// Ordering 限界上下文：拥有 Order，把 Product 数据当作本地投影来借用。
public class Order
{
    public Guid Id { get; set; }
    public List<OrderLine> Lines { get; set; } = new();
    public Money Total { get; set; } = null!;
    public DateTimeOffset PlacedAt { get; set; }
}

public class OrderLine
{
    public Guid ProductId { get; set; }
    // 本地反规范化副本，所有权归 Catalog，Ordering 永远不写它。
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public Money UnitPrice { get; set; } = null!;
}

public class OrderingDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(b =>
        {
            b.HasKey(o => o.Id);
            b.OwnsMany(o => o.Lines, l =>
            {
                l.Property(x => x.ProductName).HasMaxLength(200);
                l.Property(x => x.UnitPrice).HasConversion(
                    m => m.Amount, a => new Money(a));
            });
            b.OwnsOne(o => o.Total, m =>
                m.Property(x => x.Amount).HasColumnName("TotalAmount"));
        });
    }
}
