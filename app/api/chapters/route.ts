import { NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

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

    const newChapter = DataService.addChapter({
      id: `c-${code.toLowerCase()}`,
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

    DataService.deleteChapter(id);
    return NextResponse.json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete chapter" }, { status: 500 });
  }
}
