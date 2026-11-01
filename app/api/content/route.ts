import { NextResponse } from "next/server";
import { ContentService } from "@/lib/content-service";

// ─── GET /api/content ────────────────────────────────────────────────────────
// Returns all content sections, optionally filtered by ?page=home|about|...

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") as "home" | "about" | "events" | "programs" | "blog" | null;
    const id = searchParams.get("id");

    if (id) {
      const section = ContentService.getById(id);
      if (!section) {
        return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: section });
    }

    const sections = page ? ContentService.getByPage(page) : ContentService.getAll();
    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error("[UPUA Content] GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}

// ─── PUT /api/content ────────────────────────────────────────────────────────
// Updates a section's blocks.
// Body: { sectionId: string; blocks: { id: string; value: string }[] }

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sectionId, blocks } = body;

    if (!sectionId || !Array.isArray(blocks)) {
      return NextResponse.json(
        { success: false, error: "sectionId and blocks array are required" },
        { status: 400 }
      );
    }

    const updated = ContentService.updateSection(sectionId, blocks);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[UPUA Content] PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 });
  }
}

// ─── POST /api/content/reset ─────────────────────────────────────────────────
// Reset a section (or all) to defaults.
// Body: { sectionId?: string }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionId } = body;

    if (sectionId) {
      const reset = ContentService.resetSection(sectionId);
      if (!reset) {
        return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: reset, message: "Section reset to defaults." });
    }

    ContentService.resetAll();
    return NextResponse.json({ success: true, message: "All content reset to defaults." });
  } catch (error) {
    console.error("[UPUA Content] POST reset error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset content" }, { status: 500 });
  }
}
