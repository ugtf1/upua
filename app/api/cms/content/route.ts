import { NextRequest, NextResponse } from "next/server";
import { ContentService } from "@/lib/content-service";

// GET /api/cms/content?type=(page|collection|global)&name=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "page";
    const name = searchParams.get("name") || "home";

    if (type === "page") {
      const data = ContentService.getPage(name, null);
      return NextResponse.json({ success: true, data });
    }

    if (type === "collection") {
      const data = ContentService.getCollection(name, []);
      return NextResponse.json({ success: true, data });
    }

    if (type === "global") {
      const data = ContentService.getGlobalSettings(null);
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch content" }, { status: 500 });
  }
}

// PUT /api/cms/content
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, data } = body;

    if (!type || !name || data === undefined) {
      return NextResponse.json({ error: "Missing required fields (type, name, data)" }, { status: 400 });
    }

    let success = false;
    if (type === "page") {
      success = ContentService.updatePage(name, data);
    } else if (type === "collection") {
      success = ContentService.updateCollection(name, data);
    } else if (type === "global") {
      success = ContentService.updateGlobalSettings(data);
    }

    if (!success) {
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Successfully updated ${type}/${name}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update content" }, { status: 500 });
  }
}
