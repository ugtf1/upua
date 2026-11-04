import { NextRequest, NextResponse } from "next/server";
import { ContentService } from "@/lib/content-service";
import { githubCMS } from "@/lib/github-cms";

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
// Works across both environments:
//   1. Local dev / container with writable filesystem: writes directly to disk
//   2. Vercel serverless (read-only filesystem): commits directly via GitHub API
export async function PUT(req: NextRequest) {
  try {
    const clientToken = req.headers.get("x-github-token")?.trim() || "";
    const body = await req.json();
    const { type, name, data } = body;

    if (!type || !name || data === undefined) {
      return NextResponse.json({ error: "Missing required fields (type, name, data)" }, { status: 400 });
    }

    // Determine the content file path relative to repository root
    let contentRelativePath: string;
    if (type === "page") {
      contentRelativePath = `content/pages/${name}.json`;
    } else if (type === "collection") {
      contentRelativePath = `content/${name}.json`;
    } else if (type === "global") {
      contentRelativePath = "content/global/site-settings.json";
    } else {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const jsonContent = JSON.stringify(data, null, 2);

    // Strategy 1: Try local filesystem write (dev / docker / self-hosted)
    const localWriteOk = githubCMS.writeLocalFile(contentRelativePath, jsonContent);

    if (localWriteOk) {
      return NextResponse.json({
        success: true,
        message: `Content saved: ${contentRelativePath}`,
        savedVia: "filesystem",
      });
    }

    // Strategy 2: Filesystem is read-only (e.g. AWS Lambda / Vercel Serverless)
    // Commit the change directly to GitHub master, triggering auto-deploy
    if (!githubCMS.isConfigured(clientToken)) {
      return NextResponse.json(
        {
          error:
            "Vercel filesystem is read-only. Please provide your GitHub Personal Access Token in the 'Publish & Deploy' tab to commit directly to GitHub, or add GITHUB_TOKEN to your Vercel Project Settings.",
          code: "MISSING_GITHUB_TOKEN",
        },
        { status: 400 }
      );
    }

    const commitResult = await githubCMS.commitFilesToGitHub(
      [{ path: contentRelativePath, content: jsonContent, encoding: "utf-8" }],
      `CMS: Update ${type}/${name} [editor-save]`,
      clientToken
    );

    if (!commitResult.success) {
      return NextResponse.json(
        { error: commitResult.error || "Failed to commit content to GitHub" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Content saved & committed to GitHub: ${contentRelativePath}`,
      commitSha: commitResult.commitSha,
      savedVia: "github",
    });
  } catch (err: any) {
    console.error("[PUT /api/cms/content] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update content" }, { status: 500 });
  }
}
