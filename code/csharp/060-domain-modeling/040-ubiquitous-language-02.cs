// 改名之后：领域的词语。每个名字都能在信贷手册里找到出处。
public sealed class Underwriter
{
    public Adjudication Adjudicate(MortgageApplication application)
    {
        if (application.CreditScore < 600)
            return Adjudication.Decline("Credit score below policy minimum.");

        if (application.DebtToIncomeRatio > 0.43m)
            return Adjudication.Conditional("DTI exceeds 43%; require additional collateral.");

        return Adjudication.Approve();
    }
}

// 核定结论：三种结果，一种都不能少。bool 装不下这个业务。
public sealed record Adjudication(DecisionKind Kind, string? Reason)
{
    public static Adjudication Approve() => new(DecisionKind.Approve, null);
    public static Adjudication Conditional(string reason) => new(DecisionKind.Conditional, reason);
    public static Adjudication Decline(string reason) => new(DecisionKind.Decline, reason);
}

public enum DecisionKind { Approve, Conditional, Decline }
