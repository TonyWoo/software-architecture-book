// Program.cs：一个薄网关。只做路由和入口策略，业务逻辑一律不碰。
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddRateLimiter(options =>
{
    // 入口统一限流：每个客户端每分钟 100 次。
    // 这件事在网关做一遍，所有服务都不用再关心。
    options.AddFixedWindowLimiter("per-client", o =>
    {
        o.PermitLimit = 100;
        o.Window = TimeSpan.FromMinutes(1);
    });
});

var app = builder.Build();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapReverseProxy();
app.Run();
