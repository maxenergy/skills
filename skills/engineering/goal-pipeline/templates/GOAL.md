# Goal Contract: <Feature Name>

## Objective

<Final outcome in one sentence.>

## Source Of Truth

Follow these files in order. Later files refine but do not override earlier constraints unless explicitly stated.

1. `docs/goal/PRD.md`
2. `docs/goal/REQUIREMENTS.md`
3. `docs/goal/NON_GOALS.md`
4. `docs/goal/DESIGN.md`
5. `docs/goal/IMPACT.md`
6. `docs/goal/PLAN.md`
7. `docs/goal/TASKS.md`
8. `docs/goal/ACCEPTANCE.md`
9. `docs/goal/VERIFY.md`

## Execution Rules

- Work task by task in `TASKS.md` order.
- Do not reinterpret requirements casually.
- Do not expand scope without explicit user approval.
- Do not change files listed under Do Not Touch.
- If requirements conflict, stop and report the conflict.
- If blocked, report the exact blocker, attempted commands, and the smallest question needed.

## TDD Rules

For every production-code task:

1. Write the RED test first.
2. Run the verification command and confirm the expected failure.
3. Implement only the GREEN boundary for the current task.
4. Run verification and confirm pass.
5. Refactor only after green.
6. Update `docs/goal/VERIFY.md` with command output summary and evidence.

## Definition Of Done

- All tasks in `TASKS.md` are complete.
- All acceptance criteria in `ACCEPTANCE.md` pass.
- Tests, lint, type checks, or project-specific verification commands pass.
- `git diff` contains only expected files.
- `docs/goal/VERIFY.md` is updated with evidence.
- Remaining risks are listed explicitly.
