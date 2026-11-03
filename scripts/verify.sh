#!/usr/bin/env bash
# Production-build check for a style-demo project. Encodes the hard-won rule:
# NEVER build while `next dev` is running (it clobbers .next and the page 500s).
# Usage: scripts/verify.sh <project-dir>
set -euo pipefail

DIR="${1:-.}"
cd "$DIR"

if pgrep -f "next dev" >/dev/null 2>&1; then
  echo "ERROR: a 'next dev' server is running. Stop it first (pkill -f 'next dev')." >&2
  echo "       Building now would corrupt .next. To check while dev is live, use:" >&2
  echo "         npx tsc --noEmit   +   curl -s localhost:3000 | grep '<your content>'" >&2
  exit 1
fi

echo "== typecheck =="
npx tsc --noEmit

echo "== build (static export) =="
npm run build

OUT="out/index.html"
if [[ ! -f "$OUT" ]]; then
  echo "WARN: $OUT not found — is output:'export' set in next.config.mjs?" >&2
  exit 1
fi

echo "== content / style / motion checks in $OUT =="
pass=0 fail=0
check() { # <label> <grep-pattern>
  if grep -qi "$2" "$OUT"; then echo "  ok   $1"; pass=$((pass+1));
  else echo "  MISS $1  (pattern: $2)"; fail=$((fail+1)); fi
}
# motion hooks shipped by the template layer
check "word-mask reveal (rw-word)" "rw-word"
check "scroll progress bar"        "scroll-progress"
echo "  -- now add your own checks: product words, accent hex, font name --"
echo "     e.g. grep -i 'YourProduct'  '$OUT'"

echo
echo "checks: $pass ok, $fail missing (the two above are template hooks; the real"
echo "proof is grepping YOUR product copy + accent color + font in $OUT)."
[[ $fail -eq 0 ]]
