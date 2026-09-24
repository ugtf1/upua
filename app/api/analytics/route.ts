import { NextResponse } from "next/server";
import { months, seedMembers, seedTransactions } from "@/lib/seed-data";

export async function GET() {
  const activeMembers = seedMembers.filter((member) => member.status === "Active").length;
  const pendingMembers = seedMembers.filter((member) => member.status === "Pending").length;
  const duesCollected = seedTransactions
    .filter((entry) => entry.status === "Paid")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const outstandingDues = seedTransactions
    .filter((entry) => entry.status !== "Paid")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const monthlySumMap = Object.fromEntries(months.map((month) => [month, 0]));
  seedTransactions.forEach((transaction) => {
    const monthShort = transaction.month.slice(0, 3);
    if (monthlySumMap[monthShort] !== undefined) {
      monthlySumMap[monthShort] += transaction.amount;
    }
  });
  const departments = Object.entries(
    seedMembers.reduce<Record<string, number>>((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return NextResponse.json({
    stats: {
      totalMembers: seedMembers.length,
      activeMembers,
      pendingMembers,
      duesCollected,
      outstandingDues,
      attendanceRate: 91.6,
      recordedMeetings: 2
    },
    monthlyTransactions: months.slice(0, 8).map((month) => ({ month, value: monthlySumMap[month] })),
    departments
  });
}
