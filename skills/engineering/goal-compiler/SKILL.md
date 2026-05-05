---
name: goal-compiler
description: Assemble interrogation outputs into a single self-contained Codex /goal text. Token-economical (400-700 words target), audit-ready for the continuation.md checklist protocol, corrected misconceptions included inline so Codex does not inherit wrong assumptions. Use after /acceptance-engineer completes, or directly if REQUIREMENTS, DESIGN, TASKS, and ACCEPTANCE docs already exist.
---

# Goal Compiler

Assemble the outputs of the interrogation pipeline into a single, self-contained text for Codex `/goal`. The text must satisfy Codex's `continuation.md` audit protocol while staying token-economical to avoid compaction-induced goal loss.

## The compaction problem

Codex issue #19910: after mid-turn compaction, the goal continuation prompt and audit requirements can be silently dropped. The new agent then marks the goal complete because it was only fed the local task, not the global goal. Keeping the goal text under 800 words reduces the risk of triggering compaction mid-turn.

## Before compiling

Read all four files. If any is missing, stop and name the missing file and the skill that produces it:

- `docs/goal/REQUIREMENTS.md` -- produced by `/requirements-interrogator`
- `docs/goal/DESIGN.md` -- produced by `/design-interrogator`
- `docs/goal/TASKS.md` -- produced by `/task-decomposer`
- `docs/goal/ACCEPTANCE.md` -- produced by `/acceptance-engineer`

## Why the goal text must be self-contained

Codex injects the goal text into `<untrusted_objective>` tags on every continuation turn. The goal is the only durable anchor -- Codex does not re-read separate docs files unless they appear in a verification command. References like "see docs/goal/DESIGN.md" will be invisible after the first compaction. Every deliverable, constraint, and stop condition must be stated in the goal text itself.

## Compilation rules

1. **One-sentence objective** -- state the end state in observable, user-visible terms.
2. **Numbered deliverables** -- each deliverable maps to exactly one verification command or file check. Codex's audit checklist indexes by number.
3. **Named artifacts** -- every file, command, or test that proves completion is spelled out exactly as it would appear in a terminal.
4. **Corrected misconceptions inline** -- copy the "Corrected Misconceptions" section from `docs/goal/DESIGN.md` verbatim. If it says "None," omit the section entirely.
5. **Explicit stop rule** -- the last section, copied from `docs/goal/ACCEPTANCE.md` Stop Rule, is a numbered list of verifiable conditions. Never compressed.
6. **No rationale** -- omit the reasoning behind decisions; keep only the decisions themselves.

## Token budget

Target: 400-700 words. If the draft exceeds 800 words, compress in this order:

1. Collapse repeated constraints into a single Constraints section
2. Remove rationale text (keep decisions only)
3. Abbreviate task descriptions to Goal + Verification line only

Never compress the Deliverables list, the Stop Rule, or the Corrected Misconceptions section.

## Output -- docs/goal/GOAL.md

Write using exactly this structure:

```
## Objective
<One sentence: observable end state.>

## Context
<Two to four sentences on the codebase area being changed. No rationale -- facts only.>

## Deliverables
1. <name>: <what exists or passes when done> -- verified by: `<exact command or file check>`
2. ...

## Constraints
- Must not change: <list of files or interfaces>
- Backward compatibility: <requirement or "none">
- <any other hard constraints from REQUIREMENTS.md>

## Corrected Misconceptions
<Verbatim from DESIGN.md. Omit this section if "None.">

## Stop Rule
Call update_goal with status=achieved only when ALL of the following are true:
1. `<verification command>` exits 0 / returns `<expected output>`
2. ...
N. `<full test suite command>` exits 0 with no new failures.
```

## After writing GOAL.md

Print the compiled text to the user. Then print this exact dispatch guide:

---

**Codex CLI (direct):**
Run `/goal` in a new Codex thread, then paste the full content of `docs/goal/GOAL.md` as your first message. The goal text is already self-contained.

**AgentOS (automated loop):**
Use `/codex-goal-dispatch` -- it dispatches to the `codex_cli` adapter, runs per-task verification, and feeds failures back to the same Codex thread automatically.

---

Do not dispatch automatically. The user decides when and how to run it.
