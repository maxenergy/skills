# Design 设计文档（umbrella）: <Feature Name>

> 这是对外 `@` 入口之一。下游编程 agent 用 `@docs/goal/DESIGN.md` 加载本文件，并通过下方链接按需展开细节。

## Related Documents

- 需求：[`REQUIREMENTS.md`](./REQUIREMENTS.md)
- 影响面：[`IMPACT.md`](./IMPACT.md)
- 任务拆分：[`TASKS.md`](./TASKS.md)
- 系统架构（如存在）：[`../system/ARCHITECTURE.md`](../system/ARCHITECTURE.md)

## Tech Stack 技术栈

> **必填**。每一项写明版本约束 + 选型理由 + 被淘汰的候选 + 淘汰原因。改造现有项目时，先 inspect 仓库再填，**不要自由选型**。

| 维度 | 选型 | 版本约束 | 选型理由 | 淘汰候选 + 原因 |
|---|---|---|---|---|
| 语言 / Language | <e.g. TypeScript> | <e.g. ^5.4> | <reason> | <alt 1>: <why rejected>; <alt 2>: <why rejected> |
| 运行时 / Runtime | <e.g. Node.js> | <e.g. 20.x LTS> | <reason> | <alt>: <why> |
| 主框架 / Framework | <e.g. Next.js> | <e.g. 15.x> | <reason> | <alt>: <why> |
| 包管理器 / Package Manager | <e.g. pnpm> | <e.g. 9.x> | <reason> | <alt>: <why> |
| 测试框架 / Test Framework | <e.g. Vitest> | <e.g. ^1.6> | <reason> | <alt>: <why> |
| 静态检查 / Type Checker | <e.g. tsc strict> | <—> | <reason> | <alt>: <why> |
| Lint / Format | <e.g. ESLint + Prettier> | <—> | <reason> | <alt>: <why> |
| 数据库 / Datastore | <e.g. PostgreSQL> | <e.g. 16> | <reason> | <alt>: <why> |
| ORM / 数据访问 | <e.g. Drizzle> | <e.g. ^0.30> | <reason> | <alt>: <why> |
| 部署目标 / Deploy Target | <e.g. Vercel / Docker / 自建 K8s> | <—> | <reason> | <alt>: <why> |
| 关键运行依赖 / Key Deps | <e.g. zod, hono, …> | <—> | <reason> | <alt>: <why> |
| CI / CD | <e.g. GitHub Actions> | <—> | <reason> | <alt>: <why> |

### 技术栈约束 Constraints

- 必须遵守的既有规范（团队 lint config、依赖白名单、license 限制等）：<list>
- 不允许引入的依赖：<list>
- 升级窗口 / EOL 注意事项：<list>

## Current System Context

> 已有项目：实际架构和相关模块。新项目：写 "Greenfield — see Greenfield Assumptions"。

<Current architecture and relevant modules.>

### Greenfield Assumptions（仅新项目填写）

- 已知输入：<list>
- 已知输出 / SLA：<list>
- 已知未知（unknown but will need answer before 任务切片）：<list>

## Proposed Architecture

<High-level design.>

## Module Responsibilities

| Module | Responsibility | Public Interface | Notes |
|---|---|---|---|
| `<module>` | <responsibility> | <interface> | <notes> |

## Data Flow

1. <Input/source>
2. <Processing/module>
3. <Output/side effect>

## Public Interfaces / Contracts

- <API, CLI, UI, function, event, or schema contract>

## Data Model / Migration

- <Schema changes, migrations, backward compatibility>

## Error Handling / Observability

- <Error classes, user messages, logs, metrics>

## Security / Privacy / Permissions

- <Auth, authorization, privacy, secrets, compliance>

## Performance / Concurrency

- <Latency, throughput, locking, races, limits>

## Rejected Alternatives

> 架构层面被否决的方案（技术栈层面的另见上方 Tech Stack 表）。

- <Alternative>: rejected because <reason>.

## Do Not Touch

- <Files, modules, or behavior that must remain unchanged>

## Impact Summary

> 详见 [`IMPACT.md`](./IMPACT.md)。这里只放一句话总览。

- <one-line impact summary>
