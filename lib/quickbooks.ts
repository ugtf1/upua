/**
 * QuickBooks Online API Utility — UPUA Portal
 * Handles OAuth 2.0 token management and report fetching.
 *
 * Environment variables required (set in .env.local and Netlify dashboard):
 *   QB_CLIENT_ID         — Intuit app Client ID
 *   QB_CLIENT_SECRET     — Intuit app Client Secret
 *   QB_REDIRECT_URI      — e.g. https://yoursite.com/api/quickbooks/callback
 *   QB_ENVIRONMENT       — "sandbox" or "production"
 *
 * After OAuth, these are stored (swap for DB / KV store in production):
 *   QB_ACCESS_TOKEN      — short-lived (1 hr)
 *   QB_REFRESH_TOKEN     — long-lived (101 days)
 *   QB_REALM_ID          — QuickBooks company ID
 */

const QB_ENV = process.env.QB_ENVIRONMENT ?? "sandbox";

export const QB_BASE_URL =
  QB_ENV === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";

export const QB_AUTH_URL = "https://appcenter.intuit.com/connect/oauth2";
export const QB_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
export const QB_REVOKE_URL = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";

/** In-memory token store (single-company use).
 *  In production, persist these in your DB / Netlify Edge Config / Redis. */
let _tokenStore: {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresAt: number; // Unix ms
} | null = null;

export function saveTokens(data: {
  access_token: string;
  refresh_token: string;
  realmId: string;
  expires_in: number;
}) {
  _tokenStore = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    realmId: data.realmId,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export function getTokenStore() {
  return _tokenStore;
}

export function clearTokens() {
  _tokenStore = null;
}

export function isConnected(): boolean {
  return !!_tokenStore?.accessToken;
}

/** Refresh the access token using the stored refresh token. */
export async function refreshAccessToken(): Promise<boolean> {
  if (!_tokenStore?.refreshToken) return false;
  const creds = Buffer.from(
    `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
  ).toString("base64");
  try {
    const res = await fetch(QB_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: _tokenStore.refreshToken,
      }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    saveTokens({ ...json, realmId: _tokenStore.realmId });
    return true;
  } catch {
    return false;
  }
}

/** Get a valid access token, refreshing if expired. */
export async function getValidAccessToken(): Promise<string | null> {
  if (!_tokenStore) return null;
  if (Date.now() > _tokenStore.expiresAt - 60_000) {
    const ok = await refreshAccessToken();
    if (!ok) return null;
  }
  return _tokenStore.accessToken;
}

/** Fetch a QuickBooks report by name.
 *
 * Common report names:
 *   ProfitAndLoss, BalanceSheet, TransactionList, GeneralLedger,
 *   CashFlow, TrialBalance, CustomerSales, VendorExpenses
 */
export async function fetchQBReport(
  reportName: string,
  params: Record<string, string> = {}
): Promise<{ ok: true; data: QBReport } | { ok: false; error: string }> {
  const token = await getValidAccessToken();
  if (!token || !_tokenStore) return { ok: false, error: "Not connected to QuickBooks." };

  const query = new URLSearchParams({ minorversion: "70", ...params });
  const url = `${QB_BASE_URL}/v3/company/${_tokenStore.realmId}/reports/${reportName}?${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `QB API error ${res.status}: ${text}` };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/** QuickBooks report JSON shape (simplified) */
export interface QBReport {
  Header: {
    ReportName: string;
    DateMacro?: string;
    StartPeriod?: string;
    EndPeriod?: string;
    Currency?: string;
    Time?: string;
  };
  Columns?: {
    Column: { ColTitle: string; ColType: string }[];
  };
  Rows?: {
    Row?: QBRow[];
  };
}

export interface QBRow {
  type: string;
  group?: string;
  Header?: { ColData: { value: string; id?: string }[] };
  Summary?: { ColData: { value: string }[] };
  Rows?: { Row?: QBRow[] };
  ColData?: { value: string; id?: string }[];
}
