// Content Management Service for UPUA Public Website
// In-memory store with default values matching current hardcoded content.
// When DATABASE_URL is connected, this will be replaced by Prisma DB calls.

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

// ── Default Content (mirrors current hardcoded values) ───────────────────────

const DEFAULT_CONTENT: ContentSection[] = [
  // ─── HOME PAGE ─────────────────────────────────────────────────────────────
  {
    id: "home-hero",
    page: "home",
    section: "hero",
    label: "Hero Banner",
    icon: "🏠",
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
    icon: "💼",
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
    icon: "👥",
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
      { id: "home-updates-text", type: "text", label: "Section Description", value: "News and blog posts on UPU America and our programs" },
    ],
  },
  {
    id: "home-events",
    page: "home",
    section: "events",
    label: "Events Section",
    icon: "📅",
    blocks: [
      { id: "home-events-heading", type: "heading", label: "Section Heading", value: "Latest & Upcoming Events" },
      { id: "home-events-text", type: "text", label: "Section Description", value: "Mark your calendars for our national conventions, youth summits, and cultural gatherings" },
    ],
  },

  // ─── ABOUT PAGE ────────────────────────────────────────────────────────────
  {
    id: "about-hero",
    page: "about",
    section: "hero",
    label: "About Page Hero",
    icon: "ℹ️",
    blocks: [
      { id: "about-hero-badge", type: "badge", label: "Badge Text", value: "About UPUA" },
      { id: "about-hero-heading", type: "heading", label: "Main Heading", value: "Who We Are" },
      { id: "about-hero-text", type: "text", label: "Description", value: "The Urhobo Progress Union America (UPUA) is the umbrella organization of all Urhobo people living in North America. We are a non-profit dedicated to the cultural, social, and economic advancement of Urhobo people in the diaspora." },
      { id: "about-hero-image", type: "image", label: "Hero Image URL", value: "/about-hero.jpg" },
    ],
  },
  {
    id: "about-mission",
    page: "about",
    section: "mission",
    label: "Mission & Vision",
    icon: "🎯",
    blocks: [
      { id: "about-mission-heading", type: "heading", label: "Section Heading", value: "Our Mission & Vision" },
      { id: "about-mission-text", type: "text", label: "Mission Statement", value: "To unite, empower, and advocate for all Urhobo people in North America while fostering cultural pride, community development, and meaningful progress in Urhoboland." },
      { id: "about-vision-text", type: "text", label: "Vision Statement", value: "A thriving, unified Urhobo diaspora that is a beacon of cultural excellence, economic empowerment, and impactful homeland development." },
    ],
  },
  {
    id: "about-exec",
    page: "about",
    section: "executive",
    label: "Executive Committee Header",
    icon: "🏛️",
    blocks: [
      { id: "about-exec-heading", type: "heading", label: "Section Heading", value: "Meet the Executive Committee" },
      { id: "about-exec-text", type: "text", label: "Section Description", value: "The elected leadership of UPUA, serving the Urhobo community across North America." },
    ],
  },
  {
    id: "about-youth",
    page: "about",
    section: "youth-wing",
    label: "Youth Wing EXCO Header",
    icon: "⚡",
    blocks: [
      { id: "about-youth-heading", type: "heading", label: "Section Heading", value: "UPUAYA Executive Council (Youth Wing)" },
      { id: "about-youth-text", type: "text", label: "Section Description", value: "Empowering dynamic Urhobo young professionals and students across the United States." },
    ],
  },
  {
    id: "about-chapters",
    page: "about",
    section: "chapters",
    label: "Chapters Section Header",
    icon: "🗺️",
    blocks: [
      { id: "about-chapters-heading", type: "heading", label: "Section Heading", value: "UPUA Chapters Across America" },
      { id: "about-chapters-text", type: "text", label: "Section Description", value: "A continental network of Urhobo associations united under the UPUA banner." },
    ],
  },
  {
    id: "about-cta",
    page: "about",
    section: "cta",
    label: "Join CTA Banner",
    icon: "🤝",
    blocks: [
      { id: "about-cta-heading", type: "heading", label: "CTA Heading", value: "Be Part of the Movement" },
      { id: "about-cta-text", type: "text", label: "CTA Description", value: "Join thousands of Urhobo professionals, leaders, and culture-bearers across North America making a real difference." },
      { id: "about-cta-btn", type: "cta_label", label: "CTA Button Label", value: "Join Your Chapter" },
    ],
  },

  // ─── EVENTS PAGE ───────────────────────────────────────────────────────────
  {
    id: "events-hero",
    page: "events",
    section: "hero",
    label: "Events Page Hero",
    icon: "🎉",
    blocks: [
      { id: "events-hero-badge", type: "badge", label: "Badge Text", value: "Events & Convention" },
      { id: "events-hero-heading", type: "heading", label: "Main Heading", value: "UPUA Events & Conventions" },
      { id: "events-hero-text", type: "text", label: "Description", value: "Join us at our flagship national events — the Annual Convention, Youth Leadership Symposium, and Cultural Gala." },
    ],
  },

  // ─── PROGRAMS PAGE ─────────────────────────────────────────────────────────
  {
    id: "programs-hero",
    page: "programs",
    section: "hero",
    label: "Programs Page Hero",
    icon: "📚",
    blocks: [
      { id: "programs-hero-badge", type: "badge", label: "Badge Text", value: "Our Programs" },
      { id: "programs-hero-heading", type: "heading", label: "Main Heading", value: "Programs & Initiatives" },
      { id: "programs-hero-text", type: "text", label: "Description", value: "Strategic programs driving cultural preservation, economic development, and humanitarian aid for Urhobo people across two continents." },
    ],
  },

  // ─── BLOG PAGE ─────────────────────────────────────────────────────────────
  {
    id: "blog-hero",
    page: "blog",
    section: "hero",
    label: "Blog Page Hero",
    icon: "✍️",
    blocks: [
      { id: "blog-hero-badge", type: "badge", label: "Badge Text", value: "News & Updates" },
      { id: "blog-hero-heading", type: "heading", label: "Main Heading", value: "UPUA News & Blog" },
      { id: "blog-hero-text", type: "text", label: "Description", value: "Stay informed on UPUA programs, convention highlights, community milestones, and homeland development news." },
    ],
  },
];

