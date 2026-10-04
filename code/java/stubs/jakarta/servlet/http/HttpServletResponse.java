// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.servlet:jakarta.servlet-api
package jakarta.servlet.http;

import java.io.PrintWriter;

public class HttpServletResponse {
    public void setStatus(int status) {
        throw new UnsupportedOperationException("编译桩");
    }

    public PrintWriter getWriter() {
        throw new UnsupportedOperationException("编译桩");
    }

    public void setContentType(String type) {
        throw new UnsupportedOperationException("编译桩");
    }
}
