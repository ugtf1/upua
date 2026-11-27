import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySandboxWebhook, getSandboxWebhookAction, verifySandboxStripeSignature } from "@/lib/stripe-webhook-sandbox";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development" || process.env.STRIPE_SANDBOX_CHECKOUT !== "1" || !prisma || !process.env.UPUA_STORE_STRIPE_TEST_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
  const payload = await request.text();
  if (!verifySandboxStripeSignature(payload, request.headers.get("stripe-signature") ?? "", process.env.UPUA_STORE_STRIPE_TEST_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  let event: unknown;
  try { event = JSON.parse(payload); } catch { return NextResponse.json({ error: "Invalid event" }, { status: 400 }); }
  const action = getSandboxWebhookAction(event);
  if (!action) return NextResponse.json({ received: true });
  try {
    const db = prisma;
    const result = await applySandboxWebhook(action, {
      find: (id) => db.sandboxStoreOrder.findUnique({ where: { id } }),
      transitionOrder: async (id, sessionId, status) => {
        await db.sandboxStoreOrder.updateMany({ where: { id, stripeSessionId: sessionId, status: status === "paid" ? { in: ["pending", "failed", "expired"] } : "pending" }, data: { status } });
      },
    });
    if (result === "not_ready") return NextResponse.json({ error: "Order not ready" }, { status: 503 });
    if (result === "mismatch") return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Order update unavailable" }, { status: 503 });
  }
}
