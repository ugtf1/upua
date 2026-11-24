import { NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function GET() {
  const livePayments = DataService.getPayments();
  const ledger = livePayments.map((p) => ({
    id: p.id,
    date: p.date,
    description: p.description,
    category: p.category,
    amount: p.amount,
    type: "credit",
    status: "cleared",
    account: "Main Checking",
    reference: p.confirmationNo || p.id,
    chapter: p.chapterName,
  }));

  return NextResponse.json({ transactions: ledger, ledger });
}
