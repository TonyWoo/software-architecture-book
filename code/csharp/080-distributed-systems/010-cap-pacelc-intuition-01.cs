// .NET 8：按操作选择一致性或可用性，而不是按系统一刀切。
public sealed class CartWriter
{
    // 购物车：AP 选择——本地先接受写入，事后复制。
    // 延迟低；合并冲突靠策略兜底（最后写入胜出 + 退款预算）。
    public Task AddToCartAsync(string userId, string itemId)
        => _localStore.WriteAsync(userId, itemId); // 复制完成前就确认

    // 账本：CP 选择——宁可拒绝写入，也不冒双花风险。
    // 牺牲可用性；错误是显式的，不是悄悄错的。
    public async Task<Result> PostToLedgerAsync(LedgerEntry entry)
    {
        if (!_quorum.IsReachable())
            return Result.Rejected("检测到分区：拒绝写入，不冒不一致的风险");
        return await _quorum.AppendAsync(entry);
    }
}
