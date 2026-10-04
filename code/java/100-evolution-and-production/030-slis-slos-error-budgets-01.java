package ch100;

// 概念上：SLI = 好事件 / 总事件。
// 实际中这段逻辑住在你的指标后端（Prometheus 等），
// 由上一节你埋好的请求指标算出来：
//
// success_ratio = sum(rate(http_requests_total{status!~"5.."}[30d]))
//                 / sum(rate(http_requests_total[30d]))
//
// p95_latency   = histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[30d]))
class SlisSlosErrorBudgets01 {

    // SLO 写成代码：目标、窗口、烧预算的速度，一处写清。
    record Slo(
        String name,
        String sliQuery,     // 在 Prometheus / Grafana 里的查询
        double target,       // 0.999
        String window,       // "30d"
        String alertPolicy) {}

    static final Slo[] SLOS = {
        new Slo("下单可用性",
            "sum(rate(http_requests_total{route=\"POST /orders\",status!~\"5..\"}[30d]))"
                + " / sum(rate(http_requests_total{route=\"POST /orders\"}[30d]))",
            0.999, "30d",
            "预算燃烧速度超 14.4 倍时 paging，超 6 倍时 ticket"),
        new Slo("下单 p95 延迟",
            "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[30d]))",
            0.8, "30d", // 目标：p95 < 800ms
            "连续 2 个窗口超标就冻结该服务的发布"),
    };

    // 错误预算 = 1 - SLO：99.9% 的月预算约 43 分钟。
    // 预算花光之前：随便发布；花光之后：只修稳定性，不许上新功能。
    static double errorBudget(double slo) {
        return 1.0 - slo;
    }
}
