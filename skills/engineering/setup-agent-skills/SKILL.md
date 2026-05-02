---
name: setup-agent-skills
description: Set up an `## Agent skills` block in the repo's agent config file and `docs/agents/` so engineering skills know the repo's issue tracker, triage label vocabulary, and domain doc layout. Run before first use of `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, or `zoom-out` — or when those skills lack project setup context.
disable-model-invocation: true
---

# Setup Agent Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live, such as GitHub, GitLab, local markdown,
  or another tracker.
- **Triage labels** — the strings used for the five canonical triage roles.
- **Domain docs** — where `CONTEXT.md` and ADRs live, plus the consumer rules
  for reading them.

This is a prompt-driven skill, not a deterministic script. Explore, present what
you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists;
do not assume:

- `git remote -v` and `.git/config` — does the repo point to GitHub, GitLab, or
  another host?
- `AGENTS.md` and `CLAUDE.md` at the repo root — does either exist? Is there
  already an `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already
  in use

### 2. Present findings and ask

Summarise what is present and missing. Then walk the user through the three
decisions **one at a time**: present a section, get the user's answer, then move
to the next.

Assume the user does not know what these terms mean. Each section starts with a
short explainer: what it is, why these skills need it, and what changes if they
pick differently.

**Section A — Issue tracker.**

> Explainer: The issue tracker is where issues live for this repo. Skills like
> `to-issues`, `triage`, and `to-prd` read from and write to it. They need to
> know whether to call `gh issue create`, use `glab`, write markdown under
> `.scratch/`, or follow another workflow you describe.

Default posture: if a `git remote` points at GitHub, propose GitHub. If a
remote points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab.
Otherwise, offer:

- **GitHub** — issues live in GitHub Issues; use the `gh` CLI.
- **GitLab** — issues live in GitLab Issues; use the `glab` CLI.
- **Local markdown** — issues live as files under `.scratch/<feature>/`.
- **Other** — ask the user to describe the workflow in one paragraph and record
  it as freeform prose.

**Section B — Triage label vocabulary.**

> Explainer: When `triage` processes an issue, it moves it through a state
> machine: needs evaluation, waiting on reporter, ready for an AFK agent,
> ready for a human, or will not be actioned. The skill needs to map these
> canonical roles to the actual labels or states configured in the issue
> tracker.

The five canonical roles:

- `needs-triage` — maintainer needs to evaluate
- `needs-info` — waiting on reporter
- `ready-for-agent` — fully specified, AFK-ready
- `ready-for-human` — needs human implementation
- `wontfix` — will not be actioned

Default: each role's string equals its name. Ask whether the user wants to
override any labels. If their issue tracker has no existing labels, defaults are
fine.

**Section C — Domain docs.**

> Explainer: Some skills (`improve-codebase-architecture`, `diagnose`, `tdd`)
> read `CONTEXT.md` to learn project language, and `docs/adr/` for past
> architectural decisions. They need to know whether the repo has one global
> context or multiple contexts.

Confirm the layout:

- **Single-context** — one `CONTEXT.md` plus `docs/adr/` at the repo root.
- **Multi-context** — `CONTEXT-MAP.md` at the root points to per-context
  `CONTEXT.md` files.

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to the selected agent config file.
- The contents of `docs/agents/issue-tracker.md`.
- The contents of `docs/agents/triage-labels.md`.
- The contents of `docs/agents/domain.md`.

Let the user edit before writing.

### 4. Write

**Pick the agent config file to edit:**

- If exactly one of `AGENTS.md` or `CLAUDE.md` exists, edit the existing file.
- If both exist and one already has an `## Agent skills` section, update that
  file.
- If both exist and neither has the section, choose by active agent:
  - Claude Code: prefer `CLAUDE.md`.
  - Codex or generic agents: prefer `AGENTS.md`.
- If neither exists, ask which one to create.

Never create a second agent config file when a suitable one already exists.
Always update an existing `## Agent skills` block in place rather than appending
a duplicate. Preserve surrounding user edits.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout: "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Then write the three docs files using the seed templates in this skill folder:

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) — label mapping
- [domain.md](./domain.md) — domain doc consumer rules and layout

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch
using the user's description.

### 5. Done

Tell the user setup is complete and which engineering skills will now read from
these files. Mention that they can edit `docs/agents/*.md` directly later;
re-running this skill is only necessary when they want to switch issue trackers
or redo the setup.

