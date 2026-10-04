package ch110;

import com.structurizr.Workspace;
import com.structurizr.model.Container;
import com.structurizr.model.Model;
import com.structurizr.model.SoftwareSystem;

// C4-as-code：容器、关系、技术标签写成代码，
// 图永远和代码一起评审、一起版本化，不贴截图。
class C4ModelAndDiagrams01 {

    static Workspace commerce() {
        var workspace = new Workspace("Commerce", "订单处理系统");
        Model model = workspace.getModel();

        SoftwareSystem shop = model.addSoftwareSystem("电商平台", "订单处理系统");

        Container webApp = shop.addContainer("Web App", "React SPA", "HTTPS");
        Container api = shop.addContainer("Order API", "Spring Boot", "HTTPS + JSON");
        Container db = shop.addContainer("Order DB", "PostgreSQL", "SQL");
        Container queue = shop.addContainer("Order Queue", "RabbitMQ", "AMQP");

        webApp.uses(api, "提交订单", "HTTPS");
        api.uses(db, "读写订单", "SQL");
        api.uses(queue, "发布 OrderPlaced", "AMQP");

        return workspace;
    }
}
