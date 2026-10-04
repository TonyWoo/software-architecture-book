// 浅：活儿都是调用者在干。这个"模块"只是个薄包装，
// 套着四十个它不肯替你做决定的配置开关。
public class ShallowReportBuilder
{
    public string Font { get; set; } = "Arial";
    public int FontSize { get; set; } = 11;
    public string HeaderText { get; set; } = "";
    public bool ShowPageNumbers { get; set; }
    public string DateFormat { get; set; } = "yyyy-MM-dd";
    // ... 还有三十个开关 ...
    public string Build(IEnumerable<Row> rows) { /* ... */ return ""; }
}

// 深：三个方法，所有格式决策模块自己扛。
public class InvoiceReport
{
    public InvoiceReport(IEnumerable<Invoice> invoices) { /* ... */ }

    public string ToPdf() { /* ... */ return ""; }

    public string ToCsv() { /* ... */ return ""; }
}
