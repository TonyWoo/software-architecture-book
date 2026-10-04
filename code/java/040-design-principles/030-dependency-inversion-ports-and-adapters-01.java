package ch040;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.util.Properties;

class DependencyInversionPortsAndAdapters01 {

    // --- 核心：端口。由领域拥有，按领域的需求塑形。 ---
    interface NotificationPort {
        void send(String recipient, String subject, String body);
    }

    static class OrderConfirmationService {
        private final NotificationPort notifications;

        OrderConfirmationService(NotificationPort notifications) {
            this.notifications = notifications;
        }

        void confirm(Order order) {
            // 纯领域逻辑。这里看不到 SMTP、SendGrid、HTTP 客户端。
            var message = "Order " + order.id() + " confirmed. Total: " + order.total();
            notifications.send(order.customerEmail(), "Order confirmed", message);
        }
    }

    // --- 基础设施：适配器。知道那些脏细节，但被端口藏在后面。 ---
    static class SmtpNotificationAdapter implements NotificationPort {
        private final Session session;

        SmtpNotificationAdapter() {
            // 真实项目里 Session 来自 Spring 的 JavaMailSender 自动装配。
            this.session = Session.getInstance(new Properties());
        }

        public void send(String recipient, String subject, String body) {
            try {
                var mail = new MimeMessage(session);
                mail.setFrom(new InternetAddress("noreply@shop.example"));
                mail.setRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
                mail.setSubject(subject);
                mail.setText(body);
                Transport.send(mail);
            } catch (Exception e) {
                throw new IllegalStateException("邮件发送失败", e);
            }
        }
    }

    record Order(String id, BigDecimal total, String customerEmail) {}
}
