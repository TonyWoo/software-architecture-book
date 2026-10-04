// .NET 8：幂等键中间件草图——重试在构造上就是安全的。
public sealed class IdempotencyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;

    public IdempotencyMiddleware(RequestDelegate next, IDistributedCache cache)
        => (_next, _cache) = (next, cache);

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue("Idempotency-Key", out var key))
        {
            await _next(context); // 没带键：放行，风险自负
            return;
        }

        var cacheKey = $"idem:{key}";
        var stored = await _cache.GetStringAsync(cacheKey);
        if (stored is not null)
        {
            context.Response.StatusCode = 200;
            await context.Response.WriteAsync(stored); // 重放第一次的结果
            return;
        }

        // 截获响应体，让重试可以重放结果而不必重新执行。
        var buffer = new MemoryStream();
        var originalBody = context.Response.Body;
        context.Response.Body = buffer;
        try
        {
            await _next(context);
            buffer.Position = 0;
            var result = await new StreamReader(buffer).ReadToEndAsync();
            await _cache.SetStringAsync(cacheKey, result,
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24) });
            buffer.Position = 0;
            await buffer.CopyToAsync(originalBody);
        }
        finally { context.Response.Body = originalBody; }
    }
}
