// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.servlet:jakarta.servlet-api
package jakarta.servlet.http;

public class HttpServletRequest {
    public String getHeader(String name) {
        throw new UnsupportedOperationException("编译桩");
    }

    public String getPathInfo() {
        throw new UnsupportedOperationException("编译桩");
    }

    public String getRequestURI() {
        throw new UnsupportedOperationException("编译桩");
    }
}
