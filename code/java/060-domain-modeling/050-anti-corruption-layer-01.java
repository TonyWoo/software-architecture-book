package ch060;

import java.util.Optional;
import java.util.UUID;

// 防腐层：领域代码只调这个外观，永远碰不到 ERP 的 API。
// ERP 的怪形状被拦在翻译器里，进不了领域。
class AntiCorruptionLayer01 {

    // 外观：领域只依赖这个接口。
    interface CustomerDirectory {
        Optional<Customer> findById(CustomerId id);
    }

    // 实现：唯一知道 ERP 存在的地方。
    static final class ErpCustomerDirectory implements CustomerDirectory {
        private final LegacyErpClient erp;
        private final ErpCustomerTranslator translator;

        ErpCustomerDirectory(LegacyErpClient erp, ErpCustomerTranslator translator) {
            this.erp = erp;
            this.translator = translator;
        }

        public Optional<Customer> findById(CustomerId id) {
            // ERP 的怪字段、怪状态码，在这里被翻译掉。
            return erp.fetchCustomer(id.value()).map(translator::toDomain);
        }
    }

    // 祖传 ERP 客户端：返回 ERP 的原生形状。
    interface LegacyErpClient {
        Optional<ErpCustomerRecord> fetchCustomer(String customerNo);
    }

    record ErpCustomerRecord(String custNo, String firstNm, String lastNm, int statCd) {}

    record CustomerId(String value) {}
    record PersonName(String first, String last) {}
    enum CustomerStatus { ACTIVE, SUSPENDED, CLOSED }

    static final class Customer {
        private final CustomerId id;
        private final PersonName name;
        private final CustomerStatus status;

        Customer(CustomerId id, PersonName name, CustomerStatus status) {
            this.id = id;
            this.name = name;
            this.status = status;
        }
    }

    static final class ErpCustomerTranslator {
        Customer toDomain(ErpCustomerRecord legacy) {
            return new Customer(
                new CustomerId(legacy.custNo().trim()),
                new PersonName(legacy.firstNm().trim(), legacy.lastNm().trim()),
                switch (legacy.statCd()) {
                    case 1, 2 -> CustomerStatus.ACTIVE;
                    case 3, 4 -> CustomerStatus.SUSPENDED;
                    default -> CustomerStatus.CLOSED;
                });
        }
    }
}
