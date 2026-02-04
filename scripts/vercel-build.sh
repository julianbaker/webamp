#!/usr/bin/env bash
set -euo pipefail
set -x

export NODE_OPTIONS="--max-old-space-size=4096"
export DISABLE_BUNDLE_REPORT="1"

pnpm --filter ani-cursor build
pnpm --filter winamp-eqf build
pnpm --filter webamp build -- --debug
