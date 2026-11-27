import { NextResponse } from "next/server";

// The previous endpoint fabricated successful payments without confirmation.
// PaymentIntent creation remains disabled until a verified order flow is ready.
export async function POST() {
  return NextResponse.json({ error: "Payments are not available yet." }, { status: 503 });
}
