# Migration Report

This report captures the first compatibility pass for turning this repo into a
universal agent skill library.

## Generated Artifacts

- `manifests/skills.json`: portable manifest generated from `skills/**/SKILL.md`
- `manifests/claude-plugin.generated.json`: Claude Code plugin manifest generated
  from public skills

Run:

```bash
node scripts/generate-universal-manifest.mjs
```

## Current Findings

### Most Skills Are Already Portable

Only two public skills mention Claude directly:

- `setup-agent-skills`: platform-neutral replacement for the original setup
  skill
- `git-guardrails`: Claude-specific behavior now lives in
  `adapters/claude-code.md`

No public skill body currently mentions Codex directly.

### Public Manifest Difference

The current `.claude-plugin/plugin.json` contains 12 skills. The generated
public manifest contains 16 skills because it includes the `misc` bucket:

- `git-guardrails`
- `migrate-to-shoehorn`
- `scaffold-exercises`
- `setup-pre-commit`

Choose one policy before replacing the hand-written Claude manifest:

1. Publish `misc` skills, matching the top-level `CLAUDE.md` guidance.
2. Treat `misc` as local-only, matching the current `.claude-plugin/plugin.json`.

### Reference Files Are Sibling Docs

Several skills link to sibling Markdown files rather than a `references/`
directory:

- `grill-with-docs`
- `improve-codebase-architecture`
- `setup-agent-skills`
- `tdd`
- `triage`
- `write-a-skill`

This is acceptable for Claude Code and Codex, but a universal installer should
copy the entire skill directory, not only `SKILL.md`.

## Recommended Refactors

### 1. Split Core Skill From Platform Packaging

Keep `SKILL.md` portable. Generate platform manifests from
`manifests/skills.json`.

### 2. Normalize Setup Skill

Done: `setup-agent-skills` is now the portable setup skill. It preserves the
issue tracker, triage labels, and domain docs workflow, and chooses the agent
config file using platform-neutral rules.

### 3. Split Git Guardrails

Done: `git-guardrails` is now the portable core skill, and Claude Code hook
installation lives in `adapters/claude-code.md`.

### 4. Add Cross-Platform Installer

Replace `scripts/link-skills.sh` as the primary path with a Node installer:

```bash
node scripts/install-skills.mjs --target codex
node scripts/install-skills.mjs --target claude
node scripts/install-skills.mjs --target dir --dest ./vendor/skills
```

Use symlinks when supported; fall back to copying directories on Windows if
symlink creation is unavailable.

### 5. Add Validation

The validator should check:

- frontmatter has `name` and `description`
- names are unique
- local Markdown links resolve
- generated manifests are up to date
- public skills do not rely on platform-private fields unless allow-listed

## Suggested Next Slice

Implement `scripts/install-skills.mjs` and `scripts/validate-skills.mjs`, then
decide whether `misc` is public or local-only.
