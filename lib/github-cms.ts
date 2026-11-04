// GitHub CMS Service — Server-side GitHub REST API client
// Connects to GitHub repository (ugtf1/upua) to manage CMS files,
// upload media to public/assets/cms, create atomic commits on master,
// and poll deployment statuses for Vercel and Google Cloud Run.

import fs from "fs";
import path from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || "";
const REPO_FULL = process.env.GITHUB_REPOSITORY || "ugtf1/upua";
const [REPO_OWNER, REPO_NAME] = REPO_FULL.split("/");
const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || "master";

interface StagedFile {
  path: string; // e.g. "content/pages/home.json" or "public/assets/cms/photo.webp"
  content: string; // utf-8 text or base64 string
  encoding?: "utf-8" | "base64";
}

export interface DeploymentStatus {
  commitSha: string;
  commitMessage: string;
  author: string;
  timestamp: string;
  cloudRun: {
    status: "idle" | "queued" | "in_progress" | "completed" | "failure" | "unknown";
    conclusion: string | null;
    runUrl: string | null;
    updatedAt: string | null;
  };
  vercel: {
    status: "idle" | "queued" | "in_progress" | "completed" | "failure" | "unknown";
    conclusion: string | null;
    targetUrl: string | null;
    updatedAt: string | null;
  };
}

class GitHubCMSService {
  private owner: string;
  private repo: string;
  private branch: string;
  private token: string;

  constructor() {
    this.owner = REPO_OWNER || "ugtf1";
    this.repo = REPO_NAME || "upua";
    this.branch = DEFAULT_BRANCH;
    this.token = GITHUB_TOKEN;
  }

  public isConfigured(overrideToken?: string): boolean {
    return !!(overrideToken || this.token);
  }

  public getRepoInfo(overrideToken?: string) {
    return {
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
      hasToken: !!(overrideToken || this.token),
    };
  }

  private getHeaders(overrideToken?: string): Record<string, string> {
    const activeToken = overrideToken || this.token;
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${activeToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "UPUA-CMS-Engine/1.0",
    };
  }

