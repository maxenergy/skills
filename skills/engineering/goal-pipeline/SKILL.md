---
name: goal-pipeline
description: 向导模式 — 从一句话需求开始拷问到底，敲定 需求 / 设计（含技术栈） / 任务拆分 三类 umbrella 文档，让 Codex /goal 或 Claude Code @ 加载即可按 TDD 自动开发。Use when the user wants PRD/design/plan refined, wants Codex /goal-ready packs, or wants a spec-first TDD wizard. 拷问用中文，技术术语保留英文，文件名保持英文以稳定 @ 引用。
---

# Goal Pipeline / 规格向导（spec-wizard）

## Mission

把一句话的想法、bug 或粗糙需求，**拷问**成一份能让编程 agent（Codex `/goal`、Claude Code `@`、其它支持文件引用的 agent）按 **TDD red-green-refactor** 自动跑完的实现包。

**You do NOT write production code while using this skill.** 你的工作是：审仓库、提问、记录、冻结、切片、校验、移交。

最终用户只需 `@` 三类 umbrella 文档即可触发自动开发：

- `docs/goal/REQUIREMENTS.md` — **需求** umbrella（链接 PRD / NON_GOALS / ACCEPTANCE / ASSUMPTIONS）
- `docs/goal/DESIGN.md` — **设计** umbrella，含技术栈选型（链接 IMPACT）
- `docs/goal/TASKS.md` — **任务拆分** umbrella，每任务带 TDD 契约（链接 PLAN / VERIFY）

入口斜杠命令：`/spec-wizard <一句话>`（见 `commands/spec-wizard.md`），也可由用户主动调用本 skill。

## When To Use

Use this skill when the user wants PRD, design, or plan docs refined before coding; wants Codex `/goal` or Claude Code `@` 三文档去自动实现; asks for spec-first or TDD; has a fuzzy idea that needs adversarial questioning; or wants a guide through all planning documents.

Do not use this skill for small one-line edits, pure refactors with no product ambiguity, or code execution after the goal pack is frozen. 出包之后切换到 Codex `/goal` 或 `CLAUDE_CODE_START.md` 里的 prompt 触发自动开发。

## Non-Negotiable Rules

1. **一次只问一个问题**。每个问题都要附上你推荐的答案 + 一句话理由（这样用户可以直接 "y" 或反驳，不必从零思考）。
2. **能从仓库里推断出的事实绝不问用户**。先 Read / Grep / Glob，再问。
3. **不要写生产代码**。本 skill 全程只产文档；编码由出包之后的 Codex / Claude Code 完成。
4. **不许藏歧义**。非阻塞的不确定项写进 `ASSUMPTIONS.md`；阻塞项立刻停下来问。
5. `NON_GOALS.md` 和 Do-Not-Touch 与 requirements **同等强**，违反任何一条等同于失败。
6. **每个实现任务都必须是 vertical slice 的 RED → GREEN → REFACTOR**。横向切片（"加 model"、"加 API"、"加 UI"）一律拒绝。
7. 每个生产代码任务必须给出：要先写的失败测试、预期的失败信号、最小通过实现的边界、验证命令。
8. `/goal` 入口必须保持很小，引用文档而不内联文档。
9. **三类 umbrella 文档（REQUIREMENTS / DESIGN / TASKS）是对外 @ 接口**，必须自包含且交叉链接到细节文件——它们决定下游 agent 看到什么。
10. **语言纪律**：grilling 用中文 + 英文术语（API、TDD、red-green-refactor、idempotent、CI、SLA、p95 等保留英文），章节标题/文件名/锚点用英文以保证 `@` 引用稳定。

## Required Output Tree

Create or update these files in the target project. `★` 标记的是对外 @ umbrella；其余是细节支撑文件，由 umbrella 链接引用。

```text
docs/system/
  ARCHITECTURE.md
  MODULE_MAP.md
  DATA_FLOW.md
  RISK_AREAS.md

docs/goal/
  QUESTIONS.md        # 拷问轨迹
  ANSWERS.md          # 用户已拍板的答案
  ASSUMPTIONS.md      # 非阻塞假设（默认值，可被推翻）
  UNKNOWN.md          # 阻塞未知（必须在冻结前清零）
  PRD.md              # 产品需求原始稿
  REQUIREMENTS.md  ★  # 需求 umbrella（@ 入口）
  NON_GOALS.md        # 明确排除项
  ACCEPTANCE.md       # 验收标准
  DESIGN.md        ★  # 设计 umbrella，含技术栈（@ 入口）
  IMPACT.md           # 影响面分析
  PLAN.md             # 切片策略 + 验证策略
  TASKS.md         ★  # 任务拆分 umbrella，每任务带 TDD 契约（@ 入口）
  VERIFY.md           # 执行后追加的验证证据
  GOAL.md             # Codex /goal 的小入口
  CODEX_START.md      # Codex 触发模板
  CLAUDE_CODE_START.md# Claude Code @ 触发模板
  FINAL_REVIEW.md     # 完成后的对抗式复盘
```

