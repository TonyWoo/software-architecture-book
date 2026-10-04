// 组织结构图即架构断言：
// 每条服务边界都必须对上一条团队边界。
public record Team(string Name, string[] OwnedServices);

public static class OrganizationTopology
{
    public static readonly Team[] Teams =
    {
        new("checkout", new[] { "Checkout.Api", "Checkout.Worker" }),
        new("billing",  new[] { "Billing.Api" }),
        new("platform", new[] { "Shared.Observability", "Shared.Deploy" }),
    };

    // 没有团队拥有的服务是孤儿。
    // 被两个团队拥有的服务是未来的故障。
    public static IEnumerable<string> ValidateOwnership(string[] allServices)
    {
        var ownership = Teams
            .SelectMany(t => t.OwnedServices.Select(s => (Service: s, Team: t.Name)))
            .GroupBy(x => x.Service)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Team).ToList());

        foreach (var service in allServices)
        {
            if (!ownership.TryGetValue(service, out var owners))
                yield return $"孤儿：{service} 没有归属团队。";
            else if (owners.Count > 1)
                yield return $"共管：{service} 被 {string.Join("、", owners)} 共同拥有——拆了它，或者定一个主人。";
        }
    }
}
