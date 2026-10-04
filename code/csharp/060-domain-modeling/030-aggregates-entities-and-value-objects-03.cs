// EF Core 配置：Money 作为 OrderLine 的内嵌值对象，没有独立表。
protected override void OnModelCreating(ModelBuilder builder)
{
    builder.Entity<Order>(b =>
    {
        b.HasKey(o => o.Id);
        b.HasMany(typeof(OrderLine), "_lines"); // 通过后备字段映射私有集合。
    });

    builder.Entity<OrderLine>(b =>
    {
        b.OwnsOne(l => l.UnitPrice, m =>
        {
            m.Property(p => p.Amount).HasColumnName("UnitPriceAmount");
            m.Property(p => p.Currency).HasColumnName("UnitPriceCurrency");
        });
        b.OwnsOne(l => l.Sku, s =>
            s.Property(p => p.Value).HasColumnName("Sku"));
    });
}
