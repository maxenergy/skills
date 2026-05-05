# v2.5 Autonomous Codex Worker

This worker is the execution body for the v2 goal-driven skills pipeline.

It assumes the repository already contains a prepared goal package:

- `docs/goal/GOAL.md`
- `docs/goal/TASKS.md`
- `docs/goal/ACCEPTANCE.md`
- `docs/goal/VERIFY.md`

## Current Scope

This is a minimal, dependency-free worker skeleton. It provides:

- task parsing from `docs/goal/TASKS.md`
- state tracking in `.agent/worker-state.json`
- per-task verification command execution
- Codex app-server integration boundary
- retry loop structure

## Run

```bash
node agent/worker/run-goal.js
```

## Environment

Optional:

```bash
VERIFY_COMMAND="npm test" node agent/worker/run-goal.js
CODEX_COMMAND="codex app-server --listen stdio://" node agent/worker/run-goal.js
MAX_RETRIES=3 node agent/worker/run-goal.js
```

## Design Principle

The worker must not invent requirements. It only executes the frozen goal package produced by the v2 skills pipeline.
