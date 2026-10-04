package ch090;

import java.math.BigDecimal;
import java.util.UUID;

// v1：最初的承诺。这个形状从此再也不动，动它就是破坏性变更。
class ApiDesignContractsAndVersioning01 {

    record OrderDtoV1(
        UUID id,
        BigDecimal total,
        String status) {}

    // v2：只做加法——新增一个字段，不删、不改名、不改类型、不改语义。
    record OrderDtoV2(
        UUID id,
        BigDecimal total,
        String status,
        String trackingNumber) {}
}
