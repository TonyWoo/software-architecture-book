// 没有边界：领域逻辑和某个具体的数据库 API 结了婚。
public class OrderRepository
{
    public void Save(Order order)
    {
        using var conn = new SqlConnection("...");
        conn.Execute("INSERT INTO orders ...", order); // Dapper、SQL Server，写死了
    }
}

// 画出边界：领域只依赖自己定义的接口。
// 换掉 SQL Server 不需要动领域代码的一行。
public interface IOrderStore
{
    void Save(Order order);
    Order? Load(OrderId id);
}

public class PlaceOrderUseCase
{
    private readonly IOrderStore _store;

    public PlaceOrderUseCase(IOrderStore store) => _store = store;

    public void Execute(Order order)
    {
        if (order.Lines.Count == 0)
            throw new InvalidOperationException("Empty order.");
        _store.Save(order);
    }
}
