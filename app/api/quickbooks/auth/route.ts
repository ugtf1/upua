/**
 * GET /api/quickbooks/auth
 * Initiates QuickBooks OAuth 2.0 flow — redirects admin to Intuit consent screen.
 */
import { NextResponse } from "next/server";
import { QB_AUTH_URL } from "@/lib/quickbooks";

export async function GET() {
  const clientId = process.env.QB_CLIENT_ID;
  const redirectUri = process.env.QB_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "QuickBooks credentials not configured. Set QB_CLIENT_ID and QB_REDIRECT_URI in environment variables." },
      { status: 500 }
    );
  }

  const state = crypto.randomUUID(); // CSRF protection — store in session in production
  const scope = "com.intuit.quickbooks.accounting";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
  });

  return NextResponse.redirect(`${QB_AUTH_URL}?${params}`);
}
