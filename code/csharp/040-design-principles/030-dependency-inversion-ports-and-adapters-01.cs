// --- 核心：端口。由领域拥有，按领域的需求塑形。 ---
public interface INotificationPort
{
    Task SendAsync(string recipient, string subject, string body);
}

public class OrderConfirmationService
{
    private readonly INotificationPort _notifications;

    public OrderConfirmationService(INotificationPort notifications)
        => _notifications = notifications;

    public async Task ConfirmAsync(Order order)
    {
        // 纯领域逻辑。这里看不到 SMTP、SendGrid、HTTP 客户端。
        var message = $"Order {order.Id} confirmed. Total: {order.Total:C}";
        await _notifications.SendAsync(order.CustomerEmail, "Order confirmed", message);
    }
}

// --- 基础设施：适配器。知道那些脏细节，但被端口藏在后面。 ---
public sealed class SmtpNotificationAdapter : INotificationPort
{
    private readonly SmtpClient _smtp;

    public SmtpNotificationAdapter(SmtpClient smtp) => _smtp = smtp;

    public async Task SendAsync(string recipient, string subject, string body)
    {
        using var mail = new MailMessage("noreply@shop.example", recipient, subject, body);
        await _smtp.SendMailAsync(mail);
    }
}
