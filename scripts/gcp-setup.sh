#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# UPUA Portal — GCP Bootstrap Script (Keyless with Workload Identity Federation)
# Run ONCE to set up all Google Cloud infrastructure for GitHub Actions CI/CD.
#
# Prerequisites:
#   1. gcloud CLI installed (https://cloud.google.com/sdk/docs/install)
#   2. Run: gcloud auth login
#   3. Run: gcloud config set project top-cedar-471512-k3
#   4. Fill in the SECRET VARIABLES section below before running.
#
# Usage:
#   chmod +x scripts/gcp-setup.sh
#   bash scripts/gcp-setup.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── CONFIGURATION ─────────────────────────────────────────────────────────────
PROJECT_ID="top-cedar-471512-k3"
REGION="us-east1"
ARTIFACT_REPO="upua"
SERVICE_NAME="upua-portal"
DB_INSTANCE="upuadb"
DB_NAME="upua_db"
DB_USER="postgres"
SA_NAME="upua-deploy"
SA_DISPLAY="UPUA Deployment SA"
GITHUB_REPO="ugtf1/upua"
WIF_POOL="github-pool"
WIF_PROVIDER="github-provider"

# ── SECRET VARIABLES — FILL THESE IN BEFORE RUNNING ──────────────────────────
DB_PASSWORD="CHANGE_ME_STRONG_PASSWORD"          # Cloud SQL postgres password
GEMINI_API_KEY="CHANGE_ME_GEMINI_KEY"            # From https://aistudio.google.com/app/apikey
AUTH_SECRET="upua-secret-key-prod-2026-okugbe-egba-voyan-robaro"
STRIPE_SECRET_KEY="sk_live_..."                  # Or sk_test_... for testing
STRIPE_PK_KEY="pk_live_..."                      # Or pk_test_... for testing

# ─────────────────────────────────────────────────────────────────────────────

echo "🚀 UPUA GCP Bootstrap — Project: $PROJECT_ID"
echo ""

# 1. Enable required APIs
echo "✅ [1/7] Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  --project="$PROJECT_ID"

# 2. Create Artifact Registry repository
echo "✅ [2/7] Creating Artifact Registry repository..."
gcloud artifacts repositories create "$ARTIFACT_REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="UPUA Portal container images" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (repository already exists — skipping)"

# 3. Create Cloud SQL PostgreSQL instance (if not exists)
echo "✅ [3/7] Checking Cloud SQL PostgreSQL instance '$DB_INSTANCE'..."
gcloud sql instances describe "$DB_INSTANCE" --project="$PROJECT_ID" 2>/dev/null || {
  echo "   Creating Cloud SQL instance $DB_INSTANCE..."
  gcloud sql instances create "$DB_INSTANCE" \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --region="$REGION" \
    --storage-type=SSD \
    --storage-size=10GB \
    --storage-auto-increase \
    --availability-type=zonal \
    --project="$PROJECT_ID"
}

# 4. Create database and set password
echo "✅ [4/7] Ensuring database '$DB_NAME' and credentials..."
gcloud sql databases create "$DB_NAME" \
  --instance="$DB_INSTANCE" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (database already exists — skipping)"

if [ "$DB_PASSWORD" != "CHANGE_ME_STRONG_PASSWORD" ]; then
  gcloud sql users set-password "$DB_USER" \
    --instance="$DB_INSTANCE" \
    --password="$DB_PASSWORD" \
    --project="$PROJECT_ID"
fi

# Build the Cloud SQL socket DATABASE_URL for Cloud Run
INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${DB_INSTANCE}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost/${DB_NAME}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"

# 5. Store secrets in Secret Manager
echo "✅ [5/7] Storing secrets in Secret Manager..."

create_or_update_secret() {
  local SECRET_ID="$1"
  local SECRET_VALUE="$2"
  if gcloud secrets describe "$SECRET_ID" --project="$PROJECT_ID" &>/dev/null; then
    echo "   Updating secret: $SECRET_ID"
    echo -n "$SECRET_VALUE" | gcloud secrets versions add "$SECRET_ID" --data-file=- --project="$PROJECT_ID"
  else
    echo "   Creating secret: $SECRET_ID"
    echo -n "$SECRET_VALUE" | gcloud secrets create "$SECRET_ID" --data-file=- --project="$PROJECT_ID"
  fi
}

create_or_update_secret "upua-database-url"          "$DATABASE_URL"
create_or_update_secret "upua-auth-secret"            "$AUTH_SECRET"
create_or_update_secret "upua-gemini-api-key"         "$GEMINI_API_KEY"
create_or_update_secret "upua-stripe-secret-key"      "$STRIPE_SECRET_KEY"
create_or_update_secret "upua-stripe-publishable-key" "$STRIPE_PK_KEY"
create_or_update_secret "upua-cloud-sql-instance"     "$INSTANCE_CONNECTION_NAME"

# 6. Create deployment Service Account & assign IAM roles
echo "✅ [6/7] Configuring deployment Service Account..."
gcloud iam service-accounts create "$SA_NAME" \
  --display-name="$SA_DISPLAY" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (service account already exists — skipping)"

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "   Granting IAM roles to $SA_EMAIL..."
for ROLE in \
  roles/run.admin \
  roles/artifactregistry.writer \
  roles/cloudsql.client \
  roles/secretmanager.secretAccessor \
  roles/iam.serviceAccountUser \
  roles/storage.objectViewer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="$ROLE" \
    --quiet
done

# Allow Cloud Run default compute service account to access Cloud SQL & secrets
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
for ROLE in roles/cloudsql.client roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$COMPUTE_SA" \
    --role="$ROLE" \
    --quiet
done

# 7. Configure Workload Identity Federation (WIF) — Keyless Auth for GitHub Actions
echo "✅ [7/7] Configuring Workload Identity Federation (No keys required!)..."

# Create Workload Identity Pool
gcloud iam workload-identity-pools create "$WIF_POOL" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  2>/dev/null || echo "   (Workload Identity Pool already exists — skipping)"

# Create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc "$WIF_PROVIDER" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$WIF_POOL" \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='${GITHUB_REPO}'" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  2>/dev/null || echo "   (Workload Identity Provider already exists — skipping)"

# Allow GitHub Actions repository to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/attribute.repository/${GITHUB_REPO}" \
  --quiet

WIF_PROVIDER_NAME="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/providers/${WIF_PROVIDER}"

echo ""
echo "═════════════════════════════════════════════════════════════════════════"
echo " 🎉 GITHUB ACTIONS SECRETS — ADD THESE TO YOUR REPO SETTINGS"
echo " 👉 https://github.com/ugtf1/upua/settings/secrets/actions"
echo "═════════════════════════════════════════════════════════════════════════"
echo ""
echo "Secret Name  : WIF_PROVIDER"
echo "Secret Value : $WIF_PROVIDER_NAME"
echo ""
echo "Secret Name  : DATABASE_URL"
echo "Secret Value : $DATABASE_URL"
echo ""
echo "Secret Name  : AUTH_SECRET"
echo "Secret Value : $AUTH_SECRET"
echo ""
echo "Secret Name  : GEMINI_API_KEY"
echo "Secret Value : $GEMINI_API_KEY"
echo ""
echo "Secret Name  : STRIPE_SECRET_KEY"
echo "Secret Value : $STRIPE_SECRET_KEY"
echo ""
echo "Secret Name  : NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "Secret Value : $STRIPE_PK_KEY"
echo "═════════════════════════════════════════════════════════════════════════"
echo ""
echo "✨ No Service Account Keys needed! Secure OIDC authentication is active."
echo "   Push to master to deploy:"
echo "   git push origin master"
