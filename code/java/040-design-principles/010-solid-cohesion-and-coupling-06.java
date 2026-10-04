// 反例：业务代码直接依赖 SQL 实现，换数据库要改业务层。
class OrderService {
    private final SqlOrderRepository repo = new SqlOrderRepository();
    void place(Order order) { repo.save(order); }
}

// 正例：高层和低层都依赖抽象。
interface OrderRepository { void save(Order order); }

class OrderService2 {
    private final OrderRepository repo;
    OrderService2(OrderRepository repo) { this.repo = repo; }
    void place(Order order) { repo.save(order); }
}

class SqlOrderRepository implements OrderRepository {
    public void save(Order order) { }
}

class MongoOrderRepository implements OrderRepository {
    public void save(Order order) { }
}
