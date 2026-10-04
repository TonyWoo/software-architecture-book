package ch070;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// 仓库现在知道了拓扑。这就是扩展的代价。
class ReplicationAndPartitioning01 {

    // 分片路由：按 customerId 选库。
    interface ShardRouter {
        String connectionFor(UUID customerId);
        List<String> allConnections();
    }

    static class OrderRepository {
        private final OrderStore store;
        private final ShardRouter shards;
        private final ExecutorService pool = Executors.newCachedThreadPool();

        OrderRepository(OrderStore store, ShardRouter shards) {
            this.store = store;
            this.shards = shards;
        }

        // 单分片读：快、一致、按分片键路由。
        Order getById(UUID orderId, UUID customerId) {
            String conn = shards.connectionFor(customerId);
            return store.findById(conn, orderId);
        }

        // 跨分片查询：scatter-gather，合并是应用的事。
        List<Order> recentAcrossShards(int take) {
            var futures = new ArrayList<CompletableFuture<List<Order>>>();
            for (String conn : shards.allConnections()) {
                futures.add(CompletableFuture.supplyAsync(
                    () -> store.recent(conn, take), pool));
            }

            return futures.stream()
                .map(CompletableFuture::join)
                .flatMap(List::stream)
                .sorted((a, b) -> b.placedAt().compareTo(a.placedAt()))
                .limit(take)
                .toList();
        }
    }

    interface OrderStore {
        Order findById(String connection, UUID orderId);
        List<Order> recent(String connection, int take);
    }

    record Order(UUID id, java.time.Instant placedAt) {}
}
