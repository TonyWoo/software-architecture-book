// REST：最通用的问题——“这张券存在吗？”
// 任何人拿 curl 就能调，这就是它的全部优点，也是它的全部约束。
app.MapGet("/coupons/{code}", async (string code, CouponStore store) =>
{
    var coupon = await store.FindAsync(code);
    return coupon is null ? Results.NotFound() : Results.Ok(coupon);
});
