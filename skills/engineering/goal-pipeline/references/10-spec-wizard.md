# spec-wizard 向导流（v1）

> 本 reference 是 `/spec-wizard <一句话>` 的实际执行剧本，配合 `01-grill-requirements.md` 使用。
> 拷问用中文，技术术语保留英文。文件名 / 章节锚点保持英文以稳定 `@` 引用。

## Purpose

接到一句话需求后，把它拷问成可让编程 agent 用 `@` 加载即可按 TDD 自动开发的三类 umbrella 文档：

- `docs/goal/REQUIREMENTS.md`
- `docs/goal/DESIGN.md`
- `docs/goal/TASKS.md`

## 触发上下文

- 用户输入：`/spec-wizard <一句话>` 或主动调用 `goal-pipeline` skill。
- `$ARGUMENTS` 或对话首条消息中那一句话就是 **seed idea**。

## Step 0 · 起锚（30 秒内完成）

不问用户，先自答这三问，写进 `docs/goal/QUESTIONS.md` 的 "Anchor" 段：

1. **新项目 还是 改造现有项目？**（查仓库根有无 package.json / pyproject.toml / Cargo.toml 等）
2. **本仓库有无 `docs/system/*`？** 若有，先读；若无，跳到 Step 1（grilling 完之后再补 system docs）。
3. **本仓库有无 `CLAUDE.md` / `AGENTS.md` / `CONTEXT.md`？** 有就把 ubiquitous language / 团队约束抽出来。

## Step 1 · 拷问需求（一次一问）

按下方维度顺序问，**每次只发一个问题**，附上推荐答案 + 一句话理由。把问题写入 `QUESTIONS.md`，答案写入 `ANSWERS.md`。

### 1.1 目标（Why）

- Q1: 真正要解决的用户问题是什么？什么"用户可见结果"能证明问题被解决？
- Q2: 这事**不做**会怎样？严重到哪种程度？（验证是否值得做）
- Q3: 明确**不做**的范围是什么？

### 1.2 用户（Who）

- Q4: 主要 actor 是谁？次要 actor / 上下游系统 / 维护者？

### 1.3 场景（What）

- Q5: 第一个端到端 happy path 长什么样？（一步步描述）
- Q6: 主要失败路径有哪些？每条对用户和系统分别什么观感？
- Q7: 性能 / 延迟 / 并发 / 可用性目标？写明数字（p95、QPS、RTO/RPO 等）。

### 1.4 风险（What If）

- Q8: 哪条假设错了，整个方案就崩？
- Q9: 必须保持 backward-compatible 的接口 / 数据 / 行为？
- Q10: 绝对**不能动**的文件 / 模块 / 行为是什么？

### 1.5 技术栈（How — 必拷问）

> 新项目和改造项目走不同分支。

#### 改造现有项目

- T1: 用 Glob / Read 看 `package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、`Gemfile`、`pom.xml`、`build.gradle` 等。直接报告现状，不让用户自由选型。
- T2: 现有测试框架 + 验证命令是什么？（拷问目标：找到 `npm test` / `pytest` / `go test ./...` / `cargo test` 等）
- T3: 现有 CI workflow 在哪？

#### 新项目

- T4: 语言 / 运行时 / 主框架？给出推荐 + 2 个被淘汰候选 + 淘汰原因。
- T5: 包管理器 / 测试框架 / 静态检查工具？
- T6: 数据库 / ORM / 部署目标？
- T7: 是否要遵守团队既有规范（lint config / 依赖白名单 / license 限制）？
- T8: CI 用什么？

把每项写入 `DESIGN.md` 的 Tech Stack 表格，**每行都要有版本约束 + 选型理由 + 淘汰候选**。

### 1.6 不变量与 Do-Not-Touch

- Q11: 当前哪些代码已经被多处依赖、改了会爆？（用 Grep 求引用数自答）
- Q12: 有哪些"看起来该重构但本次禁止动"的地方？写入 `NON_GOALS.md` 和 DESIGN 的 Do Not Touch。

## Step 2 · 阻塞清零

写完拷问轨迹后检查：

- `UNKNOWN.md` 中 BLOCKING 段必须为空或 "none"——否则停下来问。
- 非阻塞不确定项落到 `ASSUMPTIONS.md`，每条带"暂取的默认值"。

## Step 3 · 冻结三 umbrella

按顺序生成（详见 `02-spec-freeze.md`）：

1. `PRD.md` → `NON_GOALS.md` → `ACCEPTANCE.md` → **★ umbrella `REQUIREMENTS.md`**（用 `templates/REQUIREMENTS.md`）
2. `IMPACT.md` → **★ umbrella `DESIGN.md`**（用 `templates/DESIGN.md`，**必须有 Tech Stack 段**）
3. `PLAN.md` → **★ umbrella `TASKS.md`**（用 `templates/TASKS.md`，每任务 13 项 TDD 头齐全）

## Step 4 · 出包

- `GOAL.md`（小入口）
- `CODEX_START.md`（`/goal …` 一行命令）
- `CLAUDE_CODE_START.md`（`@` 三 umbrella 的 prompt）

## Step 5 · 校验

```bash
node skills/engineering/goal-pipeline/scripts/validate-goal-pack.mjs
```

或在 target 项目中：

```bash
node path/to/skills/engineering/goal-pipeline/scripts/validate-goal-pack.mjs
```

未通过不交付。

## Step 6 · 移交两条命令

把这两条命令完整贴给用户：

```text
# Codex
/goal Read docs/goal/GOAL.md and execute it exactly.
```

```text
# Claude Code / 其它支持 @ 的 agent
请按 TDD 模式实现 @docs/goal/REQUIREMENTS.md @docs/goal/DESIGN.md @docs/goal/TASKS.md 中描述的所有任务。
逐任务执行：先写 RED 测试并跑出预期失败 → 写最小 GREEN 实现 → 验证通过后允许 refactor → 把证据追加到 docs/goal/VERIFY.md。
遇到需求冲突或 BLOCKING 未知立刻停下来报告，不要自由发挥。
```

## Rules（强制）

- 一次一问；每问带推荐答案 + 理由。
- 能用 Read / Grep / Glob 自答的不问用户。
- 任何阶段都不写生产代码。
- 三 umbrella 的章节锚点保持英文，文件名保持英文，便于 `@` 稳定引用。
- 拷问语言：中文为主；API / TDD / red-green-refactor / idempotent / CI / SLA / p95 等术语保留英文。
