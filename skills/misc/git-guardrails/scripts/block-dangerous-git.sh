#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat)"

extract_command() {
  if command -v python3 >/dev/null 2>&1; then
    INPUT_JSON="$INPUT" python3 - <<'PY'
import json
import os

try:
    data = json.loads(os.environ["INPUT_JSON"])
except Exception:
    print("")
else:
    print(data.get("tool_input", {}).get("command", ""))
PY
    return
  fi

  if command -v python >/dev/null 2>&1; then
    INPUT_JSON="$INPUT" python - <<'PY'
import json
import os

try:
    data = json.loads(os.environ["INPUT_JSON"])
except Exception:
    print("")
else:
    print(data.get("tool_input", {}).get("command", ""))
PY
    return
  fi

  if command -v node >/dev/null 2>&1; then
    INPUT_JSON="$INPUT" node -e 'try { const data = JSON.parse(process.env.INPUT_JSON); console.log(data.tool_input?.command ?? ""); } catch { console.log(""); }'
    return
  fi

  printf '%s\n' "$INPUT" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p'
}

COMMAND="$(extract_command)"

DANGEROUS_PATTERNS=(
  "git[[:space:]]+push([[:space:]]|$)"
  "git[[:space:]]+reset[[:space:]]+--hard([[:space:]]|$)"
  "git[[:space:]]+clean[[:space:]]+-f"
  "git[[:space:]]+clean[[:space:]]+-fd"
  "git[[:space:]]+branch[[:space:]]+-D([[:space:]]|$)"
  "git[[:space:]]+checkout[[:space:]]+\\.([[:space:]]|$)"
  "git[[:space:]]+restore[[:space:]]+\\.([[:space:]]|$)"
  "push[[:space:]]+--force([[:space:]]|$)"
  "reset[[:space:]]+--hard([[:space:]]|$)"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if printf '%s\n' "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

exit 0
