import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DataService } from "@/lib/data-service";

const useDatabase =
  !!process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId") || undefined;

    if (useDatabase && prisma) {
      try {
        const dbMembers = await prisma.member.findMany({
          where: chapterId ? { chapterId } : undefined,
          include: { chapter: true },
          orderBy: { name: "asc" },
        });

        if (dbMembers.length > 0) {
          const formatted = dbMembers.map((m: any, idx: number) => ({
            id: m.id,
            memberCode: `UPUA-${String(idx + 1).padStart(3, "0")}`,
            name: m.name,
            email: m.email,
            phone: m.phone || "+1 (555) 000-0000",
            department: m.chapter?.name || "General",
            role: m.role || "Member",
            status: m.status || "Active",
            joinDate: m.joinedDate || m.createdAt.toISOString().split("T")[0],
            duesOwed: m.duesStatus === "Outstanding" ? 100 : 0,
            duesPaid: m.duesStatus === "Paid" ? 500 : 0,
            avatar: m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
            address: m.chapter?.region || "USA",
          }));
          return NextResponse.json({ members: formatted });
        }
      } catch (dbErr) {
        console.warn("[UPUA] DB members query failed, using live DataService fallback:", dbErr);
      }
    }

    const liveMembers = DataService.getMembers(chapterId);
    const formatted = liveMembers.map((m: any, idx: number) => ({
      id: m.id,
      memberCode: `UPUA-${String(idx + 1).padStart(3, "0")}`,
      name: m.name,
      email: m.email,
      phone: m.phone || "+1 (555) 000-0000",
      department: m.chapterName || "General",
      role: m.role || "Chapter President",
      status: m.status || "Active",
      joinDate: m.joinedDate || "2023-01-01",
      duesOwed: m.duesStatus === "Outstanding" ? 100 : 0,
      duesPaid: m.duesStatus === "Paid" ? 500 : 0,
      avatar: m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
      address: m.chapterName || "USA",
    }));
    return NextResponse.json({ members: formatted });
  } catch (error) {
    console.error("[UPUA] Failed to fetch members:", error);
    const liveMembers = DataService.getMembers();
    return NextResponse.json({ members: liveMembers });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chapterId, name, email, phone, role, status, duesStatus } = body;

    if (!name || !email || !chapterId) {
      return NextResponse.json(
        { success: false, error: "Name, email, and chapterId are required" },
        { status: 400 }
      );
    }

    if (useDatabase && prisma) {
      const newMember = await prisma.member.create({
        data: {
          id: `m-${Date.now()}`,
          chapterId,
          name,
          email,
          phone: phone || null,
          role: role || "Member",
          status: status || "Active",
          duesStatus: duesStatus || "Paid",
          joinedDate: new Date().toISOString().split("T")[0],
        },
      });
      return NextResponse.json({ success: true, data: newMember }, { status: 201 });
    }

    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create member" },
      { status: 500 }
    );
  }
}
