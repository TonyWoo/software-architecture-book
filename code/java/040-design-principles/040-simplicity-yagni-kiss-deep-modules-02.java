package ch040;

import java.util.List;

class SimplicityYagniKissDeepModules02 {

    // 浅：活儿都是调用者在干。这个"模块"只是个薄包装，
    // 套着四十个它不肯替你做决定的配置开关。
    static class ShallowReportBuilder {
        String font = "Arial";
        int fontSize = 11;
        String headerText = "";
        boolean showPageNumbers;
        String dateFormat = "yyyy-MM-dd";
        // ... 还有三十个开关 ...
        String build(List<Row> rows) {
            return "";
        }
    }

    // 深：三个方法，所有格式决策模块自己扛。
    static class InvoiceReport {
        InvoiceReport(List<Invoice> invoices) {
        }

        String toPdf() {
            return "";
        }

        String toCsv() {
            return "";
        }
    }

    record Row() {}
    record Invoice() {}
}
