// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework:spring-web
package org.springframework.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public abstract class OncePerRequestFilter {

    protected abstract void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain) throws Exception;
}
