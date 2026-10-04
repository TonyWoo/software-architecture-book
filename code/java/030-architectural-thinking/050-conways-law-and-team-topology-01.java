package ch030;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// 组织结构图即架构断言：
// 每条服务边界都必须对上一条团队边界。
class ConwaysLawAndTeamTopology01 {

    record Team(String name, List<String> ownedServices) {}

    static final List<Team> TEAMS = List.of(
        new Team("checkout", List.of("Checkout.Api", "Checkout.Worker")),
        new Team("billing", List.of("Billing.Api")),
        new Team("platform", List.of("Shared.Observability", "Shared.Deploy")));

    // 没有团队拥有的服务是孤儿。
    // 被两个团队拥有的服务是未来的故障。
    static List<String> validateOwnership(List<String> allServices) {
        var ownership = new HashMap<String, List<String>>();
        for (Team t : TEAMS)
            for (String s : t.ownedServices())
                ownership.computeIfAbsent(s, k -> new ArrayList<>()).add(t.name());

        var problems = new ArrayList<String>();
        for (String service : allServices) {
            var owners = ownership.get(service);
            if (owners == null)
                problems.add("孤儿：" + service + " 没有归属团队。");
            else if (owners.size() > 1)
                problems.add("共管：" + service + " 被 " + String.join("、", owners)
                    + " 共同拥有——拆了它，或者定一个主人。");
        }
        return problems;
    }
}
