// .NET 8：仲裁读——正确性来自读仲裁必然与写仲裁交叠。
public sealed class QuorumStore
{
    private readonly int _n; // 副本数
    private readonly int _w; // 写仲裁
    private readonly int _r; // 读仲裁

    public QuorumStore(int n, int w, int r)
    {
        if (w + r <= n)
            throw new ArgumentException(
                "R + W 必须大于 N，否则读可能错过最新写入。");
        (_n, _w, _r) = (n, w, r);
    }

    public async Task<string> ReadAsync(string key)
    {
        // 问 R 个副本；取版本号最新的值——
        // 因为 R + W > N，读集合与写集合必然交叠。
        var versions = await _cluster.QueryAsync(key, quorum: _r);
        return versions.MaxBy(v => v.Version)!.Value;
    }
}
