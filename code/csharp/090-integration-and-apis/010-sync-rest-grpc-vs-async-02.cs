// gRPC：类型化的契约——生成客户端，二进制传输
// 两端都归你管时，它比 REST 更快、更严格，错字段编译期就拦下。
public class CouponService : Coupon.CouponBase
{
    private readonly CouponStore _store;

    public CouponService(CouponStore store) => _store = store;

    public override async Task<CouponReply> Validate(
        CouponRequest request, ServerCallContext context)
    {
        var coupon = await _store.FindAsync(request.Code);
        return new CouponReply
        {
            Valid = coupon is not null,
            Discount = coupon?.Discount ?? 0
        };
    }
}
