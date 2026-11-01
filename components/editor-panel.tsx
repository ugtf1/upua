"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";

interface ContentBlock {
  id: string;
  type: "heading" | "subheading" | "text" | "image" | "caption" | "badge" | "cta_label" | "cta_url";
  label: string;
  value: string;
}

interface ContentSection {
  id: string;
  page: string;
  section: string;
  label: string;
  icon: string;
  blocks: ContentBlock[];
}

const PAGE_OPTIONS = [
  { value: "home",     label: "🏠 Home Page" },
  { value: "about",    label: "ℹ️ About Page" },
  { value: "events",   label: "📅 Events Page" },
  { value: "programs", label: "📚 Programs Page" },
  { value: "blog",     label: "✍️ Blog Page" },
];

const PAGE_URLS: Record<string, string> = {
  home: "/",
  about: "/about",
  events: "/events",
  programs: "/programs",
  blog: "/blog",
};

function blockIcon(type: ContentBlock["type"]) {
  switch (type) {
    case "heading":    return <Type size={13} />;
    case "subheading": return <Type size={11} />;
    case "text":       return <AlignLeft size={13} />;
    case "image":      return <ImageIcon size={13} />;
    case "badge":      return <Tag size={13} />;
    case "cta_label":  return <Tag size={13} />;
    case "cta_url":    return <LinkIcon size={13} />;
    default:           return <AlignLeft size={13} />;
  }
}

function blockColor(type: ContentBlock["type"]): string {
  switch (type) {
    case "heading":    return "#0e3d26";
    case "subheading": return "#137459";
    case "badge":      return "#b5830a";
    case "image":      return "#1a4b7a";
    case "cta_label":  return "#6b21a8";
    case "cta_url":    return "#0369a1";
    default:           return "#526359";
  }
}

