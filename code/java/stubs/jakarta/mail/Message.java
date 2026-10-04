// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.mail:jakarta.mail-api
package jakarta.mail;

public abstract class Message {
    public enum RecipientType {
        TO,
        CC,
        BCC
    }

    public abstract void setFrom(Address address);

    public abstract void setRecipient(RecipientType type, Address address);

    public abstract void setSubject(String subject);

    public abstract void setText(String text);
}
