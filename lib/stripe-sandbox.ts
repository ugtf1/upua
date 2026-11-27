/**
 * Isolated development-only Checkout foundation.
 * No live payments or order fulfillment are supported by this module.
 */
export type SandboxProduct = {
  id: string;
  title: string;
  category: string;
  price: number;
  options?: string[];
  inStock: boolean;
};

export type CheckoutLine = { name: string; unitAmount: number; quantity: number };

export function buildSandboxLines(input: unknown, catalog: SandboxProduct[]): CheckoutLine[] {
  if (!Array.isArray(input) || input.length < 1 || input.length > 30) throw new Error("Invalid cart.");
  const lines: CheckoutLine[] = [];
  let hasShipping = false;
  for (const value of input) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid cart item.");
    const row = value as Record<string, unknown>;
    if (Object.keys(row).some((key) => !["productId", "quantity", "selectedOption"].includes(key))) throw new Error("Invalid cart item.");
    const product = catalog.find((item) => item.id === row.productId);
    const quantity = row.quantity;
    if (!product || !product.inStock || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 25) throw new Error("Invalid product or quantity.");
    // Ticket registrations need a durable attendee record and are intentionally not supported yet.
    if (product.id === "convention-cultural-gala-ticket") throw new Error("Event registration is not available in the checkout test.");
    let price = product.price;
    let name = product.title;
    if (product.options?.length) {
      if (typeof row.selectedOption !== "string" || !product.options.includes(row.selectedOption)) throw new Error("Invalid product option.");
      name += ` — ${row.selectedOption}`;
      const match = row.selectedOption.match(/\$([\d,]+(?:\.\d{2})?)/);
      if (match) price = Number(match[1].replace(/,/g, ""));
    } else if (row.selectedOption !== undefined) {
      throw new Error("Invalid product option.");
    }
    const cents = Math.round(price * 100);
    if (!Number.isFinite(price) || price <= 0 || Math.abs(cents / 100 - price) > 0.000001 || cents > 10000000) throw new Error("Invalid catalog price.");
    lines.push({ name, unitAmount: cents, quantity: quantity as number });
    if (product.category !== "Convention Packages") hasShipping = true;
  }
  if (hasShipping) lines.push({ name: "Shipping", unitAmount: 800, quantity: 1 });
  return lines;
}

type SandboxConfig = { nodeEnv?: string; enabled?: string; secret?: string; origin?: string; webhookSecret?: string };

export function isSandboxCheckoutConfigured(config: SandboxConfig): boolean {
  if (config.nodeEnv !== "development" || config.enabled !== "1" || !/^(sk|rk)_test_[A-Za-z0-9]+$/.test(config.secret ?? "") || /placeholder/i.test(config.secret ?? "") || !/^whsec_[A-Za-z0-9]+$/.test(config.webhookSecret ?? "")) return false;
  try {
    const origin = new URL(config.origin ?? "");
    return origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname) && !origin.username && !origin.password && origin.pathname === "/" && !origin.search && !origin.hash;
  } catch {
    return false;
  }
}

export async function createSandboxCheckout(
  input: unknown,
  catalog: SandboxProduct[],
  config: SandboxConfig,
  orderId: string,
  request: typeof fetch = fetch,
): Promise<{ url: string; sessionId: string }> {
  if (!isSandboxCheckoutConfigured(config)) throw new Error("Checkout is unavailable.");
  const origin = new URL(config.origin!);
  const lines = buildSandboxLines(input, catalog);
  const params = new URLSearchParams({
    mode: "payment",
    client_reference_id: orderId,
    success_url: `${origin.origin}/store?checkout=test-return`,
    cancel_url: `${origin.origin}/store?checkout=test-cancelled`,
  });
  lines.forEach((line, index) => {
    params.set(`line_items[${index}][price_data][currency]`, "usd");
    params.set(`line_items[${index}][price_data][product_data][name]`, line.name);
    params.set(`line_items[${index}][price_data][unit_amount]`, String(line.unitAmount));
    params.set(`line_items[${index}][quantity]`, String(line.quantity));
  });
  const response = await request("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.secret}`, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": `checkout-${orderId}` },
    body: params.toString(),
  });
  if (!response.ok) throw new Error("Checkout is unavailable.");
  const session: unknown = await response.json();
  if (!session || typeof session !== "object") throw new Error("Checkout is unavailable.");
  const data = session as Record<string, unknown>;
  if (data.livemode !== false || typeof data.id !== "string" || !data.id.startsWith("cs_test_") || typeof data.url !== "string") throw new Error("Checkout is unavailable.");
  let url: URL;
  try { url = new URL(data.url); } catch { throw new Error("Checkout is unavailable."); }
  if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com" || url.port || url.username || url.password) throw new Error("Checkout is unavailable.");
  return { url: url.href, sessionId: data.id };
}
