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
