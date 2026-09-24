import { NextResponse } from "next/server";
import { seedTransactions } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ transactions: seedTransactions, ledger: seedTransactions });
}
