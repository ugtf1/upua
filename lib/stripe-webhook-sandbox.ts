import { createHmac, timingSafeEqual } from "node:crypto";

/** Verify the exact raw payload before parsing. */
export function verifySandboxStripeSignature(payload: string, header: string, secret: string, now = Date.now()): boolean {
  if (!secret.startsWith("whsec_") || payload.length > 1_000_000) return false;
  const parts = header.split(",").map((part) => part.trim().split("=", 2));
  const timestamps = parts.filter(([key]) => key === "t").map(([, value]) => value);
  if (timestamps.length !== 1 || !/^\d+$/.test(timestamps[0])) return false;
  const timestamp = Number(timestamps[0]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(now / 1000 - timestamp) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest();
  return parts.some(([key, value]) => {
    if (key !== "v1" || !/^[0-9a-f]{64}$/i.test(value ?? "")) return false;
    return timingSafeEqual(expected, Buffer.from(value, "hex"));
  });
}

export type SandboxWebhookAction = {
  orderId: string;
  sessionId: string;
  amountCents: number;
  status: "paid" | "failed" | "expired";
};

/** Only signed test events with the expected completed payment state can alter orders. */
export function getSandboxWebhookAction(event: unknown): SandboxWebhookAction | null {
  if (!event || typeof event !== "object") return null;
  const e = event as Record<string, unknown>;
  if (e.livemode !== false || typeof e.type !== "string" || !e.data || typeof e.data !== "object") return null;
  const data = (e.data as Record<string, unknown>).object;
  if (!data || typeof data !== "object") return null;
  const session = data as Record<string, unknown>;
  if (typeof session.id !== "string" || !session.id.startsWith("cs_test_") ||
      typeof session.client_reference_id !== "string" || !session.client_reference_id ||
      !Number.isSafeInteger(session.amount_total) || (session.amount_total as number) <= 0 ||
      session.currency !== "usd" || session.livemode !== false) return null;
  let status: SandboxWebhookAction["status"];
  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(e.type) && session.payment_status === "paid") {
    status = "paid";
  } else if (e.type === "checkout.session.async_payment_failed" && session.payment_status !== "paid") {
    status = "failed";
  } else if (e.type === "checkout.session.expired" && session.payment_status !== "paid") {
    status = "expired";
  } else {
    return null;
  }
  return { orderId: session.client_reference_id, sessionId: session.id, amountCents: session.amount_total as number, status };
}

export type SandboxOrder = { id: string; stripeSessionId: string | null; totalCents: number; currency: string; status: string };
export type SandboxOrderRepository = {
  find(id: string): Promise<SandboxOrder | null>;
  transitionOrder(id: string, sessionId: string, status: SandboxWebhookAction["status"]): Promise<void>;
};

/** Paid status takes precedence over failure or expiration; duplicate delivery is harmless. */
export async function applySandboxWebhook(action: SandboxWebhookAction, repository: SandboxOrderRepository): Promise<"ok" | "not_ready" | "mismatch"> {
  const order = await repository.find(action.orderId);
  if (!order || !order.stripeSessionId) return "not_ready";
  if (order.stripeSessionId !== action.sessionId || order.totalCents !== action.amountCents || order.currency !== "usd") return "mismatch";
  await repository.transitionOrder(order.id, action.sessionId, action.status);
  return "ok";
}
