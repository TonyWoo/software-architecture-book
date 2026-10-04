// 消费者侧的宽容读取：未知字段忽略，缺失的可选字段给默认值。
// 新增字段永远打不 broken 老的读取方，这就是加法演进的底气。
app.MapGet("/v1/orders/{id}", async (Guid id, OrderStore store) =>
{
    var order = await store.GetAsync(id);
    return order is null
        ? Results.NotFound()
        : Results.Ok(new OrderDtoV1(order.Id, order.Total, order.Status));
});

app.MapGet("/v2/orders/{id}", async (Guid id, OrderStore store) =>
{
    var order = await store.GetAsync(id);
    return order is null
        ? Results.NotFound()
        : Results.Ok(new OrderDtoV2(
            order.Id, order.Total, order.Status, order.TrackingNumber));
});
