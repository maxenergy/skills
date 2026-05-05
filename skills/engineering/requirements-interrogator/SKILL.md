---
name: requirements-interrogator
description: Socratic WHO/WHAT/WHY/NOT-WHAT/CONSTRAINTS grilling session that eliminates ambiguity across five requirement dimensions before any design work starts. Use when the user's goal is fuzzy, or when /interrogator-orchestrator routes here.
---

# Requirements Interrogator

Conduct a Socratic interview to fully resolve the five requirement dimensions before any design work begins. Output is written to `docs/goal/REQUIREMENTS.md`.

## Five dimensions -- score each 0-2

Score 0 only when the exit condition for that dimension is fully met.

### 1. WHO -- Users and stakeholders

Questions to resolve:
- Who is the direct user of this feature (persona, role, team)?
- Who else is affected -- downstream systems, ops, support, security?
- Who can veto or block delivery (legal, compliance, platform)?

**Exit condition**: user persona is named and described; at least one secondary stakeholder or "none" is confirmed.

### 2. WHAT -- The observable outcome

Questions to resolve:
- What does the user see or measure differently after this ships?
- What is the exact trigger that causes the new behavior?
- What does "working" look like from outside the codebase?

**Exit condition**: at least one concrete, observable success signal that does not require reading source code to verify.

### 3. WHY -- The root problem

Questions to resolve:
- What pain does the user feel today that this eliminates?
- Why now -- what changed that makes this the right time?
- Would a simpler alternative (config change, docs update, different tool) also solve the real problem?

**Exit condition**: the root pain is named; the user has confirmed that this feature -- not a simpler alternative -- is the right fix.

### 4. NOT-WHAT -- Explicit non-goals

Questions to resolve:
- What adjacent features might the agent gold-plate onto this?
- What must remain unchanged?
- What is explicitly out of scope for this cycle?

**Exit condition**: at least two specific non-goals are stated and the user confirms they are firm.

### 5. CONSTRAINTS -- Hard limits

Questions to resolve:
- Time, cost, or token budget constraints?
- Technical constraints: must use X, must not use Y, must stay backward-compatible with Z?
- Regulatory, security, or organizational constraints?

**Exit condition**: hard constraints are listed; if none exist, user explicitly confirms "no hard constraints."

## Interview protocol

- Ask one question per turn. Do not bundle questions.
- After each answer, update the dimension score immediately.
- If an answer can be verified by reading the codebase, read the codebase first -- do not ask the user.
- If an answer conflicts with a prior answer, surface the conflict before continuing.
- Do not offer solutions or design suggestions. This stage is about understanding, not designing.

## Exit condition

When all five dimensions score 0, write `docs/goal/REQUIREMENTS.md` using the template below. Report the final score summary to the user. Stop -- do not start design work.

## REQUIREMENTS.md template

```
## Users and Stakeholders

## Observable Outcome

## Root Problem

## Non-Goals
- ...

## Hard Constraints
- ...

## Open questions (blocking)
```
