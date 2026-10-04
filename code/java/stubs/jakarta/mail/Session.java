// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.mail:jakarta.mail-api
package jakarta.mail;

import java.util.Properties;

public class Session {
    private Session() {
    }

    public static Session getInstance(Properties props) {
        return new Session();
    }
}
