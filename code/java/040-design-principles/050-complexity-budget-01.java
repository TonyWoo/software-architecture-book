package ch040;

import java.util.List;

class ComplexityBudget01 {

    // 偶然复杂度：一个函数就能干的事，非要上个框架。
    // 三个接口、两个装饰器、一个工厂——就为了校验个邮箱。
    interface ValidationRule<T> {
        boolean isValid(T value);
    }

    interface ValidationPipeline<T> {
        boolean run(T value);
    }

    static class EmailRule implements ValidationRule<String> {
        public boolean isValid(String value) {
            return value.contains("@");
        }
    }

    static class ValidationPipelineImpl<T> implements ValidationPipeline<T> {
        private final List<ValidationRule<T>> rules;

        ValidationPipelineImpl(List<ValidationRule<T>> rules) {
            this.rules = rules;
        }

        public boolean run(T value) {
            return rules.stream().allMatch(r -> r.isValid(value));
        }
    }

    // 本质复杂度，诚实地表达：规则就是规则。
    static class EmailValidation {
        static boolean isValid(String email) {
            return email != null && !email.isBlank() && email.contains("@");
        }
    }
}
