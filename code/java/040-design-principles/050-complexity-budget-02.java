package ch040;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.List;

class ComplexityBudget02 {

    // 预算花得值：复杂度集中在差异化点上。
    // 这个定价引擎就是业务本身，它配得上这份讲究。
    static class DynamicPricingEngine {
        Money quote(Order order, MarketConditions market) {
            var base = order.lines().stream()
                .map(l -> l.unitPrice().multiply(BigDecimal.valueOf(l.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal demandFactor;
            if (market.demandIndex().compareTo(new BigDecimal("0.8")) > 0) {
                demandFactor = new BigDecimal("1.15");
            } else if (market.demandIndex().compareTo(new BigDecimal("0.5")) > 0) {
                demandFactor = new BigDecimal("1.05");
            } else {
                demandFactor = new BigDecimal("0.95");
            }

            // 枚举 switch：分支穷尽，编译器帮你检查漏了哪种会员。
            BigDecimal loyaltyDiscount = switch (order.customer().tier()) {
                case GOLD -> new BigDecimal("0.90");
                case SILVER -> new BigDecimal("0.95");
                default -> BigDecimal.ONE;
            };

            return new Money(base.multiply(demandFactor).multiply(loyaltyDiscount));
        }
    }

    // 预算省下来：审计日志是没差异化的管道。
    // 无聊、直白、一个方法，不上框架。
    static class AuditLog {
        private final Path path;

        AuditLog(Path path) {
            this.path = path;
        }

        void append(String entry) {
            try {
                Files.writeString(path,
                    Instant.now() + " " + entry + System.lineSeparator(),
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        }
    }

    record Money(BigDecimal amount) {}
    record OrderLine(BigDecimal unitPrice, int quantity) {}
    record Order(List<OrderLine> lines, Customer customer) {}
    record Customer(Tier tier) {}
    enum Tier { GOLD, SILVER, BRONZE }
    record MarketConditions(BigDecimal demandIndex) {}
}
