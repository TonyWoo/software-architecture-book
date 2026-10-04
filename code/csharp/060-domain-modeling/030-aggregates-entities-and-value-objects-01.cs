// 值对象：没有身份，不可变，相等只看值。
public sealed record Money(decimal Amount, string Currency)
{
    public static Money Zero(string currency) => new(0m, currency);

    public static Money operator +(Money a, Money b)
    {
        // 不同币种不能直接相加：这是业务规则，不是类型体操。
        if (a.Currency != b.Currency)
            throw new DomainException($"Cannot add {a.Currency} to {b.Currency}.");

        return new Money(a.Amount + b.Amount, a.Currency);
    }
}

public sealed record Sku(string Value);
