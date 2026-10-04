// 延迟预算：下单接口 p99 必须 < 800ms。
// 每晚在预发布环境、用录制流量加压后运行。
public sealed class LatencyBudgetTests
{
    private const int P99BudgetMs = 800;

    [Fact]
    public async Task PlaceOrder_P99_UnderBudget()
    {
        var latencies = await LoadDriver.PlaceOrdersAsync(
            concurrentUsers: 500,
            duration: TimeSpan.FromMinutes(5));

        var p99 = latencies.OrderBy(ms => ms)
                           .ElementAt((int)(latencies.Count * 0.99));

        Assert.True(p99 < P99BudgetMs,
            $"p99 延迟 {p99}ms 超出预算 {P99BudgetMs}ms。" +
            "架构漂移嫌疑：检查下单热路径是否新增了同步依赖。");
    }
}
