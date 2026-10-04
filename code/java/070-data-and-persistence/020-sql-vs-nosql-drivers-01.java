package ch070;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.mongodb.core.mapping.Document;

// 同一个概念，两种存储形状。配置本身就是决策。
class SqlVsNosqlDrivers01 {

    // 关系型形状：email 要判重 → 唯一索引；
    // Preferences 在关系型里值得一张独立的键值表，而不是一个假装成列的序列化 blob。
    @Entity
    @Table(name = "customer_profiles")
    static class RelationalCustomerProfile {
        @Id
        private UUID id;

        @Column(unique = true)
        private String email;

        @ElementCollection
        private List<String> addresses = new ArrayList<>();

        @ElementCollection
        private Map<String, String> preferences = new HashMap<>();

        protected RelationalCustomerProfile() {
        }
    }

    // 文档形状（MongoDB）：聚合整体存储，地址和偏好跟着文档一起走。
    // 如果你需要独立查询它们，说明形状选错了。
    @Document("profiles")
    static class DocumentCustomerProfile {
        private UUID id;
        private String email;
        private List<Address> addresses = new ArrayList<>();
        private Map<String, String> preferences = new HashMap<>();

        record Address(String city, String street) {}
    }
}
