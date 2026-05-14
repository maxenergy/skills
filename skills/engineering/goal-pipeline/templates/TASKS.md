# Tasks 任务拆分（umbrella）: <Feature Name>

> 这是对外 `@` 入口之一。下游编程 agent 用 `@docs/goal/TASKS.md` 加载本文件，按 **TDD red → green → refactor** 顺序逐任务推进。

## Related Documents

- 实施策略：[`PLAN.md`](./PLAN.md)
- 验证证据（执行中由编程 agent 追加）：[`VERIFY.md`](./VERIFY.md)
- 需求：[`REQUIREMENTS.md`](./REQUIREMENTS.md)
- 设计 & 技术栈：[`DESIGN.md`](./DESIGN.md)
- 影响面：[`IMPACT.md`](./IMPACT.md)
- 验收标准：[`ACCEPTANCE.md`](./ACCEPTANCE.md)

## TDD Contract（对所有任务强制）

每一个生产代码任务都按以下顺序执行——不允许跳步：

1. 写下 **RED Test**（覆盖本任务的 user-visible behavior）。
2. 跑 **Verification Command**，确认得到 **Expected Failure**（不是任意失败，是指定失败信号）。
3. 写最小化的 **GREEN** 实现，仅恰好让该测试通过。
4. 跑 **Verification Command**，确认全绿。
5. 仅在绿后执行 **Refactor Allowance** 列出的清理；refactor 后必须再跑一次验证。
6. 把命令输出 + 证据摘要追加到 [`VERIFY.md`](./VERIFY.md)。
7. 验收 **Acceptance Criteria** 全部满足才能进入下一任务。

## Task Order 任务顺序

1. <Task 1 一句话总结>
2. <Task 2 一句话总结>
3. …

> 顺序原则：vertical slice 优先，依赖在前，可独立验证。横向切片（"加 model"/"加 API"/"加 UI"/"只写测试"）一律禁止。

---

## Task 1: <Vertical Slice Name>

### Goal

<What this task accomplishes — 一句话。>

### User-Visible Behavior

<本切片完成后，用户/调用方能观察到的行为。>

### Scope

- 包含：<list>
- 不含：<list>

### Files Likely Touched

- `<path>`
- `<path>`

### RED Test

<要先写的失败测试。给出测试文件路径 + 测试名 + 关键断言。>

### Expected Failure

<该测试在 GREEN 前必须失败的具体信号——错误消息、断言失败行、stack frame 关键字。仅"红"不行，必须是**指定的红**。>

### GREEN Boundary

<允许写的最小实现的边界。明确"只动这些文件、只加这些函数、不要做其它清理"。>

### Refactor Allowance

<绿后允许做的清理：抽函数、改命名、消重复。明确禁止的：跨切片重构、改 public interface。>

### Verification Command

```bash
<command>
```

### Acceptance Criteria

- <Criterion 1，可由测试或可观测信号验证>
- <Criterion 2>

### Rollback Condition

<什么情况下回滚？怎么回滚？touch 哪些文件？>

### Dependencies

- <Prior task 编号 / 外部依赖>

### Do Not Touch

- <Files / modules / behavior 必须不动>

---

## Task 2: <Vertical Slice Name>

<同上结构。>
