CREATE TABLE "SandboxStoreOrder" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SandboxStoreOrder_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SandboxStoreOrder_stripeSessionId_key" ON "SandboxStoreOrder"("stripeSessionId");
