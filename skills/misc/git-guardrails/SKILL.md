---
name: git-guardrails
description: Set up safeguards that block or warn before dangerous git operations such as push, reset --hard, clean -f, branch -D, checkout ., or restore .. Use when user wants to prevent destructive git commands, add git safety hooks, or make an agent ask before risky repository changes.
---

# Git Guardrails

Install safeguards that prevent an agent from running dangerous git commands
without explicit user intent.

## Policy

Block or require confirmation for:

- `git push`, especially force pushes
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .`
- `git restore .`

The default posture is conservative: protect local work first, then let the user
opt into narrower or broader rules.

## Choose Integration

Ask which agent or shell surface should enforce the guardrails:

- **Claude Code**: use [adapters/claude-code.md](adapters/claude-code.md).
- **Other agents**: install an equivalent pre-command hook if the agent supports
  one, using [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh) as
  the command filter.
- **Shell-only fallback**: add a wrapper or alias in the user's shell profile
  only if they explicitly want human shell commands guarded too.

Do not assume all agents have hooks. If the active agent has no pre-command hook,
explain the limitation and offer a shell wrapper or project policy doc instead.

## Customize

Before installing, ask whether the user wants to add or remove blocked patterns.
Keep the default list unless they provide a clear preference.

When editing the script, keep each blocked command as a separate pattern so the
blocked reason remains specific.

## Verify

After installing, test the active integration with a command equivalent to:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

The guardrail should reject the command and print a `BLOCKED` message.

Also test one harmless command, such as `git status`, to make sure normal git
usage still works.

