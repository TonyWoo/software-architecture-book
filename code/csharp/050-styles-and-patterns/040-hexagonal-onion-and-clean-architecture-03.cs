// 外圈：适配器。住在基础设施项目里。
internal sealed class SqlOrderRepository(AppDbContext db) : IOrderRepository
{
    public async Task<Order?> GetByIdAsync(OrderId id, CancellationToken ct)
    {
        var row = await db.OrderRows.FindAsync([id.Value], ct);
        return row?.ToDomain();
    }

    public async Task SaveAsync(Order order, CancellationToken ct)
    {
        db.OrderRows.Upsert(order.ToRow());
        await db.SaveChangesAsync(ct);
    }
}
