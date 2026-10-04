package ch060;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// 核心子域：运费定价。公司在这里赢，也在这里输。
// 丰富模型，重投入，领域专家随叫随到。
class DomainDrivenDesignStrategic01 {

    static final class FreightQuote {
        private final Route route;
        private final CargoManifest manifest;
        private final List<Surcharge> surcharges = new ArrayList<>();

        FreightQuote(Route route, CargoManifest manifest) {
            this.route = route;
            this.manifest = manifest;
        }

        void applyFuelSurcharge(FuelIndex index) {
            // 燃油指数过期了就不能用来定价：这是业务规则，不是校验参数。
            if (index.isStale())
                throw new DomainException("Cannot price against a stale fuel index.");
            surcharges.add(Surcharge.fuel(index.currentRate(), route.distanceKm()));
        }

        Money total() {
            // 基价 × 计费重量：BigDecimal 精确计算，币种在这里定死。
            Money base = new Money(
                route.baseRate().multiply(BigDecimal.valueOf(manifest.billableWeightKg())),
                "CNY");
            Money total = base;
            for (Surcharge s : surcharges)
                total = total.add(s.amount());
            return total;
        }
    }

    record Route(BigDecimal baseRate, double distanceKm) {}
    record CargoManifest(double billableWeightKg) {}
    record FuelIndex(BigDecimal currentRate, boolean isStale) {}
    record Surcharge(Money amount) {
        static Surcharge fuel(BigDecimal rate, double distanceKm) {
            return new Surcharge(new Money(rate.multiply(BigDecimal.valueOf(distanceKm)), "CNY"));
        }
    }

    record Money(BigDecimal amount, String currency) {
        Money multiply(double factor) {
            return new Money(amount.multiply(BigDecimal.valueOf(factor)), currency);
        }

        Money add(Money other) {
            if (!currency.equals(other.currency))
                throw new DomainException("Cannot add " + currency + " to " + other.currency + ".");
            return new Money(amount.add(other.amount), currency);
        }
    }

    static class DomainException extends RuntimeException {
        DomainException(String message) {
            super(message);
        }
    }
}
