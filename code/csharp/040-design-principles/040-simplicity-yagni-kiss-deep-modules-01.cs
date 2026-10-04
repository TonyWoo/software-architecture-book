// 容易：顺手、复制粘贴、正在悄悄分叉。
public decimal PriceForMembers(decimal amount) => amount * 0.9m;
public decimal PriceForVip(decimal amount) => amount * 0.85m;
public decimal PriceForStaff(decimal amount) => amount * 0.8m;

// 简单：一个概念，一个改动点。
public decimal ApplyDiscount(decimal amount, decimal rate) => amount * rate;

public static class DiscountRates
{
    public const decimal Member = 0.9m;
    public const decimal Vip = 0.85m;
    public const decimal Staff = 0.8m;
}
