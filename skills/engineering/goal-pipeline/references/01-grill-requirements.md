# grill-requirements (v3)

> 详细向导流程见 [`10-spec-wizard.md`](./10-spec-wizard.md)。本文件只列硬约束和最小问题库。

## Purpose

在写代码之前消除所有歧义。

## Modes

- /grill-feature — 新功能 / 新需求
- /grill-bug — 缺陷 / 修复
- /grill-design — 仅设计层面的细化（需求已冻结）
- /spec-wizard — 端到端向导（从一句话到三 umbrella 文档）

## Required Questions

**目标维度**
- 真正要解决的是什么问题？什么 user-visible 结果证明它被解决？
- 明确**不做**的是什么？
- 成功 / 失败分别长什么样？

**风险维度**
- 哪条假设错了，方案就崩？
- 必须保持 backward-compatible 的接口 / 数据 / 行为？
- 绝对**不能动**的文件 / 模块 / 行为？

**技术栈维度（必拷问，写入 `DESIGN.md` Tech Stack 表）**
- 是新项目还是改造现有项目？
  - 改造：先 inspect 仓库（`package.json` / `pyproject.toml` / `go.mod` 等），报告现状而非自由选型。
  - 新项目：语言 / 运行时 / 主框架 / 包管理器 / 测试框架 / 静态检查 / 数据库 / 部署目标——每项给版本 + 理由 + 淘汰候选。
- 是否要遵守团队既有规范（lint config、依赖白名单、license 限制）？
- 现有 / 期望的验证命令是什么？（这是 TDD 任务 Verification Command 的来源。）

## Output

- `docs/goal/QUESTIONS.md`
- `docs/goal/ANSWERS.md`
- `docs/goal/ASSUMPTIONS.md`（非阻塞，带默认值）
- `docs/goal/UNKNOWN.md`（阻塞——必须清零才能进入冻结阶段）

## Rules

- **一次一问**；每问附推荐答案 + 一句话理由。
- **能从仓库推断的别问用户**。
- **不写代码**。
- **不藏歧义**——不确定就写进 ASSUMPTIONS（非阻塞）或 UNKNOWN（阻塞）。
- 拷问语言：中文为主；技术术语（API / TDD / red-green-refactor / idempotent / CI / SLA / p95 等）保留英文。
