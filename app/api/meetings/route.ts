import { NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId") || undefined;

    const meetings = DataService.getMeetings(chapterId);
    return NextResponse.json({ success: true, data: meetings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch meetings" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Meeting title and transcript are required" }, { status: 400 });
    }

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
    return NextResponse.json({ success: false, error: "Failed to save meeting record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Meeting ID is required" }, { status: 400 });
    }

    DataService.deleteMeeting(id);
    return NextResponse.json({ success: true, message: "Meeting deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete meeting" }, { status: 500 });
  }
}
