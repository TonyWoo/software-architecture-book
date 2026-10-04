// 核心子域：运费定价。公司在这里赢，也在这里输。
// 丰富模型，重投入，领域专家随叫随到。
public sealed class FreightQuote
{
    public Route Route { get; }
    public CargoManifest Manifest { get; }
    private readonly List<Surcharge> _surcharges = new();

    public FreightQuote(Route route, CargoManifest manifest)
    {
        Route = route;
        Manifest = manifest;
    }

    public void ApplyFuelSurcharge(FuelIndex index)
    {
        // 燃油指数过期了就不能用来定价：这是业务规则，不是校验参数。
        if (index.IsStale)
            throw new DomainException("Cannot price against a stale fuel index.");

        _surcharges.Add(Surcharge.Fuel(index.CurrentRate, Route.DistanceKm));
    }

    public Money Total()
    {
        var base_ = Route.BaseRate * Manifest.BillableWeightKg;
        return _surcharges.Aggregate(base_, (total, s) => total + s.Amount);
    }
}
