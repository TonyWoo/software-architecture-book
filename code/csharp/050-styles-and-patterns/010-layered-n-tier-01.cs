// 领域层：对 EF 和 HTTP 一无所知
public sealed record Order(Guid Id, string CustomerName, IReadOnlyList<OrderLine> Lines, Money Total);

// 数据层：把自己的持久化模型映射成领域类型
public sealed class OrderRepository(AppDbContext db) : IOrderRepository
{
    public async Task<Order> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var row = await db.OrderRows
            .Include(r => r.Lines)
            .SingleOrDefaultAsync(r => r.Id == id, ct)
            ?? throw new OrderNotFoundException(id);

        return row.ToDomain(); // 映射住在数据层，这是它的地盘
    }
}
