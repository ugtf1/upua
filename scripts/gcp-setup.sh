#!/usr/bin/env bash
# The original bootstrap is intentionally disabled. It embedded and printed
# credentials and granted project-wide access to secrets. Do not re-enable it.
set -euo pipefail

cat >&2 <<'MESSAGE'
UPUA GCP bootstrap is disabled for security.

This legacy script exposed credentials and granted broad project-level access.
It does not provision or change any Google Cloud resources or IAM permissions.

Before provisioning, review the target project's existing deployment and IAM
configuration, and create a new, reviewed setup with least-privilege access.
Store credentials outside the repository using an appropriate secret manager.
If the former hard-coded authentication secret was used, rotate it separately.
MESSAGE
exit 1
