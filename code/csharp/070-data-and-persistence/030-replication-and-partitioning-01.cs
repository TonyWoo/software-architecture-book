// 仓库现在知道了拓扑。这就是扩展的代价。
public sealed class OrderRepository
{
    private readonly IDbContextFactory<OrdersDbContext> _factory;
    private readonly IShardRouter _shards;

    public OrderRepository(
        IDbContextFactory<OrdersDbContext> factory,
        IShardRouter shards)
    {
        _factory = factory;
        _shards = shards;
    }

    // 单分片读：快、一致、按分片键路由。
    public async Task<Order?> GetByIdAsync(Guid orderId, Guid customerId)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Database.SetConnectionString(_shards.ConnectionFor(customerId));
        return await db.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == orderId);
    }

    // 跨分片查询：scatter-gather，合并是应用的事。
    public async Task<List<Order>> RecentAcrossShardsAsync(int take)
    {
        var tasks = _shards.AllConnections().Select(async conn =>
        {
            await using var db = await _factory.CreateDbContextAsync();
            db.Database.SetConnectionString(conn);
            return await db.Orders.AsNoTracking()
                .OrderByDescending(o => o.PlacedAt)
                .Take(take)
                .ToListAsync();
        });

        var pages = await Task.WhenAll(tasks);
        return pages.SelectMany(p => p)
            .OrderByDescending(o => o.PlacedAt)
            .Take(take)
            .ToList();
    }
}
