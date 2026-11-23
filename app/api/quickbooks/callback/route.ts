/**
 * GET /api/quickbooks/callback
 * Handles the OAuth 2.0 redirect from Intuit.
 * Exchanges the authorization code for access + refresh tokens,
 * then redirects back to the admin portal's Reports tab.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  QB_TOKEN_URL,
  saveTokens,
  getQBClientId,
  getQBClientSecret,
  getQBRedirectUri,
} from "@/lib/quickbooks";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const error = searchParams.get("error");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  if (error) {
    return NextResponse.redirect(
      `${siteUrl}/portal?tab=reports&qb_error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !realmId) {
    return NextResponse.json({ error: "Missing code or realmId from Intuit." }, { status: 400 });
  }

  const clientId = getQBClientId();
  const clientSecret = getQBClientSecret();
  const redirectUri = getQBRedirectUri();

  // Exchange authorization code for tokens
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch(QB_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("QB token exchange failed:", text);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portal?tab=reports&qb_error=token_exchange_failed`
    );
  }

  const tokens = await tokenRes.json();
  saveTokens({ ...tokens, realmId });

  console.log(`✅ QuickBooks connected — realmId: ${realmId}`);

  // Redirect back to portal Reports tab
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portal?tab=reports&qb_connected=1`
  );
}
