var builder = WebApplication.CreateBuilder(args);

// 只引用 Key Vault 的地址；应用用托管身份认证。
// 代码和配置文件里没有任何密钥、连接串、凭证。
builder.Configuration.AddAzureKeyVault(
    new Uri("https://myapp-kv.vault.azure.net/"),
    new DefaultAzureCredential());

var app = builder.Build();

// 值在运行时从 vault 解析，从不落盘到任何文件。
string apiKey = app.Configuration["Payments:ApiKey"];
