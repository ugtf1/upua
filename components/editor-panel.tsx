"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Tag,
  ExternalLink,
  Loader2,
  Info,
  Users,
  Shield,
  Building,
  Crown,
  Calendar,
  BookOpen,
  Sparkles,
  Upload,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Check,
  Send,
  Cloud,
  Layers,
  ShoppingBag,
  Edit2,
  X,
  Camera,
} from "lucide-react";

// Initial fallbacks to guarantee immediate rendering with zero empty screens
const INITIAL_HOME = {
  hero: {
    badge: "Okugbe · Egba · Voyan Robaro",
    heading: "Urhobo Progress Union America",
    subheading: "Unity. Strength. Progress.",
    description:
      "The umbrella body of all Urhobo sons and daughters across North America — advocating for cultural pride, community development, and homeland progress.",
    ctaPrimaryLabel: "Explore Our Work",
    ctaPrimaryUrl: "#work",
    ctaSecondaryLabel: "Join UPUA",
    ctaSecondaryUrl: "/portal",
    carouselImages: [
      "/upuahero.png",
      "/assets/Congress-1.jpg",
      "/assets/slide2/3.jpeg",
      "/assets/slide2/7.jpeg",
    ],
  },
  stats: [
    { label: "Years of Service", value: "32+", subtext: "Continuous diaspora service" },
    { label: "Active Chapters", value: "20", subtext: "Across USA & Canada" },
    { label: "Community Impact", value: "15k+", subtext: "Families assisted annually" },
    { label: "Active Programs", value: "6", subtext: "Signature civic initiatives" },
  ],
  marquee: {
    title: "Women in Shelter Initiative",
    subtitle:
      "Across North America, UPU chapters are giving back, donating time, resources and love to women's shelters in their communities.",
  },
  mission: {
    eyebrow: "Why UPUA exists",
    heading: "Uniting Urhobo people across North America and advancing our ancestral homeland.",
    description:
      "For over three decades, Urhobo Progress Union America has stood as the unified voice and civic engine for tens of thousands of Urhobo immigrants, families, and professionals across the United States and Canada.",
    bulletPoints: [
      "Fostering deep cultural heritage and Urhobo language fluency across generations.",
      "Providing immediate humanitarian relief and healthcare missions to Urhoboland.",
      "Empowering youth through tech mentorship, scholarships, and professional networking.",
      "Promoting civic responsibility, brotherhood, and active philanthropy in our North American cities.",
    ],
  },
  work: {
    badge: "Our Mission",
    heading: "What We Do",
    description:
      "UPUA leads transformative programs across North America, serving as the strategic voice for Urhobo people in the diaspora.",
  },
  leadershipSection: {
    badge: "Union Governance",
    heading: "Leaders who keep the union moving",
    description:
      "Dedicated trustees, national executives, and chapter leaders committed to transparency, servant leadership, and the advancement of the Urhobo nation.",
  },
  updatesSection: {
    badge: "News & Stories",
    heading: "Updates from UPU America",
    description:
      "Stay informed on national initiatives, humanitarian relief missions, and community milestones from our chapters.",
  },
  eventsSection: {
    badge: "Convocations & Galas",
    heading: "Upcoming Events & Convention",
    description:
      "Connect with fellow Urhobo people at our annual national conventions, leadership symposiums, and regional cultural celebrations.",
  },
  worldwideCommunity: {
    heading: "Global Urhobo Community",
    description:
      "From Alaska to Florida, California to New York, UPUA connects Urhobo people in every corner of North America to our ancestral roots in Delta State, Nigeria.",
    newsletterTitle: "Stay Connected with UPUA",
    newsletterDescription:
      "Receive official announcements, convention registration alerts, and quarterly executive updates directly to your inbox.",
    newsletterButtonText: "Subscribe to Updates",
  },
};

