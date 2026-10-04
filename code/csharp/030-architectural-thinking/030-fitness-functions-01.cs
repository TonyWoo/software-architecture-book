using System.Reflection;
using Xunit;

public class ArchitectureFitnessTests
{
    private static readonly Assembly WebAssembly =
        typeof(Web.Startup).Assembly;

    [Fact]
    public void WebLayer_MustNotReferenceDataLayer_Directly()
    {
        // Web 层不许直接引用数据层：必须经过应用层。
        var dataNamespace = typeof(Data.DbContext).Namespace;
        var webNamespace = typeof(Web.Startup).Namespace;

        var violations = WebAssembly.GetTypes()
            .Where(t => t.Namespace?.StartsWith(webNamespace!) == true)
            .SelectMany(t => t.GetMethods(
                BindingFlags.Public | BindingFlags.NonPublic |
                BindingFlags.Instance | BindingFlags.Static))
            .Where(m => m.ReturnType.Namespace?.StartsWith(dataNamespace!) == true
                     || m.GetParameters().Any(p =>
                         p.ParameterType.Namespace?.StartsWith(dataNamespace!) == true))
            .Select(m => $"{m.DeclaringType?.Name}.{m.Name}")
            .ToList();

        Assert.True(violations.Count == 0,
            "UI 层绕过了应用层，直连数据层：\n - " +
            string.Join("\n - ", violations));
    }
}
