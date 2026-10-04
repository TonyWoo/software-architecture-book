using Polly;
using Polly.CircuitBreaker;
using Polly.Timeout;

var pipeline = new ResiliencePipelineBuilder<HttpResponseMessage>()
    // 最外层：限定总等待时间。
    .AddTimeout(TimeSpan.FromSeconds(10))
    // 中间层：隔离这个依赖的并发数。
    .AddBulkhead(new BulkheadStrategyOptions
    {
        MaxParallelization = 20,  // 最多 20 个并发
        MaxQueuedActions = 40     // 再多就直接拒绝
    })
    // 最内层：依赖持续失败时直接短路，不再发请求。
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions<HttpResponseMessage>
    {
        FailureRatio = 0.5,                          // 30 秒窗口内失败率超 50%
        MinimumThroughput = 10,                      // 样本太少时不触发
        SamplingDuration = TimeSpan.FromSeconds(30),
        BreakDuration = TimeSpan.FromSeconds(60),    // 打开 60 秒后放探测请求
        ShouldHandle = new PredicateBuilder<HttpResponseMessage>()
            .HandleResult(r => (int)r.StatusCode >= 500)
            .Handle<TimeoutRejectedException>()
    })
    .Build();

var response = await pipeline.ExecuteAsync(
    async token => await httpClient.GetAsync("https://inventory/api/stock", token));