新项目无代码时，把 `docs/system/*` 写成"已知架构假设"，未知区域用 `<unknown>` 显式标注；已有项目先 inspect 再写。

## Workflow

### 0. Understand The System

Read existing docs, agent instructions, package manifests, tests, entrypoints, and similar features. Produce `docs/system/ARCHITECTURE.md`, `MODULE_MAP.md`, `DATA_FLOW.md`, and `RISK_AREAS.md`.

Use [00-understand-system.md](references/00-understand-system.md).

### 1. Grill Requirements / 需求拷问

死磕用户，**一次一个问题**。每个问题都附上你的推荐答案和一句话理由——用户可以一字 "y" 就敲定，也可以反驳。直到实现方向毫无歧义为止。

Write `QUESTIONS.md`, `ANSWERS.md`, `ASSUMPTIONS.md`, and `UNKNOWN.md`. **任何 BLOCKING 未知都会停掉流程**——不要先冻结再补。

详见 [01-grill-requirements.md](references/01-grill-requirements.md) 和 [10-spec-wizard.md](references/10-spec-wizard.md)。

最小问题库（中文为主，按场景增删）：

**目标维度**
- 真正要解决的问题是什么？什么样的用户可见结果能证明它被解决了？
- 明确**不做**的是什么（写进 NON_GOALS）？
- 受影响的用户、actor、上下游系统、维护者各是谁？

**场景维度**
- 第一个端到端成功路径（happy path）长什么样？
- 失败对用户、对系统分别长什么样？哪些失败可恢复，哪些是 terminal？
- 哪些路径是 backward-compatible 的硬约束？

**风险维度**
- 哪条假设一旦错了，整个设计就崩？
- 哪条需求一旦理解错，实现就完全没用？
- 有哪些**绝对不能动**的文件 / 模块 / 行为？

**技术栈维度**（必拷问，写入 DESIGN.md 的 Tech Stack 段）
- 是新项目还是改造现有项目？已有项目走 inspect 流程，不要自由选型。
- 语言 / 运行时 / 主框架 / 包管理器 / 测试框架 / 静态检查 / 数据库 / 部署目标——每个都问明确的版本约束。
- 选型理由是什么？被淘汰的候选有哪些，为何淘汰？
- 是否要遵守某团队/公司既有规范（lint config、CI workflow、依赖白名单等）？

### 2. Freeze The Requirements / 冻结需求 umbrella

依次产出：

1. `PRD.md`（原始稿，用 [templates/PRD.md](templates/PRD.md)）
2. `NON_GOALS.md` 和 `ACCEPTANCE.md`（明确排除项 + 可验证的验收标准）
3. **★ umbrella `REQUIREMENTS.md`**（用 [templates/REQUIREMENTS.md](templates/REQUIREMENTS.md)）— 这是对外 `@` 入口，必须自包含足以让 agent 直接开工的信息，并交叉链接 PRD / NON_GOALS / ACCEPTANCE / ASSUMPTIONS。

详见 [02-spec-freeze.md](references/02-spec-freeze.md)。

### 3. Freeze The Design / 冻结设计 umbrella（含技术栈）

产出 **★ umbrella `DESIGN.md`**（用 [templates/DESIGN.md](templates/DESIGN.md)），必须包含：

- **Tech Stack 技术栈**（新增、必填段）：语言 / 运行时 / 主框架 / 包管理器 / 测试框架 / 静态检查 / 格式化 / 数据库 / 部署目标 / 关键依赖；每项给版本约束 + 选型理由 + 被淘汰候选。
- Current System Context（已有项目）或 Greenfield Assumptions（新项目）
- Proposed Architecture / Module Responsibilities / Data Flow
- Public Interfaces / Contracts
- Data Model / Migration
- Error Handling / Observability
- Security / Privacy / Permissions
- Performance / Concurrency
- Rejected Alternatives
- Do Not Touch
- 链接到 `IMPACT.md` 的影响面段

设计拷问 prompt：

- 现在这块责任由哪个 module 负责？继续放它合适吗？
- 这是否要做成 deep module（小接口 + 多逻辑）？接口签名是什么？
- 状态住在哪里？允许谁修改？
- 哪些失败可恢复，哪些必须 terminal？
- 哪些选择**未来最难逆转**（数据库选型、URL schema、对外契约）？
- 测试能否只通过 public interface 验证行为？
- **技术栈选型理由**能否经受 6 个月后的质疑？被淘汰的候选有哪些？

