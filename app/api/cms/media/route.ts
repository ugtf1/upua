import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { githubCMS } from "@/lib/github-cms";

// GET /api/cms/media — Lists images in public/assets/cms and existing public/assets
export async function GET() {
  try {
    const mediaList: Array<{
      filename: string;
      url: string;
      folder: string;
      sizeBytes: number;
      modifiedAt: string;
    }> = [];

    const publicDir = path.join(process.cwd(), "public");
    const foldersToScan = [
      path.join(publicDir, "assets", "cms"),
      path.join(publicDir, "assets", "bot"),
      path.join(publicDir, "assets", "upuaya"),
      path.join(publicDir, "assets", "slide2"),
      path.join(publicDir, "assets"),
    ];

    for (const folder of foldersToScan) {
      if (fs.existsSync(folder)) {
        const entries = fs.readdirSync(folder, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && /\.(jpg|jpeg|png|webp|svg)$/i.test(entry.name)) {
            const fullPath = path.join(folder, entry.name);
            const stats = fs.statSync(fullPath);
            const relPath = path.relative(publicDir, fullPath).replace(/\\/g, "/");
            mediaList.push({
              filename: entry.name,
              url: `/${relPath}`,
              folder: path.basename(folder),
              sizeBytes: stats.size,
              modifiedAt: stats.mtime.toISOString(),
            });
          }
        }
      }
    }

    // Sort newest first
    mediaList.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ success: true, media: mediaList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to scan media" }, { status: 500 });
  }
}

// POST /api/cms/media — Uploads an image or replaces an existing media file
export async function POST(req: NextRequest) {
  try {
    const clientToken = req.headers.get("x-github-token")?.trim() || "";
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";
    const targetUrl = formData.get("targetUrl") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please upload JPG, PNG, WEBP, or SVG.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString("base64");

    // Case 1: Replacing an existing specific image URL in-place
    if (targetUrl && targetUrl.startsWith("/")) {
      const sanitizedRel = targetUrl.replace(/^\/+/, "").replace(/\.\./g, "");
      const fullTarget = path.join(process.cwd(), "public", sanitizedRel);
      const publicDir = path.join(process.cwd(), "public");

      let writtenLocally = false;
      if (fullTarget.startsWith(publicDir)) {
        try {
          const targetDir = path.dirname(fullTarget);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.writeFileSync(fullTarget, buffer);
          writtenLocally = true;
        } catch {
          // Read-only filesystem on Vercel
          writtenLocally = false;
        }
      }

      const gitRelPath = path.join("public", sanitizedRel).replace(/\\/g, "/");

      // If on Vercel (read-only FS) and token is available, commit image to GitHub
      if (!writtenLocally && githubCMS.isConfigured(clientToken)) {
        await githubCMS.commitFilesToGitHub(
          [{ path: gitRelPath, content: base64Content, encoding: "base64" }],
          `CMS Media: Replace ${path.basename(sanitizedRel)}`,
          clientToken
        );
      }

      return NextResponse.json({
        success: true,
        replaced: true,
        url: targetUrl,
        filename: path.basename(sanitizedRel),
        sizeBytes: buffer.length,
      });
    }

    // Case 2: Standard new file upload
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const safeFilename = `${Date.now()}-${cleanName}`;
    const relFolder = path.join("public", "assets", "cms", category);
    const targetDir = path.join(process.cwd(), relFolder);

    let writtenLocally = false;
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFilePath = path.join(targetDir, safeFilename);
      fs.writeFileSync(targetFilePath, buffer);
      writtenLocally = true;
    } catch {
      // Read-only filesystem
      writtenLocally = false;
    }

    const publicUrl = `/assets/cms/${category}/${safeFilename}`;
    const relGitPath = path.join(relFolder, safeFilename).replace(/\\/g, "/");

    if (!writtenLocally && githubCMS.isConfigured(clientToken)) {
      await githubCMS.commitFilesToGitHub(
        [{ path: relGitPath, content: base64Content, encoding: "base64" }],
        `CMS Media: Upload ${safeFilename}`,
        clientToken
      );
    }

    return NextResponse.json({
      success: true,
      replaced: false,
      url: publicUrl,
      filename: safeFilename,
      sizeBytes: buffer.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 });
  }
}
