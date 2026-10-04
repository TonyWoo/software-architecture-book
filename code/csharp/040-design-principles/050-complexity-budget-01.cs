// 偶然复杂度：一个函数就能干的事，非要上个框架。
// 三个接口、两个装饰器、一个工厂——就为了校验个邮箱。
public interface IValidationRule<T> { bool IsValid(T value); }
public interface IValidationPipeline<T> { bool Run(T value); }

public sealed class EmailRule : IValidationRule<string>
{
    public bool IsValid(string value) => value.Contains('@');
}

public sealed class ValidationPipeline<T> : IValidationPipeline<T>
{
    private readonly IEnumerable<IValidationRule<T>> _rules;
    public ValidationPipeline(IEnumerable<IValidationRule<T>> rules) => _rules = rules;
    public bool Run(T value) => _rules.All(r => r.IsValid(value));
}

// 本质复杂度，诚实地表达：规则就是规则。
public static class EmailValidation
{
    public static bool IsValid(string email) =>
        !string.IsNullOrWhiteSpace(email) && email.Contains('@');
}
