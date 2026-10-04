// NFR：下单 p99 < 800ms。支付网关 p99 约 1200ms。
// 决策（ADR-007）：同步接单并返回，
// 通过 outbox 异步扣款。请求路径永不阻塞在第三方上。

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IOrderOutbox, SqlOrderOutbox>();
builder.Services.AddHostedService<PaymentProcessor>();
var app = builder.Build();

app.MapPost("/orders", async (PlaceOrderRequest req, IOrderOutbox outbox) =>
{
    var order = Order.Create(req);          // 纯领域逻辑，无 I/O
    await outbox.EnqueueAsync(order);       // 一次快速的 DB 写入
    return Results.Accepted($"/orders/{order.Id}", new { order.Id });
    // 202 Accepted："收到了，正在处理。"
    // 扣款由 PaymentProcessor 在后台完成。
});

app.Run();

public sealed record PlaceOrderRequest(string CustomerId, string Sku, int Quantity);

public sealed class Order
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Status { get; private set; } = "Accepted";

    private Order() { }

    public static Order Create(PlaceOrderRequest req)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(req.CustomerId);
        if (req.Quantity <= 0) throw new ArgumentOutOfRangeException(nameof(req.Quantity));
        return new Order();
    }
}
