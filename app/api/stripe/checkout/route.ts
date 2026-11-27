import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedStoreItems } from "@/lib/seed-data";
import { buildSandboxLines, createSandboxCheckout, isSandboxCheckoutConfigured } from "@/lib/stripe-sandbox";

export async function POST(request: Request) {
  // This endpoint is only a local sandbox prototype. It cannot process live payments.
  const config = {
    nodeEnv: process.env.NODE_ENV,
    enabled: process.env.STRIPE_SANDBOX_CHECKOUT,
    secret: process.env.UPUA_STORE_STRIPE_TEST_KEY,
    webhookSecret: process.env.UPUA_STORE_STRIPE_TEST_WEBHOOK_SECRET,
    origin: process.env.STRIPE_SANDBOX_ORIGIN,
  };
  if (!isSandboxCheckoutConfigured(config) || !prisma) {
    return NextResponse.json({ error: "Checkout is not available yet." }, { status: 503 });
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => key !== "items")) {
      return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
    }
    const items = (body as { items?: unknown }).items;
    const lines = buildSandboxLines(items, seedStoreItems);
    const totalCents = lines.reduce((total, line) => total + line.unitAmount * line.quantity, 0);
    const order = await prisma.sandboxStoreOrder.create({ data: { totalCents, items: lines } });
    try {
      const session = await createSandboxCheckout(items, seedStoreItems, config, order.id);
      await prisma.sandboxStoreOrder.update({ where: { id: order.id }, data: { stripeSessionId: session.sessionId } });
      return NextResponse.json({ url: session.url });
    } catch {
      await prisma.sandboxStoreOrder.updateMany({ where: { id: order.id, status: "pending" }, data: { status: "failed" } });
      return NextResponse.json({ error: "Checkout is not available yet." }, { status: 503 });
    }
  } catch {
    return NextResponse.json({ error: "Checkout is unavailable or the cart is invalid." }, { status: 503 });
  }
}
