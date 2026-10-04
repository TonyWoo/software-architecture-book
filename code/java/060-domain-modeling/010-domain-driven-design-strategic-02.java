package ch060;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

// 通用子域：通知。已经被解决的问题，不许在这里创新。
// 用现成的 SMTP 客户端，别手写一个"更优雅的"邮件系统。
class DomainDrivenDesignStrategic02 {

    interface NotificationSender {
        void send(Notification notification);
    }

    record Notification(String to, String subject, String body) {}

    static final class SmtpNotificationSender implements NotificationSender {
        private final Session session;

        SmtpNotificationSender() {
            // 真实项目里 Session 来自 Spring 的 JavaMailSender 自动装配。
            this.session = Session.getInstance(new Properties());
        }

        public void send(Notification notification) {
            try {
                var mail = new MimeMessage(session);
                mail.setFrom(new InternetAddress("noreply@shop.example"));
                mail.setRecipient(Message.RecipientType.TO,
                    new InternetAddress(notification.to()));
                mail.setSubject(notification.subject());
                mail.setText(notification.body());
                Transport.send(mail);
            } catch (Exception e) {
                throw new IllegalStateException("邮件发送失败", e);
            }
        }
    }
}
