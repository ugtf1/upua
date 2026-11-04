// Content Management Service for UPUA Public Website
// Reads from and writes to the GitHub-backed content/ directory (JSON schemas)
// Provides unified access for pages, structured collections, and legacy blocks.

import fs from "fs";
import path from "path";
import { githubCMS } from "./github-cms";

export interface ContentBlock {
  id: string;
  type: "heading" | "subheading" | "text" | "image" | "caption" | "badge" | "cta_label" | "cta_url";
  label: string;
  value: string;
}

export interface ContentSection {
  id: string;
  page: "home" | "about" | "events" | "programs" | "blog";
  section: string;
  label: string;
  icon: string;
  blocks: ContentBlock[];
}

// Helpers for reading/writing JSON files in content/ directory
function getContentFilePath(relativePath: string): string {
  return path.join(process.cwd(), "content", relativePath);
}

function readJsonFile<T>(relativePath: string, fallback: T): T {
  try {
    const fullPath = getContentFilePath(relativePath);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, "utf-8");
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`[ContentService] Failed to read ${relativePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(relativePath: string, data: T): boolean {
  try {
    const fullPath = getContentFilePath(relativePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`[ContentService] Failed to write ${relativePath}:`, err);
    return false;
  }
}

// In-memory cache for legacy ContentSection blocks
let contentStore: ContentSection[] = [
  {
    id: "home-hero",
    page: "home",
    section: "hero",
    label: "Hero Banner",
    icon: "🌟",
    blocks: [
      { id: "home-hero-badge", type: "badge", label: "Badge Text", value: "Okugbe · Egba · Voyan Robaro" },
      { id: "home-hero-heading", type: "heading", label: "Main Heading", value: "Urhobo Progress Union America" },
      { id: "home-hero-subheading", type: "subheading", label: "Sub Heading", value: "Unity. Strength. Progress." },
      { id: "home-hero-text", type: "text", label: "Hero Description", value: "The umbrella body of all Urhobo sons and daughters across North America — advocating for cultural pride, community development, and homeland progress." },
      { id: "home-hero-cta1", type: "cta_label", label: "Primary CTA Label", value: "Explore Our Work" },
      { id: "home-hero-cta2", type: "cta_label", label: "Secondary CTA Label", value: "Join UPUA" },
    ],
  },
  {
    id: "home-work",
    page: "home",
    section: "our-work",
    label: "Our Work Section",
    icon: "🤝",
    blocks: [
      { id: "home-work-badge", type: "badge", label: "Section Badge", value: "Our Mission" },
      { id: "home-work-heading", type: "heading", label: "Section Heading", value: "What We Do" },
      { id: "home-work-text", type: "text", label: "Section Description", value: "UPUA leads transformative programs across North America, serving as the strategic voice for Urhobo people in the diaspora." },
    ],
  },
  {
    id: "home-leaders",
    page: "home",
    section: "leaders",
    label: "Leaders Showcase",
    icon: "👑",
    blocks: [
      { id: "home-leaders-heading", type: "heading", label: "Section Heading", value: "National Leadership" },
      { id: "home-leaders-text", type: "text", label: "Section Description", value: "Guided by distinguished Urhobo leaders committed to unity and progress across North America." },
    ],
  },
  {
    id: "home-updates",
    page: "home",
    section: "updates",
    label: "Updates Section",
    icon: "📰",
    blocks: [
      { id: "home-updates-heading", type: "heading", label: "Section Heading", value: "Updates from UPU America" },
      { id: "home-updates-text", type: "text", label: "Section Description", value: "Stay informed with the latest news, press releases, and community stories." },
    ],
  },
  {
    id: "home-events",
    page: "home",
    section: "events",
    label: "Events Section",
    icon: "📅",
    blocks: [
      { id: "home-events-heading", type: "heading", label: "Section Heading", value: "Upcoming Events & Convention" },
      { id: "home-events-text", type: "text", label: "Section Description", value: "Join our annual conventions, youth leadership conferences, and cultural galas." },
    ],
  },
  {
    id: "about-intro",
    page: "about",
    section: "intro",
    label: "About Introduction",
    icon: "📖",
    blocks: [
      { id: "about-heading", type: "heading", label: "Page Heading", value: "About Urhobo Progress Union America" },
      { id: "about-subheading", type: "subheading", label: "Sub Heading", value: "Preserving Urhobo heritage, empowering the diaspora, and advancing our homeland since 1993." },
      { id: "about-history", type: "text", label: "History Text", value: "The Urhobo Progress Union America (UPUA) is the umbrella organization of all Urhobo people and associations in North America." },
    ],
  },
  {
    id: "about-mission",
    page: "about",
    section: "mission",
    label: "Mission & Vision",
    icon: "🎯",
    blocks: [
      { id: "about-mission-heading", type: "heading", label: "Mission Heading", value: "Our Mission" },
      { id: "about-mission-text", type: "text", label: "Mission Statement", value: "To foster unity, promote the Urhobo culture and language, and mobilize resources for the development of Urhoboland and our diaspora communities." },
      { id: "about-vision-heading", type: "heading", label: "Vision Heading", value: "Our Vision" },
      { id: "about-vision-text", type: "text", label: "Vision Statement", value: "A vibrant, self-sustaining Urhobo diaspora community actively contributing to global excellence and homeland prosperity." },
    ],
  },
];

export const ContentService = {
  // "?"? Structured Pages (content/pages/*.json) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
  getPage<T>(pageName: string, fallback: T): T {
    return readJsonFile<T>(`pages/${pageName}.json`, fallback);
  },

  updatePage<T>(pageName: string, data: T): boolean {
    return writeJsonFile<T>(`pages/${pageName}.json`, data);
  },

  // "?"? Structured Collections (content/organization/..., content/programs/..., etc.)
  getCollection<T>(collectionPath: string, fallback: T[]): T[] {
    return readJsonFile<T[]>(`${collectionPath}.json`, fallback);
  },

  updateCollection<T>(collectionPath: string, items: T[]): boolean {
    return writeJsonFile<T[]>(`${collectionPath}.json`, items);
  },

  // "?"? Global Settings (content/global/site-settings.json) "?"?"?"?"?"?"?"?"?"?"?"?"?
  getGlobalSettings<T>(fallback: T): T {
    return readJsonFile<T>("global/site-settings.json", fallback);
  },

  updateGlobalSettings<T>(data: T): boolean {
    return writeJsonFile<T>("global/site-settings.json", data);
  },

  // "?"? Atomic Publish to GitHub (triggers Vercel + Cloud Run) "?"?"?"?"?"?"?"?"?"?"?
  async publishToGitHub(commitMessage: string) {
    const stagedFiles: Array<{ path: string; content: string }> = [];

    const contentDir = path.join(process.cwd(), "content");
    function collectFiles(dir: string, baseDir: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          collectFiles(full, baseDir);
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
          const relPath = path.relative(baseDir, full).replace(/\\/g, "/");
          stagedFiles.push({
            path: relPath,
            content: fs.readFileSync(full, "utf-8"),
          });
        }
      }
    }

    collectFiles(contentDir, process.cwd());

    return await githubCMS.commitFilesToGitHub(stagedFiles, commitMessage);
  },

  // "?"? Legacy Sections & Blocks API (Preserves Full Backwards Compatibility) "?"?"?
  getAll(): ContentSection[] {
    return contentStore;
  },

  getByPage(page: ContentSection["page"]): ContentSection[] {
    return contentStore.filter((s) => s.page === page);
  },

  getById(id: string): ContentSection | null {
    return contentStore.find((s) => s.id === id) ?? null;
  },

  updateBlock(sectionId: string, blockId: string, value: string): ContentSection | null {
    const section = contentStore.find((s) => s.id === sectionId);
    if (!section) return null;
    const block = section.blocks.find((b) => b.id === blockId);
    if (!block) return null;
    block.value = value;
    return section;
  },

  updateSection(sectionId: string, blocks: { id: string; value: string }[]): ContentSection | null {
    const section = contentStore.find((s) => s.id === sectionId);
    if (!section) return null;
    blocks.forEach(({ id, value }) => {
      const block = section.blocks.find((b) => b.id === id);
      if (block) block.value = value;
    });
    return section;
  },

  resetSection(sectionId: string): ContentSection | null {
    return contentStore.find((s) => s.id === sectionId) || null;
  },

  resetAll(): void {
    // No-op
  },
};
