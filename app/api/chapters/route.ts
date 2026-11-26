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
      try {
        if (id) {
          const chapter = await prisma.chapter.findUnique({
            where: { id },
            include: { members: true, payments: true },
          });
          if (chapter) {
            return NextResponse.json({ success: true, data: chapter });
          }
        } else {
          const chapters = await prisma.chapter.findMany({
            orderBy: { name: "asc" },
          });
          if (chapters && chapters.length > 0) {
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
        }
      } catch (dbErr) {
        console.warn("[UPUA] DB chapters query failed, using live DataService fallback:", dbErr);
      }
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
    // Ultimate fallback: always return live chapters
    const chapters = DataService.getChapters();
    return NextResponse.json({ success: true, data: chapters });
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
      try {
        const updated = await prisma.chapter.update({
          where: { id },
          data: {
            ...(updates.name && { name: updates.name }),
            ...(updates.code && { code: updates.code.toUpperCase() }),
            ...(updates.region && { region: updates.region }),
            ...(updates.president && { president: updates.president }),
            ...(updates.contactEmail && { contactEmail: updates.contactEmail }),
            ...(updates.contactPhone !== undefined && { contactPhone: updates.contactPhone }),
            ...(updates.memberCount !== undefined && { memberCount: Number(updates.memberCount) }),
            ...(updates.website !== undefined && { website: updates.website }),
            ...(updates.dues2023Paid !== undefined && { dues2023Paid: Number(updates.dues2023Paid) }),
            ...(updates.dues2023Exp !== undefined && { dues2023Exp: Number(updates.dues2023Exp) }),
            ...(updates.dues2024Paid !== undefined && { dues2024Paid: Number(updates.dues2024Paid) }),
            ...(updates.dues2024Exp !== undefined && { dues2024Exp: Number(updates.dues2024Exp) }),
            ...(updates.dues2025Paid !== undefined && { dues2025Paid: Number(updates.dues2025Paid) }),
            ...(updates.dues2025Exp !== undefined && { dues2025Exp: Number(updates.dues2025Exp) }),
            ...(updates.dues2026Paid !== undefined && { dues2026Paid: Number(updates.dues2026Paid) }),
            ...(updates.dues2026Exp !== undefined && { dues2026Exp: Number(updates.dues2026Exp) }),
            ...(updates.duesBalance !== undefined && { duesBalance: Number(updates.duesBalance) }),
            ...(updates.insurance2023Paid !== undefined && { insurance2023Paid: Number(updates.insurance2023Paid) }),
            ...(updates.insurance2024Paid !== undefined && { insurance2024Paid: Number(updates.insurance2024Paid) }),
            ...(updates.insurance2025Paid !== undefined && { insurance2025Paid: Number(updates.insurance2025Paid) }),
            ...(updates.insuranceTotal !== undefined && { insuranceTotal: Number(updates.insuranceTotal) }),
            ...(updates.rafflePaid !== undefined && { rafflePaid: Number(updates.rafflePaid) }),
            ...(updates.raffleBalance !== undefined && { raffleBalance: Number(updates.raffleBalance) }),
            ...(updates.raffleStatus !== undefined && { raffleStatus: updates.raffleStatus }),
          },
        });
        DataService.updateChapter(id, updates);
        return NextResponse.json({ success: true, data: updated });
      } catch (dbErr) {
        console.warn("[UPUA] DB chapter update failed, using DataService fallback:", dbErr);
      }
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
      try {
        await prisma.chapter.delete({ where: { id } });
        DataService.deleteChapter(id);
        return NextResponse.json({ success: true, message: "Chapter deleted successfully" });
      } catch (dbErr) {
        console.warn("[UPUA] DB chapter delete failed, using DataService fallback:", dbErr);
      }
    }

    DataService.deleteChapter(id);
    return NextResponse.json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete chapter" }, { status: 500 });
  }
}
