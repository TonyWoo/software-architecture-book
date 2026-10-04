// 聚合根：Order。所有对订单的修改都经过它。
public sealed class Order
{
    public Guid Id { get; }
    public CustomerId CustomerId { get; } // 只存 ID，不直接引用 Customer 聚合。

    private readonly List<OrderLine> _lines = new();
    public IReadOnlyList<OrderLine> Lines => _lines;

    public Order(Guid id, CustomerId customerId)
    {
        Id = id;
        CustomerId = customerId;
    }

    public void AddLine(Sku sku, int quantity, Money unitPrice)
    {
        // 不变量 1：数量必须为正。
        if (quantity <= 0)
            throw new DomainException("Quantity must be positive.");

        // 不变量 2：同一 SKU 只允许一行，改数量请走 ChangeQuantity。
        if (_lines.Any(l => l.Sku == sku))
            throw new DomainException($"SKU {sku.Value} already exists; change its quantity instead.");

        _lines.Add(new OrderLine(sku, quantity, unitPrice));
    }

    // 总额永远现场计算，不存、不缓存、不等人同步。
    public Money Total(string currency) =>
        _lines.Aggregate(Money.Zero(currency),
            (total, line) => total + line.LineTotal);
}

// OrderLine 是聚合内部实体：有身份（行号），但没有独立生命周期。
public sealed class OrderLine
{
    public int LineNumber { get; }
    public Sku Sku { get; }
    public int Quantity { get; private set; }
    public Money UnitPrice { get; }

    internal OrderLine(Sku sku, int quantity, Money unitPrice)
    {
        Sku = sku;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }

    public Money LineTotal => new(UnitPrice.Amount * Quantity, UnitPrice.Currency);
}
