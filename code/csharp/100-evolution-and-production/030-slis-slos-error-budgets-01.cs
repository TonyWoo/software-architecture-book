// 概念上：SLI = 好事件 / 总事件。
// 实际中这段逻辑住在你的指标后端（Prometheus 等），
// 由上一节你埋好的请求指标算出来：

// success_ratio = sum(rate(http_requests_total{status!~"5.."}[30d]))
//                 / sum(rate(http_requests_total[30d]))
//
// p95_latency   = histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[30d]))
