// 通用子域：通知。已经被解决的问题，不许在这里创新。
public sealed class SmtpNotificationSender : INotificationSender
{
    private readonly SmtpClient _client;

    public SmtpNotificationSender(SmtpClient client) => _client = client;

    public Task SendAsync(Notification notification, CancellationToken ct = default) =>
        _client.SendMailAsync(notification.ToMessage(), ct);
}
