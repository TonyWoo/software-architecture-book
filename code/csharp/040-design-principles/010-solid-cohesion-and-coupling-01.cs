// 两个改变的理由：计算逻辑和报表格式。
public class InvoiceService
{
    public decimal CalculateTotal(Order order) { /* ... */ return 0; }

    public string RenderPdf(Invoice invoice) { /* ... */ return ""; }
}

// 拆开。每个类现在只有一个变化轴。
public class InvoiceCalculator
{
    public decimal CalculateTotal(Order order) { /* ... */ return 0; }
}

public class InvoicePdfRenderer
{
    public string RenderPdf(Invoice invoice) { /* ... */ return ""; }
}
