#!/usr/bin/env bash
# Deploy a built static directory to a live URL. Default host: Vercel.
# The dir is just static files (Next's `out/`, or the folder holding a
# single-file index.html), so ANY static host works — alternatives below.
#
# Usage: scripts/deploy.sh [static-dir] [--prod]
#   scripts/deploy.sh out            # preview URL
#   scripts/deploy.sh out --prod     # production URL
#
# Build FIRST (scripts/verify.sh produces out/). This script only ships files;
# it does not build, so a stale out/ deploys stale. It is an outward-facing
# action and needs you to be logged in to the host (npx vercel login).
set -euo pipefail

DIR="${1:-out}"
PROD=""
[[ "${2:-}" == "--prod" ]] && PROD="--prod"

if [[ ! -f "$DIR/index.html" ]]; then
  echo "no index.html in '$DIR' — build first (scripts/verify.sh) or pass the right dir." >&2
  exit 1
fi

echo "deploying '$DIR' to Vercel ${PROD:-(preview)}…"
npx -y vercel deploy "$DIR" --yes $PROD

# Same static dir on other hosts (pick one, delete the rest in your notes):
#   npx -y netlify-cli deploy --dir "$DIR" ${PROD:+--prod}
#   npx -y surge "$DIR"
#   npx -y wrangler pages deploy "$DIR"
