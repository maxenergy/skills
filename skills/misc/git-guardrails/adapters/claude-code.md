# Claude Code Adapter

Use this adapter when installing git guardrails for Claude Code.

## 1. Ask Scope

Ask the user whether to install for:

- **This project only**: `.claude/settings.json`
- **All projects**: `~/.claude/settings.json`

## 2. Copy Hook Script

The bundled script is:

```text
scripts/block-dangerous-git.sh
```

Copy it to:

- Project: `.claude/hooks/block-dangerous-git.sh`
- Global: `~/.claude/hooks/block-dangerous-git.sh`

Make it executable with:

```bash
chmod +x <path-to-script>
```

## 3. Add PreToolUse Hook

For project scope, merge this into `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

For global scope, merge this into `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

If the settings file already exists, merge into the existing
`hooks.PreToolUse` array. Preserve unrelated settings and hooks.

## 4. Verify

Run:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

Expected result: exit code `2` and a `BLOCKED` message on stderr.

