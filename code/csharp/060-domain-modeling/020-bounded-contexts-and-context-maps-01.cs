namespace Sales
{
    // 在销售上下文里，Order 是一次和客户的商业约定。
    public sealed record Order(
        Guid Id,
        CustomerId Customer,
        IReadOnlyList<OrderLine> Lines,
        Money Total,
        DateTimeOffset PlacedAt);
}

namespace Warehouse
{
    // 在仓库上下文里，"order" 是一张拣货单：SKU、数量、库位。
    // 同一个词，不同含义，不同模型。
    public sealed class PickList
    {
        public Guid SalesOrderId { get; }
        public IReadOnlyList<PickItem> Items { get; }

        private PickList(Guid salesOrderId, IReadOnlyList<PickItem> items)
        {
            SalesOrderId = salesOrderId;
            Items = items;
        }

        // 合作关系的接口：这个翻译两边团队共同拥有。
        public static PickList FromSalesOrder(Sales.Order order) =>
            new(order.Id,
                order.Lines
                    .Select(l => new PickItem(l.Sku, l.Quantity))
                    .ToList());
    }

    public sealed record PickItem(Sku Sku, int Quantity);
}
