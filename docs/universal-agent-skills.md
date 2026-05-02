# Universal Agent Skills

This repo can be turned into a cross-agent skill library by separating the
portable skill content from agent-specific packaging.

## Goal

Support Codex, Claude Code, and other coding agents from the same source tree.
The source of truth should be the skill folders under `skills/`; platform
manifests and installer layouts should be generated from that source.

## Current Shape

- `skills/<bucket>/<skill>/SKILL.md` holds the actual workflow.
- Optional files beside `SKILL.md` provide references, scripts, and templates.
- `.claude-plugin/plugin.json` is a Claude Code distribution manifest.
- `scripts/link-skills.sh` links all skills into `~/.claude/skills`.

Most skills are already portable Markdown workflows. The main coupling is in
distribution, install paths, and a few platform-specific assumptions.

## Portable Skill Contract

Every universal skill should expose this minimum contract:

```text
skill-name/
  SKILL.md
  references/    # optional detailed docs loaded on demand
  scripts/       # optional deterministic helpers
  assets/        # optional templates or static files
  adapters/      # optional platform notes or overrides
```

`SKILL.md` frontmatter should keep these fields portable:

```yaml
---
name: diagnose
description: Disciplined diagnosis loop for hard bugs and performance regressions. Use when ...
---
```

Avoid relying on non-portable frontmatter in the core file. If an agent needs
private metadata, generate that metadata into the agent manifest or place it in
an adapter file.

## Agent Adapters

Adapters translate the same skill into each agent's install and trigger model.

### Claude Code

- Generate `.claude-plugin/plugin.json`.
- Install or link selected skills into `~/.claude/skills`.
- Keep slash-command language acceptable, but do not require it in portable
  instructions unless the behavior genuinely depends on a slash command.
- In agents where skills are not slash commands, invoke them by name in natural
  language, for example: "Use `setup-agent-skills` to set up this repo."

### Codex

- Install or link selected skills into `$CODEX_HOME/skills` or
  `~/.codex/skills`.
- Keep `SKILL.md` frontmatter to `name` and `description`.
- Optionally generate `agents/openai.yaml` for UI metadata.

### Generic Agents

- Emit a JSON manifest with skill names, descriptions, paths, resources, and
  categories.
- Emit an `AGENTS.md` snippet that tells the agent how to discover and invoke
  skills from the manifest.

## Migration Classes

### Copy As Portable

These skills are mostly platform-neutral today:

- `diagnose`
- `tdd`
- `grill-me`
- `grill-with-docs`
- `zoom-out`
- `write-a-skill`
- `improve-codebase-architecture`
- `migrate-to-shoehorn`
- `scaffold-exercises`
- `setup-pre-commit`
- `edit-article`
- `obsidian-vault`
- `caveman`

### Needs Platform Adapter

- `setup-agent-skills`: keeps the repo-setup workflow while using a
  platform-neutral config-file selection rule.
- `triage`, `to-issues`, `to-prd`: depend on issue tracker operations. Extract
  provider behavior into GitHub, GitLab, Linear, and local-markdown adapters.

### Rename Or Split

- `git-guardrails`: portable core skill with a Claude Code hook adapter.

## Proposed Generated Files

```text
manifests/
  skills.json              # portable source manifest
  claude-plugin.generated.json
  codex-skills.json        # optional Codex install manifest

scripts/
  generate-universal-manifest.mjs
  install-skills.mjs
  validate-skills.mjs
```

## First Implementation Slice

1. Generate `manifests/skills.json` from every non-deprecated `SKILL.md`.
2. Generate `manifests/claude-plugin.generated.json` from the same manifest.
3. Add a cross-platform installer that can target:
   - `claude`: `~/.claude/skills`
   - `codex`: `$CODEX_HOME/skills` or `~/.codex/skills`
   - `dir`: a user-provided output directory
4. Add validation that rejects:
   - missing `name` or `description`
   - duplicate skill names
   - non-portable core frontmatter unless allow-listed
   - broken local Markdown links

## Compatibility Rules

- Keep the skill body agent-readable, not product-marketing copy.
- Do not mention one agent as the only way to run a portable skill.
- Put volatile tool instructions in adapters or setup docs.
- Prefer provider-neutral vocabulary: "issue tracker", "agent config file",
  "skill manifest".
- Let install scripts generate platform-specific paths and manifests.

## Distribution Policy

Use buckets as the first-pass publishing signal:

- `engineering`, `productivity`, `misc`: publishable public skills.
- `personal`: valid local skills, but excluded from generated public manifests.
- `deprecated`: excluded from generated manifests.

Do not delete `personal` or `deprecated` skills; keep them available for local
development and migration analysis.
