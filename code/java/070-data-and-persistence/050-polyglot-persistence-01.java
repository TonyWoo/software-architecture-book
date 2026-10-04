package ch070;

import java.time.Duration;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 三种存储，各司其职——以及三份运维合同。
class PolyglotPersistence01 {

    @Service
    static class ProductCatalogService {
        private final ProductRepository db;   // PostgreSQL：事实来源
        private final SearchIndex search;     // 全文搜索索引
        private final StringRedisTemplate cache; // Redis：热点读缓存

        ProductCatalogService(ProductRepository db, SearchIndex search,
                              StringRedisTemplate cache) {
            this.db = db;
            this.search = search;
            this.cache = cache;
        }

        Product get(UUID id) {
            // 热路径：先读缓存，Redis 挂了就降级到数据库。
            String key = "product:" + id;
            String cached = cache.opsForValue().get(key);
            if (cached != null)
                return Product.fromJson(cached);

            Product product = db.findById(id).orElse(null);
            if (product != null)
                cache.opsForValue().set(key, product.toJson(), Duration.ofMinutes(10));
            return product;
        }

        @Transactional
        void update(Product product) {
            db.save(product);
            // 同一事务写发件箱，relay 负责同步搜索索引——
            // 跨存储的一致性，靠的是第 040 节的模式，不是运气。
            //（发件箱写入省略，见 040-transactions-sagas-and-outbox-01）

            // 缓存失效必须发生，但它不在事务里：接受短暂的不一致，
            // 或者让 relay 也管缓存。没有免费的选项。
            cache.delete("product:" + product.id());
        }
    }

    @Repository
    interface ProductRepository extends JpaRepository<Product, UUID> {}

    interface SearchIndex {
        void index(Product product);
    }

    static class Product {
        private UUID id;

        UUID id() {
            return id;
        }

        String toJson() {
            throw new UnsupportedOperationException("演示用：替换为 Jackson 序列化");
        }

        static Product fromJson(String json) {
            throw new UnsupportedOperationException("演示用：替换为 Jackson 反序列化");
        }
    }
}
