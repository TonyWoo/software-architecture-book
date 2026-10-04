// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.mail:jakarta.mail-api
package jakarta.mail;

public class Transport {
    private Transport() {
    }

    public static void send(Message message) {
        throw new UnsupportedOperationException("编译桩");
    }
}
