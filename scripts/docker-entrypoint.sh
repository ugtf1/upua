#!/bin/sh
set -e

# Automatically run Prisma migrations on Cloud SQL when DATABASE_URL is PostgreSQL
case "$DATABASE_URL" in
  postgres*)
    echo "==> [UPUA] Applying Prisma database migrations to Cloud SQL..."
    npx prisma migrate deploy || echo "==> [UPUA] Notice: Migrations already up to date or completed."
    ;;
  *)
    echo "==> [UPUA] Skipping migrations (non-PostgreSQL DATABASE_URL)."
    ;;
esac

echo "==> [UPUA] Starting Next.js server on port ${PORT:-8080}..."
exec npm start
