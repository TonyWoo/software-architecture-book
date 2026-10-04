// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework:spring-jdbc
package org.springframework.jdbc.core;

import java.sql.ResultSet;
import java.sql.SQLException;

@FunctionalInterface
public interface RowMapper<T> {
    T mapRow(ResultSet rs, int rowNum) throws SQLException;
}
