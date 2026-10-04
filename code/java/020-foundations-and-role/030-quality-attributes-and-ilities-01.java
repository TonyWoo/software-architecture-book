package ch020;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

// 延迟预算：下单接口 p99 必须 < 800ms。
// 每晚在预发布环境、用录制流量加压后运行。
class QualityAttributesAndIlities01 {

    private static final int P99_BUDGET_MS = 800;

    @Test
    void placeOrderP99UnderBudget() throws Exception {
        List<Long> latencies = LoadDriver.placeOrders(500, Duration.ofMinutes(5));

        var sorted = new ArrayList<>(latencies);
        Collections.sort(sorted);
        long p99 = sorted.get((int) (sorted.size() * 0.99));

        Assertions.assertTrue(p99 < P99_BUDGET_MS,
            "p99 延迟 " + p99 + "ms 超出预算 " + P99_BUDGET_MS + "ms。" +
            "架构漂移嫌疑：检查下单热路径是否新增了同步依赖。");
    }

    // 压测驱动：真实实现对接压测平台，这里只保留签名示意调用形状。
    static class LoadDriver {
        static List<Long> placeOrders(int concurrentUsers, Duration duration) {
            throw new UnsupportedOperationException("测试桩：对接真实压测平台");
        }
    }
}
