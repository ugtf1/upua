import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DataService } from "@/lib/data-service";

const useDatabase =
  !!process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    if (useDatabase && prisma) {
      try {
        const where: any = {};
        if (chapterId) where.chapterId = chapterId;
        if (category) where.category = category;
        if (search) {
          where.OR = [
            { memberName: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ];
        }

        const payments = await prisma.payment.findMany({
          where,
          include: { chapter: true, member: true },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        });

        if (payments && payments.length > 0) {
          return NextResponse.json({
            success: true,
            data: payments.map((p: any) => ({
              ...p,
              chapterName: p.chapter?.name || "General Chapter",
            })),
          });
        }
      } catch (dbErr) {
        console.warn("[UPUA] DB payments query failed, using live DataService fallback:", dbErr);
      }
    }

    const payments = DataService.getPayments({ chapterId, category, search });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    // Ultimate fallback: always return live payments
    const payments = DataService.getPayments();
    return NextResponse.json({ success: true, data: payments });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      chapterId,
      chapterName,
      memberId,
      memberName,
      category,
      amount,
      date,
      description,
      paymentMethod,
      stripePaymentIntentId,
    } = body;

    const parsedAmount = Number(amount);

    if (category === "donation" && parsedAmount < 50) {
      return NextResponse.json(
        { success: false, error: "Minimum donation amount is $50.00" },
        { status: 400 }
      );
    }

    if (!chapterId || !category || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid chapter, category, and positive amount are required" },
        { status: 400 }
      );
    }

    if (useDatabase && prisma) {
      const newPayment = await prisma.payment.create({
        data: {
          chapterId,
          memberId: memberId || null,
          memberName: memberName || "Anonymous Supporter",
          category,
          amount: parsedAmount,
          date: date || new Date().toISOString().split("T")[0],
          description: description || `${category.replace("_", " ")} contribution`,
          paymentMethod: paymentMethod || "stripe",
          stripePaymentIntentId: stripePaymentIntentId || `pi_${Date.now()}`,
          status: "completed",
        },
      });
      return NextResponse.json({ success: true, data: newPayment }, { status: 201 });
    }

    const newPayment = DataService.addPayment({
      chapterId,
      chapterName: chapterName || "General Chapter",
      memberName: memberName || "Anonymous Supporter",
      category,
      amount: parsedAmount,
      date: date || new Date().toISOString().split("T")[0],
      description: description || `${category.replace("_", " ")} contribution`,
      paymentMethod: paymentMethod || "stripe",
      stripePaymentIntentId: stripePaymentIntentId || `pi_${Date.now()}`,
      status: "completed",
    });

    return NextResponse.json({ success: true, data: newPayment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to record payment" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Payment ID is required" }, { status: 400 });
    }

    if (useDatabase && prisma) {
      const updated = await prisma.payment.update({
        where: { id },
        data: updates,
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = DataService.updatePayment(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update payment" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Payment ID is required" }, { status: 400 });
    }

    if (useDatabase && prisma) {
      await prisma.payment.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Payment record deleted successfully" });
    }

    DataService.deletePayment(id);
    return NextResponse.json({ success: true, message: "Payment record deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete payment" }, { status: 500 });
  }
}
