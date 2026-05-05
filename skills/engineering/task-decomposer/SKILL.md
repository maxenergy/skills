---
name: task-decomposer
description: Break a frozen design into ordered, independently-verifiable task slices, each with a single pass/fail verification command, rollback condition, and explicit dependencies. Use after /design-interrogator or when /interrogator-orchestrator routes here.
---

# Task Decomposer

Break the frozen requirements and design into a sequence of task slices. Each task must have exactly one verification command whose exit code determines pass/fail. Output goes to `docs/goal/TASKS.md`.

## What makes a good task

A task is well-formed when all of the following hold:

- **Bounded** -- completable in one coding session without blocking on other tasks
- **Verifiable** -- has exactly one command whose exit code is the success signal
- **Non-overlapping** -- does not modify the same module as a sibling task
- **Ordered** -- every dependency appears earlier in the list

## Five decomposition dimensions -- score each 0-2

### 1. ORDERING

Every task with a dependency appears after that dependency. No cycles.

**Exit condition**: a topological sort of the task list is possible and matches the written order.

### 2. SCOPE

No task requires touching more than three modules or making more than one architectural decision. If a task is too large, split it.

**Exit condition**: each task names at most three modules in its Scope field.

### 3. VERIFICATION

Every task has a concrete verification command: a test runner, lint check, type-check, curl request, or file diff command. "Review manually" is not a verification command.

**Exit condition**: every task has a Verification field with a command that can be run non-interactively.

### 4. ROLLBACK

Every task specifies how to revert it: which files to restore, or the exact git command.

**Exit condition**: every task has a Rollback field.

### 5. DEPENDENCIES

Every task lists which prior tasks it depends on. Tasks with no dependencies say so explicitly.

**Exit condition**: every task has a Dependencies field that is either "none" or names earlier tasks by number.

## Task template

Each entry in TASKS.md must use this structure:

```
### Task N: <name>

**Goal**: one sentence describing the end state
**Scope**: list of modules, interfaces, or files touched
**Constraints**: what must not change during this task
**Verification**: `<exact non-interactive command>`
**Rollback**: `git checkout -- <files>` or equivalent
**Dependencies**: Task N-x, Task N-y  (or "none")
**Do not touch**: explicit list of files or modules off-limits
```

## Interview protocol

Read `docs/goal/REQUIREMENTS.md` and `docs/goal/DESIGN.md` first. Propose an initial task list. For each task, ask the user to confirm scope and the verification command before locking it.

Do not invent verification commands. If the repo has no test runner, ask what the user would run to verify correctness. If the user says "I'll check manually," push back: autonomous agents cannot use manual verification -- propose the closest automatable alternative.

## Exit condition

When all five dimensions score 0 across all tasks, write `docs/goal/TASKS.md`.
