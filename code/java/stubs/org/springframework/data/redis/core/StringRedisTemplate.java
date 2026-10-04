// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.data:spring-data-redis
package org.springframework.data.redis.core;

import java.time.Duration;

public class StringRedisTemplate {
    public ValueOperations<String, String> opsForValue() {
        return new ValueOperations<>();
    }

    public Boolean delete(String key) {
        throw new UnsupportedOperationException("编译桩");
    }

    public static class ValueOperations<K, V> {
        public V get(K key) {
            throw new UnsupportedOperationException("编译桩");
        }
        public void set(K key, V value) {
            throw new UnsupportedOperationException("编译桩");
        }

        public void set(K key, V value, Duration timeout) {
            throw new UnsupportedOperationException("编译桩");
        }

        public Boolean setIfAbsent(K key, V value, Duration timeout) {
            throw new UnsupportedOperationException("编译桩");
        }

        public Boolean delete(K key) {
            throw new UnsupportedOperationException("编译桩");
        }
    }
}
