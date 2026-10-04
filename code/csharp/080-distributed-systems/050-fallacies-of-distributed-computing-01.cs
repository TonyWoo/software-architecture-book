// .NET 8：不相信谬论的调用长这样——超时、退避、抖动、熔断，一天都不缺。
public sealed class ResilientClient
{
    private readonly ResiliencePipeline _pipeline;

    public ResilientClient()
    {
        _pipeline = new ResiliencePipelineBuilder()
            .AddRetry(new RetryStrategyOptions<HttpResponseMessage>
            {
                MaxRetryAttempts = 3,
                // 指数退避 + 抖动：避免所有客户端步调一致地重试（谬论 1、2 的解药）
                DelayGenerator = args =>
                    ValueTask.FromResult<TimeSpan?>(
                        TimeSpan.FromSeconds(Math.Pow(2, args.AttemptNumber))
                        + TimeSpan.FromMilliseconds(Random.Shared.Next(0, 500))),
                ShouldHandle = new PredicateBuilder<HttpResponseMessage>()
                    .Handle<HttpRequestException>()
                    .HandleResult(r => (int)r.StatusCode >= 500),
            })
            .AddCircuitBreaker(new CircuitBreakerStrategyOptions<HttpResponseMessage>
            {
                // 依赖持续失败就停手，别陪它一起死（谬论 6 的解药）
                FailureRatio = 0.5,
                SamplingDuration = TimeSpan.FromSeconds(30),
                BreakDuration = TimeSpan.FromSeconds(60),
            })
            .AddTimeout(TimeSpan.FromSeconds(5)) // 延迟永远不为零，先设上限（谬论 2）
            .Build();
    }

    public Task<HttpResponseMessage> GetAsync(HttpClient client, string url, CancellationToken ct)
        => _pipeline.ExecuteAsync(token => client.GetAsync(url, token), ct);
}
