# Goal Contract

Use this file as the execution contract for Codex `/goal`.

## Objective

Describe the final outcome in one sentence.

## Source of Truth

Codex must follow these files in order:

1. `docs/goal/REQUIREMENTS.md`
2. `docs/goal/DESIGN.md`
3. `docs/goal/IMPACT.md`
4. `docs/goal/TASKS.md`
5. `docs/goal/ACCEPTANCE.md`
6. `docs/goal/VERIFY.md`

## Execution Rules

- Work task by task.
- Do not reinterpret requirements casually.
- Do not expand scope without explicit user approval.
- Do not mark complete until every acceptance criterion passes.
- If requirements conflict, stop and report the conflict.
- If blocked, report the exact blocker, attempted commands, and the smallest question needed to proceed.

## Definition of Done

- All tasks in `TASKS.md` are complete.
- Tests, lint, type checks, or project-specific verification commands pass.
- `git diff` contains only expected files.
- `VERIFY.md` is updated with evidence.
- Remaining risks are listed explicitly.
