---
name: acceptance-engineer
description: Write acceptance criteria calibrated for Codex's continuation.md audit protocol -- every criterion must be independently verifiable by file inspection or command output. Writes the explicit stop rule Codex must satisfy before calling update_goal with status=achieved. Use after /task-decomposer or when /interrogator-orchestrator routes here.
---

# Acceptance Engineer

Write acceptance criteria and a stop rule designed for Codex's internal audit protocol. Codex's `continuation.md` template requires a "prompt-to-artifact checklist" that maps every explicit requirement to evidence that can be inspected without ambiguity. Output goes to `docs/goal/ACCEPTANCE.md`.

## Why this matters

Codex's `continuation.md` mandates that before marking a goal `achieved`, the model must:

1. Restate the objective as concrete deliverables
2. Map every named file, command, test, and gate to physical evidence
3. **Treat uncertainty as not achieved**

Vague criteria ("the feature works", "tests pass") cause Codex to either over-report success or loop indefinitely. Every criterion must name a specific, inspectable artifact.

## Four acceptance dimensions -- score each 0-2

### 1. OBSERVABLE -- User-visible outcomes

For each user-facing behavior in `docs/goal/REQUIREMENTS.md`, write a criterion Codex can verify by running a command or reading a file.

Format: `<command>` returns `<expected output or exit code>`

Examples:
- `curl -s http://localhost:3000/api/health | jq '.status'` returns `"ok"`
- `cat output.json | jq '.items | length'` returns a value > 0

**Exit condition**: every user-facing behavior from REQUIREMENTS.md has a corresponding Observable criterion.

### 2. AUDITABLE -- Technical artifacts

For each task in `docs/goal/TASKS.md`, name the specific file, test, or output that proves the task is complete.

Examples:
- `src/auth/token_store.cpp` exists and compiles without warnings
- `ctest -R auth_token_tests` exits 0
- `git diff --name-only` contains exactly the expected files and no others

**Exit condition**: every task in TASKS.md has at least one Auditable criterion.

### 3. STOP-RULE -- Complete definition of done

Write a single, exhaustive list of conditions that must ALL be true before Codex calls `update_goal` with `status=achieved`. Nothing implied. No "and so on." If Codex cannot mechanically verify a condition, rewrite it until it can.

**Exit condition**: the stop rule is a numbered list; each item is a runnable command or a checkable file state.

### 4. REGRESSION -- What must not break

List the existing tests, commands, or behaviors that must still pass after the change.

**Exit condition**: the full test suite command is listed with its expected exit code; any other known regression checks are listed.

## Budget-awareness

Codex may exhaust its token budget before completing the goal. When that happens, `budget_limit.md` is injected and Codex summarizes progress. Write criteria so partial completion is unambiguous -- each task in TASKS.md should map to at least one Auditable criterion, so Codex can report "tasks 1-3 done, 4-6 remaining" precisely.

## Interview protocol

Read `docs/goal/REQUIREMENTS.md`, `docs/goal/DESIGN.md`, and `docs/goal/TASKS.md` before asking any question. For each task, propose a verification criterion and ask the user to confirm the exact command or artifact. If no test suite exists, note it explicitly and flag it as a risk.

## Exit condition

When all four dimensions score 0, write `docs/goal/ACCEPTANCE.md`.

## ACCEPTANCE.md template

```
## Observable Outcomes
- [ ] `<command>` returns `<expected output>`

## Technical Artifacts
- [ ] `<file or test>` exists / passes / contains X

## Stop Rule
Call update_goal with status=achieved only when ALL of the following are true:
1. `<verification command>` returns `<expected result>`
2. ...
N. `<full test suite command>` exits 0 with no new failures.

## Regression Criteria
- [ ] `<full test suite command>` exits 0
```
