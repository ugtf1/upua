/**
 * GET /api/quickbooks/reports?report=ProfitAndLoss&start_date=2025-01-01&end_date=2025-12-31
 *
 * Supported report values:
 *   ProfitAndLoss | BalanceSheet | TransactionList | GeneralLedger | CashFlow
 *
 * GET /api/quickbooks/reports?action=status   → returns connection status
 * GET /api/quickbooks/reports?action=disconnect → revokes tokens
 */
import { NextRequest, NextResponse } from "next/server";
import {
  fetchQBReport,
  isConnected,
  clearTokens,
  getTokenStore,
  QB_REVOKE_URL,
  getValidAccessToken,
} from "@/lib/quickbooks";

const ALLOWED_REPORTS = [
  "ProfitAndLoss",
  "BalanceSheet",
  "TransactionList",
  "GeneralLedger",
  "CashFlow",
  "TrialBalance",
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  // ── Status check ───────────────────────────────────────────────
  if (action === "status") {
    const store = getTokenStore();
    return NextResponse.json({
      connected: isConnected(),
      realmId: store?.realmId ?? null,
      expiresAt: store?.expiresAt ?? null,
    });
  }

  // ── Disconnect ─────────────────────────────────────────────────
  if (action === "disconnect") {
    const token = await getValidAccessToken();
    if (token) {
      const creds = Buffer.from(
        `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
      ).toString("base64");
      await fetch(QB_REVOKE_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      }).catch(() => {});
    }
    clearTokens();
    return NextResponse.json({ disconnected: true });
  }

  // ── Fetch report ───────────────────────────────────────────────
  if (!isConnected()) {
    return NextResponse.json({ error: "QuickBooks not connected." }, { status: 401 });
  }

  const report = searchParams.get("report") ?? "ProfitAndLoss";
  if (!ALLOWED_REPORTS.includes(report)) {
    return NextResponse.json(
      { error: `Unknown report type. Allowed: ${ALLOWED_REPORTS.join(", ")}` },
      { status: 400 }
    );
  }

  // Pass date-range params through
  const params: Record<string, string> = {};
  if (searchParams.get("start_date")) params.start_date = searchParams.get("start_date")!;
  if (searchParams.get("end_date")) params.end_date = searchParams.get("end_date")!;
  if (searchParams.get("date_macro")) params.date_macro = searchParams.get("date_macro")!;

  const result = await fetchQBReport(report, params);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ report: result.data });
}
