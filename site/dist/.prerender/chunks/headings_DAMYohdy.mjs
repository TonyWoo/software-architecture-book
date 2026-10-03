//#region \0virtual:nimbus/headings
var generation = 1;
var base = "/";
var records = [
	{
		"collection": "docs",
		"id": "book",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "章节",
			"text": "章节"
		}]
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking/architecture-decision-records-adrs",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "adr-里写什么",
				"text": "ADR 里写什么"
			},
			{
				"depth": 2,
				"slug": "什么时候写",
				"text": "什么时候写"
			},
			{
				"depth": 2,
				"slug": "把决策当数据",
				"text": "把决策当数据"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking/conways-law-and-team-topology",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "组织结构图就是设计文档",
				"text": "组织结构图就是设计文档"
			},
			{
				"depth": 2,
				"slug": "团队拓扑四种模式",
				"text": "团队拓扑：四种模式"
			},
			{
				"depth": 2,
				"slug": "把边界建模出来",
				"text": "把边界建模出来"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking/fitness-functions",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "好的适应度函数长什么样",
				"text": "好的适应度函数长什么样"
			},
			{
				"depth": 2,
				"slug": "c-里的架构测试",
				"text": "C# 里的架构测试"
			},
			{
				"depth": 2,
				"slug": "适应度函数不是单元测试",
				"text": "适应度函数不是单元测试"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking/technical-debt-and-evolutionary-pressure",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "审慎的债-vs-意外的债",
				"text": "审慎的债 vs 意外的债"
			},
			{
				"depth": 2,
				"slug": "利率比本金重要",
				"text": "利率比本金重要"
			},
			{
				"depth": 2,
				"slug": "记账与还款",
				"text": "记账与还款"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/architectural-thinking/trade-off-analysis-no-free-lunch",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "把交易摆到台面上",
				"text": "把交易摆到台面上"
			},
			{
				"depth": 2,
				"slug": "同步-vs-异步经典交易",
				"text": "同步 vs 异步：经典交易"
			},
			{
				"depth": 2,
				"slug": "一致性-vs-延迟",
				"text": "一致性 vs 延迟"
			},
			{
				"depth": 2,
				"slug": "沉默的代价",
				"text": "沉默的代价"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence/data-ownership-and-modeling",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "一条数据一个写入者",
				"text": "一条数据，一个写入者"
			},
			{
				"depth": 2,
				"slug": "共享数据库陷阱",
				"text": "共享数据库陷阱"
			},
			{
				"depth": 2,
				"slug": "为访问模式建模",
				"text": "为访问模式建模"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence/polyglot-persistence",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "给每份工作配合适的工具",
				"text": "给每份工作配合适的工具"
			},
			{
				"depth": 2,
				"slug": "运维税是按复利收的",
				"text": "运维税是按复利收的"
			},
			{
				"depth": 2,
				"slug": "让-sprawl-保持故意",
				"text": "让 sprawl 保持故意"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence/replication-and-partitioning",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "读扩展复制",
				"text": "读扩展：复制"
			},
			{
				"depth": 2,
				"slug": "写扩展分区",
				"text": "写扩展：分区"
			},
			{
				"depth": 2,
				"slug": "应用感受到的变化",
				"text": "应用感受到的变化"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence/sql-vs-nosql-drivers",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "按访问模式做决定",
				"text": "按访问模式做决定"
			},
			{
				"depth": 2,
				"slug": "四种形状",
				"text": "四种形状"
			},
			{
				"depth": 2,
				"slug": "运维现实本身就是一个特性",
				"text": "运维现实本身就是一个特性"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/data-and-persistence/transactions-sagas-and-outbox",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "acid-在边界处终结",
				"text": "ACID 在边界处终结"
			},
			{
				"depth": 2,
				"slug": "编排-vs-协同",
				"text": "编排 vs 协同"
			},
			{
				"depth": 2,
				"slug": "事务性发件箱",
				"text": "事务性发件箱"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/design-principles",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/design-principles/boundaries-and-separation-of-concerns",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "边界是变化到此为止的地方",
				"text": "边界是变化到此为止的地方"
			},
			{
				"depth": 2,
				"slug": "边界画在变化发生的地方",
				"text": "边界画在变化发生的地方"
			},
			{
				"depth": 2,
				"slug": "局部边界整面墙太贵的时候",
				"text": "局部边界：整面墙太贵的时候"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/design-principles/complexity-budget",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "复杂度是有限资源",
				"text": "复杂度是有限资源"
			},
			{
				"depth": 2,
				"slug": "本质复杂度-vs-偶然复杂度",
				"text": "本质复杂度 vs. 偶然复杂度"
			},
			{
				"depth": 2,
				"slug": "把预算花在能让你赢的地方",
				"text": "把预算花在能让你赢的地方"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/design-principles/dependency-inversion-ports-and-adapters",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "依赖抽象而不是具体",
				"text": "依赖抽象，而不是具体"
			},
			{
				"depth": 2,
				"slug": "c-里的端口与适配器",
				"text": "C# 里的端口与适配器"
			},
			{
				"depth": 2,
				"slug": "组合根所有线汇合的地方",
				"text": "组合根：所有线汇合的地方"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/design-principles/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/design-principles/simplicity-yagni-kiss-deep-modules",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "yagni你不会需要它",
				"text": "YAGNI：你不会需要它"
			},
			{
				"depth": 2,
				"slug": "kiss以及简单和容易的区别",
				"text": "KISS，以及“简单”和“容易”的区别"
			},
			{
				"depth": 2,
				"slug": "深模块而不是浅模块",
				"text": "深模块，而不是浅模块"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/design-principles/solid-cohesion-and-coupling",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "五条规则底下是两股力量",
				"text": "五条规则，底下是两股力量"
			},
			{
				"depth": 2,
				"slug": "单一职责只有一个改变的理由",
				"text": "单一职责：只有一个改变的理由"
			},
			{
				"depth": 2,
				"slug": "开闭里氏替换接口隔离扩展的三条规则",
				"text": "开闭、里氏替换、接口隔离：扩展的三条规则"
			},
			{
				"depth": 2,
				"slug": "内聚与耦合真正的两股力量",
				"text": "内聚与耦合：真正的两股力量"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems/cap-pacelc-intuition",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "cap-到底在说什么",
				"text": "CAP 到底在说什么"
			},
			{
				"depth": 2,
				"slug": "pacelc更完整的图景",
				"text": "PACELC：更完整的图景"
			},
			{
				"depth": 2,
				"slug": "一个具体的选择ap-还是-cp",
				"text": "一个具体的选择：AP 还是 CP"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems/consensus-raft-intuition",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "为什么需要共识",
				"text": "为什么需要共识"
			},
			{
				"depth": 2,
				"slug": "raft-直觉任期投票日志复制",
				"text": "Raft 直觉：任期、投票、日志复制"
			},
			{
				"depth": 2,
				"slug": "带走的心智模型",
				"text": "带走的心智模型"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems/consistency-models-and-quorum",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "保证的阶梯",
				"text": "保证的阶梯"
			},
			{
				"depth": 2,
				"slug": "仲裁数学大白话版",
				"text": "仲裁数学，大白话版"
			},
			{
				"depth": 2,
				"slug": "一个让你记住的例子",
				"text": "一个让你记住的例子"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems/failure-modes-retries-and-idempotency",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "部分故障才是常态",
				"text": "部分故障才是常态"
			},
			{
				"depth": 2,
				"slug": "重试风暴与退避的纪律",
				"text": "重试风暴与退避的纪律"
			},
			{
				"depth": 2,
				"slug": "幂等键最重要的工具",
				"text": "幂等键：最重要的工具"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems/fallacies-of-distributed-computing",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "这份清单的来历",
			"text": "这份清单的来历"
		}, {
			"depth": 2,
			"slug": "停止相信之后设计变成什么样",
			"text": "停止相信之后，设计变成什么样"
		}]
	},
	{
		"collection": "docs",
		"id": "book/distributed-systems/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling/aggregates-entities-and-value-objects",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "实体与值对象先分清身份",
				"text": "实体与值对象：先分清身份"
			},
			{
				"depth": 2,
				"slug": "聚合根的规矩",
				"text": "聚合根的规矩"
			},
			{
				"depth": 2,
				"slug": "实战order--orderline",
				"text": "实战：Order / OrderLine"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling/anti-corruption-layer",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "防腐层由三部分组成",
				"text": "防腐层由三部分组成"
			},
			{
				"depth": 2,
				"slug": "实战把-erp-的客户翻译成你的客户",
				"text": "实战：把 ERP 的客户翻译成你的客户"
			},
			{
				"depth": 2,
				"slug": "这笔钱什么时候值得花",
				"text": "这笔钱什么时候值得花"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling/bounded-contexts-and-context-maps",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "一个词多种含义",
				"text": "一个词，多种含义"
			},
			{
				"depth": 2,
				"slug": "画出地图",
				"text": "画出地图"
			},
			{
				"depth": 2,
				"slug": "一个具体的例子",
				"text": "一个具体的例子"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling/domain-driven-design-strategic",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "核心支撑通用子域",
				"text": "核心、支撑、通用子域"
			},
			{
				"depth": 2,
				"slug": "把钱花在疼的地方",
				"text": "把钱花在疼的地方"
			},
			{
				"depth": 2,
				"slug": "大多数团队栽在哪里",
				"text": "大多数团队栽在哪里"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/domain-modeling/ubiquitous-language",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "含糊的词语如何变成-bug",
				"text": "含糊的词语如何变成 bug"
			},
			{
				"depth": 2,
				"slug": "向领域的词语靠拢",
				"text": "向领域的词语靠拢"
			},
			{
				"depth": 2,
				"slug": "让语言活在代码里",
				"text": "让语言活在代码里"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production/evolutionary-architecture-and-strangler",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "绞杀它别重写它",
			"text": "绞杀它，别重写它"
		}, {
			"depth": 2,
			"slug": "为什么这很重要",
			"text": "为什么这很重要"
		}]
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production/observability-logs-metrics-traces",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "结构化日志记事件不记字符串",
				"text": "结构化日志：记事件，不记字符串"
			},
			{
				"depth": 2,
				"slug": "链路上下文把散落的点连起来",
				"text": "链路上下文：把散落的点连起来"
			},
			{
				"depth": 2,
				"slug": "先-instrument-什么少但准",
				"text": "先 instrument 什么：少，但准"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production/resilience-breaker-bulkhead-timeout",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "超时给等待设上限",
				"text": "超时：给等待设上限"
			},
			{
				"depth": 2,
				"slug": "熔断与舱壁快速失败隔离损害",
				"text": "熔断与舱壁：快速失败，隔离损害"
			},
			{
				"depth": 2,
				"slug": "为什么这很重要",
				"text": "为什么这很重要"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production/security-least-privilege-and-secrets",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "服务的最小权限",
				"text": "服务的最小权限"
			},
			{
				"depth": 2,
				"slug": "密钥不在代码里不在配置文件里",
				"text": "密钥：不在代码里，不在配置文件里"
			},
			{
				"depth": 2,
				"slug": "威胁建模短暂地像攻击者一样思考",
				"text": "威胁建模：短暂地像攻击者一样思考"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/evolution-and-production/slis-slos-error-budgets",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "选用户能感受到的-sli",
			"text": "选用户能感受到的 SLI"
		}, {
			"depth": 2,
			"slug": "错误预算把政策写进算术",
			"text": "错误预算：把政策写进算术"
		}]
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role/architect-vs-senior-vs-tech-lead",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "每个人到底负责什么",
				"text": "每个人到底负责什么"
			},
			{
				"depth": 2,
				"slug": "决策权写下来",
				"text": "决策权，写下来"
			},
			{
				"depth": 2,
				"slug": "他们在哪里碰撞",
				"text": "他们在哪里碰撞"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role/functional-vs-non-functional-reqs",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "行为是演示约束才是系统",
			"text": "行为是演示，约束才是系统"
		}, {
			"depth": 2,
			"slug": "一个-nfr-如何塑造真实代码",
			"text": "一个 NFR 如何塑造真实代码"
		}]
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role/quality-attributes-and-ilities",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "真正驱动结构的--ilities",
				"text": "真正驱动结构的 -ilities"
			},
			{
				"depth": 2,
				"slug": "量化不了的就不算拥有",
				"text": "量化不了的，就不算拥有"
			},
			{
				"depth": 2,
				"slug": "让--ility-可执行",
				"text": "让 -ility 可执行"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role/stakeholders-constraints-and-drivers",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "干系人谁有发言权",
				"text": "干系人：谁有发言权"
			},
			{
				"depth": 2,
				"slug": "约束什么动不了",
				"text": "约束：什么动不了"
			},
			{
				"depth": 2,
				"slug": "驱动力真正说了算的两三个",
				"text": "驱动力：真正说了算的两三个"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/foundations-and-role/what-architecture-actually-is",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "是决策不是图纸",
				"text": "是决策，不是图纸"
			},
			{
				"depth": 2,
				"slug": "结构应该尖叫出它的意图",
				"text": "结构应该尖叫出它的意图"
			},
			{
				"depth": 2,
				"slug": "让你的决策看得见",
				"text": "让你的决策看得见"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "integration--apis",
			"text": "Integration & APIs"
		}]
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis/api-design-contracts-and-versioning",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "契约是给陌生人的承诺",
				"text": "契约是给陌生人的承诺"
			},
			{
				"depth": 2,
				"slug": "为消费者设计不为数据库设计",
				"text": "为消费者设计，不为数据库设计"
			},
			{
				"depth": 2,
				"slug": "加法与破坏唯一重要的规则",
				"text": "加法与破坏：唯一重要的规则"
			},
			{
				"depth": 2,
				"slug": "版本策略以及代码长什么样",
				"text": "版本策略，以及代码长什么样"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis/choreography-vs-orchestration",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "谁来指挥业务流程",
				"text": "谁来指挥业务流程"
			},
			{
				"depth": 2,
				"slug": "协同没有指挥的舞蹈",
				"text": "协同：没有指挥的舞蹈"
			},
			{
				"depth": 2,
				"slug": "编排指挥棒在谁手里",
				"text": "编排：指挥棒在谁手里"
			},
			{
				"depth": 2,
				"slug": "调试是真正的分水岭以及代码长什么样",
				"text": "调试是真正的分水岭，以及代码长什么样"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis/gateway-mesh-and-discovery",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "边缘是面镜子",
				"text": "边缘是面镜子"
			},
			{
				"depth": 2,
				"slug": "网关把边缘收拢到一处",
				"text": "网关：把边缘收拢到一处"
			},
			{
				"depth": 2,
				"slug": "服务网格给每个服务配个边车",
				"text": "服务网格：给每个服务配个边车"
			},
			{
				"depth": 2,
				"slug": "服务发现你在哪是个动态问题",
				"text": "服务发现：“你在哪”是个动态问题"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis/queues-pub-sub-and-event-streams",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "三种形态三种真相",
				"text": "三种形态，三种真相"
			},
			{
				"depth": 2,
				"slug": "队列一个活儿一个工人",
				"text": "队列：一个活儿，一个工人"
			},
			{
				"depth": 2,
				"slug": "发布订阅一个事件多种反应",
				"text": "发布订阅：一个事件，多种反应"
			},
			{
				"depth": 2,
				"slug": "事件流日志即真相",
				"text": "事件流：日志即真相"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/integration-and-apis/sync-rest-grpc-vs-async",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "时间耦合才是真正的代价",
				"text": "时间耦合才是真正的代价"
			},
			{
				"depth": 2,
				"slug": "同步简单清晰脆弱",
				"text": "同步：简单、清晰、脆弱"
			},
			{
				"depth": 2,
				"slug": "异步解耦耐久费脑",
				"text": "异步：解耦、耐久、费脑"
			},
			{
				"depth": 2,
				"slug": "各自适合什么以及代码长什么样",
				"text": "各自适合什么，以及代码长什么样"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication/architecture-katas-and-design-reviews",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "kata给判断力做练习",
				"text": "Kata：给判断力做练习"
			},
			{
				"depth": 2,
				"slug": "设计评审正确的开法",
				"text": "设计评审：正确的开法"
			},
			{
				"depth": 2,
				"slug": "评审是怎么开坏的",
				"text": "评审是怎么开坏的"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication/c4-model-and-diagrams",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "图为什么总是失败",
				"text": "图为什么总是失败"
			},
			{
				"depth": 2,
				"slug": "第一层context",
				"text": "第一层：Context"
			},
			{
				"depth": 2,
				"slug": "第二层container",
				"text": "第二层：Container"
			},
			{
				"depth": 2,
				"slug": "第三层component",
				"text": "第三层：Component"
			},
			{
				"depth": 2,
				"slug": "第四层code",
				"text": "第四层：Code"
			},
			{
				"depth": 2,
				"slug": "图是用来沟通的不是用来搞艺术的",
				"text": "图是用来沟通的，不是用来搞艺术的"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication/classic-cases-commerce-feed-payments",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "案例一电商系统",
				"text": "案例一：电商系统"
			},
			{
				"depth": 2,
				"slug": "需求与驱动因素",
				"text": "需求与驱动因素"
			},
			{
				"depth": 2,
				"slug": "关键决策与权衡",
				"text": "关键决策与权衡"
			},
			{
				"depth": 2,
				"slug": "结构草图",
				"text": "结构草图"
			},
			{
				"depth": 2,
				"slug": "数据与集成",
				"text": "数据与集成"
			},
			{
				"depth": 2,
				"slug": "10-倍规模时重新审视",
				"text": "10 倍规模时重新审视"
			},
			{
				"depth": 2,
				"slug": "案例二社交信息流系统",
				"text": "案例二：社交信息流系统"
			},
			{
				"depth": 2,
				"slug": "需求与驱动因素-1",
				"text": "需求与驱动因素"
			},
			{
				"depth": 2,
				"slug": "关键决策与权衡-1",
				"text": "关键决策与权衡"
			},
			{
				"depth": 2,
				"slug": "结构草图-1",
				"text": "结构草图"
			},
			{
				"depth": 2,
				"slug": "数据与集成-1",
				"text": "数据与集成"
			},
			{
				"depth": 2,
				"slug": "10-倍规模时重新审视-1",
				"text": "10 倍规模时重新审视"
			},
			{
				"depth": 2,
				"slug": "案例三支付系统",
				"text": "案例三：支付系统"
			},
			{
				"depth": 2,
				"slug": "需求与驱动因素-2",
				"text": "需求与驱动因素"
			},
			{
				"depth": 2,
				"slug": "关键决策与权衡-2",
				"text": "关键决策与权衡"
			},
			{
				"depth": 2,
				"slug": "结构草图-2",
				"text": "结构草图"
			},
			{
				"depth": 2,
				"slug": "数据与集成-2",
				"text": "数据与集成"
			},
			{
				"depth": 2,
				"slug": "10-倍规模时重新审视-2",
				"text": "10 倍规模时重新审视"
			},
			{
				"depth": 2,
				"slug": "三个案例的共同课",
				"text": "三个案例的共同课"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication/developer-to-architect-path",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "先说清楚架构师不是头衔",
				"text": "先说清楚：架构师不是头衔"
			},
			{
				"depth": 2,
				"slug": "练什么决策的次数",
				"text": "练什么：决策的次数"
			},
			{
				"depth": 2,
				"slug": "读什么少而精",
				"text": "读什么：少而精"
			},
			{
				"depth": 2,
				"slug": "攒决策次数去有决定的地方",
				"text": "攒决策次数：去有决定的地方"
			},
			{
				"depth": 2,
				"slug": "像架构师一样沟通",
				"text": "像架构师一样沟通"
			},
			{
				"depth": 2,
				"slug": "责任感最后一条也是分水岭",
				"text": "责任感：最后一条，也是分水岭"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication/documenting-views-and-decisions",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "视图一个系统多种讲法",
				"text": "视图：一个系统，多种讲法"
			},
			{
				"depth": 2,
				"slug": "adr决策日志",
				"text": "ADR：决策日志"
			},
			{
				"depth": 2,
				"slug": "让文档活下去",
				"text": "让文档活下去"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/practice-and-communication/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/preface",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns/event-driven-cqrs-and-event-sourcing",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "事件作为脊梁",
				"text": "事件作为脊梁"
			},
			{
				"depth": 2,
				"slug": "cqrs读写分离",
				"text": "CQRS：读写分离"
			},
			{
				"depth": 2,
				"slug": "事件溯源状态是历史的折叠",
				"text": "事件溯源：状态是历史的折叠"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns/hexagonal-onion-and-clean-architecture",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "依赖规则",
				"text": "依赖规则"
			},
			{
				"depth": 2,
				"slug": "c-里的端口与适配器",
				"text": "C# 里的端口与适配器"
			},
			{
				"depth": 2,
				"slug": "三个名字一种纪律",
				"text": "三个名字，一种纪律"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns/key-takeaways",
		"generation": 1,
		"base": "/",
		"headings": []
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns/layered-n-tier",
		"generation": 1,
		"base": "/",
		"headings": [{
			"depth": 2,
			"slug": "依赖规则",
			"text": "依赖规则"
		}, {
			"depth": 2,
			"slug": "它在哪里烂掉",
			"text": "它在哪里烂掉"
		}]
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns/microservices-vs-monolith",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "微服务什么时候挣回成本",
				"text": "微服务什么时候挣回成本"
			},
			{
				"depth": 2,
				"slug": "分布式单体的陷阱",
				"text": "分布式单体的陷阱"
			},
			{
				"depth": 2,
				"slug": "诚实的记分牌",
				"text": "诚实的记分牌"
			}
		]
	},
	{
		"collection": "docs",
		"id": "book/styles-and-patterns/modular-monolith",
		"generation": 1,
		"base": "/",
		"headings": [
			{
				"depth": 2,
				"slug": "模块不是文件夹",
				"text": "模块，不是文件夹"
			},
			{
				"depth": 2,
				"slug": "c-的模块边界",
				"text": "C# 的模块边界"
			},
			{
				"depth": 2,
				"slug": "为什么它是默认选项",
				"text": "为什么它是默认选项"
			}
		]
	}
];
//#endregion
export { base, generation, records };
