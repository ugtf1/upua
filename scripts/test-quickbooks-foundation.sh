#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
temp_dir=$(mktemp -d "${TMPDIR:-/tmp}/upua-qb-test.XXXXXX")
trap 'rm -rf "$temp_dir"' EXIT
./node_modules/.bin/tsc --target es2022 --module commonjs --moduleResolution node \
  --esModuleInterop --skipLibCheck --types node --outDir "$temp_dir" \
  lib/quickbooks-credentials.ts lib/quickbooks-oauth-state.ts lib/quickbooks-token-store.ts
QB_TEST_COMPILED_DIR="$temp_dir" node --test tests/quickbooks-foundation.test.cjs
