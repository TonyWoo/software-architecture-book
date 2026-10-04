package ch060;

import java.math.BigDecimal;

// 改名之前：程序员的词语。process 到底干了什么？没人说得清。
class UbiquitousLanguage01 {

    static class LoanManager {
        // 返回 bool？那"有条件通过"去哪了？被这个签名吃掉了。
        boolean process(LoanApplication app) {
            if (app.creditScore() < 600)
                return false;
            return true;
        }
    }

    record LoanApplication(int creditScore) {}
}

// 改名之后：领域的词语。每个名字都能在信贷手册里找到出处。
class UbiquitousLanguage01After {

    static final class Underwriter {
        Adjudication adjudicate(MortgageApplication application) {
            if (application.creditScore() < 600)
                return Adjudication.decline("Credit score below policy minimum.");

            if (application.debtToIncomeRatio().compareTo(new BigDecimal("0.43")) > 0)
                return Adjudication.conditional(
                    "DTI exceeds 43%; require additional collateral.");

            return Adjudication.approve();
        }
    }

    // 核定结论：三种结果，一种都不能少。bool 装不下这个业务。
    record Adjudication(DecisionKind kind, String reason) {
        static Adjudication approve() {
            return new Adjudication(DecisionKind.APPROVE, null);
        }

        static Adjudication conditional(String reason) {
            return new Adjudication(DecisionKind.CONDITIONAL, reason);
        }

        static Adjudication decline(String reason) {
            return new Adjudication(DecisionKind.DECLINE, reason);
        }
    }

    enum DecisionKind { APPROVE, CONDITIONAL, DECLINE }

    record MortgageApplication(int creditScore, BigDecimal debtToIncomeRatio) {}
}
