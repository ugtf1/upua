"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, Check, Globe, RefreshCw, X, ShieldAlert, ArrowUpRight, Sparkles } from "lucide-react";

export default function InlineEditorBar() {
  const [isEditor, setIsEditor] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    try {
      // Check for editor role in localStorage or session
      const storedUser = localStorage.getItem("upua_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.role === "editor" || u.role === "admin") {
          setIsEditor(true);
        }
      }
    } catch {}
  }, []);

  // When editMode changes, toggle body class for editable highlight rings
  useEffect(() => {
    if (editMode) {
      document.body.classList.add("cms-inline-edit-active");
    } else {
      document.body.classList.remove("cms-inline-edit-active");
    }
    return () => {
      document.body.classList.remove("cms-inline-edit-active");
    };
  }, [editMode]);

  async function handlePublish() {
    setIsPublishing(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: publishMessage.trim() || `CMS: Update website content via inline editor (${new Date().toLocaleDateString()})`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `🚀 Published! Commit ${data.commitSha?.slice(0, 7) || ""} pushed to GitHub master. Vercel & Cloud Run deployments triggered.`,
        });
        setTimeout(() => {
          setShowPublishModal(false);
          setEditMode(false);
          setStatusMessage(null);
        }, 3000);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Publish failed" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to publish" });
    } finally {
      setIsPublishing(false);
    }
  }

  // Only visible to logged in Website Editors
  if (!isEditor) return null;

  return (
    <>
      {/* Top Floating Control Bar when in Edit Mode */}
      {editMode && (
        <aside className="cms-floating-editor-bar" role="toolbar" aria-label="CMS Visual Editor Toolbar">
          <div className="cms-editor-bar-left">
            <span className="cms-editor-badge">
              <span className="cms-pulse-dot" />
              INLINE EDIT MODE
            </span>
            <span className="cms-editor-tip">Click on text/headings directly to edit · Changes auto-save locally</span>
          </div>

          <div className="cms-editor-bar-actions">
            <button
              type="button"
              className="cms-btn-publish"
              onClick={() => setShowPublishModal(true)}
            >
              <Globe size={15} /> Publish to GitHub
            </button>
            <Link href="/portal" className="cms-btn-dashboard">
              Full CMS Dashboard <ArrowUpRight size={14} />
            </Link>
            <button
              type="button"
              className="cms-btn-exit"
              onClick={() => setEditMode(false)}
              title="Exit Edit Mode"
            >
              <X size={16} /> Exit
            </button>
          </div>
        </aside>
      )}

      {/* Unobtrusive Bottom-Right Launcher Badge */}
      {!editMode && (
        <div className="cms-floating-launcher">
          <button
            type="button"
            className="cms-launcher-btn"
            onClick={() => setEditMode(true)}
            title="Activate Website Editor Mode"
          >
            <Edit3 size={15} />
            <span>Edit Page</span>
          </button>
        </div>
      )}

      {/* Publish to GitHub Modal */}
      {showPublishModal && (
        <div className="upua-modal-backdrop" style={{ zIndex: 99999 }} onClick={() => setShowPublishModal(false)}>
          <div className="upua-modal-box" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.4rem" }}>🚀</span>
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "#0e3d26" }}>
                  Publish to GitHub
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "#526359", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 16px" }}>
              This will create a production Git commit in the <strong>ugtf1/upua</strong> repository on the <strong>master</strong> branch.
              Both <strong>Vercel</strong> and <strong>Google Cloud Run</strong> will automatically deploy the updated content.
            </p>

            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0e3d26", marginBottom: "6px" }}>
              Commit Description
            </label>
            <input
              type="text"
              placeholder="e.g. CMS: Update homepage hero and community statistics"
              value={publishMessage}
              onChange={(e) => setPublishMessage(e.target.value)}
              className="donation-input"
              style={{ width: "100%", padding: "10px 14px", fontSize: "0.88rem", marginBottom: "16px" }}
            />

            {statusMessage && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.84rem",
                  background: statusMessage.type === "success" ? "#e6f4ea" : "#fce8e6",
                  color: statusMessage.type === "success" ? "#137333" : "#c5221f",
                }}
              >
                {statusMessage.text}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setShowPublishModal(false)}
                disabled={isPublishing}
                style={{ padding: "10px 16px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handlePublish}
                disabled={isPublishing}
                style={{ padding: "10px 18px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={15} className="spinner" /> Publishing to GitHub...
                  </>
                ) : (
                  <>
                    <Globe size={15} /> Confirm & Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
