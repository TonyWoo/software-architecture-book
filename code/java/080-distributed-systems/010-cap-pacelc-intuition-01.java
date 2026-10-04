package ch080;

import java.util.concurrent.CompletableFuture;

// 按操作选择一致性或可用性，而不是按系统一刀切。
class CapPacelcIntuition01 {

    static class CartWriter {
        private final LocalStore localStore;
        private final Quorum quorum;

        CartWriter(LocalStore localStore, Quorum quorum) {
            this.localStore = localStore;
            this.quorum = quorum;
        }

        // 购物车：AP 选择——本地先接受写入，事后复制。
        // 延迟低；合并冲突靠策略兜底（最后写入胜出 + 退款预算）。
        CompletableFuture<Void> addToCart(String userId, String itemId) {
            return localStore.write(userId, itemId); // 复制完成前就确认
        }

        // 账本：CP 选择——宁可拒绝写入，也不冒双花风险。
        // 牺牲可用性；错误是显式的，不是悄悄错的。
        CompletableFuture<WriteResult> postToLedger(LedgerEntry entry) {
            if (!quorum.isReachable())
                return CompletableFuture.completedFuture(
                    WriteResult.reject("检测到分区：拒绝写入，不冒不一致的风险"));
            return quorum.append(entry).thenApply(v -> WriteResult.accept());
        }
    }

    interface LocalStore {
        CompletableFuture<Void> write(String userId, String itemId);
    }

    interface Quorum {
        boolean isReachable();
        CompletableFuture<Void> append(LedgerEntry entry);
    }

    record LedgerEntry(String id, long amountCents) {}

    record WriteResult(boolean accepted, String reason) {
        static WriteResult accept() {
            return new WriteResult(true, null);
        }

        static WriteResult reject(String reason) {
            return new WriteResult(false, reason);
        }
    }
}
