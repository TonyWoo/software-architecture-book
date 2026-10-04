package ch030;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

// 适应度函数：架构规则写成可执行的测试，漂移了就地报警。
class FitnessFunctions01 {

    // 数据层类型：Web 层方法的签名里不许出现它们。
    // （真实项目里 dataTypes 来自对数据层包的 classpath 扫描。）
    static class DataLayer {
        static class DbRow {}
    }

    // Web 层：只跟应用层 DTO 打交道，签名干净。
    static class WebLayer {
        static class OrderDto {
            String id() {
                return "";
            }
        }

        public OrderDto getOrder(String id) {
            return new OrderDto();
        }
    }

    @Test
    void webLayerMustNotReferenceDataLayerDirectly() {
        // Web 层不许直接引用数据层：必须经过应用层。
        // 真实项目里 webClasses 来自 classpath 扫描；反射逻辑完全一样。
        var webClasses = List.of(WebLayer.class);
        var dataTypes = Set.of(DataLayer.class.getDeclaredClasses());

        var violations = new ArrayList<String>();
        for (Class<?> webClass : webClasses) {
            for (Method m : webClass.getDeclaredMethods()) {
                boolean leaks = dataTypes.contains(m.getReturnType())
                    || Arrays.stream(m.getParameterTypes()).anyMatch(dataTypes::contains);
                if (leaks)
                    violations.add(webClass.getSimpleName() + "." + m.getName());
            }
        }

        Assertions.assertTrue(violations.isEmpty(),
            "UI 层绕过了应用层，直连数据层：\n - " + String.join("\n - ", violations));
    }
}
