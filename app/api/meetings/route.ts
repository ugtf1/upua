import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DataService } from "@/lib/data-service";

type MeetingRow = Awaited<ReturnType<typeof prisma.meeting.findMany>>[number];

// Detect whether a real PostgreSQL DATABASE_URL is configured (Cloud SQL / Neon / Supabase).
// When false, fall back to the in-memory DataService so dev mode still works.
const useDatabase =
  !!process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId") || undefined;

    if (useDatabase) {
      const meetings = await prisma.meeting.findMany({
        where: chapterId ? { chapterId } : undefined,
        orderBy: { createdAt: "desc" },
      });

      // Parse stored JSON strings back to arrays
      const parsed = meetings.map((m: MeetingRow) => ({
        ...m,
        keyDecisions: safeParseJSON(m.keyDecisions, []),
        actionItems: safeParseJSON(m.actionItems, []),
      }));

      return NextResponse.json({ success: true, data: parsed });
    }

    // In-memory fallback (dev / Vercel without DB)
    const meetings = DataService.getMeetings(chapterId);
    return NextResponse.json({ success: true, data: meetings });
  } catch (error) {
    console.error("[UPUA] Failed to fetch meetings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      date,
      chapterId,
      chapterName,
      duration,
      recordedBy,
      audioBlobUrl,
      transcript,
      summary,
      keyDecisions,
      actionItems,
    } = body;

    if (!title || !transcript) {
      return NextResponse.json(
        { success: false, error: "Meeting title and transcript are required" },
        { status: 400 }
      );
    }

    if (useDatabase) {
      const meeting = await prisma.meeting.create({
        data: {
          title,
          date: date || new Date().toISOString().split("T")[0],
          chapterId: chapterId || null,
          duration: duration || "45m",
          recordedBy: recordedBy || "Administrative Recorder",
          audioBlobUrl: audioBlobUrl || null,
          transcript,
          summary: summary || "Meeting convened and reviewed organizational matters.",
          keyDecisions: JSON.stringify(keyDecisions || []),
          actionItems: JSON.stringify(actionItems || []),
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            ...meeting,
            keyDecisions: keyDecisions || [],
            actionItems: actionItems || [],
          },
        },
        { status: 201 }
      );
    }

    // In-memory fallback
    const newMeeting = DataService.addMeeting({
      title,
      date: date || new Date().toISOString().split("T")[0],
      chapterId: chapterId || null,
      chapterName: chapterName || "National Executive Assembly",
      duration: duration || "45m",
      recordedBy: recordedBy || "Administrative Recorder",
      audioBlobUrl: audioBlobUrl || null,
      transcript,
      summary: summary || "Meeting convened and reviewed organizational matters.",
      keyDecisions: keyDecisions || [],
      actionItems: actionItems || [],
    });

    return NextResponse.json({ success: true, data: newMeeting }, { status: 201 });
  } catch (error) {
    console.error("[UPUA] Failed to save meeting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save meeting record" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    if (useDatabase) {
      await prisma.meeting.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Meeting deleted successfully" });
    }

    DataService.deleteMeeting(id);
    return NextResponse.json({ success: true, message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("[UPUA] Failed to delete meeting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function safeParseJSON<T>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}
