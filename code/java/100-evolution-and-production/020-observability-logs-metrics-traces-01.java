package ch100;

import java.math.BigDecimal;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

// 别这么写：
//   log.info("Order " + orderId + " placed by user " + userId + " for " + total);
// 字符串拼接在日志关掉时也照算，还没法按字段查。

// 要这么写：结构化日志，占位符 + 参数。
class ObservabilityLogsMetricsTraces01 {

    @Service
    static class OrderService {
        private static final Logger log = LoggerFactory.getLogger(OrderService.class);

        void placeOrder(UUID orderId, String userId, BigDecimal total, int itemCount) {
            // 参数化：日志级别关掉时零开销；收集器按字段索引，能查"某用户的所有订单"。
            log.info("Order placed. orderId={} userId={} total={} itemCount={}",
                orderId, userId, total, itemCount);
        }
    }
}
