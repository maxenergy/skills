---
name: spec-wizard
description: 向导模式：从一句话开始拷问到底，敲定 需求 / 设计（含技术栈） / 任务拆分 三类文档，让 Codex 或 Claude Code 用 @ 加载即可按 TDD 模式自动开发。
argument-hint: <一句话描述你想构建的东西>
---

# /spec-wizard — 规格向导（拷问 → 三文档 → TDD 自动开发）

You are running the **spec-wizard**. Load the full procedure from the `goal-pipeline` skill:

> Read `skills/engineering/goal-pipeline/SKILL.md` and follow it as the authoritative procedure.

The user typed:

```
/spec-wizard $ARGUMENTS
```

The text after `/spec-wizard` is the **one-sentence seed**. Treat `$ARGUMENTS` as the initial idea, bug report, or feature request, then enter the wizard flow.

## 强制约束（不要违反）

1. **不要写生产代码**。这个命令只产出文档；编码交给 Codex `/goal` 或 Claude Code `@` 三文档之后自动跑。
2. **一次只问一个问题**。grilling 阶段每次只抛出一个最小的、可拍板的问题，并附上你的推荐答案 + 理由。
3. **能从仓库里查到的事实就别问用户**。先用 Read / Grep / Glob 翻代码，再问用户。
4. **三类 umbrella 文档**最终必须落盘到 `docs/goal/` 下：
   - `docs/goal/REQUIREMENTS.md` — 需求文档（含问题陈述、用户故事、功能/非功能需求、验收标准、Non-Goals）
   - `docs/goal/DESIGN.md` — 设计文档（含技术栈选型 + 理由 + 拒绝的替代方案、架构、模块责任、数据流、错误处理、影响面）
   - `docs/goal/TASKS.md` — 任务拆分文档（含每个 vertical slice 的 RED/GREEN/REFACTOR 契约、验证命令、回滚条件）
5. **TDD 是硬约束**。每个产出任务必须包含 RED Test / Expected Failure / GREEN Boundary / Refactor Allowance / Verification Command，以便编程 agent 自动执行 red-green-refactor 循环。
6. **blocking unknown 不允许压住**。无法立即决定的非阻塞项写入 `docs/goal/ASSUMPTIONS.md`；阻塞项必须当场停下来问用户。
7. **语言**：拷问问题、文档主体用中文；技术术语（API、TDD、red-green-refactor、CI、SLA、idempotent 等）保留英文；文件名和章节锚点保持英文以便 `@` 引用稳定。

## 输出后用法

当三文档冻结、`docs/goal/GOAL.md` 生成、`scripts/validate-goal-pack.mjs` 通过后，告诉用户两种自动开发触发方式：

**Codex：**
```
/goal Read docs/goal/GOAL.md and execute it exactly.
```

**Claude Code（或任意支持 @ 文件引用的 agent）：**
```
请根据 @docs/goal/REQUIREMENTS.md @docs/goal/DESIGN.md @docs/goal/TASKS.md 按 TDD 模式逐任务实现，
对每个任务先写 RED 测试并跑出预期失败，再实现最小 GREEN，再 refactor，最后把验证证据追加到 docs/goal/VERIFY.md。
```

## 阶段映射（详见 goal-pipeline/SKILL.md）

| 阶段 | 产物 | reference |
|---|---|---|
| 0. 看仓库 | `docs/system/{ARCHITECTURE,MODULE_MAP,DATA_FLOW,RISK_AREAS}.md` | `references/00-understand-system.md` |
| 1. 拷问需求 | `QUESTIONS / ANSWERS / ASSUMPTIONS / UNKNOWN.md` | `references/01-grill-requirements.md`, `references/10-spec-wizard.md` |
| 2. 冻结需求 | `PRD.md` + **umbrella `REQUIREMENTS.md`** + `NON_GOALS.md` + `ACCEPTANCE.md` | `references/02-spec-freeze.md` |
| 3. 冻结设计 | **umbrella `DESIGN.md`**（含技术栈段） | `references/02-spec-freeze.md` + DESIGN 模板 |
| 4. 影响面 | `IMPACT.md` | `references/03-impact-analysis.md` |
| 5. TDD 切片 | `PLAN.md` + **umbrella `TASKS.md`** | `references/04-task-slice.md`, `references/06-tdd-contract.md` |
| 6. 出包 | `GOAL.md` + `CODEX_START.md` + `CLAUDE_CODE_START.md` | `references/05-goal-pack.md` |
| 7. 校验 | `node scripts/validate-goal-pack.mjs` | — |

进入向导。第一步：用 `$ARGUMENTS` 起锚，先决定这是新项目还是改造现有项目，然后开始 grilling。
