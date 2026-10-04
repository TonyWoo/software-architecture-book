package ch080;

import java.time.Duration;
import java.util.function.Supplier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

// 幂等键：重试在构造上就是安全的。
class FailureModesRetriesAndIdempotency01 {

    @Component
    static class IdempotentExecutor {
        private final StringRedisTemplate redis;

        IdempotentExecutor(StringRedisTemplate redis) {
            this.redis = redis;
        }

        // 调用方在请求头里带 Idempotency-Key。
        // 第一次执行完把结果存 24 小时；重试直接重放，不再执行。
        <T> T execute(String idempotencyKey, Supplier<T> action) {
            String cacheKey = "idem:" + idempotencyKey;

            String stored = redis.opsForValue().get(cacheKey);
            if (stored != null)
                return deserialize(stored); // 重放第一次的结果

            T result = action.get();
            redis.opsForValue().set(cacheKey, serialize(result), Duration.ofHours(24));
            return result;
        }

        private <T> String serialize(T value) {
            throw new UnsupportedOperationException("演示用：替换为 Jackson 序列化");
        }

        private <T> T deserialize(String json) {
            throw new UnsupportedOperationException("演示用：替换为 Jackson 反序列化");
        }
    }

    // 没带键的请求：放行，风险自负——
    // 幂等是调用方和服务方共同的契约，不是一方的独角戏。
}
