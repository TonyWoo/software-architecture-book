// 祖传 ERP 的形状：原样保留，一行都不许「顺手改」。
public sealed record ErpCustomerRecord(
    string CUST_NO,
    string FIRST_NM,
    string LAST_NM,
    int STAT_CD);

// 你的领域概念：干净，用统一语言。
public sealed class Customer
{
    public CustomerId Id { get; }
    public PersonName Name { get; }
    public CustomerStatus Status { get; }

    public Customer(CustomerId id, PersonName name, CustomerStatus status)
    {
        Id = id;
        Name = name;
        Status = status;
    }
}

public enum CustomerStatus { Active, Suspended, Closed }

// 翻译器：整个系统里唯一同时懂两种模型的地方。
public sealed class ErpCustomerTranslator
{
    public Customer ToDomain(ErpCustomerRecord legacy) =>
        new Customer(
            new CustomerId(legacy.CUST_NO.Trim()),
            new PersonName(legacy.FIRST_NM.Trim(), legacy.LAST_NM.Trim()),
            MapStatus(legacy.STAT_CD));

    // 状态码 1–9 的含义只允许出现在这里，不许漏进领域。
    private static CustomerStatus MapStatus(int code) => code switch
    {
        1 or 2 => CustomerStatus.Active,
        3 or 4 => CustomerStatus.Suspended,
        _ => CustomerStatus.Closed, // 未知码按最保守处理：关户。
    };
}

// 外观：领域代码只调这个，永远碰不到 ERP 的 API。
public interface ICustomerDirectory
{
    Task<Customer?> FindByIdAsync(CustomerId id, CancellationToken ct = default);
}
