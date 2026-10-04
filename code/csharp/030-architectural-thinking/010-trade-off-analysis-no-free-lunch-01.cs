// 把权衡写进代码：Polly 策略精确声明了
// 你愿意承受多少延迟之痛，来换取可靠性。
var retryPolicy = Policy
    .Handle<HttpRequestException>()
    .OrResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
    .WaitAndRetryAsync(
        retryCount: 3,
        sleepDurationProvider: attempt => TimeSpan.FromMilliseconds(100 * Math.Pow(2, attempt)),
        onRetry: (outcome, delay, attempt, _) =>
            Console.WriteLine($"第 {attempt} 次重试，等待 {delay}：{outcome.Exception?.Message}"));

// 你买到了韧性，付出的是延迟：最多约 700 毫秒的额外等待。
// 如果你的 SLA 是 200 毫秒，这个策略本身就是违约。
