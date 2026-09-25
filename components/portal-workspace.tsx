"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  CreditCard,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  LogOut,
  Home,
  FileText,
  Lock,
  Heart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Bell,
  ArrowUpRight,
  Sparkle,
} from "lucide-react";
import DonationModal from "@/components/donation-modal";
import { ChapterData, PaymentRecord, ExpenseRecord, MeetingRecord, MemberRecord } from "@/lib/data-service";

export type Role = "admin" | "chapter" | "member";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  chapterId?: string | null;
  chapterName?: string;
}

export default function PortalWorkspace() {
  // Authentication State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "chapters" | "ledger" | "meetings" | "my_chapter" | "my_membership">("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [meetingsSubmenuOpen, setMeetingsSubmenuOpen] = useState(true);

  // Data States
  const [overview, setOverview] = useState<any>(null);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null);
  const [ledgerSubTab, setLedgerSubTab] = useState<"income" | "expenses">("income");

  // Admin CRUD Modal States
  const [isNewChapterOpen, setIsNewChapterOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  // Form Fields
  const [chapterForm, setChapterForm] = useState({ name: "", code: "", region: "", president: "", contactEmail: "", memberCount: 50 });
  const [paymentForm, setPaymentForm] = useState({ chapterId: "c-houston", memberName: "", category: "monthly_dues", amount: 100, description: "" });
  const [expenseForm, setExpenseForm] = useState({ category: "Humanitarian Aid", amount: 1000, description: "", approvedBy: "President", vendor: "" });

  // Mic & AI Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [meetingTitleInput, setMeetingTitleInput] = useState("");
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Data from APIs
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [resOverview, resChapters, resPayments, resExpenses, resMeetings] = await Promise.all([
          fetch("/api/general/overview").then((r) => r.json()),
          fetch("/api/chapters").then((r) => r.json()),
          fetch("/api/payments").then((r) => r.json()),
          fetch("/api/expenses").then((r) => r.json()),
          fetch("/api/meetings").then((r) => r.json()),
        ]);

        if (resOverview.success) setOverview(resOverview.data);
        if (resChapters.success) setChapters(resChapters.data);
        if (resPayments.success) setPayments(resPayments.data);
        if (resExpenses.success) setExpenses(resExpenses.data);
        if (resMeetings.success) setMeetings(resMeetings.data);

        // Populate sample chapter members for chapter view
        setMembers([
          { id: "m-1", name: "Chief Godspower Oniovosa", email: "g.oniovosa@upua.org", phone: "+1 713-555-0192", chapterId: "c-houston", duesStatus: "Paid", role: "Chapter President" },
          { id: "m-2", name: "Oghenefejiro Okagbare", email: "member.ogaga@upuamerica.org", phone: "+1 832-555-4819", chapterId: "c-houston", duesStatus: "Paid", role: "General Member" },
          { id: "m-3", name: "Dr. Eseoghene Akpodiete", email: "e.akpodiete@upua.org", phone: "+1 281-555-7362", chapterId: "c-houston", duesStatus: "Paid", role: "Treasurer" },
          { id: "m-4", name: "Mrs. Onome Edewor", email: "onome.edewor@gmail.com", phone: "+1 713-555-9014", chapterId: "c-houston", duesStatus: "Pending", role: "General Member" },
          { id: "m-5", name: "Engr. Victor Urhobojor", email: "victor.u@houstontech.com", phone: "+1 832-555-1129", chapterId: "c-houston", duesStatus: "Paid", role: "Youth Liaison" },
          { id: "m-6", name: "Okiemute Dafinone", email: "okiemute@dafinone.com", phone: "+1 281-555-3341", chapterId: "c-houston", duesStatus: "Paid", role: "General Member" },
        ]);
      } catch (err) {
        console.error("Failed to load portal data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Set default tab based on user role
  useEffect(() => {
    if (user?.role === "admin") setActiveTab("overview");
    else if (user?.role === "chapter") setActiveTab("my_chapter");
    else if (user?.role === "member") setActiveTab("my_membership");
  }, [user]);

  // Demo Login Helper
  function handleLoginAs(role: Role) {
    if (role === "admin") {
      setUser({
        id: "u-admin",
        name: "Chief Samuel Ogaga",
        email: "admin@upuamerica.org",
        role: "admin",
        chapterName: "National Executive Assembly",
      });
    } else if (role === "chapter") {
      setUser({
        id: "u-chapter-houston",
        name: "Chief Godspower Oniovosa",
        email: "chapter.houston@upuamerica.org",
        role: "chapter",
        chapterId: "c-houston",
        chapterName: "UPA Houston",
      });
    } else {
      setUser({
        id: "u-member-1",
        name: "Oghenefejiro Okagbare",
        email: "member.ogaga@upuamerica.org",
        role: "member",
        chapterId: "c-houston",
        chapterName: "UPA Houston",
      });
    }
  }

  // Mic Recording Handlers
  function startRecording() {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }

  async function stopAndTranscribe() {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setIsTranscribing(true);

    try {
      const res = await fetch("/api/meetings/ai-transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meetingTitleInput.trim() || "National Emergency Executive Council Session",
          durationSeconds: recordingSeconds || 45,
          chapterName: user?.chapterName || "National Assembly",
        }),
      }).then((r) => r.json());

      if (res.success) {
        setMeetings((prev) => [res.data, ...prev]);
        setSelectedMeeting(res.data);
        setMeetingTitleInput("");
      }
    } catch (err) {
      console.error("AI Transcription failed", err);
    } finally {
      setIsTranscribing(false);
    }
  }

  // Admin CRUD Handlers
  async function handleCreateChapter(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chapterForm),
    }).then((r) => r.json());

    if (res.success) {
      setChapters((prev) => [res.data, ...prev]);
      setIsNewChapterOpen(false);
      setChapterForm({ name: "", code: "", region: "", president: "", contactEmail: "", memberCount: 50 });
    }
  }

  async function handleDeleteChapter(id: string) {
    if (!confirm("Are you sure you want to remove this chapter?")) return;
    await fetch(`/api/chapters?id=${id}`, { method: "DELETE" });
    setChapters((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentForm),
    }).then((r) => r.json());

    if (res.success) {
      setPayments((prev) => [res.data, ...prev]);
      setIsNewPaymentOpen(false);
      setPaymentForm({ chapterId: "c-houston", memberName: "", category: "monthly_dues", amount: 100, description: "" });
    }
  }

  async function handleDeletePayment(id: string) {
    if (!confirm("Delete payment record?")) return;
    await fetch(`/api/payments?id=${id}`, { method: "DELETE" });
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseForm),
    }).then((r) => r.json());

    if (res.success) {
      setExpenses((prev) => [res.data, ...prev]);
      setIsNewExpenseOpen(false);
      setExpenseForm({ category: "Humanitarian Aid", amount: 1000, description: "", approvedBy: "President", vendor: "" });
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm("Delete expense record?")) return;
    await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchSearch =
      p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Filtered Expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN - STYLED EXACTLY TO ORG-FLO (org-flo.com/admin)
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-gradient, linear-gradient(180deg, #f7faf7 0%, #eef5f0 100%))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "var(--font-main)",
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "28px",
            padding: "44px 38px",
            boxShadow: "0 20px 50px rgba(14, 61, 38, 0.12)",
            border: "1px solid #e5eee7",
            textAlign: "center",
          }}
        >
          {/* UPUA / ORGFLO Crest */}
          <div
            style={{
              margin: "0 auto 16px",
              width: "78px",
              height: "78px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#edf5ef",
              borderRadius: "50%",
              padding: "10px",
            }}
          >
            <Image src="/upua-logo.png" alt="UPUA Emblem" width={60} height={60} priority style={{ objectFit: "contain" }} />
          </div>

          <div
            style={{
              fontSize: "0.74rem",
              color: "#137459",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            Urhobo Progress Union America
          </div>
          <h1
            style={{
              color: "#0e3d26",
              fontFamily: "var(--font-heading)",
              fontSize: "1.9rem",
              margin: "0 0 8px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Executive Portal
          </h1>
          <p
            style={{
              color: "#526359",
              fontSize: "0.92rem",
              lineHeight: "1.55",
              margin: "0 0 26px",
            }}
          >
            Enterprise organization management, chapter dues reconciliation, Stripe payments, and AI meeting intelligence.
          </p>

          {/* Quick Login Role Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "26px" }}>
            <button
              type="button"
              onClick={() => handleLoginAs("admin")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f4f8f5",
                border: "1.5px solid #137459",
                borderRadius: "16px",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>👑</span>
                  <strong style={{ color: "#0e3d26", fontSize: "0.95rem", fontWeight: 800 }}>National Admin Console</strong>
                  <span className="badge badge-active" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>Full Access</span>
                </div>
                <small style={{ color: "#526359", fontSize: "0.8rem", display: "block", marginTop: "4px" }}>
                  Executive overview, all chapters, income & expenses, AI mic studio
                </small>
              </div>
              <ArrowRight size={18} color="#137459" />
            </button>

            <button
              type="button"
              onClick={() => handleLoginAs("chapter")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "1.5px solid #e1eae3",
                borderRadius: "16px",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>🏛️</span>
                  <strong style={{ color: "#0e3d26", fontSize: "0.95rem", fontWeight: 800 }}>Chapter Leader (Houston)</strong>
                </div>
                <small style={{ color: "#526359", fontSize: "0.8rem", display: "block", marginTop: "4px" }}>
                  Chapter member roster, monthly dues tracking, local fundraising
                </small>
              </div>
              <ArrowRight size={18} color="#0e3d26" />
            </button>

            <button
              type="button"
              onClick={() => handleLoginAs("member")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "1.5px solid #e1eae3",
                borderRadius: "16px",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>👤</span>
                  <strong style={{ color: "#0e3d26", fontSize: "0.95rem", fontWeight: 800 }}>General Member</strong>
                </div>
                <small style={{ color: "#526359", fontSize: "0.8rem", display: "block", marginTop: "4px" }}>
                  Digital membership card, Stripe dues payment, ratified minutes
                </small>
              </div>
              <ArrowRight size={18} color="#0e3d26" />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#526359",
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "10px 0",
              borderTop: "1px solid #edf2ee",
            }}
          >
            <Lock size={14} color="#137459" />
            <span>Role-Based Permissions · Stripe Protected · Powered by ORGFLO</span>
          </div>

          <div style={{ marginTop: "14px" }}>
            <Link
              href="/"
              style={{
                color: "#137459",
                fontSize: "0.86rem",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. MAIN LOGGED-IN PORTAL - STYLED TO ORG-FLO (org-flo.com/admin)
  // -------------------------------------------------------------
  return (
    <div className={`app-layout ${mobileNavOpen ? "mobile-nav-open" : ""}`}>
      {/* Mobile Sidebar Backdrop */}
      {mobileNavOpen && (
        <div className="app-sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* FIXED SIDEBAR - EXACT ORGFLO SPECIFICATION */}
      <aside className="app-sidebar">
        <div>
          {/* Brand Emblem Header */}
          <Link
            href="/"
            className="app-sidebar-brand"
            onClick={() => setMobileNavOpen(false)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                <Image src="/upua-logo.png" alt="UPUA Emblem" width={32} height={32} priority style={{ objectFit: "contain" }} />
              </div>
              <div>
                <strong
                  style={{
                    color: "#ffffff",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  UPUA
                </strong>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "#d8f3dc",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  ORGFLO SYSTEM
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: "0.7rem",
                color: "#9bb8a6",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginTop: "12px",
              }}
            >
              {user.role === "admin"
                ? "Admin Console"
                : user.role === "chapter"
                ? "Chapter Console"
                : "Member Portal"}
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="app-sidebar-nav">
            {user.role === "admin" && (
              <>
                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("overview");
                    setMobileNavOpen(false);
                  }}
                >
                  <LayoutDashboard size={18} /> Overview
                </button>

                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "chapters" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("chapters");
                    setMobileNavOpen(false);
                  }}
                >
                  <Building size={18} /> Chapters & Breakdown
                </button>

                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "ledger" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("ledger");
                    setMobileNavOpen(false);
                  }}
                >
                  <DollarSign size={18} /> Transactions & Ledger
                </button>

                {/* Submenu: Meetings & AI Studio */}
                <div>
                  <button
                    type="button"
                    className="app-sidebar-submenu-toggle"
                    onClick={() => setMeetingsSubmenuOpen(!meetingsSubmenuOpen)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <FileText size={18} /> Meetings & AI
                    </div>
                    {meetingsSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {meetingsSubmenuOpen && (
                    <div className="app-sidebar-sublinks">
                      <button
                        type="button"
                        className={`app-sidebar-sublink ${activeTab === "meetings" ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("meetings");
                          setMobileNavOpen(false);
                        }}
                      >
                        <Mic size={15} /> Meeting Tracker & AI Mic
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {user.role === "chapter" && (
              <>
                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "my_chapter" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("my_chapter");
                    setMobileNavOpen(false);
                  }}
                >
                  <Building size={18} /> Chapter Dashboard
                </button>

                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "chapters" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("chapters");
                    setMobileNavOpen(false);
                  }}
                >
                  <Users size={18} /> Chapter Members
                </button>

                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "ledger" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("ledger");
                    setMobileNavOpen(false);
                  }}
                >
                  <DollarSign size={18} /> Local Dues Ledger
                </button>

                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "meetings" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("meetings");
                    setMobileNavOpen(false);
                  }}
                >
                  <FileText size={18} /> National Meetings & AI
                </button>
              </>
            )}

            {user.role === "member" && (
              <>
                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "my_membership" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("my_membership");
                    setMobileNavOpen(false);
                  }}
                >
                  <Users size={18} /> My Account & Digital ID
                </button>

                <button
                  type="button"
                  className={`app-sidebar-link ${activeTab === "meetings" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("meetings");
                    setMobileNavOpen(false);
                  }}
                >
                  <FileText size={18} /> Meeting Intelligence
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer with OrgFlo styling */}
        <div className="app-sidebar-footer">
          <Link
            href="/"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "#c3ded0",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            <Home size={16} /> Public Website
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0, 0, 0, 0.2)",
              padding: "12px 14px",
              borderRadius: "12px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </div>
              <div style={{ color: "#a7d6b6", fontSize: "0.72rem", fontWeight: 600 }}>
                {user.chapterName || "UPUA National"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUser(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff7b72",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="app-main">
        {/* TOP HEADER - MATCHING ORGFLO HEADER SPEC */}
        <header className="app-header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              className="app-mobile-menu-toggle"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="app-header-copy">
              <h3>
                {user.role === "admin"
                  ? "UPUA National Executive Workspace"
                  : user.chapterName
                  ? `${user.chapterName} Workspace`
                  : "Member Portal"}
              </h3>
              <p>Urhobo Progress Union America · North America Operations</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* OrgFlo Role Pill */}
            <span
              style={{
                background: user.role === "admin" ? "#e6f4ea" : "#e8f0fe",
                color: user.role === "admin" ? "#137333" : "#1a73e8",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {user.role === "admin" ? <ShieldCheck size={14} /> : <Users size={14} />}
              {user.role.toUpperCase()} ROLE
            </span>

            {/* OrgFlo Gold Donate Pill Button */}
            <button
              type="button"
              className="btn-orgflo-gold"
              onClick={() => setDonationModalOpen(true)}
            >
              <Heart size={14} fill="currentColor" /> Donate ($50+)
            </button>

            {/* Profile Avatar Circle */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#f4f8f5",
                border: "1.5px solid #dce8df",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary, #0e3d26)",
                fontWeight: 800,
                fontSize: "0.85rem",
              }}
              title={user.name}
            >
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="app-page-content">
          {/* TAB 1: OVERVIEW (ADMIN) */}
          {activeTab === "overview" && (
            <>
              {/* ORGFLO DASHBOARD WELCOME BANNER */}
              <div className="dash-welcome-banner">
                <div style={{ zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#a7d6b6",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "6px",
                    }}
                  >
                    UPUA EXECUTIVE DASHBOARD · POWERED BY ORGFLO
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.85rem",
                      fontWeight: 800,
                      margin: "0 0 6px",
                    }}
                  >
                    Welcome back, {user.name}
                  </h2>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.88)",
                      fontSize: "0.92rem",
                      margin: 0,
                      maxWidth: "600px",
                      lineHeight: "1.5",
                    }}
                  >
                    Real-time national compliance across 23 accredited chapters, verified Stripe transaction streams, and AI-transcribed assembly minutes.
                  </p>
                </div>

                <div className="dash-banner-actions" style={{ zIndex: 1 }}>
                  <button
                    type="button"
                    className="btn-orgflo-white"
                    onClick={() => setActiveTab("meetings")}
                  >
                    <Mic size={16} /> Record Meeting (Mic)
                  </button>
                  <button
                    type="button"
                    className="btn-orgflo-outline"
                    onClick={() => setIsNewPaymentOpen(true)}
                  >
                    <Plus size={16} /> Record Payment
                  </button>
                </div>
              </div>

              {/* ORGFLO METRICS CARDS GRID */}
              <div className="dash-metrics-grid">
                <div className="orgflo-metric-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        TOTAL MEMBERS
                      </span>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, color: "var(--primary)", marginTop: "8px" }}>
                        {overview?.totalMembers?.toLocaleString() || "2,420"}
                      </div>
                    </div>
                    <div className="orgflo-metric-icon-wrap">
                      <Users size={20} />
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge badge-active">Across 23 Chapters</span>
                  </div>
                </div>

                <div className="orgflo-metric-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        ACTIVE CHAPTERS
                      </span>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, color: "var(--primary)", marginTop: "8px" }}>
                        {overview?.totalChapters || "23"}
                      </div>
                    </div>
                    <div className="orgflo-metric-icon-wrap">
                      <Building size={20} />
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge badge-active">US & Canada</span>
                  </div>
                </div>

                <div className="orgflo-metric-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        TOTAL INCOME
                      </span>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, color: "#137333", marginTop: "8px" }}>
                        ${overview?.totalIncome?.toLocaleString() || "480,000"}
                      </div>
                    </div>
                    <div className="orgflo-metric-icon-wrap" style={{ background: "#e6f4ea", color: "#137333" }}>
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge badge-active">Stripe Verified</span>
                  </div>
                </div>

                <div className="orgflo-metric-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        TOTAL EXPENSES
                      </span>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, color: "#c5221f", marginTop: "8px" }}>
                        ${overview?.totalExpenses?.toLocaleString() || "34,500"}
                      </div>
                    </div>
                    <div className="orgflo-metric-icon-wrap" style={{ background: "#fce8e6", color: "#c5221f" }}>
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge badge-pending">Humanitarian / Ops</span>
                  </div>
                </div>

                <div className="orgflo-metric-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        NET SURPLUS RESERVE
                      </span>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, color: "#0e3d26", marginTop: "8px" }}>
                        ${overview?.netBalance?.toLocaleString() || "445,500"}
                      </div>
                    </div>
                    <div className="orgflo-metric-icon-wrap" style={{ background: "#edf5ef", color: "#0e3d26" }}>
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge badge-active">Treasury Healthy</span>
                  </div>
                </div>
              </div>

              {/* INCOME BREAKDOWN GRID */}
              <div className="orgflo-card">
                <div className="orgflo-card-header">
                  <div>
                    <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
                      National Payment Streams Breakdown
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Breakdown of all dues, donations, ticket sales, and merchandise collections
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-orgflo-white"
                    style={{ border: "1px solid #dce8df", color: "#0e3d26" }}
                    onClick={() => setActiveTab("ledger")}
                  >
                    View All Transactions →
                  </button>
                </div>

                <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div style={{ background: "#fbfbfc", border: "1px solid #eceef2", borderRadius: "14px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#526359", textTransform: "uppercase" }}>Monthly Dues</span>
                      <div style={{ background: "#e5f5e8", borderRadius: "6px", padding: "4px", color: "#0d6b39" }}>
                        <CreditCard size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#0e3d26", margin: "8px 0 4px" }}>
                      ${overview?.incomeBreakdown?.monthlyDues?.toLocaleString() || "200,000"}
                    </div>
                    <small style={{ color: "#137333", fontWeight: 600, fontSize: "0.76rem" }}>
                      23 accredited chapters reporting
                    </small>
                  </div>

                  <div style={{ background: "#fbfbfc", border: "1px solid #eceef2", borderRadius: "14px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#526359", textTransform: "uppercase" }}>Donations (Min $50)</span>
                      <div style={{ background: "#edf5ef", borderRadius: "6px", padding: "4px", color: "#137459" }}>
                        <Heart size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#137459", margin: "8px 0 4px" }}>
                      ${overview?.incomeBreakdown?.donations?.toLocaleString() || "150,000"}
                    </div>
                    <small style={{ color: "#137333", fontWeight: 600, fontSize: "0.76rem" }}>
                      Shelters, Okuama relief & healthcare
                    </small>
                  </div>

                  <div style={{ background: "#fbfbfc", border: "1px solid #eceef2", borderRadius: "14px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#526359", textTransform: "uppercase" }}>Convention Tickets</span>
                      <div style={{ background: "#e8f0fe", borderRadius: "6px", padding: "4px", color: "#1a73e8" }}>
                        <DollarSign size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#003e53", margin: "8px 0 4px" }}>
                      ${overview?.incomeBreakdown?.tickets?.toLocaleString() || "95,000"}
                    </div>
                    <small style={{ color: "#1a73e8", fontWeight: 600, fontSize: "0.76rem" }}>
                      Annual general conference registrations
                    </small>
                  </div>

                  <div style={{ background: "#fbfbfc", border: "1px solid #eceef2", borderRadius: "14px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#526359", textTransform: "uppercase" }}>Merchandise</span>
                      <div style={{ background: "#fef7e0", borderRadius: "6px", padding: "4px", color: "#b06000" }}>
                        <Award size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#b08000", margin: "8px 0 4px" }}>
                      ${overview?.incomeBreakdown?.merchandise?.toLocaleString() || "35,000"}
                    </div>
                    <small style={{ color: "#b06000", fontWeight: 600, fontSize: "0.76rem" }}>
                      Pins, shawls, regalia & literature
                    </small>
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY & SUMMARY */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Recent Chapters Preview */}
                <div className="orgflo-card">
                  <div className="orgflo-card-header">
                    <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)" }}>
                      Top Performing Chapters
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("chapters")}
                      style={{ background: "none", border: "none", color: "#137459", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
                    >
                      View All ({chapters.length}) →
                    </button>
                  </div>
                  <div className="orgflo-table-wrap">
                    <table className="orgflo-table">
                      <thead>
                        <tr>
                          <th>Chapter</th>
                          <th>Region</th>
                          <th>Members</th>
                          <th style={{ textAlign: "right" }}>Total Dues</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chapters.slice(0, 4).map((ch) => (
                          <tr key={ch.id}>
                            <td style={{ fontWeight: 700, color: "#0e3d26" }}>{ch.name}</td>
                            <td style={{ color: "#526359" }}>{ch.region}</td>
                            <td>
                              <span className="badge badge-active">{ch.memberCount}</span>
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 700, color: "#137333" }}>
                              ${ch.paymentsBreakdown.monthlyDues.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Latest AI Transcribed Meeting */}
                <div className="orgflo-card">
                  <div className="orgflo-card-header">
                    <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)" }}>
                      Latest Meeting Intelligence
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("meetings")}
                      style={{ background: "none", border: "none", color: "#137459", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
                    >
                      All Records ({meetings.length}) →
                    </button>
                  </div>
                  <div style={{ padding: "20px 24px" }}>
                    {meetings[0] && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span className="badge badge-active">{meetings[0].chapterName}</span>
                          <span style={{ fontSize: "0.78rem", color: "#526359" }}>⏱️ {meetings[0].duration}</span>
                        </div>
                        <h4 style={{ margin: "4px 0 8px", color: "#0e3d26", fontSize: "1.05rem", fontWeight: 700 }}>
                          {meetings[0].title}
                        </h4>
                        <p style={{ color: "#526359", fontSize: "0.88rem", lineHeight: "1.55", margin: "0 0 16px" }}>
                          {meetings[0].summary}
                        </p>
                        <button
                          type="button"
                          className="btn-orgflo-white"
                          style={{ border: "1.5px solid #dce8df", width: "100%", justifyContent: "center" }}
                          onClick={() => setSelectedMeeting(meetings[0])}
                        >
                          <Sparkles size={15} color="#137459" /> View AI Decisions & Action Items
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CHAPTERS & BREAKDOWN */}
          {activeTab === "chapters" && (
            <div className="orgflo-card">
              <div className="orgflo-card-header">
                <div>
                  <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.45rem", fontWeight: 800, color: "var(--primary)" }}>
                    Chapter Directories & Financial Breakdown
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    Granular breakdown of monthly dues, donations, ticket sales, and merchandise across all accredited councils.
                  </p>
                </div>
                {user.role === "admin" && (
                  <button
                    type="button"
                    className="btn-orgflo-white"
                    style={{ background: "#0e3d26", color: "#ffffff" }}
                    onClick={() => setIsNewChapterOpen(true)}
                  >
                    <Plus size={16} /> Add New Chapter
                  </button>
                )}
              </div>

              <div className="orgflo-table-wrap">
                <table className="orgflo-table">
                  <thead>
                    <tr>
                      <th>Chapter Name</th>
                      <th>Region</th>
                      <th>President</th>
                      <th>Members</th>
                      <th>Monthly Dues</th>
                      <th>Donations</th>
                      <th>Tickets</th>
                      <th>Merchandise</th>
                      {user.role === "admin" && <th style={{ textAlign: "right" }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((ch) => (
                      <tr key={ch.id}>
                        <td style={{ fontWeight: 700, color: "#0e3d26" }}>
                          {ch.name}
                          <small style={{ display: "block", color: "#526359", fontWeight: 400 }}>{ch.contactEmail}</small>
                        </td>
                        <td style={{ color: "#526359" }}>{ch.region}</td>
                        <td style={{ color: "#14211a", fontWeight: 500 }}>{ch.president}</td>
                        <td>
                          <span className="badge badge-active">{ch.memberCount} members</span>
                        </td>
                        <td style={{ color: "#0e3d26", fontWeight: 700 }}>
                          ${ch.paymentsBreakdown.monthlyDues.toLocaleString()}
                        </td>
                        <td style={{ color: "#137459", fontWeight: 700 }}>
                          ${ch.paymentsBreakdown.donations.toLocaleString()}
                        </td>
                        <td style={{ color: "#003e53", fontWeight: 700 }}>
                          ${ch.paymentsBreakdown.tickets.toLocaleString()}
                        </td>
                        <td style={{ color: "#b08000", fontWeight: 700 }}>
                          ${ch.paymentsBreakdown.merchandise.toLocaleString()}
                        </td>
                        {user.role === "admin" && (
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteChapter(ch.id)}
                              style={{ background: "transparent", border: 0, color: "#c5221f", cursor: "pointer", padding: "6px" }}
                              title="Delete Chapter"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS & LEDGER */}
          {activeTab === "ledger" && (
            <div>
              {/* Header & Sub-Tab Switcher */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "14px" }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.45rem", fontWeight: 800, color: "var(--primary)" }}>
                    Financial Transactions & General Ledger
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    Complete audit trail of all recorded income payments and organizational expenses.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  {user.role === "admin" && (
                    <>
                      <button
                        type="button"
                        className="btn-orgflo-white"
                        style={{ background: "#0e3d26", color: "#ffffff" }}
                        onClick={() => setIsNewPaymentOpen(true)}
                      >
                        <Plus size={16} /> Record Income
                      </button>
                      <button
                        type="button"
                        className="btn-orgflo-white"
                        style={{ border: "1.5px solid #dce8df", color: "#c5221f" }}
                        onClick={() => setIsNewExpenseOpen(true)}
                      >
                        <Plus size={16} /> Record Expense
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Filter & Subtabs Bar */}
              <div className="orgflo-card" style={{ marginBottom: "20px" }}>
                <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
                  {/* Ledger Tab Switcher */}
                  <div style={{ display: "flex", background: "#f4f8f5", borderRadius: "12px", padding: "4px" }}>
                    <button
                      type="button"
                      onClick={() => setLedgerSubTab("income")}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        cursor: "pointer",
                        background: ledgerSubTab === "income" ? "#ffffff" : "transparent",
                        color: ledgerSubTab === "income" ? "#0e3d26" : "#526359",
                        boxShadow: ledgerSubTab === "income" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      Recorded Income ({payments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setLedgerSubTab("expenses")}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        cursor: "pointer",
                        background: ledgerSubTab === "expenses" ? "#ffffff" : "transparent",
                        color: ledgerSubTab === "expenses" ? "#c5221f" : "#526359",
                        boxShadow: ledgerSubTab === "expenses" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      Recorded Expenses ({expenses.length})
                    </button>
                  </div>

                  {/* Search and Category Filter */}
                  <div style={{ display: "flex", gap: "10px", flex: 1, maxWidth: "480px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#ffffff",
                        border: "1.5px solid #dce8df",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        flex: 1,
                      }}
                    >
                      <Search size={16} color="#526359" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 0, outline: "none", background: "transparent", width: "100%", fontSize: "0.88rem" }}
                      />
                    </div>

                    {ledgerSubTab === "income" && (
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "10px",
                          border: "1.5px solid #dce8df",
                          fontSize: "0.88rem",
                          background: "#ffffff",
                          fontWeight: 600,
                          color: "#0e3d26",
                        }}
                      >
                        <option value="all">All Categories</option>
                        <option value="monthly_dues">Monthly Dues</option>
                        <option value="donation">Donations</option>
                        <option value="ticket">Tickets</option>
                        <option value="merchandise">Merchandise</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Transactions Table: Income */}
              {ledgerSubTab === "income" && (
                <div className="orgflo-card">
                  <div className="orgflo-table-wrap">
                    <table className="orgflo-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Donor / Member</th>
                          <th>Chapter</th>
                          <th>Category</th>
                          <th>Description</th>
                          <th>Payment Gateway</th>
                          <th style={{ textAlign: "right" }}>Amount</th>
                          {user.role === "admin" && <th style={{ textAlign: "right" }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((p) => (
                          <tr key={p.id}>
                            <td style={{ color: "#526359", whiteSpace: "nowrap" }}>{p.date}</td>
                            <td style={{ fontWeight: 700, color: "#14211a" }}>{p.memberName}</td>
                            <td style={{ color: "#526359" }}>{p.chapterName}</td>
                            <td>
                              <span className="badge badge-active">{p.category.replace("_", " ")}</span>
                            </td>
                            <td style={{ color: "#526359" }}>{p.description}</td>
                            <td>
                              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#137459", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <CreditCard size={13} /> Stripe Active
                              </span>
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#137333", fontSize: "0.95rem" }}>
                              +${p.amount.toLocaleString()}
                            </td>
                            {user.role === "admin" && (
                              <td style={{ textAlign: "right" }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePayment(p.id)}
                                  style={{ background: "transparent", border: 0, color: "#c5221f", cursor: "pointer", padding: "6px" }}
                                  title="Delete Transaction"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Transactions Table: Expenses */}
              {ledgerSubTab === "expenses" && (
                <div className="orgflo-card">
                  <div className="orgflo-table-wrap">
                    <table className="orgflo-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Category</th>
                          <th>Description</th>
                          <th>Vendor / Payee</th>
                          <th>Approved By</th>
                          <th style={{ textAlign: "right" }}>Amount</th>
                          {user.role === "admin" && <th style={{ textAlign: "right" }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map((exp) => (
                          <tr key={exp.id}>
                            <td style={{ color: "#526359", whiteSpace: "nowrap" }}>{exp.date}</td>
                            <td style={{ fontWeight: 700, color: "#003e53" }}>{exp.category}</td>
                            <td style={{ color: "#526359" }}>{exp.description}</td>
                            <td style={{ color: "#526359" }}>{exp.vendor}</td>
                            <td style={{ color: "#14211a", fontWeight: 600 }}>{exp.approvedBy}</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#c5221f", fontSize: "0.95rem" }}>
                              -${exp.amount.toLocaleString()}
                            </td>
                            {user.role === "admin" && (
                              <td style={{ textAlign: "right" }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExpense(exp.id)}
                                  style={{ background: "transparent", border: 0, color: "#c5221f", cursor: "pointer", padding: "6px" }}
                                  title="Delete Expense"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEETINGS & AI INTELLIGENCE */}
          {activeTab === "meetings" && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.45rem", fontWeight: 800, color: "var(--primary)" }}>
                  Official Meeting Records & AI Intelligence
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                  Microphone recordings automatically transcribed into executive summaries, key decisions, and action items.
                </p>
              </div>

              {/* Admin Microphone Voice Studio */}
              {user.role === "admin" && (
                <div
                  className="orgflo-card"
                  style={{
                    marginBottom: "28px",
                    border: isRecording ? "2px solid #c5221f" : "1.5px solid #137459",
                    background: isRecording ? "#fff9f9" : "#ffffff",
                  }}
                >
                  <div style={{ padding: "26px 30px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                      <div
                        style={{
                          background: isRecording ? "#fce8e6" : "#edf5ef",
                          padding: "12px",
                          borderRadius: "50%",
                          display: "flex",
                          color: isRecording ? "#c5221f" : "#0e3d26",
                        }}
                      >
                        <Mic size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                          {isRecording ? "🔴 Recording Meeting Live From Microphone..." : "AI Voice Recording & Minutes Studio"}
                        </h3>
                        <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526359" }}>
                          Speak clearly into your microphone. Once finished, AI will transcribe audio and extract ratified action items.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
                      <input
                        type="text"
                        placeholder="Session Title (e.g. Q4 National Executive Council Meeting)"
                        value={meetingTitleInput}
                        onChange={(e) => setMeetingTitleInput(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: "280px",
                          padding: "12px 18px",
                          borderRadius: "12px",
                          border: "1.5px solid #dce8df",
                          fontSize: "0.92rem",
                          outline: "none",
                        }}
                      />

                      {!isRecording ? (
                        <button
                          type="button"
                          className="btn-orgflo-white"
                          style={{ background: "#0e3d26", color: "#ffffff", padding: "12px 24px" }}
                          onClick={startRecording}
                        >
                          <Mic size={16} /> Start Microphone Recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-orgflo-white"
                          style={{ background: "#c5221f", color: "#ffffff", padding: "12px 24px" }}
                          onClick={stopAndTranscribe}
                          disabled={isTranscribing}
                        >
                          {isTranscribing ? (
                            <>
                              <Sparkles size={16} /> AI Transcribing & Generating Minutes...
                            </>
                          ) : (
                            <>
                              <MicOff size={16} /> Stop & Generate AI Summary (
                              {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")})
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isRecording && (
                      <div
                        style={{
                          background: "#fef3f2",
                          border: "1px solid #fecdca",
                          borderRadius: "12px",
                          padding: "14px 18px",
                          color: "#b42318",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#c5221f",
                            boxShadow: "0 0 0 4px rgba(197, 34, 31, 0.2)",
                          }}
                        />
                        <span>
                          Microphone stream is live ({recordingSeconds}s). Audio buffer captured. Click <strong>"Stop & Generate AI Summary"</strong> to finalize.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Meetings List */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
                {meetings.map((mtg) => (
                  <div
                    key={mtg.id}
                    className="orgflo-card"
                    style={{ display: "flex", flexDirection: "column", padding: "26px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span className="badge badge-active">{mtg.chapterName}</span>
                      <small style={{ color: "#526359", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem" }}>
                        <Clock size={13} /> {mtg.duration}
                      </small>
                    </div>

                    <h3
                      style={{
                        color: "#0e3d26",
                        fontSize: "1.2rem",
                        margin: "0 0 10px",
                        fontWeight: 800,
                        fontFamily: "var(--font-heading)",
                        lineHeight: 1.3,
                      }}
                    >
                      {mtg.title}
                    </h3>

                    <p style={{ color: "#526359", fontSize: "0.88rem", lineHeight: "1.6", margin: "0 0 20px", flex: 1 }}>
                      <strong>AI Summary:</strong> {mtg.summary}
                    </p>

                    <div
                      style={{
                        borderTop: "1px solid #edf2ee",
                        paddingTop: "16px",
                        marginTop: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", color: "#526359" }}>📅 {mtg.date}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMeeting(mtg)}
                        className="btn-orgflo-white"
                        style={{
                          background: "#0e3d26",
                          color: "#ffffff",
                          padding: "8px 16px",
                          fontSize: "0.82rem",
                        }}
                      >
                        <Sparkles size={14} /> View AI Minutes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CHAPTER DASHBOARD (FOR CHAPTER LEADER) */}
          {activeTab === "my_chapter" && (
            <div>
              {/* OrgFlo Welcome Banner for Chapter */}
              <div className="dash-welcome-banner" style={{ marginBottom: "28px" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "#a7d6b6", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    CHAPTER LEADERSHIP CONSOLE
                  </div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, margin: "0 0 6px" }}>
                    {user.chapterName || "Houston Chapter"} Dashboard
                  </h2>
                  <p style={{ color: "rgba(255, 255, 255, 0.88)", fontSize: "0.92rem", margin: 0 }}>
                    Track active members, monthly dues status, and local fundraising initiatives in real-time.
                  </p>
                </div>

                <div className="dash-banner-actions">
                  <button
                    type="button"
                    className="btn-orgflo-white"
                    onClick={() => setDonationModalOpen(true)}
                  >
                    <CreditCard size={16} /> Pay Chapter Dues
                  </button>
                </div>
              </div>

              {/* Chapter Stat Cards */}
              <div className="dash-metrics-grid" style={{ marginBottom: "28px" }}>
                <div className="orgflo-metric-card">
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Chapter Members</span>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#0e3d26", margin: "8px 0 4px" }}>
                    245 Active
                  </div>
                  <span className="badge badge-active">89% Dues Compliance</span>
                </div>

                <div className="orgflo-metric-card">
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Dues Raised</span>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#137333", margin: "8px 0 4px" }}>
                    $29,400
                  </div>
                  <span className="badge badge-active">FY 2024 to Date</span>
                </div>

                <div className="orgflo-metric-card">
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Chapter Donations</span>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#003e53", margin: "8px 0 4px" }}>
                    $18,500
                  </div>
                  <span className="badge badge-active">Shelters & Okuama</span>
                </div>

                <div className="orgflo-metric-card">
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Convention Tickets</span>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#b08000", margin: "8px 0 4px" }}>
                    $12,250
                  </div>
                  <span className="badge badge-pending">Registered Delegates</span>
                </div>
              </div>

              {/* Chapter Members Table */}
              <div className="orgflo-card">
                <div className="orgflo-card-header">
                  <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
                    Verified Chapter Members
                  </h3>
                  <span className="badge badge-active">{members.length} Members Enrolled</span>
                </div>
                <div className="orgflo-table-wrap">
                  <table className="orgflo-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Dues Status</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 700, color: "#14211a" }}>{m.name}</td>
                          <td style={{ color: "#526359" }}>{m.email}</td>
                          <td style={{ color: "#526359" }}>{m.phone}</td>
                          <td>
                            <span className={`badge ${m.duesStatus === "Paid" ? "badge-active" : "badge-overdue"}`}>
                              {m.duesStatus}
                            </span>
                          </td>
                          <td style={{ color: "#003e53", fontWeight: 600 }}>{m.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MY MEMBERSHIP (GENERAL MEMBER) */}
          {activeTab === "my_membership" && (
            <div>
              {/* Member Welcome Banner */}
              <div className="dash-welcome-banner" style={{ marginBottom: "28px" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "#a7d6b6", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    MEMBER CREDENTIALS & SERVICES
                  </div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, margin: "0 0 6px" }}>
                    Welcome, {user.name}
                  </h2>
                  <p style={{ color: "rgba(255, 255, 255, 0.88)", fontSize: "0.92rem", margin: 0 }}>
                    Access your official UPUA digital membership credential, pay monthly dues via Stripe, and explore meeting minutes.
                  </p>
                </div>

                <div className="dash-banner-actions">
                  <button
                    type="button"
                    className="btn-orgflo-white"
                    onClick={() => setDonationModalOpen(true)}
                  >
                    <CreditCard size={16} /> Pay Dues / View Ledger
                  </button>
                </div>
              </div>

              {/* Digital Credential & Online Dues Payment */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* OrgFlo Styled Digital ID Card */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)",
                    borderRadius: "24px",
                    padding: "32px",
                    color: "#ffffff",
                    boxShadow: "0 16px 36px rgba(14,61,38,0.2)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ background: "#ffffff", padding: "6px", borderRadius: "10px" }}>
                        <Image src="/upua-logo.png" alt="UPUA Emblem" width={40} height={40} priority style={{ objectFit: "contain" }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: "1.1rem", display: "block", fontFamily: "var(--font-heading)" }}>
                          Urhobo Progress Union America
                        </strong>
                        <small style={{ color: "#d8f3dc", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                          OFFICIAL DIGITAL CREDENTIAL
                        </small>
                      </div>
                    </div>
                    <ShieldCheck size={28} color="#f3c31a" />
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "0.72rem", opacity: 0.8, textTransform: "uppercase" }}>Full Member Name</div>
                    <div style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.01em" }}>{user.name}</div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "12px",
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                      paddingTop: "16px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.68rem", opacity: 0.8, textTransform: "uppercase", display: "block" }}>Member ID</span>
                      <strong style={{ fontSize: "0.88rem" }}>UPUA-2024-8841</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.68rem", opacity: 0.8, textTransform: "uppercase", display: "block" }}>Chapter</span>
                      <strong style={{ fontSize: "0.88rem" }}>{user.chapterName}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.68rem", opacity: 0.8, textTransform: "uppercase", display: "block" }}>Dues Status</span>
                      <span className="badge badge-active" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>Active / Paid</span>
                    </div>
                  </div>
                </div>

                {/* Contribution & Dues Card */}
                <div className="orgflo-card" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)" }}>
                      Online Chapter Dues & Contributions
                    </h3>
                    <p style={{ color: "#526359", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 24px" }}>
                      Make online monthly dues payments, convention ticket contributions, or donations processed instantly through the Stripe gateway.
                    </p>

                    <div style={{ background: "#f4f8f5", borderRadius: "14px", padding: "16px", border: "1px solid #dce8df", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0e3d26" }}>Current Monthly Dues</span>
                        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#137333" }}>$100.00 / month</span>
                      </div>
                      <small style={{ color: "#526359" }}>Covers chapter operational levy and national union contribution.</small>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn-orgflo-white"
                      style={{ background: "#0e3d26", color: "#ffffff", flex: 1, justifyContent: "center" }}
                      onClick={() => setDonationModalOpen(true)}
                    >
                      <CreditCard size={16} /> Pay Monthly Dues
                    </button>
                    <button
                      type="button"
                      className="btn-orgflo-gold"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => setDonationModalOpen(true)}
                    >
                      <Heart size={16} fill="currentColor" /> Make Donation ($50+)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MEETING INTELLIGENCE DETAIL MODAL */}
      {selectedMeeting && (
        <div className="app-sidebar-backdrop" onClick={() => setSelectedMeeting(null)}>
          <div
            className="orgflo-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "820px",
              width: "92%",
              margin: "60px auto",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Modal Header Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)",
                color: "#ffffff",
                padding: "28px 32px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge badge-active" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
                  AI MEETING INTELLIGENCE
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMeeting(null)}
                  style={{ background: "transparent", border: "none", color: "#ffffff", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: "12px 0 6px", fontWeight: 800 }}>
                {selectedMeeting.title}
              </h2>
              <div style={{ fontSize: "0.82rem", opacity: 0.85 }}>
                📅 {selectedMeeting.date} · ⏱️ {selectedMeeting.duration} · Recorded by {selectedMeeting.recordedBy}
              </div>
            </div>

            <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 8px", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                  🧠 AI Executive Summary
                </h4>
                <p style={{ background: "#f0f8f3", borderLeft: "4px solid #137459", padding: "16px 20px", borderRadius: "10px", color: "#14211a", fontSize: "0.92rem", lineHeight: "1.65", margin: 0 }}>
                  {selectedMeeting.summary}
                </p>
              </div>

              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 10px", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                  ⚖️ Key Ratified Decisions
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedMeeting.keyDecisions.map((decision, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.9rem", color: "#14211a" }}>
                      <CheckCircle2 size={16} color="#137459" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{decision}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 10px", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                  📋 Action Items & Assigned Owners
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  {selectedMeeting.actionItems.map((item, idx) => (
                    <div key={idx} style={{ background: "#f7faf8", border: "1px solid #d5e4d9", borderRadius: "12px", padding: "14px 18px" }}>
                      <strong style={{ color: "#0e3d26", fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>{item.task}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#526359" }}>👤 Owner: <strong>{item.owner}</strong></div>
                      <div style={{ fontSize: "0.78rem", color: "#667085" }}>⏰ Deadline: {item.deadline}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 8px", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                  🎙️ Full Audio Transcription Record
                </h4>
                <p style={{ background: "#fafafa", border: "1.5px solid #e1eae3", padding: "16px", borderRadius: "10px", fontSize: "0.88rem", color: "#526359", lineHeight: "1.75", maxHeight: "180px", overflowY: "auto", margin: 0 }}>
                  {selectedMeeting.transcript}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setSelectedMeeting(null)}
                  className="btn-orgflo-white"
                  style={{ background: "#0e3d26", color: "#ffffff", padding: "10px 24px" }}
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MODAL: NEW CHAPTER */}
      {isNewChapterOpen && (
        <div className="app-sidebar-backdrop" onClick={() => setIsNewChapterOpen(false)}>
          <div className="orgflo-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", width: "90%", margin: "80px auto", padding: "32px" }}>
            <h2 style={{ color: "#0e3d26", fontSize: "1.4rem", margin: "0 0 16px", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              Add New UPUA Chapter
            </h2>
            <form onSubmit={handleCreateChapter} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                type="text"
                placeholder="Chapter Name (e.g. UPU Dallas Fort Worth)"
                required
                value={chapterForm.name}
                onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Code (e.g. DALLAS)"
                required
                value={chapterForm.code}
                onChange={(e) => setChapterForm({ ...chapterForm, code: e.target.value })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Region (e.g. Texas / South)"
                value={chapterForm.region}
                onChange={(e) => setChapterForm({ ...chapterForm, region: e.target.value })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Chapter President"
                value={chapterForm.president}
                onChange={(e) => setChapterForm({ ...chapterForm, president: e.target.value })}
                className="donation-input"
              />
              <input
                type="number"
                placeholder="Initial Member Count"
                value={chapterForm.memberCount}
                onChange={(e) => setChapterForm({ ...chapterForm, memberCount: Number(e.target.value) })}
                className="donation-input"
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn-orgflo-white" style={{ background: "#0e3d26", color: "#ffffff", flex: 1, justifyContent: "center" }}>
                  Save Chapter
                </button>
                <button type="button" onClick={() => setIsNewChapterOpen(false)} style={{ background: "#f0f2f1", border: 0, padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL: NEW PAYMENT */}
      {isNewPaymentOpen && (
        <div className="app-sidebar-backdrop" onClick={() => setIsNewPaymentOpen(false)}>
          <div className="orgflo-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", width: "90%", margin: "80px auto", padding: "32px" }}>
            <h2 style={{ color: "#0e3d26", fontSize: "1.4rem", margin: "0 0 16px", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              Record Income Payment
            </h2>
            <form onSubmit={handleCreatePayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <select
                value={paymentForm.chapterId}
                onChange={(e) => setPaymentForm({ ...paymentForm, chapterId: e.target.value })}
                className="donation-input"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Member / Donor Name"
                required
                value={paymentForm.memberName}
                onChange={(e) => setPaymentForm({ ...paymentForm, memberName: e.target.value })}
                className="donation-input"
              />
              <select
                value={paymentForm.category}
                onChange={(e) => setPaymentForm({ ...paymentForm, category: e.target.value })}
                className="donation-input"
              >
                <option value="monthly_dues">Monthly Dues</option>
                <option value="donation">Donation (Min $50)</option>
                <option value="ticket">Convention Ticket</option>
                <option value="merchandise">Merchandise</option>
              </select>
              <input
                type="number"
                min={paymentForm.category === "donation" ? 50 : 1}
                placeholder="Amount (USD)"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                className="donation-input"
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn-orgflo-white" style={{ background: "#0e3d26", color: "#ffffff", flex: 1, justifyContent: "center" }}>
                  Record Payment
                </button>
                <button type="button" onClick={() => setIsNewPaymentOpen(false)} style={{ background: "#f0f2f1", border: 0, padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL: NEW EXPENSE */}
      {isNewExpenseOpen && (
        <div className="app-sidebar-backdrop" onClick={() => setIsNewExpenseOpen(false)}>
          <div className="orgflo-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", width: "90%", margin: "80px auto", padding: "32px" }}>
            <h2 style={{ color: "#c5221f", fontSize: "1.4rem", margin: "0 0 16px", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              Record Expense Entry
            </h2>
            <form onSubmit={handleCreateExpense} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="donation-input"
              >
                <option value="Humanitarian Aid">Humanitarian Aid (Okuama IDPs)</option>
                <option value="Medical Supplies">Medical Supplies & Outreach</option>
                <option value="STEM & AI Lab">STEM & AI Digital Equipment</option>
                <option value="Convention Logistics">Convention Logistics</option>
                <option value="Administrative">Administrative</option>
                <option value="Youth Programs">Youth Programs (UPUAYA)</option>
              </select>
              <input
                type="number"
                placeholder="Expense Amount (USD)"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Vendor / Payee"
                value={expenseForm.vendor}
                onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="donation-input"
              />
              <input
                type="text"
                placeholder="Approved By (Officer)"
                value={expenseForm.approvedBy}
                onChange={(e) => setExpenseForm({ ...expenseForm, approvedBy: e.target.value })}
                className="donation-input"
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn-orgflo-white" style={{ background: "#c5221f", color: "#ffffff", flex: 1, justifyContent: "center" }}>
                  Save Expense
                </button>
                <button type="button" onClick={() => setIsNewExpenseOpen(false)} style={{ background: "#f0f2f1", border: 0, padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STRIPE DONATION MODAL */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
      />
    </div>
  );
}
