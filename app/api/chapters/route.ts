import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DataService } from "@/lib/data-service";

const useDatabase =
  !!process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (useDatabase && prisma) {
      if (id) {
        const chapter = await prisma.chapter.findUnique({
          where: { id },
          include: { members: true, payments: true },
        });
        if (!chapter) {
          return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: chapter });
      }

      const chapters = await prisma.chapter.findMany({
        orderBy: { name: "asc" },
      });
      const formatted = chapters.map((ch: any) => {
        const totalDuesPaid =
          (ch.dues2023Paid || 0) +
          (ch.dues2024Paid || 0) +
          (ch.dues2025Paid || 0) +
          (ch.dues2026Paid || 0);
        return {
          ...ch,
          paymentsBreakdown: {
            monthlyDues: totalDuesPaid,
            donations: 0,
            tickets: ch.rafflePaid || 0,
            merchandise: 0,
            total: totalDuesPaid + (ch.rafflePaid || 0),
          },
        };
      });
      return NextResponse.json({ success: true, data: formatted });
    }

    if (id) {
      const chapter = DataService.getChapterById(id);
      if (!chapter) {
        return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: chapter });
    }

    const chapters = DataService.getChapters();
    return NextResponse.json({ success: true, data: chapters });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch chapters" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, region, president, contactEmail, memberCount, website } = body;

    if (!name || !code) {
      return NextResponse.json({ success: false, error: "Chapter name and code are required" }, { status: 400 });
    }

    const chapterId = `c-${code.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

    if (useDatabase && prisma) {
      const newChapter = await prisma.chapter.create({
        data: {
          id: chapterId,
          name,
          code: code.toUpperCase(),
          region: region || "General",
          president: president || "Pending Appointment",
          contactEmail: contactEmail || `${code.toLowerCase()}@upuamerica.org`,
          memberCount: Number(memberCount) || 0,
          website: website || null,
        },
      });
      return NextResponse.json({ success: true, data: newChapter }, { status: 201 });
    }

    const newChapter = DataService.addChapter({
      id: chapterId,
      name,
      code: code.toUpperCase(),
      region: region || "General",
      president: president || "Pending Appointment",
      contactEmail: contactEmail || `${code.toLowerCase()}@upuamerica.org`,
      memberCount: Number(memberCount) || 0,
      website,
    });

    return NextResponse.json({ success: true, data: newChapter }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create chapter" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Chapter ID is required" }, { status: 400 });
    }

    if (useDatabase && prisma) {
      const updated = await prisma.chapter.update({
        where: { id },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.code && { code: updates.code.toUpperCase() }),
          ...(updates.region && { region: updates.region }),
          ...(updates.president && { president: updates.president }),
          ...(updates.contactEmail && { contactEmail: updates.contactEmail }),
          ...(updates.memberCount !== undefined && { memberCount: Number(updates.memberCount) }),
          ...(updates.website !== undefined && { website: updates.website }),
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = DataService.updateChapter(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update chapter" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Chapter ID is required" }, { status: 400 });
    }

    if (useDatabase && prisma) {
      await prisma.chapter.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Chapter deleted successfully" });
    }

    DataService.deleteChapter(id);
    return NextResponse.json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete chapter" }, { status: 500 });
  }
}
