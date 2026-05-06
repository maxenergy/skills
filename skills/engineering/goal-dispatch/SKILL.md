---
name: goal-dispatch
description: Dispatch a compiled /goal objective to any AgentOS coding agent (codex_cli, anthropic, gemini, qwen). Runs per-task verification after each agent turn, feeds failures back with accumulated error context, and runs an adversarial final review before accepting completion. Use after /goal-compiler has produced docs/goal/GOAL.md.
---

# Goal Dispatch

Dispatch the compiled goal to a coding agent via AgentOS and run the verify-then-feedback loop. This skill works from any project that has the `agentos` CLI available and `docs/goal/GOAL.md` produced by `/goal-compiler`.

## Agent selection

AgentOS supports these coding agents. Ask the user which to use if not specified:

| Agent key | Model |
|-----------|-------|
| `codex_cli` | OpenAI Codex CLI (best for Codex /goal integration) |
| `anthropic` | Claude (Anthropic API) |
| `gemini` | Gemini (Google API) |
| `qwen` | Qwen (Alibaba API) |

Default to `codex_cli` unless the user specifies otherwise or `ANTHROPIC_API_KEY` is set but `OPENAI_API_KEY` is not.

## Prerequisites

Before dispatching, check all of the following. Stop and name what is missing:

- `docs/goal/GOAL.md` exists (produced by `/goal-compiler`)
- `docs/goal/TASKS.md` exists (produced by `/task-decomposer`)
- `docs/goal/ACCEPTANCE.md` exists (produced by `/acceptance-engineer`)
- `agentos` CLI is on PATH: `agentos --version` exits 0
- `git status --short` returns nothing, or only untracked files under `docs/goal/`

## Initial dispatch

Run the chosen agent with the goal as its objective:

```
agentos run <agent_key> objective="$(cat docs/goal/GOAL.md)"
```

Capture stdout and stderr. Write the initial entry to `docs/goal/DISPATCH_LOG.md`.

## Verify loop

After the agent run completes, work through the tasks in `docs/goal/TASKS.md` in order:

1. Run the Verification command for the current task.
2. **Pass**: log `[PASS] Task N: <name>` and continue to the next task.
3. **Fail**: capture exit code + full output (truncated at 2000 chars). Go to **Retry protocol**.

When all task verifications pass, go to **Final review**.

## Retry protocol

On a verification failure, build a retry objective that embeds the error context:

```
<original docs/goal/GOAL.md content>

---
## Retry context

Previous run failed verification for Task N: <name>

Verification command: `<command>`
Exit code: <n>
Output:
<stderr/stdout, truncated at 2000 chars>

Fix this before continuing. Do not mark any task complete until its
verification command passes.
```

Then rerun:

```
agentos run <agent_key> objective="<retry objective above>"
```

Retry up to **2 times** for the same task. On the third consecutive failure:
1. Present the failure to the user (command, output, all 3 attempts).
2. Ask: "Should I retry, change the agent, adjust the verification command, or stop?"

Never proceed to the next task while a verification is failing.

## Safety -- scope check

After each agent run, before running verification:

1. Run `git diff --name-only`.
2. Check every changed file is listed in the Scope field of the current task in `docs/goal/TASKS.md`.
3. If unexpected files appear, log them and ask the user: "Agent modified files outside task scope: `<files>`. Continue, roll back those files, or stop?"

Never roll back automatically.

## Final review

When all task verifications pass:

1. Run every condition in the Stop Rule section of `docs/goal/ACCEPTANCE.md` in order.
2. Run `git diff --name-only` against the expected file set.
3. **All pass**: report "All acceptance criteria verified. Goal complete." Update `docs/goal/DISPATCH_LOG.md`.
4. **Any fail**: do not accept completion. Build a final-review retry objective:

```
<original docs/goal/GOAL.md content>

---
## Acceptance failure

All task verifications passed, but the following Stop Rule conditions failed:

<numbered list of failed conditions with commands and outputs>

Do not declare completion until every condition in the Stop Rule passes.
```

Rerun the agent with this objective. Retry the final review up to 2 times.

## Budget-limit detection

If the agent's output summarizes progress without making code changes (consistent with exhausting a token budget), stop the loop and present:

- Tasks completed so far (from `docs/goal/DISPATCH_LOG.md`)
- Tasks remaining (from `docs/goal/TASKS.md`)
- The agent's summary verbatim
- Recommendation: "Split remaining tasks into a new goal and re-run `/goal-dispatch`."

## Dispatch log

Maintain `docs/goal/DISPATCH_LOG.md` throughout:

```
## Dispatch Log

Agent: <agent_key>
Started: <timestamp>

### Task N: <name>
- Status: pass / fail / retrying / pending
- Verification: `<command>` -> exit <n>
- Scope check: ok / unexpected files: <list>
- Attempts: <n>

### Final Status
- All tasks: pass / fail
- Stop Rule: pass / fail
- Completed at: <timestamp>
```
