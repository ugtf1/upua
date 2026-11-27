# Deployment safety

The GitHub Actions workflow on `master` builds and deploys the Cloud Run service.
Pull requests run a separate build and smoke test without production credentials.
Do not merge or deploy changes until their configuration and impact have been reviewed.

The legacy `scripts/gcp-setup.sh` is disabled. It included a predictable authentication
secret, printed credentials, and granted project-wide secret access. Disabling the script
does not revoke any existing permissions or rotate credentials. If the old authentication
secret was ever used, rotate it through a coordinated production change.

The deployment workflow still injects several GitHub Actions secrets as Cloud Run
environment variables. The separate Cloud Build configuration also deploys the service.
Before migrating secrets or replacing either deployment path, inventory the live service,
build triggers, service identities, IAM, secret names, versions, and rollback settings.
Do not paste credentials into source, pull requests, logs, or terminal history.

The removed live-data reseed endpoint deleted chapter, member, and payment records and
was callable without authentication. Its removal does not change any existing data or
deployment; the protections take effect only after the change is reviewed and deployed.
