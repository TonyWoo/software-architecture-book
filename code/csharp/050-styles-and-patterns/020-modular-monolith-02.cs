// Catalog 模块本体 —— 其他一切都是 internal
namespace Catalog;

internal sealed class CatalogFacade(
    CatalogDbContext db,
    IProductPolicy policy) : ICatalogFacade
{
    public async Task<ProductInfo?> GetProductAsync(Guid id, CancellationToken ct)
    {
        var product = await db.Products.FindAsync([id], ct);
        if (product is null || !policy.IsVisible(product))
            return null;

        return new ProductInfo(product.Id, product.Name, product.Price);
    }
}
