// 核心：端口。归应用层所有，在外部实现。
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(OrderId id, CancellationToken ct);
    Task SaveAsync(Order order, CancellationToken ct);
}

public interface IClock
{
    DateTimeOffset UtcNow { get; }
}
