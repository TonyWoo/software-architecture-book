public sealed class StranglerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IStranglerRouter _router;

    public StranglerMiddleware(RequestDelegate next, IStranglerRouter router)
    {
        _next = next;
        _router = router;
    }

    public async Task InvokeAsync(HttpContext context, LegacyProxy legacy, NewOrdersService newOrders)
    {
        if (_router.UseNewImplementation(context))
        {
            // 走新世界。
            var result = await newOrders.HandleAsync(context);
            await result.WriteAsync(context);
            return;
        }

        // 否则继续走旧世界。
        await legacy.ForwardAsync(context);
    }
}

public interface IStranglerRouter
{
    bool UseNewImplementation(HttpContext context);
}

// 示例：先按端点迁移，再按比例，最后按租户。
public sealed class EndpointBasedRouter : IStranglerRouter
{
    public bool UseNewImplementation(HttpContext context) =>
        context.Request.Path.StartsWithSegments("/api/orders/v2");
}
