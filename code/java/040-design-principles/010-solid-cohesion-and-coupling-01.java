package ch040;

import java.math.BigDecimal;

class SolidCohesionAndCoupling01 {

    // 两个改变的理由：计算逻辑和报表格式。
    // 违反单一职责：税率变了、PDF 样式变了，都会逼你改这个类。
    static class InvoiceService {
        BigDecimal calculateTotal(Order order) {
            return BigDecimal.ZERO;
        }

        String renderPdf(Invoice invoice) {
            return "";
        }
    }

    // 拆开。每个类现在只有一个变化轴。
    static class InvoiceCalculator {
        BigDecimal calculateTotal(Order order) {
            return BigDecimal.ZERO;
        }
    }

    static class InvoicePdfRenderer {
        String renderPdf(Invoice invoice) {
            return "";
        }
    }

    record Order() {}
    record Invoice() {}
}