### 4. Analyze Impact

Create `docs/goal/IMPACT.md` using [03-impact-analysis.md](references/03-impact-analysis.md). Be conservative. Include affected modules, public interfaces, data, tests, risks, rollback, and unknown impact areas.

### 5. Slice The TDD Plan

Create `docs/goal/PLAN.md` from [PLAN.md](templates/PLAN.md) and `docs/goal/TASKS.md` from [TASKS.md](templates/TASKS.md). Tasks must be ordered vertical slices, not horizontal layers.

Each task must include exactly these headings:

- Goal
- User-Visible Behavior
- Scope
- Files Likely Touched
- RED Test
- Expected Failure
- GREEN Boundary
- Refactor Allowance
- Verification Command
- Acceptance Criteria
- Rollback Condition
- Dependencies
- Do Not Touch

Use [04-task-slice.md](references/04-task-slice.md) and [06-tdd-contract.md](references/06-tdd-contract.md).

Reject any task that says only "add model", "add API", "add UI", or "write tests" unless it is framed as a complete behavior slice with its own verification.

### 6. Generate The Goal Pack / 出包

Create:
- `docs/goal/GOAL.md` from [GOAL.md](templates/GOAL.md)
- `docs/goal/CODEX_START.md` from [CODEX_START.md](templates/CODEX_START.md)
- `docs/goal/CLAUDE_CODE_START.md` from [CLAUDE_CODE_START.md](templates/CLAUDE_CODE_START.md)

Codex `/goal` 入口必须保持极小：

```text
/goal Read docs/goal/GOAL.md and execute it exactly.
```

Claude Code（或任意支持 @ 文件引用的 agent）入口模板：

```text
请按 TDD 模式实现 @docs/goal/REQUIREMENTS.md @docs/goal/DESIGN.md @docs/goal/TASKS.md 中描述的所有任务。
逐任务执行：先写 RED 测试并跑出预期失败，再写最小 GREEN 实现，验证通过后允许 refactor，
验证证据追加到 docs/goal/VERIFY.md。遇到需求冲突或 BLOCKING 未知立刻停下来报告。
```

Use [05-goal-pack.md](references/05-goal-pack.md).

### 7. Validate Before Handoff

If this skill's scripts are installed in the repo, run:

```bash
node path/to/goal-pipeline/scripts/validate-goal-pack.mjs
```

Otherwise manually verify required files, blocking unknowns, task TDD headings, `GOAL.md` source references, and `CODEX_START.md` `/goal` command.

### 8. Execute With Codex

Preferred manual handoff:

1. Open `docs/goal/CODEX_START.md`.
2. Paste it into Codex.
3. Keep the same Codex thread for the full goal.
4. After each task, verify and feed failures back into the same thread.

Worker handoff, if available:

```bash
VERIFY_COMMAND="<project verification command>" node agent/worker/run-goal.js
```

Use [07-codex-controller.md](references/07-codex-controller.md) and [08-verify-loop.md](references/08-verify-loop.md).

### 9. Final Review

After Codex claims completion, create or update `docs/goal/FINAL_REVIEW.md`. Be adversarial. Assume Codex is wrong until evidence proves otherwise. Use [09-goal-review.md](references/09-goal-review.md).

## Completion Checklist

- [ ] System docs created or updated
- [ ] Requirements grilled and blocking unknowns resolved（`UNKNOWN.md` BLOCKING 段为空或 `none`）
- [ ] PRD, NON_GOALS, ACCEPTANCE frozen
- [ ] **★ REQUIREMENTS.md umbrella** 自包含且交叉链接 PRD / NON_GOALS / ACCEPTANCE / ASSUMPTIONS
- [ ] **★ DESIGN.md umbrella** 含 Tech Stack 段（每项版本 + 理由 + 淘汰候选）和 IMPACT 链接
- [ ] IMPACT.md frozen
- [ ] Plan + **★ TASKS.md umbrella** 切片为 vertical slice，**每任务都含 13 项 TDD 头**（Goal / User-Visible Behavior / Scope / Files Likely Touched / RED Test / Expected Failure / GREEN Boundary / Refactor Allowance / Verification Command / Acceptance Criteria / Rollback Condition / Dependencies / Do Not Touch）
- [ ] GOAL.md + CODEX_START.md + CLAUDE_CODE_START.md 生成
- [ ] `node scripts/validate-goal-pack.mjs` 通过
- [ ] 用户拿到了两条触发命令：`/goal …` 和 `@docs/goal/REQUIREMENTS.md @DESIGN.md @TASKS.md …`
