#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# UPUA Portal — GCP Bootstrap Script
# Run ONCE to set up all Google Cloud infrastructure for the first time.
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
DB_INSTANCE="upua-db"
DB_NAME="upua_db"
DB_USER="postgres"
SA_NAME="upua-deploy"
SA_DISPLAY="UPUA Deployment SA"

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
echo "✅ [1/8] Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com \
  --project="$PROJECT_ID"

# 2. Create Artifact Registry repository
echo "✅ [2/8] Creating Artifact Registry repository..."
gcloud artifacts repositories create "$ARTIFACT_REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="UPUA Portal container images" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (repository already exists — skipping)"

# 3. Create Cloud SQL PostgreSQL instance
echo "✅ [3/8] Creating Cloud SQL PostgreSQL 16 instance (this may take 3-5 min)..."
gcloud sql instances create "$DB_INSTANCE" \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region="$REGION" \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --availability-type=zonal \
  --no-assign-ip \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (Cloud SQL instance already exists — skipping)"

# 4. Create database and set password
echo "✅ [4/8] Creating database and setting credentials..."
gcloud sql databases create "$DB_NAME" \
  --instance="$DB_INSTANCE" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (database already exists — skipping)"

gcloud sql users set-password "$DB_USER" \
  --instance="$DB_INSTANCE" \
  --password="$DB_PASSWORD" \
  --project="$PROJECT_ID"

# Build the Cloud SQL socket DATABASE_URL for Cloud Run
INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${DB_INSTANCE}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost/${DB_NAME}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"

# 5. Store secrets in Secret Manager
echo "✅ [5/8] Storing secrets in Secret Manager..."

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

# 6. Create deployment Service Account
echo "✅ [6/8] Creating deployment Service Account..."
gcloud iam service-accounts create "$SA_NAME" \
  --display-name="$SA_DISPLAY" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "   (service account already exists — skipping)"

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant required IAM roles to the SA
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

# Also allow Cloud Run service identity to access Cloud SQL & secrets
COMPUTE_SA="$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')-compute@developer.gserviceaccount.com"
for ROLE in roles/cloudsql.client roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$COMPUTE_SA" \
    --role="$ROLE" \
    --quiet
done

# 7. Create SA key and print GitHub secret instructions
echo "✅ [7/8] Generating Service Account key for GitHub Actions..."
KEY_FILE="/tmp/upua-gcp-sa-key.json"
gcloud iam service-accounts keys create "$KEY_FILE" \
  --iam-account="$SA_EMAIL" \
  --project="$PROJECT_ID"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " GITHUB ACTIONS SECRETS — ADD THESE TO YOUR REPO SETTINGS"
echo " https://github.com/ugtf1/upua/settings/secrets/actions"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Secret Name         : GCP_PROJECT_ID"
echo "Secret Value        : $PROJECT_ID"
echo ""
echo "Secret Name         : GCP_SA_KEY"
echo "Secret Value        : (contents of $KEY_FILE — see below)"
echo ""
cat "$KEY_FILE"
echo ""
echo "Secret Name         : DATABASE_URL"
echo "Secret Value        : $DATABASE_URL"
echo ""
echo "Secret Name         : AUTH_SECRET"
echo "Secret Value        : $AUTH_SECRET"
echo ""
echo "Secret Name         : GEMINI_API_KEY"
echo "Secret Value        : $GEMINI_API_KEY"
echo ""
echo "Secret Name         : CLOUD_SQL_INSTANCE_CONNECTION_NAME"
echo "Secret Value        : $INSTANCE_CONNECTION_NAME"
echo ""
echo "Secret Name         : STRIPE_SECRET_KEY"
echo "Secret Value        : $STRIPE_SECRET_KEY"
echo ""
echo "Secret Name         : NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "Secret Value        : $STRIPE_PK_KEY"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Clean up key file
rm -f "$KEY_FILE"

# 8. Run initial Prisma migration (requires DATABASE_URL to be set locally)
echo "✅ [8/8] Prisma migration reminder:"
echo "   After setting DATABASE_URL in your .env.local (pointing to Cloud SQL proxy),"
echo "   run: npx prisma migrate deploy"
echo "   Or it will run automatically via the GitHub Actions pipeline on next push."
echo ""
echo "🎉 GCP Bootstrap complete!"
echo ""
echo "   Cloud SQL Instance : $INSTANCE_CONNECTION_NAME"
echo "   Artifact Registry  : $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO"
echo "   Cloud Run Service  : $SERVICE_NAME (will appear after first deploy)"
echo ""
echo "   Push to master to trigger the full CI/CD pipeline:"
echo "   git push origin master"
