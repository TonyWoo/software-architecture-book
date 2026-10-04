package ch080;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;

// 仲裁读：正确性来自读仲裁必然与写仲裁交叠。
class ConsistencyModelsAndQuorum01 {

    static final class QuorumStore {
        private final int n; // 副本数
        private final int w; // 写仲裁
        private final int r; // 读仲裁
        private final Cluster cluster;

        QuorumStore(int n, int w, int r, Cluster cluster) {
            if (w + r <= n)
                throw new IllegalArgumentException(
                    "R + W 必须大于 N，否则读可能错过最新写入。");
            this.n = n;
            this.w = w;
            this.r = r;
            this.cluster = cluster;
        }

        CompletableFuture<String> read(String key) {
            // 问 R 个副本；取版本号最新的值——
            // 因为 R + W > N，读集合与写集合必然交叠。
            return cluster.query(key, r)
                .thenApply(versions -> versions.stream()
                    .max(Comparator.comparingLong(VersionedValue::version))
                    .orElseThrow()
                    .value());
        }
    }

    interface Cluster {
        CompletableFuture<List<VersionedValue>> query(String key, int quorum);
    }

    record VersionedValue(String value, long version) {}
}
