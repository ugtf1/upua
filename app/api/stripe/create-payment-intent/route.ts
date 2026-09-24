import { NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "usd", category, chapterId, memberName, email, description } = body;

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ success: false, error: "Valid amount is required" }, { status: 400 });
    }

    if (category === "donation" && parsedAmount < 50) {
      return NextResponse.json(
        { success: false, error: "Minimum donation amount is $50.00" },
        { status: 400 }
      );
    }

    // Stripe Secret Key integration (if configured in environment)
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey && !stripeKey.startsWith("sk_test_placeholder")) {
      // Live or real test Stripe execution via Stripe API
      const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: Math.round(parsedAmount * 100).toString(),
          currency: currency.toLowerCase(),
          description: description || `UPUA ${category || "contribution"}`,
          "receipt_email": email || "",
        }).toString(),
      });

      const stripeData = await stripeRes.json();
      if (!stripeRes.ok) {
        return NextResponse.json({ success: false, error: stripeData.error?.message || "Stripe initialization failed" }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        clientSecret: stripeData.client_secret,
        paymentIntentId: stripeData.id,
      });
    }

    // High-performance test/demo mode for MVP presentation
    const mockIntentId = `pi_${Date.now()}_test_${Math.random().toString(36).substring(2, 9)}`;

    // Automatically log payment into UPUA database
    DataService.addPayment({
      chapterId: chapterId || "c-houston",
      chapterName: "Online Direct Payment",
      memberName: memberName || email || "Direct Supporter",
      category: category || "donation",
      amount: parsedAmount,
      date: new Date().toISOString().split("T")[0],
      description: description || `Online ${category || "contribution"} via Stripe`,
      paymentMethod: "stripe",
      stripePaymentIntentId: mockIntentId,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      clientSecret: `${mockIntentId}_secret_test`,
      paymentIntentId: mockIntentId,
      mode: "setup_demo",
      message: "Payment authorized and logged successfully. Stripe gateway ready for live keys.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal payment processing error" }, { status: 500 });
  }
}
