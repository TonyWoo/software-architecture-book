var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()       // 自动记录入站请求
        .AddHttpClientInstrumentation()      // 自动记录出站 HTTP
        .AddEntityFrameworkCoreInstrumentation() // 自动记录数据库查询
        .AddOtlpExporter())                  // 发往收集器（Jaeger、Tempo 或厂商）
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()         // GC、线程池等运行时指标
        .AddOtlpExporter());

var app = builder.Build();
app.Run();
