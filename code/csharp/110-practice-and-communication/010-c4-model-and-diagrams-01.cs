// 不可执行——只是示意 C4-as-code 记录什么：
// 容器、关系、技术标签。
var workspace = new Workspace("Commerce", "订单处理系统");
var webApp = workspace.AddContainer("Web App", "React SPA", "HTTPS");
var api = workspace.AddContainer("Order API", "ASP.NET Core", "HTTPS + JSON");
var db = workspace.AddContainer("Order DB", "PostgreSQL", "SQL");
var queue = workspace.AddContainer("Order Queue", "RabbitMQ", "AMQP");

webApp.Uses(api, "提交订单", "HTTPS");
api.Uses(db, "读写订单", "SQL");
api.Uses(queue, "发布 OrderPlaced", "AMQP");
