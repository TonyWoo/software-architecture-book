// 读侧：投影，又笨又快
public sealed class OrderHistoryProjection(AppDbContext db)
{
    public Task<List<OrderSummaryDto>> GetForCustomerAsync(Guid customerId, CancellationToken ct)
        => db.OrderSummaries
            .Where(s => s.CustomerId == customerId)
            .OrderByDescending(s => s.PlacedAt)
            .Select(s => new OrderSummaryDto(s.OrderId, s.Total, s.Status, s.PlacedAt))
            .ToListAsync(ct);
    // 没有领域逻辑，没有不变量，只有一个长得像页面的查询。
}