const INITIAL_ABOUT = {
  hero: {
    badge: "About UPUA",
    heading: "Urhobo Progress Union America",
    subheading: "The supreme cultural and developmental body of Urhobo people resident across North America.",
    motto: "Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress)",
  },
  history: {
    heading: "Our History & Purpose",
    accreditation:
      "UPUA is a duly incorporated 501(c)(3) non-profit tax-exempt cultural and humanitarian institution operating under the laws of the United States of America.",
    body: [
      "The Urhobo Progress Union America (UPUA) is the umbrella organization representing all Urhobo associations, chapters, families, and people residing across the United States and Canada.",
      "Rooted in the century-old lineage of the worldwide Urhobo Progress Union founded in 1931, UPUA serves as the supreme beacon of Urhobo culture, language, solidarity, and socio-economic advancement in North America.",
      "Over the decades, UPUA has built bridges of fraternity between diaspora communities and our ancestral homeland in Delta State, Nigeria — sponsoring schools, providing emergency humanitarian relief, advocating for indigenous environmental rights, and mentoring the next generation of global leaders.",
    ],
  },
  missionVision: {
    missionHeading: "Our Mission",
    mission:
      "To unite all Urhobo people and associations in North America into one cohesive, forward-looking brotherhood; to preserve and celebrate our rich monarchical heritage and language; and to mobilize human and financial capital for the educational, economic, and civic elevation of Urhoboland and our host communities.",
    visionHeading: "Our Vision",
    vision:
      "A vibrant, self-sustaining global Urhobo diaspora renowned for cultural pride, institutional excellence, academic achievement, and permanent developmental impact across North America and Urhoboland.",
  },
  nationalAnthem: {
    heading: "The Urhobo National Anthem",
    subheading: "The sacred anthem echoing the royal lineage and eternal bond of all Urhobo people.",
    urhoboLyrics: [
      "Urhobo eh, Orere r'Ivie sa-a.",
      "Urhobo eh, Orere r'Ivie sa-a.",
      "Urhobo kokore Ogbare eh,",
      "Urhobo eh, Orere r'Ivie sa-a.",
      "Obo r'Urhobo jevwe na,",
      "Aso 'fa jevwe otio ye-eh.",
      "Edefa me rhiakpo, Urhobo me wan rhe,",
      "Urhobo eh, Orere r'Ivie sa-a Anoma-a.",
    ],
    englishTranslation: [
      "Urhobo hail! Land of royal monarchies and dignity.",
      "Urhobo hail! Land of royal monarchies and dignity.",
      "Let all Urhobos gather in unbreakable unity,",
      "Urhobo hail! Land of royal monarchies and dignity.",
      "The boundless love I have for Urhobo,",
      "No other nation compares under the sun.",
      "When next I reincarnate into this mortal earth,",
      "It is through Urhobo that I shall surely return!",
    ],
  },
};

