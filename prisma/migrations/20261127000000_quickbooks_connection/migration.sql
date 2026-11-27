CREATE TABLE "QuickBooksOAuthState" (
    "stateHash" TEXT NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "QuickBooksOAuthState_pkey" PRIMARY KEY ("stateHash")
);

CREATE INDEX "QuickBooksOAuthState_expiresAt_idx" ON "QuickBooksOAuthState"("expiresAt");

CREATE TABLE "QuickBooksConnection" (
    "id" TEXT NOT NULL,
    "encrypted" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "QuickBooksConnection_pkey" PRIMARY KEY ("id")
);
