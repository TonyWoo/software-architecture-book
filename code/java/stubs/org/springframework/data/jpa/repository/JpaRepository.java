// 编译桩：仅用于验证示例语法，对应真实依赖 org.springframework.data:spring-data-jpa
package org.springframework.data.jpa.repository;

import java.util.List;
import java.util.Optional;

public interface JpaRepository<T, ID> {
    <S extends T> S save(S entity);

    Optional<T> findById(ID id);

    List<T> findAll();

    void deleteById(ID id);

    long count();
}
