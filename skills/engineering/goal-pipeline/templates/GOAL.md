# Goal Contract: <Feature Name>

## Objective

<Final outcome in one sentence.>

## How To Trigger Implementation

两种触发方式（任选其一）：

**Codex `/goal`**：把 `docs/goal/CODEX_START.md` 内容贴进 Codex 即可。

**Claude Code / 其它支持 `@` 的 agent**：把 `docs/goal/CLAUDE_CODE_START.md` 内容贴进对话即可——它会用 `@` 同时加载三 umbrella 文档。

## Source Of Truth

下游 agent 按以下顺序读。后面的文件细化但不覆盖前面的约束（除非显式标注）。

### Umbrella（`@` 入口，对外接口）

1. `docs/goal/REQUIREMENTS.md` — 需求 umbrella
2. `docs/goal/DESIGN.md` — 设计 umbrella（含 Tech Stack 段）
3. `docs/goal/TASKS.md` — 任务拆分 umbrella（每任务 13 项 TDD 头）

### 支撑文件（umbrella 内部交叉链接到这些）

4. `docs/goal/PRD.md`
5. `docs/goal/NON_GOALS.md`
6. `docs/goal/IMPACT.md`
7. `docs/goal/PLAN.md`
8. `docs/goal/ACCEPTANCE.md`
9. `docs/goal/VERIFY.md`（执行中由编程 agent 追加证据）
10. `docs/goal/ASSUMPTIONS.md` / `DECISIONS.md`（可选，决策与默认值轨迹）

## Execution Rules

- 按 `TASKS.md` 中 Task Order 顺序逐任务推进。
- 不要重新解释需求；冲突时停下来报告。
- 不许擅自扩 scope（违反 `NON_GOALS.md` 或任务 "Do Not Touch" 段 = 失败）。
- 技术栈和版本约束以 `DESIGN.md` 的 Tech Stack 段为准，不静默替换。
- 任何 BLOCKING 阻塞 → 立即停止 + 报告 + 提一个**最小**问题。

## TDD Rules

对每一个生产代码任务：

1. 先写任务里 "RED Test" 段指定的失败测试。
2. 跑 "Verification Command"，确认失败信号与 "Expected Failure" 描述一致（**指定的红**，不是任意红）。
3. 仅在 "GREEN Boundary" 范围内实现到刚好让测试通过。
4. 再跑验证，确认全绿。
5. 仅在绿后按 "Refactor Allowance" 清理；refactor 后必须再跑一次验证。
6. 把命令输出摘要追加到 `docs/goal/VERIFY.md`。

## Definition Of Done

- `TASKS.md` 中所有任务完成
- `ACCEPTANCE.md` 中所有验收标准通过
- lint / type-check / test 等验证命令全绿
- `git diff` 只含预期文件
- `VERIFY.md` 含完整证据
- 残留风险显式列出
