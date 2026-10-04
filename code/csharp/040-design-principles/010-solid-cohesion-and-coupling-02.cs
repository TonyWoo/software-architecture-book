public interface IDiscountPolicy
{
    decimal Apply(decimal amount);
}

public class NoDiscount : IDiscountPolicy
{
    public decimal Apply(decimal amount) => amount;
}

public class LoyaltyDiscount : IDiscountPolicy
{
    public decimal Apply(decimal amount) => amount * 0.9m;
}

// 对修改关闭：新增折扣政策不需要动这里的一行代码。
public class Checkout
{
    private readonly IDiscountPolicy _policy;

    public Checkout(IDiscountPolicy policy) => _policy = policy;

    public decimal Total(decimal amount) => _policy.Apply(amount);
}