  // "?"? Read file locally first (if on disk), then GitHub fallback "?"?"?"?"?"?"?"?
  public readLocalFile(relativePath: string): string | null {
    try {
      const fullPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, "utf-8");
      }
    } catch (err) {
      console.warn(`Local file read warning [${relativePath}]:`, err);
    }
    return null;
  }

  // "?"? Write file locally for instant dev preview and server hot-reload "?"?"?"?
  public writeLocalFile(relativePath: string, content: string, encoding: "utf-8" | "base64" = "utf-8"): boolean {
    try {
      const fullPath = path.join(process.cwd(), relativePath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (encoding === "base64") {
        fs.writeFileSync(fullPath, Buffer.from(content, "base64"));
      } else {
        fs.writeFileSync(fullPath, content, "utf-8");
      }
      return true;
    } catch (err) {
      console.error(`Local file write error [${relativePath}]:`, err);
      return false;
    }
  }

  // 🚀 Atomic Git Commit: Creates blobs, tree, commit, and updates ref ─────────
  public async commitFilesToGitHub(
    files: StagedFile[],
    commitMessage: string,
    overrideToken?: string
  ): Promise<{ success: boolean; commitSha?: string; error?: string }> {
    // 1. Always write locally first so the local server/container sees changes immediately
    for (const f of files) {
      this.writeLocalFile(f.path, f.content, f.encoding || "utf-8");
    }

    const activeToken = overrideToken || this.token;

    // 2. If no GitHub token configured (e.g. offline dev), return success for local write
    if (!activeToken) {
      return {
        success: true,
        commitSha: "local-staged-" + Date.now().toString(16),
      };
    }

    try {
      const baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;

      // A. Get branch head reference
      const refRes = await fetch(`${baseUrl}/git/ref/heads/${this.branch}`, {
        headers: this.getHeaders(activeToken),
      });
      if (!refRes.ok) {
        throw new Error(`Failed to fetch branch ref: ${refRes.status} ${await refRes.text()}`);
      }
      const refData = await refRes.json();
      const parentCommitSha = refData.object.sha;

      // B. Get parent commit to extract base tree
      const parentCommitRes = await fetch(`${baseUrl}/git/commits/${parentCommitSha}`, {
        headers: this.getHeaders(activeToken),
      });
      if (!parentCommitRes.ok) {
        throw new Error(`Failed to fetch parent commit: ${parentCommitRes.status}`);
      }
      const parentCommitData = await parentCommitRes.json();
      const baseTreeSha = parentCommitData.tree.sha;

      // C. Create blobs for each file
      const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];
      for (const file of files) {
        const isBase64 = file.encoding === "base64";
        const blobRes = await fetch(`${baseUrl}/git/blobs`, {
          method: "POST",
          headers: this.getHeaders(activeToken),
          body: JSON.stringify({
            content: file.content,
            encoding: isBase64 ? "base64" : "utf-8",
          }),
        });
        if (!blobRes.ok) {
          throw new Error(`Failed to create blob for ${file.path}: ${await blobRes.text()}`);
        }
        const blobData = await blobRes.json();
        treeItems.push({
          path: file.path.replace(/^[\\\/]+/, "").replace(/\\/g, "/"),
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        });
      }

      // D. Create new tree
      const treeRes = await fetch(`${baseUrl}/git/trees`, {
        method: "POST",
        headers: this.getHeaders(activeToken),
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeItems,
        }),
      });
      if (!treeRes.ok) {
        throw new Error(`Failed to create tree: ${await treeRes.text()}`);
      }
      const treeData = await treeRes.json();

      // E. Create commit
      const commitRes = await fetch(`${baseUrl}/git/commits`, {
        method: "POST",
        headers: this.getHeaders(activeToken),
        body: JSON.stringify({
          message: commitMessage,
          tree: treeData.sha,
          parents: [parentCommitSha],
        }),
      });
      if (!commitRes.ok) {
        throw new Error(`Failed to create commit: ${await commitRes.text()}`);
      }
      const commitData = await commitRes.json();

      // F. Update branch reference (points master to the new commit)
      const updateRefRes = await fetch(`${baseUrl}/git/refs/heads/${this.branch}`, {
        method: "PATCH",
        headers: this.getHeaders(activeToken),
        body: JSON.stringify({
          sha: commitData.sha,
          force: false,
        }),
      });
      if (!updateRefRes.ok) {
        throw new Error(`Failed to update ref: ${await updateRefRes.text()}`);
      }

      return {
        success: true,
        commitSha: commitData.sha,
      };
    } catch (err: any) {
      console.error("commitFilesToGitHub error:", err);
      return {
        success: false,
        error: err.message || "Failed to commit changes to GitHub",
      };
    }
  }

  // 🚀 Get Live Deployment Status for both Vercel & Google Cloud Run ──────────
  public async getDeploymentStatus(overrideToken?: string): Promise<DeploymentStatus> {
    const fallback: DeploymentStatus = {
      commitSha: "unknown",
      commitMessage: "Latest release",
      author: "UPUA Web Team",
      timestamp: new Date().toISOString(),
      cloudRun: {
        status: "idle",
        conclusion: null,
        runUrl: null,
        updatedAt: null,
      },
      vercel: {
        status: "idle",
        conclusion: null,
        targetUrl: null,
        updatedAt: null,
      },
    };

    const activeToken = overrideToken || this.token;

    if (!activeToken) {
      return fallback;
    }

    try {
      const baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;

      // 1. Fetch latest commit on master
      const commitRes = await fetch(`${baseUrl}/commits/${this.branch}`, {
        headers: this.getHeaders(activeToken),
        cache: "no-store",
      });
      if (commitRes.ok) {
        const cData = await commitRes.json();
        fallback.commitSha = cData.sha?.substring(0, 7) || "unknown";
        fallback.commitMessage = cData.commit?.message?.split("\n")[0] || "Update website content";
        fallback.author = cData.commit?.author?.name || "Website Editor";
        fallback.timestamp = cData.commit?.author?.date || new Date().toISOString();

        // 2. Fetch Check Runs for this commit (Vercel automatically posts Check Runs)
        const checksRes = await fetch(`${baseUrl}/commits/${cData.sha}/check-runs`, {
          headers: this.getHeaders(activeToken),
          cache: "no-store",
        });
        if (checksRes.ok) {
          const checksData = await checksRes.json();
          const checkRuns = checksData.check_runs || [];

          // Look for Vercel check run
          const vercelCheck = checkRuns.find(
            (c: any) =>
              c.name?.toLowerCase().includes("vercel") ||
              c.app?.slug?.toLowerCase().includes("vercel")
          );
          if (vercelCheck) {
            fallback.vercel = {
              status:
                vercelCheck.status === "completed"
                  ? "completed"
                  : vercelCheck.status === "in_progress"
                  ? "in_progress"
                  : "queued",
              conclusion: vercelCheck.conclusion,
              targetUrl: vercelCheck.details_url || vercelCheck.html_url,
              updatedAt: vercelCheck.completed_at || vercelCheck.started_at,
            };
          }
        }
      }

      // 3. Fetch Cloud Run GitHub Action Workflow Runs
      const workflowRes = await fetch(
        `${baseUrl}/actions/workflows/deploy-gcloud.yml/runs?per_page=1`,
        {
          headers: this.getHeaders(activeToken),
          cache: "no-store",
        }
      );
      if (workflowRes.ok) {
        const wfData = await workflowRes.json();
        const latestRun = wfData.workflow_runs?.[0];
        if (latestRun) {
          fallback.cloudRun = {
            status:
              latestRun.status === "completed"
                ? "completed"
                : latestRun.status === "in_progress"
                ? "in_progress"
                : "queued",
            conclusion: latestRun.conclusion,
            runUrl: latestRun.html_url,
            updatedAt: latestRun.updated_at,
          };
        }
      }
    } catch (err) {
      console.warn("getDeploymentStatus warning:", err);
    }

    return fallback;
  }
}

export const githubCMS = new GitHubCMSService();