type CMSTab =
  | "home"
  | "about"
  | "leadership"
  | "executives"
  | "youth"
  | "chapters"
  | "kingdoms"
  | "programs"
  | "events"
  | "blog"
  | "media"
  | "deploy";

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<CMSTab>("home");
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Content states initialized with real defaults so writeups are immediately visible
  const [homeData, setHomeData] = useState<any>(INITIAL_HOME);
  const [aboutData, setAboutData] = useState<any>(INITIAL_ABOUT);
  const [leadershipList, setLeadershipList] = useState<any[]>([]);
  const [trusteesList, setTrusteesList] = useState<any[]>([]);
  const [executivesList, setExecutivesList] = useState<any[]>([]);
  const [youthList, setYouthList] = useState<any[]>([]);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [kingdomsList, setKingdomsList] = useState<any[]>([]);
  const [programsData, setProgramsData] = useState<any>({ shelterChapters: [], programs: [] });
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [deployStatus, setDeployStatus] = useState<any>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");

  // Modal for Image Picker / Replacer
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    currentUrl: string;
    onSelect: (newUrl: string) => void;
  } | null>(null);

  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Sync content from backend
  const loadTabContent = useCallback(async (tab: CMSTab) => {
    try {
      if (tab === "home") {
        const res = await fetch("/api/cms/content?type=page&name=home");
        const json = await res.json();
        if (json.data) setHomeData(json.data);
      } else if (tab === "about") {
        const res = await fetch("/api/cms/content?type=page&name=about");
        const json = await res.json();
        if (json.data) setAboutData(json.data);
      } else if (tab === "leadership") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/leadership");
        const json = await res.json();
        if (json.data?.length) setLeadershipList(json.data);
        const tRes = await fetch("/api/cms/content?type=collection&name=organization/trustees");
        const tJson = await tRes.json();
        if (tJson.data?.length) setTrusteesList(tJson.data);
      } else if (tab === "executives") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/executive-committee");
        const json = await res.json();
        if (json.data?.length) setExecutivesList(json.data);
      } else if (tab === "youth") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/youth-leadership");
        const json = await res.json();
        if (json.data?.length) setYouthList(json.data);
      } else if (tab === "chapters") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/chapters");
        const json = await res.json();
        if (json.data?.length) setChaptersList(json.data);
      } else if (tab === "kingdoms") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/kingdoms");
        const json = await res.json();
        if (json.data?.length) setKingdomsList(json.data);
      } else if (tab === "programs") {
        const res = await fetch("/api/cms/content?type=collection&name=programs/programs");
        const json = await res.json();
        if (json.data?.programs) setProgramsData(json.data);
      } else if (tab === "events") {
        const res = await fetch("/api/cms/content?type=collection&name=events/events");
        const json = await res.json();
        if (json.data?.length) setEventsList(json.data);
      } else if (tab === "blog") {
        const res = await fetch("/api/cms/content?type=collection&name=blog/articles");
        const json = await res.json();
        if (json.data?.length) setArticlesList(json.data);
      } else if (tab === "media") {
        const res = await fetch("/api/cms/media");
        const json = await res.json();
        if (json.media) setMediaList(json.media);
      } else if (tab === "deploy") {
        const res = await fetch("/api/cms/deploy");
        const json = await res.json();
        if (json.status) setDeployStatus(json.status);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadTabContent(activeTab);
  }, [activeTab, loadTabContent]);

  // Load media list once on mount so image replacer always has thumbnails ready
  useEffect(() => {
    fetch("/api/cms/media")
      .then((r) => r.json())
      .then((json) => {
        if (json.media) setMediaList(json.media);
      })
      .catch(() => {});
  }, []);

  async function saveContent(type: "page" | "collection" | "global", name: string, data: any) {
    try {
      const res = await fetch("/api/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name, data }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `Saved changes for ${name}`);
      } else {
        showToast("error", json.error || "Save failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to save");
    }
  }

  async function handlePublishToGitHub() {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: publishMessage.trim() || `CMS: Publish website updates (${new Date().toLocaleDateString()})`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `🚀 Published! Commit ${json.commitSha?.slice(0, 7) || ""} pushed to GitHub master.`);
        setPublishMessage("");
        loadTabContent("deploy");
      } else {
        showToast("error", json.error || "Publish failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  }

  // Upload an image directly into public/assets/cms
  async function handleDirectUpload(file: File, category = "cms"): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);

    try {
      showToast("info", "Uploading image to repository assets...");
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `Image uploaded: ${json.url}`);
        // Refresh media library
        fetch("/api/cms/media")
          .then((r) => r.json())
          .then((m) => {
            if (m.media) setMediaList(m.media);
          });
        return json.url;
      } else {
        showToast("error", json.error || "Upload failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to upload image");
    }
    return null;
  }

  // Reusable Image Replacer Widget
  function ImageField({
    label,
    currentUrl,
    onChange,
  }: {
    label: string;
    currentUrl: string;
    onChange: (newUrl: string) => void;
  }) {
    return (
      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
          {label}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8faf8", padding: "10px", borderRadius: "8px", border: "1px solid #e1eae3" }}>
          <div style={{ width: "64px", height: "64px", position: "relative", borderRadius: "6px", overflow: "hidden", background: "#e5ece7", flexShrink: 0 }}>
            {currentUrl ? (
              <Image src={currentUrl} alt={label} fill style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888", fontSize: "0.65rem" }}>
                No image
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              type="text"
              value={currentUrl || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/assets/..."
              style={{
                width: "100%",
                padding: "6px 10px",
                fontSize: "0.8rem",
                borderRadius: "6px",
                border: "1px solid #d4dfd7",
                marginBottom: "6px",
              }}
            />
            <button
              type="button"
              onClick={() => setImagePickerTarget({ currentUrl, onSelect: onChange })}
              style={{
                background: "#0e3d26",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Camera size={13} /> Replace Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-workspace-container" style={{ padding: "24px 0", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0e3d26 0%, #175e3c 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "24px 32px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 8px 30px rgba(14, 61, 38, 0.15)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                color: "#f7df72",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "9999px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Live Visual CMS
            </span>
            <span style={{ color: "#c3ded0", fontSize: "0.82rem" }}>All content stored in GitHub master · Dual Vercel + Cloud Run</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: "0 0 4px", fontWeight: 800 }}>
            Website Content &amp; Media Studio
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.9rem", margin: 0 }}>
            Select any page or section below to edit writeups, headings, and replace images visually.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "10px",
              padding: "10px 16px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Live Site <ExternalLink size={15} />
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab("deploy")}
            style={{
              background: "#d4af37",
              color: "#0e3d26",
              border: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              fontSize: "0.86rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Globe size={16} /> Publish &amp; Deploy
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "24px",
          borderBottom: "1px solid #e1eae3",
        }}
      >
        {[
          { id: "home", label: "🏠 Home Page" },
          { id: "about", label: "📖 About & Anthem" },
          { id: "leadership", label: "👑 Leadership & BOT" },
          { id: "executives", label: "🏛️ Executive Committee" },
          { id: "youth", label: "🌟 UPUAYA Youth Wing" },
          { id: "chapters", label: "📍 Chapters" },
          { id: "kingdoms", label: "👑 24 Royal Kingdoms" },
          { id: "programs", label: "🎯 Programs & Shelter" },
          { id: "events", label: "📅 Events & Convention" },
          { id: "blog", label: "📰 Blog & Stories" },
          { id: "media", label: "🖼️ Media Manager" },
          { id: "deploy", label: "🚀 Deployments" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as CMSTab)}
            style={{
              background: activeTab === t.id ? "#0e3d26" : "#ffffff",
              color: activeTab === t.id ? "#ffffff" : "#526359",
              border: activeTab === t.id ? "1.5px solid #0e3d26" : "1.5px solid #e1eae3",
              borderRadius: "10px",
              padding: "9px 16px",
              fontSize: "0.84rem",
              fontWeight: activeTab === t.id ? 800 : 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: toast.type === "success" ? "#0e3d26" : toast.type === "error" ? "#c5221f" : "#1a73e8",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "0.88rem",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TAB: HOME PAGE                                                        */}
      {/* ========================================================================= */}
      {activeTab === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section: Hero Banner */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🌟 Hero Banner &amp; Slider</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>Main landing heading, tagline, description, and slider images</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "home", homeData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Hero Section
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={homeData.hero?.badge || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, badge: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Main Heading
                </label>
                <input
                  type="text"
                  value={homeData.hero?.heading || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, heading: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Subheading / Tagline
                </label>
                <input
                  type="text"
                  value={homeData.hero?.subheading || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, subheading: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Hero Writeup / Description
                </label>
                <textarea
                  rows={3}
                  value={homeData.hero?.description || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem", resize: "vertical" }}
                />
              </div>
            </div>

            {/* Carousel Images with Replace Image */}
            <div style={{ marginTop: "20px", borderTop: "1px solid #edf2ee", paddingTop: "16px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#0e3d26", marginBottom: "10px" }}>
                Hero Carousel Slider Images (Replace any image below)
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                {homeData.hero?.carouselImages?.map((imgUrl: string, idx: number) => (
                  <ImageField
                    key={idx}
                    label={`Carousel Slide #${idx + 1}`}
                    currentUrl={imgUrl}
                    onChange={(newUrl) => {
                      const updated = [...homeData.hero.carouselImages];
                      updated[idx] = newUrl;
                      setHomeData({ ...homeData, hero: { ...homeData.hero, carouselImages: updated } });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section: Gallery Marquee Header */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🖼️ Women in Shelter Gallery Marquee</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>Controls the section title and subtitle above the infinite scrolling marquee</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "home", homeData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Marquee Header
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Section Title
                </label>
                <input
                  type="text"
                  value={homeData.marquee?.title || ""}
                  onChange={(e) => setHomeData({ ...homeData, marquee: { ...homeData.marquee, title: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  value={homeData.marquee?.subtitle || ""}
                  onChange={(e) => setHomeData({ ...homeData, marquee: { ...homeData.marquee, subtitle: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>
            </div>
          </div>

          {/* Section: Why UPUA Exists / Mission */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🤝 Why UPUA Exists</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>Mission writeup, eyebrow, and bullet points</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "home", homeData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Mission
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Section Eyebrow Label
                </label>
                <input
                  type="text"
                  value={homeData.mission?.eyebrow || ""}
                  onChange={(e) => setHomeData({ ...homeData, mission: { ...homeData.mission, eyebrow: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={homeData.mission?.heading || ""}
                  onChange={(e) => setHomeData({ ...homeData, mission: { ...homeData.mission, heading: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={homeData.mission?.description || ""}
                  onChange={(e) => setHomeData({ ...homeData, mission: { ...homeData.mission, description: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Key Bullet Points (One per line)
                </label>
                <textarea
                  rows={4}
                  value={homeData.mission?.bulletPoints?.join("\n") || ""}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      mission: { ...homeData.mission, bulletPoints: e.target.value.split("\n").filter(Boolean) },
                    })
                  }
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: ABOUT & ANTHEM                                                    */}
      {/* ========================================================================= */}
      {activeTab === "about" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* History & Accreditation */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📖 History &amp; 501(c)(3) Accreditation</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>About page historical overview and legal accreditation</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "about", aboutData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save History
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Main Heading
                </label>
                <input
                  type="text"
                  value={aboutData.history?.heading || ""}
                  onChange={(e) => setAboutData({ ...aboutData, history: { ...aboutData.history, heading: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Accreditation Statement
                </label>
                <textarea
                  rows={2}
                  value={aboutData.history?.accreditation || ""}
                  onChange={(e) => setAboutData({ ...aboutData, history: { ...aboutData.history, accreditation: e.target.value } })}
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  History Paragraphs (One paragraph per block)
                </label>
                {aboutData.history?.body?.map((p: string, pIdx: number) => (
                  <textarea
                    key={pIdx}
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const updated = [...aboutData.history.body];
                      updated[pIdx] = e.target.value;
                      setAboutData({ ...aboutData, history: { ...aboutData.history, body: updated } });
                    }}
                    className="donation-input"
                    style={{ width: "100%", padding: "10px 12px", fontSize: "0.84rem", marginBottom: "10px" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🎯 Mission &amp; Vision Statements</h3>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "about", aboutData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Mission &amp; Vision
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={aboutData.missionVision?.mission || ""}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, missionVision: { ...aboutData.missionVision, mission: e.target.value } })
                  }
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={aboutData.missionVision?.vision || ""}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, missionVision: { ...aboutData.missionVision, vision: e.target.value } })
                  }
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>
            </div>
          </div>

          {/* Urhobo National Anthem */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🎵 The Urhobo National Anthem</h3>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "about", aboutData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Anthem
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#137459", marginBottom: "4px" }}>
                  In Urhobo Language (Lyrics)
                </label>
                <textarea
                  rows={9}
                  value={aboutData.nationalAnthem?.urhoboLyrics?.join("\n") || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      nationalAnthem: { ...aboutData.nationalAnthem, urhoboLyrics: e.target.value.split("\n") },
                    })
                  }
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem", fontStyle: "italic" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#137459", marginBottom: "4px" }}>
                  In English Translation
                </label>
                <textarea
                  rows={9}
                  value={aboutData.nationalAnthem?.englishTranslation?.join("\n") || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      nationalAnthem: { ...aboutData.nationalAnthem, englishTranslation: e.target.value.split("\n") },
                    })
                  }
                  className="donation-input"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "0.86rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: LEADERSHIP & BOT                                                 */}
      {/* ========================================================================= */}
      {activeTab === "leadership" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top Leaders */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>👑 National President &amp; BOT Chairman</h3>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/leadership", leadershipList)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Top Leaders
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
              {leadershipList.map((leader, idx) => (
                <div key={leader.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "12px", padding: "16px", background: "#fbfcfb" }}>
                  <ImageField
                    label="Portrait Photograph"
                    currentUrl={leader.image}
                    onChange={(newUrl) => {
                      const updated = [...leadershipList];
                      updated[idx].image = newUrl;
                      setLeadershipList(updated);
                    }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Full Name &amp; Title
                  </label>
                  <input
                    type="text"
                    value={leader.name}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].name = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 10px", marginBottom: "8px" }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Executive Position
                  </label>
                  <input
                    type="text"
                    value={leader.title}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].title = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontSize: "0.82rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 10px", marginBottom: "8px" }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Tagline / Credentials
                  </label>
                  <input
                    type="text"
                    value={leader.tagline}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].tagline = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontSize: "0.8rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 10px", marginBottom: "8px" }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Biography &amp; Address
                  </label>
                  <textarea
                    rows={4}
                    value={leader.bio}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].bio = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 10px", resize: "vertical" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Board of Trustees Grid */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🛡️ Board of Trustees (BOT)</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{trusteesList.length} accredited trustees across North America</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/trustees", trusteesList)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Trustees
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "14px" }}>
              {trusteesList.map((trustee, idx) => (
                <div key={trustee.slug || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb" }}>
                  <ImageField
                    label="Trustee Photo"
                    currentUrl={trustee.localPath}
                    onChange={(newUrl) => {
                      const updated = [...trusteesList];
                      updated[idx].localPath = newUrl;
                      setTrusteesList(updated);
                    }}
                  />
                  <input
                    type="text"
                    value={trustee.name}
                    onChange={(e) => {
                      const updated = [...trusteesList];
                      updated[idx].name = e.target.value;
                      setTrusteesList(updated);
                    }}
                    style={{ fontWeight: 700, fontSize: "0.86rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px", marginBottom: "4px" }}
                  />
                  <input
                    type="text"
                    value={trustee.title}
                    onChange={(e) => {
                      const updated = [...trusteesList];
                      updated[idx].title = e.target.value;
                      setTrusteesList(updated);
                    }}
                    style={{ fontSize: "0.78rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px", marginBottom: "4px" }}
                  />
                  <input
                    type="text"
                    value={trustee.chapter}
                    onChange={(e) => {
                      const updated = [...trusteesList];
                      updated[idx].chapter = e.target.value;
                      setTrusteesList(updated);
                    }}
                    style={{ fontSize: "0.75rem", color: "#526359", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: EXECUTIVE COMMITTEE                                              */}
      {/* ========================================================================= */}
      {activeTab === "executives" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🏛️ National Executive Committee (EC)</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{executivesList.length} elected national officers</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => saveContent("collection", "organization/executive-committee", executivesList)}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Save size={14} /> Save Executive Committee
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
            {executivesList.map((officer, idx) => (
              <div key={officer.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "14px", background: "#fbfcfb" }}>
                <ImageField
                  label="Officer Portrait"
                  currentUrl={officer.image}
                  onChange={(newUrl) => {
                    const updated = [...executivesList];
                    updated[idx].image = newUrl;
                    setExecutivesList(updated);
                  }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Name</label>
                <input
                  type="text"
                  value={officer.name}
                  onChange={(e) => {
                    const updated = [...executivesList];
                    updated[idx].name = e.target.value;
                    setExecutivesList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Office / Role</label>
                <input
                  type="text"
                  value={officer.role}
                  onChange={(e) => {
                    const updated = [...executivesList];
                    updated[idx].role = e.target.value;
                    setExecutivesList(updated);
                  }}
                  style={{ fontSize: "0.82rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: YOUTH LEADERSHIP                                                 */}
      {/* ========================================================================= */}
      {activeTab === "youth" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🌟 UPUAYA Youth Wing Executive Leaders</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{youthList.length} executive leaders across North America</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => saveContent("collection", "organization/youth-leadership", youthList)}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Save size={14} /> Save Youth Executives
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
            {youthList.map((leader, idx) => (
              <div key={leader.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "14px", background: "#fbfcfb" }}>
                <ImageField
                  label="Youth Leader Photo"
                  currentUrl={leader.image}
                  onChange={(newUrl) => {
                    const updated = [...youthList];
                    updated[idx].image = newUrl;
                    setYouthList(updated);
                  }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Name</label>
                <input
                  type="text"
                  value={leader.name}
                  onChange={(e) => {
                    const updated = [...youthList];
                    updated[idx].name = e.target.value;
                    setYouthList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Position</label>
                <input
                  type="text"
                  value={leader.role}
                  onChange={(e) => {
                    const updated = [...youthList];
                    updated[idx].role = e.target.value;
                    setYouthList(updated);
                  }}
                  style={{ fontSize: "0.82rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Chapter</label>
                <input
                  type="text"
                  value={leader.chapter}
                  onChange={(e) => {
                    const updated = [...youthList];
                    updated[idx].chapter = e.target.value;
                    setYouthList(updated);
                  }}
                  style={{ fontSize: "0.8rem", color: "#526359", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: CHAPTERS DIRECTORY                                               */}
      {/* ========================================================================= */}
      {activeTab === "chapters" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📍 North American Chapters Directory</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{chaptersList.length} accredited metro chapters</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => saveContent("collection", "organization/chapters", chaptersList)}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Save size={14} /> Save Chapters
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
            {chaptersList.map((chapter, idx) => (
              <div key={chapter.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "14px", background: "#fbfcfb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#137459", textTransform: "uppercase" }}>{chapter.region}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#888" }}>#{idx + 1}</span>
                </div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Chapter Name</label>
                <input
                  type="text"
                  value={chapter.name}
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].name = e.target.value;
                    setChaptersList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>President</label>
                <input
                  type="text"
                  value={chapter.president}
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].president = e.target.value;
                    setChaptersList(updated);
                  }}
                  style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Website URL</label>
                <input
                  type="text"
                  value={chapter.website || ""}
                  placeholder="https://..."
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].website = e.target.value;
                    setChaptersList(updated);
                  }}
                  style={{ fontSize: "0.8rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: 24 ROYAL KINGDOMS                                                */}
      {/* ========================================================================= */}
      {activeTab === "kingdoms" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>👑 The 24 Urhobo Royal Kingdoms</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>Honoring traditional heritage, ancient dynasties, and Royal Monarchs</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => saveContent("collection", "organization/kingdoms", kingdomsList)}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Save size={14} /> Save Royal Kingdoms
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {kingdomsList.map((k, idx) => (
              <div key={k.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#137459" }}>Kingdom #{idx + 1}</span>
                <input
                  type="text"
                  value={k.name}
                  onChange={(e) => {
                    const updated = [...kingdomsList];
                    updated[idx].name = e.target.value;
                    setKingdomsList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px", margin: "4px 0" }}
                />
                <textarea
                  rows={2}
                  value={k.king}
                  onChange={(e) => {
                    const updated = [...kingdomsList];
                    updated[idx].king = e.target.value;
                    setKingdomsList(updated);
                  }}
                  style={{ fontSize: "0.8rem", color: "#526359", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: PROGRAMS & SHELTER INITIATIVE                                    */}
      {/* ========================================================================= */}
      {activeTab === "programs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Programs Manager */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🎯 Flagship Programs &amp; Initiatives</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{programsData.programs?.length || 0} signature civic and humanitarian initiatives</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "programs/programs", programsData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Programs
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {programsData.programs?.map((prog: any, idx: number) => (
                <div key={prog.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "12px", padding: "18px", background: "#fbfcfb" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                    <div>
                      <ImageField
                        label="Featured Image"
                        currentUrl={prog.featuredImage}
                        onChange={(newUrl) => {
                          const updated = { ...programsData };
                          updated.programs[idx].featuredImage = newUrl;
                          setProgramsData(updated);
                        }}
                      />
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Program Title</label>
                      <input
                        type="text"
                        value={prog.title}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].title = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                      />
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Category</label>
                      <input
                        type="text"
                        value={prog.category}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].category = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ fontSize: "0.82rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                      />
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Impact Metric</label>
                      <input
                        type="text"
                        value={prog.impact}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].impact = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Summary</label>
                      <textarea
                        rows={3}
                        value={prog.summary}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].summary = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ width: "100%", fontSize: "0.84rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                      />

                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Key Details (One per line)</label>
                      <textarea
                        rows={3}
                        value={prog.details?.join("\n") || ""}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].details = e.target.value.split("\n").filter(Boolean);
                          setProgramsData(updated);
                        }}
                        style={{ width: "100%", fontSize: "0.82rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                      />

                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Full Writeup Paragraphs (One per line)</label>
                      <textarea
                        rows={4}
                        value={prog.fullWriteup?.join("\n\n") || ""}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].fullWriteup = e.target.value.split("\n\n").filter(Boolean);
                          setProgramsData(updated);
                        }}
                        style={{ width: "100%", fontSize: "0.82rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shelter Chapters */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🏠 Women in Shelter Participating Chapters</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>8 participating metro chapter delegations and photos</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "programs/programs", programsData)}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                <Save size={14} /> Save Shelter Chapters
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
              {programsData.shelterChapters?.map((sc: any, idx: number) => (
                <div key={idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb" }}>
                  <ImageField
                    label="Chapter Photo"
                    currentUrl={sc.image}
                    onChange={(newUrl) => {
                      const updated = { ...programsData };
                      updated.shelterChapters[idx].image = newUrl;
                      setProgramsData(updated);
                    }}
                  />
                  <input
                    type="text"
                    value={sc.chapter}
                    onChange={(e) => {
                      const updated = { ...programsData };
                      updated.shelterChapters[idx].chapter = e.target.value;
                      setProgramsData(updated);
                    }}
                    style={{ fontWeight: 800, fontSize: "0.86rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px", marginBottom: "4px" }}
                  />
                  <input
                    type="text"
                    value={sc.location}
                    onChange={(e) => {
                      const updated = { ...programsData };
                      updated.shelterChapters[idx].location = e.target.value;
                      setProgramsData(updated);
                    }}
                    style={{ fontSize: "0.8rem", color: "#526359", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB: EVENTS & CONVENTION                                              */}
      {/* ========================================================================= */}
      {activeTab === "events" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📅 Events &amp; Convention Manager</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{eventsList.length} events, conventions, and convocations</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => saveContent("collection", "events/events", eventsList)}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Save size={14} /> Save Events
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {eventsList.map((event, idx) => (
              <div key={event.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "12px", padding: "18px", background: "#fbfcfb" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  <div>
                    <ImageField
                      label="Event Flyer / Poster Image"
                      currentUrl={event.flyer}
                      onChange={(newUrl) => {
                        const updated = [...eventsList];
                        updated[idx].flyer = newUrl;
                        setEventsList(updated);
                      }}
                    />
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Event Title</label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].title = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Category</label>
                        <input
                          type="text"
                          value={event.category}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].category = e.target.value;
                            setEventsList(updated);
                          }}
                          style={{ fontSize: "0.82rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Full Date String</label>
                        <input
                          type="text"
                          value={event.fullDate}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].fullDate = e.target.value;
                            setEventsList(updated);
                          }}
                          style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                        />
                      </div>
                    </div>

                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Venue &amp; Location</label>
                    <input
                      type="text"
                      value={event.venueName}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].venueName = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "4px" }}
                    />
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].location = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.8rem", color: "#526359", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Pricing / Ticket Options</label>
                    <input
                      type="text"
                      value={event.pricing}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].pricing = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                    />

                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Registration / Ticket URL</label>
                    <input
                      type="text"
                      value={event.registrationUrl}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].registrationUrl = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                    />

                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Hotel Booking URL</label>
                    <input
                      type="text"
                      value={event.hotelBookingUrl || ""}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].hotelBookingUrl = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                    />

                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Event Description</label>
                    <textarea
                      rows={4}
                      value={event.description}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].description = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ width: "100%", fontSize: "0.82rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TAB: BLOG & STORIES                                                   */}
      {/* ========================================================================= */}
      {activeTab === "blog" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📰 Blog &amp; Press Articles</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{articlesList.length} articles published</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => saveContent("collection", "blog/articles", articlesList)}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Save size={14} /> Save Articles
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {articlesList.map((article, idx) => (
              <div key={article.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "12px", padding: "18px", background: "#fbfcfb" }}>
                <ImageField
                  label="Article Lead Photograph"
                  currentUrl={article.image}
                  onChange={(newUrl) => {
                    const updated = [...articlesList];
                    updated[idx].image = newUrl;
                    setArticlesList(updated);
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px", marginBottom: "8px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Article Title</label>
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].title = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Category</label>
                    <input
                      type="text"
                      value={article.category}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].category = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontSize: "0.82rem", color: "#137459", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "8px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Date String</label>
                    <input
                      type="text"
                      value={article.displayDate || article.date}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].displayDate = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Author</label>
                    <input
                      type="text"
                      value={article.author}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].author = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                    />
                  </div>
                </div>

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Lead Excerpt</label>
                <textarea
                  rows={2}
                  value={article.excerpt}
                  onChange={(e) => {
                    const updated = [...articlesList];
                    updated[idx].excerpt = e.target.value;
                    setArticlesList(updated);
                  }}
                  style={{ width: "100%", fontSize: "0.84rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px", marginBottom: "8px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Article Body Content (Paragraphs)</label>
                <textarea
                  rows={4}
                  value={article.content?.join("\n\n") || ""}
                  onChange={(e) => {
                    const updated = [...articlesList];
                    updated[idx].content = e.target.value.split("\n\n").filter(Boolean);
                    setArticlesList(updated);
                  }}
                  style={{ width: "100%", fontSize: "0.82rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "6px 8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. TAB: MEDIA ASSET MANAGER                                             */}
      {/* ========================================================================= */}
      {activeTab === "media" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🖼️ Media Asset Manager</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>
                Stored in repository public assets directory (public/assets/cms) · Staged for GitHub master
              </p>
            </div>

            <label
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <Upload size={14} /> Upload New Image
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleDirectUpload(file);
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
            {mediaList.map((m, idx) => (
              <div key={idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "10px", background: "#fbfcfb", textAlign: "center" }}>
                <div style={{ width: "100%", height: "130px", position: "relative", borderRadius: "6px", overflow: "hidden", marginBottom: "8px", background: "#eee" }}>
                  <Image src={m.url} alt={m.filename} fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={m.filename}>
                  {m.filename}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#888", margin: "2px 0 6px" }}>
                  {(m.sizeBytes / 1024).toFixed(1)} KB · {m.folder}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(m.url);
                    showToast("info", `Copied URL: ${m.url}`);
                  }}
                  style={{
                    background: "#eef5f1",
                    border: "1px solid #cce2d6",
                    color: "#137459",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Copy Path
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. TAB: DEPLOYMENTS & PUBLISH                                           */}
      {/* ========================================================================= */}
      {activeTab === "deploy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* One-Click Publish Card */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1.5px solid #d4af37" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.4rem" }}>🚀</span>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.2rem", fontWeight: 800 }}>Publish Changes to Production</h3>
            </div>
            <p style={{ color: "#526359", fontSize: "0.88rem", margin: "0 0 16px" }}>
              Commits all modified JSON schemas and media assets directly to the GitHub repository on branch <strong>master</strong>.
              This immediately triggers parallel production deployments to <strong>Vercel</strong> and <strong>Google Cloud Run</strong>.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Enter commit release note (e.g. CMS: Update homepage hero & programs)"
                value={publishMessage}
                onChange={(e) => setPublishMessage(e.target.value)}
                className="donation-input"
                style={{ flex: 1, minWidth: "260px", padding: "10px 14px", fontSize: "0.88rem" }}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={handlePublishToGitHub}
                disabled={isPublishing}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={16} className="spinner" /> Publishing to GitHub...
                  </>
                ) : (
                  <>
                    <Globe size={16} /> Confirm &amp; Push to GitHub
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Deployment Monitor */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📡 Live Deployment Status</h3>
              <button
                type="button"
                className="btn-outline"
                onClick={() => loadTabContent("deploy")}
                style={{ padding: "6px 12px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <RefreshCw size={13} /> Refresh Status
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {/* GitHub Commit Status */}
              <div style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "16px", background: "#fbfcfb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Globe size={18} color="#0e3d26" />
                  <strong style={{ fontSize: "0.92rem", color: "#0e3d26" }}>GitHub Repository</strong>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#526359" }}>Branch: <strong>master</strong></div>
                <div style={{ fontSize: "0.8rem", color: "#526359" }}>
                  Latest SHA: <code>{deployStatus?.commitSha || "master"}</code>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#888", marginTop: "6px" }}>
                  {deployStatus?.commitMessage || "Live repository connected"}
                </div>
              </div>

              {/* Vercel Status */}
              <div style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "16px", background: "#fbfcfb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "1.1rem" }}>▲</span>
                  <strong style={{ fontSize: "0.92rem", color: "#0e3d26" }}>Vercel Production</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "6px 0" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: deployStatus?.vercel?.status === "completed" ? "#10b981" : "#f59e0b",
                    }}
                  />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "capitalize", color: "#0e3d26" }}>
                    {deployStatus?.vercel?.status || "Active & Ready"}
                  </span>
                </div>
                <a
                  href="https://upua.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.78rem", color: "#137459", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  upua.vercel.app <ExternalLink size={12} />
                </a>
              </div>

              {/* Google Cloud Run Status */}
              <div style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "16px", background: "#fbfcfb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Cloud size={18} color="#1a73e8" />
                  <strong style={{ fontSize: "0.92rem", color: "#0e3d26" }}>Google Cloud Run</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "6px 0" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: deployStatus?.cloudRun?.status === "completed" ? "#10b981" : "#f59e0b",
                    }}
                  />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "capitalize", color: "#0e3d26" }}>
                    {deployStatus?.cloudRun?.status || "Active (deploy-gcloud.yml)"}
                  </span>
                </div>
                <span style={{ fontSize: "0.78rem", color: "#526359" }}>Service: upua · Region: us-east1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMAGE PICKER & REPLACER                                           */}
      {/* ========================================================================= */}
      {imagePickerTarget && (
        <div className="upua-modal-backdrop" style={{ zIndex: 999999 }} onClick={() => setImagePickerTarget(null)}>
          <div className="upua-modal-box" style={{ maxWidth: "680px", maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Camera size={20} color="#0e3d26" />
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "#0e3d26" }}>
                  Replace / Select Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setImagePickerTarget(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Action 1: Direct File Upload */}
            <div style={{ background: "#f8faf8", padding: "16px", borderRadius: "10px", border: "1.5px dashed #137459", textAlign: "center", marginBottom: "18px" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#0e3d26",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Upload size={16} /> Choose File from Computer
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const newUrl = await handleDirectUpload(file);
                      if (newUrl) {
                        imagePickerTarget.onSelect(newUrl);
                        setImagePickerTarget(null);
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
              <p style={{ margin: "6px 0 0", fontSize: "0.76rem", color: "#526359" }}>
                Accepts JPG, PNG, WEBP, or SVG. Automatically saved to public/assets/cms and staged for GitHub.
              </p>
            </div>

            {/* Action 2: Choose from Media Library */}
            <div style={{ flex: 1, overflowY: "auto", minHeight: "220px", maxHeight: "360px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#0e3d26", marginBottom: "8px" }}>
                Or Pick an Existing Image from Media Library:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "10px" }}>
                {mediaList.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      imagePickerTarget.onSelect(m.url);
                      setImagePickerTarget(null);
                      showToast("success", `Selected ${m.filename}`);
                    }}
                    style={{
                      background: imagePickerTarget.currentUrl === m.url ? "#e6f4ea" : "#ffffff",
                      border: imagePickerTarget.currentUrl === m.url ? "2px solid #137333" : "1px solid #e1eae3",
                      borderRadius: "8px",
                      padding: "6px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ width: "100%", height: "70px", position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "4px", background: "#eee" }}>
                      <Image src={m.url} alt={m.filename} fill style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#0e3d26", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={m.filename}>
                      {m.filename}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
