import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LIVE_CHAPTERS, getParsedQBTransactions } from "@/lib/excel-live-data";

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json({ success: false, error: "Database client not available" }, { status: 500 });
    }

    // Step 1: Wipe pre-seeded data
    const delPayments = await prisma.payment.deleteMany({});
    const delMembers = await prisma.member.deleteMany({});
    const delChapters = await prisma.chapter.deleteMany({});

    // Step 2: Seed 24 live chapters
    for (const ch of LIVE_CHAPTERS) {
      await prisma.chapter.create({
        data: {
          id: ch.id,
          name: ch.name,
          code: ch.code,
          region: ch.region,
          president: ch.president,
          contactPhone: ch.contactPhone,
          contactEmail: ch.contactEmail,
          memberCount: Math.round(ch.memberCount),
          website: ch.website || null,

          members2023: ch.members2023,
          dues2023Exp: ch.dues2023Exp,
          dues2023Paid: ch.dues2023Paid,

          members2024: ch.members2024,
          dues2024Exp: ch.dues2024Exp,
          dues2024Paid: ch.dues2024Paid,

          members2025: ch.members2025,
          dues2025Exp: ch.dues2025Exp,
          dues2025Paid: ch.dues2025Paid,

          members2026: ch.members2026,
          dues2026Exp: ch.dues2026Exp,
          dues2026Paid: ch.dues2026Paid,

          duesBalance: ch.duesBalance,

          insurance2023Paid: ch.insurance2023Paid,
          insurance2024Paid: ch.insurance2024Paid,
          insurance2025Paid: ch.insurance2025Paid,
          insuranceTotal: ch.insuranceTotal,
          insuranceColonial: ch.insuranceColonial,

          raffleStatus: ch.raffleStatus,
          raffleSent: ch.raffleSent,
          rafflePaid: ch.rafflePaid,
          raffleBalance: ch.raffleBalance,
        },
      });

      const cleanPresName = ch.president.replace(/\s*\(President\)/i, "").trim();
      await prisma.member.create({
        data: {
          id: `m-${ch.id}`,
          chapterId: ch.id,
          name: cleanPresName,
          email: ch.contactEmail,
          phone: ch.contactPhone,
          role: "Chapter President",
          status: "Active",
          duesStatus: ch.duesBalance >= 0 ? "Paid" : "Outstanding",
          joinedDate: "2023-01-01",
        },
      });
    }

    // Step 3: Seed QB transactions
    const qbTransactions = getParsedQBTransactions();
    let totalDuesAmount = 0;
    for (const tx of qbTransactions) {
      totalDuesAmount += tx.amount;
      await prisma.payment.create({
        data: {
          id: tx.id,
          chapterId: tx.chapterId,
          memberName: tx.customer,
          category: tx.category,
          amount: tx.amount,
          date: tx.date,
          description: tx.description,
          paymentMethod: tx.paymentMethod,
          confirmationNo: tx.confirmationNo || null,
          status: "completed",
        },
      });
    }

    const [chapCount, memCount, payCount] = await Promise.all([
      prisma.chapter.count(),
      prisma.member.count(),
      prisma.payment.count(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Database wiped and re-seeded with official Excel audit and QB received data",
      deleted: {
        payments: delPayments.count,
        members: delMembers.count,
        chapters: delChapters.count,
      },
      seeded: {
        chapters: chapCount,
        members: memCount,
        payments: payCount,
        totalDuesReceived: Math.round(totalDuesAmount * 100) / 100,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed live excel data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST(new Request("https://localhost/api/admin/seed-live-data", { method: "POST" }));
}
