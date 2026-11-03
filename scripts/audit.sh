#!/usr/bin/env bash
# Lighthouse scores for a URL (a running dev server or a live deploy).
# Needs Chrome/Chromium on the machine. First run downloads lighthouse via npx.
#
# Usage: scripts/audit.sh <url>
#   scripts/audit.sh http://localhost:3000
#   scripts/audit.sh https://your-demo.vercel.app
set -euo pipefail

URL="${1:-}"
if [[ -z "$URL" ]]; then echo "usage: $0 <url>" >&2; exit 2; fi

OUT="$(mktemp -d)/lh.json"
npx -y lighthouse "$URL" \
  --quiet \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless --no-sandbox" \
  --output=json --output-path="$OUT"

echo "== Lighthouse: $URL =="
node -e 'const c=require(process.argv[1]).categories;for(const k in c)console.log(String(Math.round(c[k].score*100)).padStart(4)+"  "+c[k].title)' "$OUT"
echo "(aim for 90+ on a demo; accessibility and SEO are the cheap wins.)"
