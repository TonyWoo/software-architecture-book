// v1：最初的承诺。这个形状从此再也不动，动它就是破坏性变更。
public record OrderDtoV1(
    Guid Id,
    decimal Total,
    string Status);

// v2：只做加法——新增一个字段，不删、不改名、不改类型、不改语义。
public record OrderDtoV2(
    Guid Id,
    decimal Total,
    string Status,
    string? TrackingNumber);
