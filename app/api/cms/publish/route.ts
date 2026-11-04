import { NextRequest, NextResponse } from "next/server";
import { ContentService } from "@/lib/content-service";

// POST /api/cms/publish — Commits all staged content & media changes to GitHub master
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body.message || `CMS: Publish website content update (${new Date().toLocaleDateString()})`;

    const result = await ContentService.publishToGitHub(message);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "GitHub commit failed. Check GITHUB_TOKEN permissions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      commitSha: result.commitSha,
      message: "Published successfully! Vercel and Google Cloud Run deployment triggered.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to publish" }, { status: 500 });
  }
}
