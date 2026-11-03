#!/usr/bin/env bash
# Scaffold a new style-demo project from the shipped template, then install deps.
# Usage: scripts/new-demo.sh <dest-dir>   (dest must not already exist / be non-empty)
set -euo pipefail

DEST="${1:-}"
if [[ -z "$DEST" ]]; then
  echo "usage: $0 <dest-dir>" >&2
  exit 2
fi
if [[ -e "$DEST" && -n "$(ls -A "$DEST" 2>/dev/null || true)" ]]; then
  echo "refusing to scaffold into non-empty '$DEST'" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/../template"

mkdir -p "$DEST"
# copy template contents (including dotfiles like .gitignore)
cp -R "$TEMPLATE"/. "$DEST"/
echo "scaffolded $DEST from template"

cd "$DEST"
echo "installing deps (npm)…"
npm install --no-audit --no-fund
echo
echo "done. next:"
echo "  cd $DEST && npm run dev        # http://localhost:3000"
echo "  # verify a production build:  $SCRIPT_DIR/verify.sh $DEST"
