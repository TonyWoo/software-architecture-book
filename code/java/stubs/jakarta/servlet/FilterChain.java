// 编译桩：仅用于验证示例语法，对应真实依赖 jakarta.servlet:jakarta.servlet-api
package jakarta.servlet;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface FilterChain {
    void doFilter(HttpServletRequest request, HttpServletResponse response) throws Exception;
}
