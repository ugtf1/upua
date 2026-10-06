FROM node:20-alpine AS base

# Install OpenSSL and libc compatibility for Alpine/Prisma
RUN apk add --no-cache libc6-compat openssl

# 1. Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm install

# 2. Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client for PostgreSQL
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY scripts/docker-entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
