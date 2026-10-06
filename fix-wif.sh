#!/bin/bash
PROJECT_ID="top-cedar-471512-k3"
PROJECT_NUMBER="30228073381"
WIF_POOL="github-pool"
GITHUB_REPO="ugtf1/upua"
SA_EMAIL="upua-deploy@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Executing IAM policy binding with correct format..."
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://://googleapis.com{PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/attribute.repository/${GITHUB_REPO}"
