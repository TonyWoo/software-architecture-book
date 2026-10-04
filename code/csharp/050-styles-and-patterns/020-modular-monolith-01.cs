// Catalog.Contracts —— 被其他模块引用，只装契约，零逻辑
namespace Catalog.Contracts;

public sealed record ProductInfo(Guid Id, string Name, Money Price);

public interface ICatalogFacade
{
    Task<ProductInfo?> GetProductAsync(Guid id, CancellationToken ct);
}
