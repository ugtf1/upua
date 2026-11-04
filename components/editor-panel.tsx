"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  ChevronDown,
  ChevronRight,
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
  Link as LinkIcon,
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
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Staged data states
  const [homeData, setHomeData] = useState<any>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [leadershipList, setLeadershipList] = useState<any[]>([]);
  const [trusteesList, setTrusteesList] = useState<any[]>([]);
  const [executivesList, setExecutivesList] = useState<any[]>([]);
  const [youthList, setYouthList] = useState<any[]>([]);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [kingdomsList, setKingdomsList] = useState<any[]>([]);
  const [programsData, setProgramsData] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [deployStatus, setDeployStatus] = useState<any>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");

  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch initial content
  const loadTabContent = useCallback(async (tab: CMSTab) => {
    setIsLoading(true);
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
        if (json.data) setLeadershipList(json.data);
        const tRes = await fetch("/api/cms/content?type=collection&name=organization/trustees");
        const tJson = await tRes.json();
        if (tJson.data) setTrusteesList(tJson.data);
      } else if (tab === "executives") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/executive-committee");
        const json = await res.json();
        if (json.data) setExecutivesList(json.data);
      } else if (tab === "youth") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/youth-leadership");
        const json = await res.json();
        if (json.data) setYouthList(json.data);
      } else if (tab === "chapters") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/chapters");
        const json = await res.json();
        if (json.data) setChaptersList(json.data);
      } else if (tab === "kingdoms") {
        const res = await fetch("/api/cms/content?type=collection&name=organization/kingdoms");
        const json = await res.json();
        if (json.data) setKingdomsList(json.data);
      } else if (tab === "programs") {
        const res = await fetch("/api/cms/content?type=page&name=programs");
        // Also check programs collection
        const colRes = await fetch("/api/cms/content?type=collection&name=programs/programs");
        const colJson = await colRes.json();
        if (colJson.data) setProgramsData(colJson.data);
      } else if (tab === "events") {
        const res = await fetch("/api/cms/content?type=collection&name=events/events");
        const json = await res.json();
        if (json.data) setEventsList(json.data);
      } else if (tab === "blog") {
        const res = await fetch("/api/cms/content?type=collection&name=blog/articles");
        const json = await res.json();
        if (json.data) setArticlesList(json.data);
      } else if (tab === "media") {
        const res = await fetch("/api/cms/media");
        const json = await res.json();
        if (json.media) setMediaList(json.media);
      } else if (tab === "deploy") {
        const res = await fetch("/api/cms/deploy");
        const json = await res.json();
        if (json.status) setDeployStatus(json.status);
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to load tab data");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTabContent(activeTab);
  }, [activeTab, loadTabContent]);

  // Save content to local/server JSON
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

  // Publish to GitHub master
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

  // Upload image to public/assets/cms
  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>, category = "cms") {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);

    try {
      showToast("info", "Uploading image to public/assets/cms...");
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `Image uploaded: ${json.url}`);
        loadTabContent("media");
      } else {
        showToast("error", json.error || "Upload failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to upload image");
    }
  }

  return (
    <div className="cms-workspace-container" style={{ padding: "24px 0", maxWidth: "1280px", margin: "0 auto" }}>
      {/* CMS Header Banner */}
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
              Git-Backed Visual CMS
            </span>
            <span style={{ color: "#c3ded0", fontSize: "0.82rem" }}>Target: GitHub master · Dual Vercel + Cloud Run</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: "0 0 4px", fontWeight: 800 }}>
            Website Content &amp; Media Studio
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.9rem", margin: 0 }}>
            Visually manage public headings, images, leadership rosters, programs, events, and publish directly to GitHub.
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

      {/* Main Tab Panels */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#526359" }}>
          <Loader2 size={32} className="spinner" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>Loading CMS data from content repository...</p>
        </div>
      ) : (
        <>
          {/* TAB: HOME PAGE */}
          {activeTab === "home" && homeData && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Hero Banner Section */}
              <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🌟 Hero Section</h3>
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
              </div>

              {/* Statistics Counters */}
              <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📊 Impact Counters</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => saveContent("page", "home", homeData)}
                    style={{ padding: "8px 16px", fontSize: "0.82rem" }}
                  >
                    <Save size={14} /> Save Stats
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  {homeData.stats?.map((stat: any, idx: number) => (
                    <div key={idx} style={{ background: "#f8faf8", padding: "14px", borderRadius: "10px", border: "1px solid #e1eae3" }}>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#526359", marginBottom: "4px" }}>
                        Stat Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...homeData.stats];
                          newStats[idx].label = e.target.value;
                          setHomeData({ ...homeData, stats: newStats });
                        }}
                        className="donation-input"
                        style={{ width: "100%", padding: "8px 10px", fontSize: "0.84rem", marginBottom: "8px" }}
                      />
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#526359", marginBottom: "4px" }}>
                        Stat Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...homeData.stats];
                          newStats[idx].value = e.target.value;
                          setHomeData({ ...homeData, stats: newStats });
                        }}
                        className="donation-input"
                        style={{ width: "100%", padding: "8px 10px", fontSize: "0.95rem", fontWeight: 800, color: "#0e3d26" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Marquee Title & Subtitle */}
              <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🖼️ Gallery Marquee Header</h3>
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
                      Marquee Title
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
                      Marquee Subtitle
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
            </div>
          )}

          {/* TAB: LEADERSHIP & BOT */}
          {activeTab === "leadership" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>👑 Top Executive Leaders</h3>
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
                      <div style={{ display: "flex", gap: "14px", marginBottom: "12px" }}>
                        <div style={{ width: "70px", height: "70px", position: "relative", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "#eee" }}>
                          <Image src={leader.image || "/upua-logo.png"} alt={leader.name} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            value={leader.name}
                            onChange={(e) => {
                              const updated = [...leadershipList];
                              updated[idx].name = e.target.value;
                              setLeadershipList(updated);
                            }}
                            style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "4px 8px" }}
                          />
                          <input
                            type="text"
                            value={leader.title}
                            onChange={(e) => {
                              const updated = [...leadershipList];
                              updated[idx].title = e.target.value;
                              setLeadershipList(updated);
                            }}
                            style={{ fontSize: "0.82rem", color: "#526359", width: "100%", marginTop: "4px", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "4px 8px" }}
                          />
                        </div>
                      </div>

                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Image Path</label>
                      <input
                        type="text"
                        value={leader.image}
                        onChange={(e) => {
                          const updated = [...leadershipList];
                          updated[idx].image = e.target.value;
                          setLeadershipList(updated);
                        }}
                        style={{ fontSize: "0.8rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "4px 8px", marginBottom: "8px" }}
                      />

                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Biography</label>
                      <textarea
                        rows={3}
                        value={leader.bio}
                        onChange={(e) => {
                          const updated = [...leadershipList];
                          updated[idx].bio = e.target.value;
                          setLeadershipList(updated);
                        }}
                        style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 8px", resize: "vertical" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Trustees Grid */}
              <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🛡️ Board of Trustees Roster</h3>
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

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                  {trusteesList.map((trustee, idx) => (
                    <div key={trustee.slug || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb", display: "flex", gap: "12px" }}>
                      <div style={{ width: "52px", height: "52px", position: "relative", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#eee" }}>
                        <Image src={trustee.localPath || "/upua-logo.png"} alt={trustee.name} fill style={{ objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={trustee.name}
                          onChange={(e) => {
                            const updated = [...trusteesList];
                            updated[idx].name = e.target.value;
                            setTrusteesList(updated);
                          }}
                          style={{ fontWeight: 700, fontSize: "0.86rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "3px 6px" }}
                        />
                        <input
                          type="text"
                          value={trustee.title}
                          onChange={(e) => {
                            const updated = [...trusteesList];
                            updated[idx].title = e.target.value;
                            setTrusteesList(updated);
                          }}
                          style={{ fontSize: "0.78rem", color: "#137459", width: "100%", marginTop: "3px", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "3px 6px" }}
                        />
                        <input
                          type="text"
                          value={trustee.chapter}
                          onChange={(e) => {
                            const updated = [...trusteesList];
                            updated[idx].chapter = e.target.value;
                            setTrusteesList(updated);
                          }}
                          style={{ fontSize: "0.75rem", color: "#526359", width: "100%", marginTop: "3px", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "3px 6px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHAPTERS */}
          {activeTab === "chapters" && (
            <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>📍 North American Chapters</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>{chaptersList.length} affiliated metro chapters</p>
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
                    <input
                      type="text"
                      value={chapter.name}
                      onChange={(e) => {
                        const updated = [...chaptersList];
                        updated[idx].name = e.target.value;
                        setChaptersList(updated);
                      }}
                      style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px", marginBottom: "6px" }}
                    />
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#526359" }}>President</label>
                    <input
                      type="text"
                      value={chapter.president}
                      onChange={(e) => {
                        const updated = [...chaptersList];
                        updated[idx].president = e.target.value;
                        setChaptersList(updated);
                      }}
                      style={{ fontSize: "0.82rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px", marginBottom: "6px" }}
                    />
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#526359" }}>Website URL</label>
                    <input
                      type="text"
                      value={chapter.website || ""}
                      placeholder="https://..."
                      onChange={(e) => {
                        const updated = [...chaptersList];
                        updated[idx].website = e.target.value;
                        setChaptersList(updated);
                      }}
                      style={{ fontSize: "0.8rem", width: "100%", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "4px 8px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MEDIA MANAGER */}
          {activeTab === "media" && (
            <div className="panel-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #e1eae3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>🖼️ Media Asset Manager</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>
                    Stored in repository public assets directory (public/assets/cms) · No external cloud bucket needed
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
                  <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, "general")} style={{ display: "none" }} />
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

          {/* TAB: DEPLOYMENTS & PUBLISH */}
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
        </>
      )}
    </div>
  );
}
