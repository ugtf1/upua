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

// POST /api/cms/media — Uploads an image to public/assets/cms
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";

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

    // Sanitize filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const safeFilename = `${Date.now()}-${cleanName}`;

    // Target path in public/assets/cms
    const relFolder = path.join("public", "assets", "cms", category);
    const targetDir = path.join(process.cwd(), relFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFilePath = path.join(targetDir, safeFilename);
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/assets/cms/${category}/${safeFilename}`;

    // Also stage for GitHub commit
    const relGitPath = path.join(relFolder, safeFilename).replace(/\\/g, "/");
    githubCMS.writeLocalFile(relGitPath, buffer.toString("base64"), "base64");

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      sizeBytes: buffer.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 });
  }
}
