---
name: goal-pipeline
description: Build a Codex /goal-ready implementation package through an adversarial PRD, design, plan, and TDD workflow. Use when the user wants to refine PRD/design/plan docs, prepare Codex /goal execution, or run specification-first TDD development.
---

# Goal Pipeline

## Mission

Turn an idea, bug, or rough feature request into a Codex `/goal` package that is precise enough for autonomous implementation and strict enough to prevent scope drift. Do not write production code while using this skill. Your job is to interrogate, document, freeze, slice, validate, and hand off.

The final handoff must let Codex load a tiny `/goal` command that points at `docs/goal/GOAL.md`. All large context belongs in source-of-truth documents under `docs/goal/`.

## When To Use

Use this skill when the user wants PRD, design, or plan docs refined before coding; wants Codex `/goal` to implement a feature autonomously; asks for a specification-first or TDD development flow; has a fuzzy idea that needs adversarial questioning; or wants a guide that walks a developer through all planning documents.

Do not use this skill for small one-line edits, pure refactors with no product ambiguity, or code execution after the goal pack is frozen. Use the generated `CODEX_START.md` or `codex-controller` reference for execution.

## Non-Negotiable Rules

1. Ask one question at a time during grilling.
2. If the answer can be discovered from the repo, inspect the repo instead of asking.
3. Do not implement production code.
4. Do not hide ambiguity. Put unresolved non-blockers in `ASSUMPTIONS.md`; stop on blockers.
5. Treat `NON_GOALS.md` and do-not-touch constraints as strongly as requirements.
6. Every implementation task must be a vertical slice with RED -> GREEN -> REFACTOR.
7. Every production-code task must include a failing test to write first, the expected failure, a minimal implementation boundary, and verification commands.
8. The `/goal` entrypoint must stay small and reference docs instead of inlining them.

## Required Output Tree

Create or update these files in the target project:

```text
docs/system/
  ARCHITECTURE.md
  MODULE_MAP.md
  DATA_FLOW.md
  RISK_AREAS.md

docs/goal/
  QUESTIONS.md
  ANSWERS.md
  ASSUMPTIONS.md
  UNKNOWN.md
  PRD.md
  REQUIREMENTS.md
  NON_GOALS.md
  DESIGN.md
  IMPACT.md
  PLAN.md
  TASKS.md
  ACCEPTANCE.md
  VERIFY.md
  GOAL.md
  CODEX_START.md
  FINAL_REVIEW.md
```

If a new project does not yet have code, write `docs/system/*` with known architecture assumptions and explicitly mark unknown areas. If an existing project has code, inspect it first.

## Workflow

### 0. Understand The System

Read existing docs, agent instructions, package manifests, tests, entrypoints, and similar features. Produce `docs/system/ARCHITECTURE.md`, `MODULE_MAP.md`, `DATA_FLOW.md`, and `RISK_AREAS.md`.

Use [00-understand-system.md](references/00-understand-system.md).

### 1. Grill Requirements

Interview the user relentlessly, but only one question at a time. For each question, include your recommended answer and why. Continue until the implementation direction is unambiguous.

Write `QUESTIONS.md`, `ANSWERS.md`, `ASSUMPTIONS.md`, and `UNKNOWN.md`. Blocking unknowns stop the workflow.

Use [01-grill-requirements.md](references/01-grill-requirements.md).

Minimum question bank:

- What is the real goal, and what user-visible outcome proves it?
- What is explicitly not the goal?
- Who are the users, actors, systems, or maintainers affected?
- What is the first successful end-to-end scenario?
- What does failure look like to the user and to the system?
- What must remain backward compatible?
- What must not change, even if it would simplify implementation?
- Which assumption could invalidate the design?
- Which requirement, if misunderstood, would make the implementation useless?

### 2. Freeze The PRD

Create `docs/goal/PRD.md` from [PRD.md](templates/PRD.md). Then derive `REQUIREMENTS.md`, `NON_GOALS.md`, and `ACCEPTANCE.md`.

Use [02-spec-freeze.md](references/02-spec-freeze.md).

### 3. Freeze The Design

Create `docs/goal/DESIGN.md` from [DESIGN.md](templates/DESIGN.md). Design must include current system context, proposed architecture, module responsibilities, public interfaces, data model or migration impact, error handling, observability, security, privacy, permissions, performance, concurrency, rejected alternatives, and do-not-touch constraints.

Design interrogation prompts:

- Which existing module owns this responsibility today?
- Should this become a deep module? What is its small stable interface?
- Where does state live, and who is allowed to mutate it?
- What failures are recoverable vs terminal?
- Which choices will be hardest to reverse later?
- Which tests can verify behavior through public interfaces only?

### 4. Analyze Impact

Create `docs/goal/IMPACT.md` using [03-impact-analysis.md](references/03-impact-analysis.md). Be conservative. Include affected modules, public interfaces, data, tests, risks, rollback, and unknown impact areas.

### 5. Slice The TDD Plan

Create `docs/goal/PLAN.md` from [PLAN.md](templates/PLAN.md) and `docs/goal/TASKS.md` from [TASKS.md](templates/TASKS.md). Tasks must be ordered vertical slices, not horizontal layers.

Each task must include exactly these headings:

- Goal
- User-Visible Behavior
- Scope
- Files Likely Touched
- RED Test
- Expected Failure
- GREEN Boundary
- Refactor Allowance
- Verification Command
- Acceptance Criteria
- Rollback Condition
- Dependencies
- Do Not Touch

Use [04-task-slice.md](references/04-task-slice.md) and [06-tdd-contract.md](references/06-tdd-contract.md).

Reject any task that says only "add model", "add API", "add UI", or "write tests" unless it is framed as a complete behavior slice with its own verification.

### 6. Generate The Goal Pack

Create `docs/goal/GOAL.md` from [GOAL.md](templates/GOAL.md). Create `docs/goal/CODEX_START.md` from [CODEX_START.md](templates/CODEX_START.md).

The `/goal` entrypoint must look like:

```text
/goal Read docs/goal/GOAL.md and execute it exactly.
```

Use [05-goal-pack.md](references/05-goal-pack.md).

### 7. Validate Before Handoff

If this skill's scripts are installed in the repo, run:

```bash
node path/to/goal-pipeline/scripts/validate-goal-pack.mjs
```

Otherwise manually verify required files, blocking unknowns, task TDD headings, `GOAL.md` source references, and `CODEX_START.md` `/goal` command.

### 8. Execute With Codex

Preferred manual handoff:

1. Open `docs/goal/CODEX_START.md`.
2. Paste it into Codex.
3. Keep the same Codex thread for the full goal.
4. After each task, verify and feed failures back into the same thread.

Worker handoff, if available:

```bash
VERIFY_COMMAND="<project verification command>" node agent/worker/run-goal.js
```

Use [07-codex-controller.md](references/07-codex-controller.md) and [08-verify-loop.md](references/08-verify-loop.md).

### 9. Final Review

After Codex claims completion, create or update `docs/goal/FINAL_REVIEW.md`. Be adversarial. Assume Codex is wrong until evidence proves otherwise. Use [09-goal-review.md](references/09-goal-review.md).

## Completion Checklist

- [ ] System docs created or updated
- [ ] Requirements grilled and blocking unknowns resolved
- [ ] PRD, requirements, non-goals, and acceptance docs frozen
- [ ] Design and impact docs frozen
- [ ] Plan and tasks sliced vertically
- [ ] Every task includes strict TDD fields
- [ ] Goal and Codex start docs generated
- [ ] Goal pack validated
- [ ] User has the exact `/goal` command to run
