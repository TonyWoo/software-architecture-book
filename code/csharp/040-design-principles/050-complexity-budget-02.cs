// 预算花得值：复杂度集中在差异化点上。
// 这个定价引擎就是业务本身，它配得上这份讲究。
public sealed class DynamicPricingEngine
{
    public Money Quote(Order order, MarketConditions market)
    {
        var base_ = order.Lines.Sum(l => l.UnitPrice * l.Quantity);
        var demandFactor = market.DemandIndex switch
        {
            > 0.8m => 1.15m,
            > 0.5m => 1.05m,
            _ => 0.95m,
        };
        var loyaltyDiscount = order.Customer.Tier switch
        {
            Tier.Gold => 0.90m,
            Tier.Silver => 0.95m,
            _ => 1.0m,
        };
        return new Money(base_ * demandFactor * loyaltyDiscount);
    }
}

// 预算省下来：审计日志是没差异化的管道。
// 无聊、直白、一个方法，不上框架。
public sealed class AuditLog
{
    private readonly string _path;
    public AuditLog(string path) => _path = path;

    public void Append(string entry) =>
        File.AppendAllText(_path, $"{DateTime.UtcNow:o} {entry}{Environment.NewLine}");
}
