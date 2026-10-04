builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ChargePaymentConsumer>();
    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host("broker");
        cfg.ReceiveEndpoint("charge-payment", e =>
        {
            // 失败先重试三次，实在不行再进死信队列人工看，别直接丢。
            e.UseMessageRetry(r => r.Interval(3, TimeSpan.FromSeconds(10)));
            e.ConfigureConsumer<ChargePaymentConsumer>(ctx);
        });
    });
});
