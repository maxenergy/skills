---
name: design-interrogator
description: HOW grilling session with built-in epistemic vigilance. Challenges technically infeasible plans, ecosystem antipatterns, and NFR violations before design is frozen. Writes a Corrected Misconceptions section so Codex inherits your corrected understanding, not your original wrong assumptions. Use after /requirements-interrogator or when /interrogator-orchestrator routes here.
---

# Design Interrogator

Resolve the five HOW dimensions, then apply the **epistemic vigilance subprocess** to challenge any technically wrong assumptions before design is frozen. Output goes to `docs/goal/DESIGN.md`, including a "Corrected Misconceptions" section that travels verbatim into the Codex goal text.

## Five dimensions -- score each 0-2

### 1. HOW -- Architecture and approach

Questions to resolve:
- What is the high-level approach: new module, extend existing, replace, or configure?
- What are the top two or three design decisions this approach depends on?
- What does the happy-path data flow look like from trigger to observable output?

**Exit condition**: approach is named; top two design decisions are resolved; happy-path fits in three sentences.

### 2. TECH-STACK -- Technology choices

Questions to resolve:
- Which libraries, frameworks, or services are being used?
- Are new dependencies being introduced? Why this one over alternatives?
- What version constraints apply?

**Exit condition**: every new dependency is named and justified, or user confirms "no new dependencies."

### 3. DATA-MODEL -- State and persistence

Questions to resolve:
- What new data structures, types, or schema changes are required?
- What existing data structures does this touch?
- How does data flow through the system (in -> transform -> persist/out)?

**Exit condition**: every new type or schema is described by its fields and key invariants, or user confirms "no data model changes."

### 4. ERROR-HANDLING -- Failure modes

Questions to resolve:
- What are the three most likely failure modes?
- For each: does it fail fast, degrade gracefully, or retry?
- What does the user see when each failure occurs?

**Exit condition**: the two most critical failure modes are described with a concrete handling strategy.

### 5. NFRS -- Non-functional requirements

Questions to resolve:
- Latency or throughput expectations?
- Memory or storage ceiling?
- Observability: what gets logged, measured, or traced?
- Security surface: does this add an attack surface, and how is it mitigated?

**Exit condition**: each applicable NFR is scoped concretely, or explicitly waived by the user.

## Interview protocol

Same as `/requirements-interrogator`: one question per turn, read the codebase before asking, surface conflicts immediately. Do not implement anything.

## Epistemic vigilance subprocess

After all five dimensions reach 0, run this adversarial checklist **before** declaring the design frozen. State a "strong opinion, loosely held" pushback for every trigger that fires -- even if it contradicts what the user said.

### Trigger 1: Technically infeasible plan

Check: does the proposed design rely on APIs, platform features, or runtime behavior that do not exist, have been removed, or work differently than the user described?

If triggered: state the infeasibility precisely, name the actual API or correct behavior, and ask the user to confirm the correction before continuing.

### Trigger 2: Ecosystem antipattern

Check: does the proposed approach contradict a well-established best practice for this stack -- for example: mutating framework-managed state directly, synchronous I/O inside an async event loop, N+1 query patterns, storing secrets in non-secret storage, or client-side trust of user-supplied IDs?

If triggered: name the antipattern, explain specifically why it is harmful in this context, and propose the idiomatic alternative.

### Trigger 3: NFR violation

Check: will the proposed design violate any NFR from `docs/goal/REQUIREMENTS.md`? Check latency, memory ceiling, backward compatibility, and security constraints in that order.

If triggered: state which NFR is violated, trace exactly how the violation occurs, and name the design change that would preserve the constraint.

### Corrected Misconceptions output

After the subprocess runs, write a **Corrected Misconceptions** section to `docs/goal/DESIGN.md`. If no triggers fired, write "None." This section is copied verbatim into the Codex goal text by `/goal-compiler` -- it ensures Codex does not inherit the user's original wrong assumptions.

## Exit condition

When all five dimensions score 0 **and** the epistemic vigilance subprocess has completed (even with no findings), write `docs/goal/DESIGN.md` and report the final score summary.

## DESIGN.md template

```
## Architecture

## Technology Choices

## Data Model

## Error Handling

## Non-Functional Requirements

## Corrected Misconceptions
```
