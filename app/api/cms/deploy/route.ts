import { NextResponse } from "next/server";
import { githubCMS } from "@/lib/github-cms";

// GET /api/cms/deploy — Returns live deployment status of Vercel and Google Cloud Run
export async function GET() {
  try {
    const status = await githubCMS.getDeploymentStatus();
    const repoInfo = githubCMS.getRepoInfo();

    return NextResponse.json({
      success: true,
      repo: repoInfo,
      status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch deployment status" },
      { status: 500 }
    );
  }
}
