---
name: interrogator-orchestrator
description: Entry point for the full Socratic pipeline that converts a rough idea into a Codex /goal-ready objective. Routes through requirements -> design -> tasks -> acceptance -> goal in sequence, advancing only when ambiguity score reaches zero. Use when you want to turn a fuzzy idea into a ready-to-execute Codex /goal with no hand-waving.
---

# Interrogator Orchestrator

This is the single entry point for the five-stage Socratic pipeline. Invoke it once per feature or bug-fix cycle. It routes through each stage in sequence and does not advance until that stage's ambiguity score is zero across all dimensions.

## When to use

- You have a rough idea and want to turn it into a Codex `/goal`-ready objective
- You want to avoid the most common agent failure mode: misalignment between what you want and what the agent builds
- You're about to send a long autonomous run to Codex or another AFK agent

If you already have frozen requirements and design and only need a goal text, run `/goal-compiler` directly.

## Session state

All output accumulates in `docs/goal/` in the working repo:

| File | Written by |
|------|------------|
| `docs/goal/SESSION.md` | This skill -- current stage, ambiguity scores, locked decisions |
| `docs/goal/REQUIREMENTS.md` | `/requirements-interrogator` |
| `docs/goal/DESIGN.md` | `/design-interrogator` |
| `docs/goal/TASKS.md` | `/task-decomposer` |
| `docs/goal/ACCEPTANCE.md` | `/acceptance-engineer` |
| `docs/goal/GOAL.md` | `/goal-compiler` |

At startup, read `docs/goal/SESSION.md` if it exists and resume from the last incomplete stage. If no session exists, start from stage 1.

## Ambiguity scoring

Every stage dimension is scored 0-2:

- **0** -- concrete and verifiable: no wiggle room, an agent could prove this is met
- **1** -- understood but one open question remains
- **2** -- vague, assumed, or contradictory

Do not advance from a stage until every dimension scores 0. Do not ask a question you can answer by reading the codebase.

## Stage sequence

| Stage | Skill | Dimensions |
|-------|-------|------------|
| 1 | `/requirements-interrogator` | WHO, WHAT, WHY, NOT-WHAT, CONSTRAINTS |
| 2 | `/design-interrogator` | HOW, TECH-STACK, DATA-MODEL, ERROR-HANDLING, NFRS |
| 3 | `/task-decomposer` | ORDERING, SCOPE, VERIFICATION, ROLLBACK, DEPENDENCIES |
| 4 | `/acceptance-engineer` | OBSERVABLE, AUDITABLE, STOP-RULE, REGRESSION, BUDGET-AWARE |
| 5 | `/goal-compiler` | (assembles output -- no questions) |

Skip a stage only if all its dimensions already score 0 from prior session context.

## Turn structure

Each turn:
1. Announce the current stage and its ambiguity scores (e.g., "Stage 2 -- HOW:1, TECH-STACK:0, DATA-MODEL:2, ERROR-HANDLING:0, NFRS:1")
2. Ask exactly one question for the highest-scoring unresolved dimension
3. After the answer, update the score and write the relevant section of that stage's output file
4. If all dimensions for the current stage score 0, announce stage completion and move to the next

Never combine two stage transitions in one message. Never ask a question you can answer from the codebase.

## Resuming a session

If `docs/goal/SESSION.md` exists, print a one-paragraph summary of what has been decided so far and which stage is next. Ask the user to confirm before continuing. Do not re-ask resolved questions.

## Hard rules

- One question at a time.
- No stage skipping without explicit user confirmation.
- No `/goal-compiler` until stages 1-4 are complete.
- Never ask the user to "read docs/goal/X.md" -- you read it.
