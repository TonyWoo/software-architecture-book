// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.mail:jakarta.mail-api
package jakarta.mail.internet;

import jakarta.mail.Address;
import jakarta.mail.Message;
import jakarta.mail.Session;

public class MimeMessage extends Message {
    public MimeMessage(Session session) {
    }

    @Override
    public void setFrom(Address address) {
    }

    @Override
    public void setRecipient(RecipientType type, Address address) {
    }

    @Override
    public void setSubject(String subject) {
    }

    @Override
    public void setText(String text) {
    }
}
