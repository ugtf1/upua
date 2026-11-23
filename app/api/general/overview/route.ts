import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DataService } from "@/lib/data-service";

const useDatabase =
  !!process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:");

export async function GET() {
  try {
    const defaultOverview = DataService.getGeneralOverview();

    if (useDatabase && prisma) {
      try {
        const [chapterCount, memberCount, paymentAgg, expenseAgg] = await Promise.all([
          prisma.chapter.count(),
          prisma.member.count(),
          prisma.payment.aggregate({
            _sum: { amount: true },
          }),
          prisma.expense.aggregate({
            _sum: { amount: true },
          }),
        ]);

        const dbTotalIncome = paymentAgg._sum.amount ?? 0;
        const dbTotalExpenses = expenseAgg._sum.amount ?? 0;

        return NextResponse.json({
          success: true,
          data: {
            ...defaultOverview,
            totalChapters: chapterCount > 0 ? chapterCount : defaultOverview.totalChapters,
            totalMembers: memberCount > 0 ? memberCount : defaultOverview.totalMembers,
            totalIncome: dbTotalIncome > 0 ? dbTotalIncome : defaultOverview.totalIncome,
            totalExpenses: dbTotalExpenses > 0 ? dbTotalExpenses : defaultOverview.totalExpenses,
            netBalance:
              dbTotalIncome > 0 || dbTotalExpenses > 0
                ? dbTotalIncome - dbTotalExpenses
                : defaultOverview.netBalance,
          },
        });
      } catch (err) {
        console.warn("[UPUA] DB overview aggregate fallback:", err);
      }
    }

    return NextResponse.json({ success: true, data: defaultOverview });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch general overview" }, { status: 500 });
  }
}
