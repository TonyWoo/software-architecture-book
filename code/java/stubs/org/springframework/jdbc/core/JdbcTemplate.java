// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework:spring-jdbc
package org.springframework.jdbc.core;

import javax.sql.DataSource;
import java.util.List;

public class JdbcTemplate {
    public JdbcTemplate() {
    }

    public JdbcTemplate(DataSource dataSource) {
    }

    public <T> List<T> query(String sql, RowMapper<T> rowMapper, Object... args) {
        throw new UnsupportedOperationException("编译桩");
    }

    public <T> T queryForObject(String sql, RowMapper<T> rowMapper, Object... args) {
        throw new UnsupportedOperationException("编译桩");
    }

    public int update(String sql, Object... args) {
        throw new UnsupportedOperationException("编译桩");
    }
}