export default function EditorPanel() {
  const [activePage, setActivePage] = useState("home");
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [localEdits, setLocalEdits] = useState<Record<string, Record<string, string>>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadSections = useCallback(async (page: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content?page=${page}`);
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
        // Seed localEdits with current values
        const edits: Record<string, Record<string, string>> = {};
        data.data.forEach((s: ContentSection) => {
          edits[s.id] = {};
          s.blocks.forEach((b: ContentBlock) => {
            edits[s.id][b.id] = b.value;
          });
        });
        setLocalEdits(edits);
        setExpandedSection(data.data[0]?.id ?? null);
      }
    } catch {
      showToast("error", "Failed to load content. Using defaults.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSections(activePage);
  }, [activePage, loadSections]);

  function handleEdit(sectionId: string, blockId: string, value: string) {
    setLocalEdits((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] ?? {}), [blockId]: value },
    }));
  }

  async function handleSaveSection(sectionId: string) {
    setSaving(sectionId);
    try {
      const blocks = Object.entries(localEdits[sectionId] ?? {}).map(([id, value]) => ({
        id,
        value,
      }));
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, blocks }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Section saved successfully!");
        // Persist to localStorage for session continuity
        try {
          const stored = JSON.parse(localStorage.getItem("upua_content_edits") || "{}");
          stored[sectionId] = localEdits[sectionId];
          localStorage.setItem("upua_content_edits", JSON.stringify(stored));
        } catch {}
      } else {
        showToast("error", data.error || "Failed to save changes.");
      }
    } catch {
      showToast("error", "Network error — could not save changes.");
    } finally {
      setSaving(null);
    }
  }

  async function handleResetSection(sectionId: string) {
    if (!confirm("Reset this section to its original default content?")) return;
    setResetting(sectionId);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId }),
      });
      const data = await res.json();
      if (data.success) {
        // Re-seed local edits from API response
        const section = data.data as ContentSection;
        setLocalEdits((prev) => ({
          ...prev,
          [sectionId]: Object.fromEntries(section.blocks.map((b) => [b.id, b.value])),
        }));
        showToast("success", "Section reset to defaults.");
        // Remove from localStorage
        try {
          const stored = JSON.parse(localStorage.getItem("upua_content_edits") || "{}");
          delete stored[sectionId];
          localStorage.setItem("upua_content_edits", JSON.stringify(stored));
        } catch {}
      }
    } catch {
      showToast("error", "Failed to reset section.");
    } finally {
      setResetting(null);
    }
  }

  function isDirty(sectionId: string, section: ContentSection): boolean {
    const edits = localEdits[sectionId] ?? {};
    return section.blocks.some((b) => edits[b.id] !== undefined && edits[b.id] !== b.value);
  }

  return (
    <div style={{ minHeight: "100%", padding: "0 0 80px", fontFamily: "var(--font-main)" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <Globe size={22} color="#0e3d26" />
          <h2 style={{ margin: 0, fontSize: "1.45rem", fontWeight: 800, color: "#0e3d26", fontFamily: "var(--font-heading)" }}>
            Website Content Editor
          </h2>
        </div>
        <p style={{ margin: 0, color: "#526359", fontSize: "0.9rem" }}>
          Edit headings, text, images, and captions across all public pages. Changes save immediately to the content store.
        </p>
      </div>

      {/* Info Banner */}
      <div style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}>
        <Info size={15} color="#137459" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ margin: 0, color: "#166534", fontSize: "0.82rem", lineHeight: 1.5 }}>
          <strong>Connection-Ready Mode:</strong> Changes are saved in the active session and localStorage. When a cloud database is connected, all edits will persist permanently across sessions.
        </p>
      </div>

      {/* Page Selector */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#526359", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
          Select Page to Edit
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {PAGE_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setActivePage(p.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: activePage === p.value ? "2px solid #0e3d26" : "1.5px solid #e1eae3",
                background: activePage === p.value ? "#0e3d26" : "#ffffff",
                color: activePage === p.value ? "#ffffff" : "#333",
                fontWeight: 700,
                fontSize: "0.83rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {p.label}
            </button>
          ))}
          <a
            href={PAGE_URLS[activePage] || "/"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "1.5px solid #e1eae3",
              background: "#f8f9fa",
              color: "#526359",
              fontWeight: 600,
              fontSize: "0.83rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={13} /> View Live Page
          </a>
        </div>
      </div>

      {/* Sections */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "40px 0", justifyContent: "center", color: "#526359" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          Loading content sections...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const dirty = isDirty(section.id, section);
            const edits = localEdits[section.id] ?? {};

            return (
              <div
                key={section.id}
                style={{
                  background: "#ffffff",
                  border: dirty ? "1.5px solid #d97706" : "1.5px solid #e1eae3",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{section.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0e3d26" }}>
                        {section.label}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#8a9e91", marginTop: "2px" }}>
                        {section.blocks.length} editable field{section.blocks.length !== 1 ? "s" : ""}
                        {dirty && <span style={{ color: "#d97706", fontWeight: 700, marginLeft: "8px" }}>● Unsaved changes</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {dirty && (
                      <span style={{
                        background: "#fef3c7",
                        color: "#92400e",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "999px",
                      }}>
                        Modified
                      </span>
                    )}
                    {isExpanded ? <ChevronDown size={16} color="#526359" /> : <ChevronRight size={16} color="#526359" />}
                  </div>
                </button>

                {/* Expanded Editor */}
                {isExpanded && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f0f4f1" }}>
                    <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      {section.blocks.map((block) => {
                        const currentVal = edits[block.id] ?? block.value;
                        const isChanged = currentVal !== block.value;

                        return (
                          <div key={block.id}>
                            <label style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: blockColor(block.type),
                              marginBottom: "6px",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}>
                              {blockIcon(block.type)}
                              {block.label}
                              {isChanged && (
                                <span style={{ color: "#d97706", fontWeight: 800, fontSize: "0.65rem" }}>✎ Edited</span>
                              )}
                            </label>

                            {block.type === "image" ? (
                              <div>
                                <input
                                  type="text"
                                  value={currentVal}
                                  onChange={(e) => handleEdit(section.id, block.id, e.target.value)}
                                  placeholder="Image URL or /public path (e.g. /assets/hero.jpg)"
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: `1.5px solid ${isChanged ? "#d97706" : "#dce8df"}`,
                                    borderRadius: "10px",
                                    fontSize: "0.87rem",
                                    fontFamily: "monospace",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    background: isChanged ? "#fffbeb" : "#ffffff",
                                  }}
                                />
                                {currentVal && (
                                  <div style={{ marginTop: "8px", borderRadius: "10px", overflow: "hidden", maxHeight: "120px", background: "#f5f5f5" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={currentVal}
                                      alt="Preview"
                                      style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }}
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : block.type === "text" ? (
                              <textarea
                                value={currentVal}
                                onChange={(e) => handleEdit(section.id, block.id, e.target.value)}
                                rows={3}
                                style={{
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: `1.5px solid ${isChanged ? "#d97706" : "#dce8df"}`,
                                  borderRadius: "10px",
                                  fontSize: "0.87rem",
                                  resize: "vertical",
                                  outline: "none",
                                  boxSizing: "border-box",
                                  fontFamily: "inherit",
                                  lineHeight: 1.6,
                                  background: isChanged ? "#fffbeb" : "#ffffff",
                                }}
                              />
                            ) : (
                              <input
                                type={block.type === "cta_url" ? "url" : "text"}
                                value={currentVal}
                                onChange={(e) => handleEdit(section.id, block.id, e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: `1.5px solid ${isChanged ? "#d97706" : "#dce8df"}`,
                                  borderRadius: "10px",
                                  fontSize: "0.87rem",
                                  outline: "none",
                                  boxSizing: "border-box",
                                  background: isChanged ? "#fffbeb" : "#ffffff",
                                  fontWeight: block.type === "heading" ? 700 : 400,
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Section Actions */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleResetSection(section.id)}
                        disabled={resetting === section.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "9px 16px",
                          border: "1.5px solid #e1eae3",
                          borderRadius: "10px",
                          background: "#f8f9fa",
                          color: "#526359",
                          fontWeight: 600,
                          fontSize: "0.83rem",
                          cursor: "pointer",
                        }}
                      >
                        {resetting === section.id ? (
                          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveSection(section.id)}
                        disabled={saving === section.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "9px 20px",
                          border: "none",
                          borderRadius: "10px",
                          background: dirty ? "#0e3d26" : "#8a9e91",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.83rem",
                          cursor: dirty ? "pointer" : "default",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {saving === section.id ? (
                          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                        ) : (
                          <Save size={14} />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          background: toast.type === "success" ? "#0e3d26" : "#c5221f",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 700,
          fontSize: "0.88rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 9999,
          animation: "slideUp 0.25s ease",
        }}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
