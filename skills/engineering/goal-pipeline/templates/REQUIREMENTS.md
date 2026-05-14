# Requirements 需求文档（umbrella）: <Feature Name>

> 这是对外 `@` 入口之一。下游编程 agent 用 `@docs/goal/REQUIREMENTS.md` 加载本文件，再按需打开下方链接。

## Related Documents

- 原始 PRD：[`PRD.md`](./PRD.md)
- 明确不做的：[`NON_GOALS.md`](./NON_GOALS.md)
- 验收标准：[`ACCEPTANCE.md`](./ACCEPTANCE.md)
- 非阻塞假设：[`ASSUMPTIONS.md`](./ASSUMPTIONS.md)
- 设计 & 技术栈：[`DESIGN.md`](./DESIGN.md)
- 任务拆分：[`TASKS.md`](./TASKS.md)

## Problem Statement 问题陈述

<一段话讲清楚：在用户视角，当前痛点是什么、为什么现在必须做。>

## Target Users / Actors 用户与角色

| 角色 | 动机 | 主要职责 | 受影响场景 |
|---|---|---|---|
| <actor> | <motivation> | <responsibility> | <scenario> |

## In-Scope Use Cases 范围内用例

1. **<UC-1 用例名>**: As a <actor>, I want <capability>, so that <benefit>.
   - 触发：<trigger>
   - 主路径：<happy path 步骤>
   - 失败路径：<failure path>

## Functional Requirements 功能需求

- **FR-1**: <Requirement>。验收信号：<观察点>。
- **FR-2**: …

## Non-Functional Requirements 非功能需求

- **NFR-1 性能**: <e.g. p95 接口延迟 < 200ms>
- **NFR-2 安全**: <auth / authz / 数据保护要求>
- **NFR-3 兼容性**: <backward-compatibility 要求>
- **NFR-4 可观测性**: <logs / metrics / tracing 要求>
- **NFR-5 可访问性 / i18n**（如适用）：<requirement>

## Constraints 约束

- 技术约束（详见 [`DESIGN.md`](./DESIGN.md) 的 Tech Stack 段）：<one-line summary>
- 业务约束：<deadline / 合规 / 团队规约>
- 必须保留的现有行为：<list>

## Out of Scope / Non-Goals 明确不做

> 详见 [`NON_GOALS.md`](./NON_GOALS.md)。这里只放最关键的几条。

- <NG-1>
- <NG-2>

## Acceptance Criteria 验收标准

> 详见 [`ACCEPTANCE.md`](./ACCEPTANCE.md)。每条 AC 必须可由测试或人工 checklist 验证。

- **AC-1**: Given <context>, when <action>, then <observable outcome>.
- **AC-2**: …

## Open Questions 待解问题

### Blocking 阻塞（必须为空才能进入实现阶段）

- <空 或 待问题>

### Non-Blocking 非阻塞（详见 [`ASSUMPTIONS.md`](./ASSUMPTIONS.md)）

- <question> → 暂取默认值：<assumption>，可由实现者推翻并回报。
