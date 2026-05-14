# spec-freeze (v2)

## Purpose

把拷问轨迹（QUESTIONS / ANSWERS / ASSUMPTIONS）冻结成可被编程 agent 用 `@` 直接加载的三类 **umbrella** 文档，再补足 PRD / NON_GOALS / ACCEPTANCE / IMPACT 等支撑文件。

## Inputs

- 当前会话
- `docs/system/*`（如存在）
- `docs/goal/QUESTIONS.md`
- `docs/goal/ANSWERS.md`
- `docs/goal/ASSUMPTIONS.md`
- `docs/goal/UNKNOWN.md`（**BLOCKING 段必须已清零**）

## Outputs

### 三 umbrella（`@` 入口）

| 文件 | 来源模板 | 作用 |
|---|---|---|
| `docs/goal/REQUIREMENTS.md` | `templates/REQUIREMENTS.md` | 需求 umbrella，自包含 + 链接 PRD / NON_GOALS / ACCEPTANCE / ASSUMPTIONS |
| `docs/goal/DESIGN.md` | `templates/DESIGN.md` | 设计 umbrella，**必须含 Tech Stack 段**（版本 + 理由 + 淘汰候选）+ 链接 IMPACT |
| `docs/goal/TASKS.md` | `templates/TASKS.md` | 任务拆分 umbrella，每任务 13 项 TDD 头齐全 + 链接 PLAN / VERIFY |

### 支撑文件

- `docs/goal/PRD.md`（用 `templates/PRD.md`）
- `docs/goal/NON_GOALS.md`
- `docs/goal/ACCEPTANCE.md`
- `docs/goal/IMPACT.md`（详见 `03-impact-analysis.md`）
- `docs/goal/PLAN.md`（用 `templates/PLAN.md`）
- `docs/goal/DECISIONS.md`（确认决策 / 假设 / 拒绝的替代方案）

## Required Sections（umbrella）

### REQUIREMENTS.md

- Related Documents（交叉链接）
- Problem Statement
- Target Users / Actors
- In-Scope Use Cases
- Functional Requirements（FR-N，每条带验收信号）
- Non-Functional Requirements（NFR-N，数字化目标）
- Constraints
- Out of Scope / Non-Goals（摘要 + 链接到 NON_GOALS.md）
- Acceptance Criteria（摘要 + 链接到 ACCEPTANCE.md）
- Open Questions（BLOCKING 必须为空）

### DESIGN.md（**必须含**）

- Related Documents
- **Tech Stack 技术栈**（表格：维度 / 选型 / 版本约束 / 选型理由 / 淘汰候选）
- 技术栈约束
- Current System Context 或 Greenfield Assumptions
- Proposed Architecture
- Module Responsibilities
- Data Flow
- Public Interfaces / Contracts
- Data Model / Migration
- Error Handling / Observability
- Security / Privacy / Permissions
- Performance / Concurrency
- Rejected Alternatives（架构层）
- Do Not Touch
- Impact Summary（一句话 + 链接到 IMPACT.md）

### TASKS.md

- Related Documents
- TDD Contract（红 → 绿 → 重构 顺序，强制）
- Task Order
- 每个 `## Task N: ...` 块下含 13 项必填头：Goal / User-Visible Behavior / Scope / Files Likely Touched / RED Test / Expected Failure / GREEN Boundary / Refactor Allowance / Verification Command / Acceptance Criteria / Rollback Condition / Dependencies / Do Not Touch

### NON_GOALS.md

- Explicitly excluded features
- Implementation styles to avoid
- Files or modules that must not be changed
- Scope creep traps

### ACCEPTANCE.md

- User-visible acceptance criteria
- Technical acceptance criteria
- Regression criteria
- Manual verification checklist

### DECISIONS.md

- User-confirmed decisions
- Agent-made assumptions
- Rejected alternatives

## Rules

- 不写代码。
- 不藏歧义——非阻塞 → ASSUMPTIONS；阻塞 → 停下来问。
- `NON_GOALS.md` 与 `REQUIREMENTS.md` 同等强。
- 三 umbrella 必须**自包含**：agent 只看 umbrella 就能理解任务，但保留链接以便下钻细节。
- 章节锚点 / 文件名用英文（保证 `@` 稳定引用）；正文用中文 + 英文术语。
