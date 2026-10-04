// 改名之前：程序员的词语。Process 到底干了什么？没人说得清。
public class LoanManager
{
    // 返回 bool？那「有条件通过」去哪了？被这个签名吃掉了。
    public bool Process(LoanApplication app)
    {
        if (app.CreditScore < 600) return false;
        return true;
    }
}
