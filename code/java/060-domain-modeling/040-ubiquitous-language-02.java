package ch060;

// 祖传 ERP 的形状：原样保留，一行都不许"顺手改"。
class UbiquitousLanguage02 {

    // ERP 的字段名：CUST_NO、FIRST_NM……这是它的语言，不是你的。
    record ErpCustomerRecord(
        String custNo,
        String firstNm,
        String lastNm,
        int statCd) {}

    // 你的领域概念：干净，用统一语言。
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

    record CustomerId(String value) {}
    record PersonName(String first, String last) {}
    enum CustomerStatus { ACTIVE, SUSPENDED, CLOSED }

    // 翻译器：整个系统里唯一同时懂两种模型的地方。
    static final class ErpCustomerTranslator {
        Customer toDomain(ErpCustomerRecord legacy) {
            return new Customer(
                new CustomerId(legacy.custNo().trim()),
                new PersonName(legacy.firstNm().trim(), legacy.lastNm().trim()),
                mapStatus(legacy.statCd()));
        }

        // 状态码 1–9 的含义只允许出现在这里，不许漏进领域。
        private static CustomerStatus mapStatus(int code) {
            return switch (code) {
                case 1, 2 -> CustomerStatus.ACTIVE;
                case 3, 4 -> CustomerStatus.SUSPENDED;
                default -> CustomerStatus.CLOSED; // 未知码按最保守处理：关户。
            };
        }
    }
}