// ── In-Memory Store ──────────────────────────────────────────────────────────

let contentStore: ContentSection[] = DEFAULT_CONTENT.map((s) => ({
  ...s,
  blocks: s.blocks.map((b) => ({ ...b })),
}));

export const ContentService = {
  // Get all sections
  getAll(): ContentSection[] {
    return contentStore;
  },

  // Get sections for a specific page
  getByPage(page: ContentSection["page"]): ContentSection[] {
    return contentStore.filter((s) => s.page === page);
  },

  // Get a single section by id
  getById(id: string): ContentSection | null {
    return contentStore.find((s) => s.id === id) ?? null;
  },

  // Update a single block value within a section
  updateBlock(sectionId: string, blockId: string, value: string): ContentSection | null {
    const section = contentStore.find((s) => s.id === sectionId);
    if (!section) return null;
    const block = section.blocks.find((b) => b.id === blockId);
    if (!block) return null;
    block.value = value;
    return section;
  },

  // Bulk-update all blocks in a section
  updateSection(sectionId: string, blocks: { id: string; value: string }[]): ContentSection | null {
    const section = contentStore.find((s) => s.id === sectionId);
    if (!section) return null;
    blocks.forEach(({ id, value }) => {
      const block = section.blocks.find((b) => b.id === id);
      if (block) block.value = value;
    });
    return section;
  },

  // Reset a section to its default
  resetSection(sectionId: string): ContentSection | null {
    const defaultSection = DEFAULT_CONTENT.find((s) => s.id === sectionId);
    if (!defaultSection) return null;
    const idx = contentStore.findIndex((s) => s.id === sectionId);
    if (idx === -1) return null;
    contentStore[idx] = {
      ...defaultSection,
      blocks: defaultSection.blocks.map((b) => ({ ...b })),
    };
    return contentStore[idx];
  },

  // Reset ALL content to defaults
  resetAll(): void {
    contentStore = DEFAULT_CONTENT.map((s) => ({
      ...s,
      blocks: s.blocks.map((b) => ({ ...b })),
    }));
  },
};
