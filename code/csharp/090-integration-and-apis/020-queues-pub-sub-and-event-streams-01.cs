// 命令消费者：一个活儿，一个工人。幂等是你的活儿，框架替不了。
public class ChargePaymentConsumer : IConsumer<ChargePayment>
{
    private readonly IPaymentGateway _gateway;
    private readonly IOrderStore _orders;

    public ChargePaymentConsumer(IPaymentGateway gateway, IOrderStore orders)
        => (_gateway, _orders) = (gateway, orders);

    public async Task Consume(ConsumeContext<ChargePayment> context)
    {
        var order = await _orders.GetAsync(context.Message.OrderId);

        // at-least-once 意味着这段代码可能跑两遍。
        // 这个守卫就是“效果上的恰好一次”，删掉它等于允许重复扣款。
        if (order.PaymentStatus == PaymentStatus.Charged)
            return;

        await _gateway.ChargeAsync(order.Id, order.Total);
        order.MarkCharged();
        await _orders.SaveAsync(order);
    }
}
