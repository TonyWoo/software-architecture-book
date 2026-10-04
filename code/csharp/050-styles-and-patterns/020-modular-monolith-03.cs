// Catalog 的装配入口 —— 除 Contracts 外唯一的公开接缝
public static class CatalogModule
{
    public static IServiceCollection AddCatalog(this IServiceCollection services)
    {
        services.AddDbContext<CatalogDbContext>(o => o.UseNpgsql(...));
        services.AddScoped<ICatalogFacade, CatalogFacade>();
        // CatalogFacade 是 internal 的：只能通过接口解析到它
        return services;
    }
}
