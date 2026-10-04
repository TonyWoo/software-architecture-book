// 反例：业务代码直接依赖 SQL 实现，换数据库要改业务层。
public class OrderService
{
    private readonly SqlOrderRepository _repo = new();
    public void Place(Order order) => _repo.Save(order);
}

// 正例：高层和低层都依赖抽象。
public interface IOrderRepository { void Save(Order order); }

public class OrderService2
{
    private readonly IOrderRepository _repo;
    public OrderService2(IOrderRepository repo) => _repo = repo;
    public void Place(Order order) => _repo.Save(order);
}

public class SqlOrderRepository : IOrderRepository
{
    public void Save(Order order) { }
}

public class MongoOrderRepository : IOrderRepository
{
    public void Save(Order order) { }
}
