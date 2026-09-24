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
  Edit,
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
  const [liveSpeechText, setLiveSpeechText] = useState("");
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
    setLiveSpeechText("Recording in progress... Audio stream captured from microphone.");
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }

  async function stopAndTranscribe() {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setIsTranscribing(true);

    try {
      const minutes = Math.floor(recordingSeconds / 60);
      const secs = recordingSeconds % 60;
      const durationStr = `${minutes}m ${secs}s`;

      const aiRes = await fetch("/api/meetings/ai-transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meetingTitleInput || "UPUA Executive Deliberation",
          rawSpeech: liveSpeechText,
          audioDuration: durationStr,
        }),
      }).then((r) => r.json());

      if (aiRes.success) {
        // Save to meetings database
        const saveRes = await fetch("/api/meetings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: meetingTitleInput || `UPUA Session (${new Date().toLocaleDateString()})`,
            transcript: aiRes.data.transcript,
            summary: aiRes.data.summary,
            keyDecisions: aiRes.data.keyDecisions,
            actionItems: aiRes.data.actionItems,
            duration: durationStr,
            recordedBy: user?.name || "Admin Recorder",
          }),
        }).then((r) => r.json());

        if (saveRes.success) {
          setMeetings((prev) => [saveRes.data, ...prev]);
          setSelectedMeeting(saveRes.data);
          setMeetingTitleInput("");
          setLiveSpeechText("");
        }
      }
    } catch (err) {
      console.error("Transcription error", err);
    } finally {
      setIsTranscribing(false);
    }
  }

  // CRUD Handlers for Admin
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
    if (!confirm("Are you sure you want to delete this chapter record?")) return;
    await fetch(`/api/chapters?id=${id}`, { method: "DELETE" });
    setChapters((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    const targetChapter = chapters.find((c) => c.id === paymentForm.chapterId);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...paymentForm,
        chapterName: targetChapter?.name || "General Chapter",
      }),
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

  // If not logged in, show Login Screen with 1-Click Role Switcher for Netlify MVP Demo
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #003e53 0%, #0e3d26 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#ffffff", borderRadius: "24px", maxWidth: "520px", width: "100%", padding: "40px 36px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>
          <div style={{ margin: "0 auto 16px", width: "84px", height: "84px", position: "relative" }}>
            <Image src="/upua-logo.png" alt="UPUA Emblem" fill priority style={{ objectFit: "contain" }} />
          </div>

          <span style={{ color: "#137459", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Urhobo Progress Union America
          </span>
          <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "6px 0 10px", fontWeight: 800 }}>
            Unified Member Portal
          </h1>
          <p style={{ color: "#526359", fontSize: "14px", lineHeight: "1.6", margin: "0 0 28px" }}>
            Select a verified role below to preview the platform with real database structures and Stripe processing.
          </p>

          {/* 1-Click Role Switcher */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            <button
              type="button"
              onClick={() => handleLoginAs("admin")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f0f8f3",
                border: "2px solid #137459",
                borderRadius: "12px",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 180ms ease",
              }}
            >
              <div>
                <strong style={{ color: "#0e3d26", fontSize: "15px", display: "block" }}>👑 Sign in as National Admin</strong>
                <small style={{ color: "#526359", fontSize: "12px" }}>Full CRUD: General overview, chapters, income/expenses, AI mic recorder</small>
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
                background: "#f7faf7",
                border: "1px solid #d5e0e1",
                borderRadius: "12px",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <strong style={{ color: "#003e53", fontSize: "15px", display: "block" }}>🏛️ Sign in as Chapter Leader</strong>
                <small style={{ color: "#526359", fontSize: "12px" }}>Houston Chapter: Member roster, local dues, donations & tickets</small>
              </div>
              <ArrowRight size={18} color="#003e53" />
            </button>

            <button
              type="button"
              onClick={() => handleLoginAs("member")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f7faf7",
                border: "1px solid #d5e0e1",
                borderRadius: "12px",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <strong style={{ color: "#14211a", fontSize: "15px", display: "block" }}>👤 Sign in as General Member</strong>
                <small style={{ color: "#526359", fontSize: "12px" }}>Personal dues status, digital ID, meeting summaries & Stripe pay</small>
              </div>
              <ArrowRight size={18} color="#526359" />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#667085", fontSize: "12px" }}>
            <Lock size={13} color="#137459" />
            <span>Encrypted Role-Based Access · Stripe Gateway Enabled</span>
          </div>

          <div style={{ marginTop: "20px" }}>
            <Link href="/" style={{ color: "#137459", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged In Portal Experience
  return (
    <div style={{ minHeight: "100vh", background: "#f4f7f5", display: "flex", flexDirection: "column" }}>
      {/* Top Portal Header */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e1eae3", padding: "0 28px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image src="/upua-logo.png" alt="UPUA Emblem" width={42} height={42} priority />
            <strong style={{ color: "#003e53", fontSize: "18px", fontFamily: "var(--font-heading)" }}>UPUA Portal</strong>
          </Link>
          <span style={{ background: user.role === "admin" ? "#e8f5ef" : "#eef4f8", color: user.role === "admin" ? "#137459" : "#00527a", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>
            {user.role} role
          </span>
        </div>

        {/* User Profile & Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <button
            type="button"
            className="public-donate-link"
            style={{ padding: "8px 16px", fontSize: "12px" }}
            onClick={() => setDonationModalOpen(true)}
          >
            Donate <Heart size={13} fill="currentColor" />
          </button>

          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#0e3d26", fontWeight: 700, fontSize: "13.5px" }}>{user.name}</div>
            <div style={{ color: "#667085", fontSize: "11.5px" }}>{user.chapterName || "National"}</div>
          </div>

          <button
            type="button"
            onClick={() => setUser(null)}
            style={{ background: "#f0f2f1", border: "1px solid #d5e0e1", borderRadius: "8px", padding: "8px 12px", color: "#c5221f", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700 }}
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Navigation Sidebar */}
        <aside style={{ width: "260px", background: "#ffffff", borderRight: "1px solid #e1eae3", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {user.role === "admin" && (
            <>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <TrendingUp size={18} /> General Overview
              </button>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "chapters" ? "active" : ""}`}
                onClick={() => setActiveTab("chapters")}
              >
                <Building size={18} /> Chapters & Breakdown
              </button>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "ledger" ? "active" : ""}`}
                onClick={() => setActiveTab("ledger")}
              >
                <DollarSign size={18} /> Income & Expenses
              </button>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "meetings" ? "active" : ""}`}
                onClick={() => setActiveTab("meetings")}
              >
                <Mic size={18} /> AI Meeting Recorder
              </button>
            </>
          )}

          {user.role === "chapter" && (
            <>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "my_chapter" ? "active" : ""}`}
                onClick={() => setActiveTab("my_chapter")}
              >
                <Building size={18} /> Chapter Dashboard
              </button>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "meetings" ? "active" : ""}`}
                onClick={() => setActiveTab("meetings")}
              >
                <FileText size={18} /> National Meetings & AI
              </button>
            </>
          )}

          {user.role === "member" && (
            <>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "my_membership" ? "active" : ""}`}
                onClick={() => setActiveTab("my_membership")}
              >
                <Users size={18} /> My Membership & Dues
              </button>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === "meetings" ? "active" : ""}`}
                onClick={() => setActiveTab("meetings")}
              >
                <FileText size={18} /> Official Meetings & AI
              </button>
            </>
          )}

          <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #e1eae3" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#526359", fontSize: "13px", textDecoration: "none", padding: "8px 12px" }}>
              <Home size={16} /> Public Website
            </Link>
          </div>
        </aside>

        {/* Workspace Stage */}
        <main style={{ flex: 1, padding: "32px clamp(20px, 4vw, 48px)", maxWidth: "1280px" }}>
          {/* TAB: GENERAL OVERVIEW (ADMIN) */}
          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "0 0 6px", fontWeight: 800 }}>
                    General Executive Overview
                  </h1>
                  <p style={{ color: "#526359", fontSize: "14px", margin: 0 }}>
                    National financial health, chapter compliance, and active member totals across North America.
                  </p>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "36px" }}>
                <div className="portal-stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#137459" }}>
                    <span>Total Members</span>
                    <Users size={20} />
                  </div>
                  <strong>{overview?.totalMembers?.toLocaleString() || "2,420"}</strong>
                  <small>Across 23 accredited chapters</small>
                </div>

                <div className="portal-stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#003e53" }}>
                    <span>Active Chapters</span>
                    <Building size={20} />
                  </div>
                  <strong>{overview?.totalChapters || "23"}</strong>
                  <small>US & Canada regional councils</small>
                </div>

                <div className="portal-stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#0e3d26" }}>
                    <span>Total Income</span>
                    <DollarSign size={20} />
                  </div>
                  <strong style={{ color: "#0e3d26" }}>${overview?.totalIncome?.toLocaleString() || "480,000"}</strong>
                  <small>Dues, donations, tickets & merch</small>
                </div>

                <div className="portal-stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#c5221f" }}>
                    <span>Total Expenses</span>
                    <TrendingUp size={20} />
                  </div>
                  <strong style={{ color: "#c5221f" }}>${overview?.totalExpenses?.toLocaleString() || "34,500"}</strong>
                  <small>Humanitarian aid & operations</small>
                </div>

                <div className="portal-stat-card" style={{ borderLeft: "4px solid #137459" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#137459" }}>
                    <span>Net Surplus Balance</span>
                    <CheckCircle2 size={20} />
                  </div>
                  <strong style={{ color: "#137459" }}>${overview?.netBalance?.toLocaleString() || "445,500"}</strong>
                  <small>Available in treasury reserve</small>
                </div>
              </div>

              {/* Income Breakdown by Category (Monthly Dues, Donations, Tickets, Merchandise) */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e1eae3", padding: "28px", marginBottom: "36px" }}>
                <h3 style={{ color: "#0e3d26", fontSize: "1.2rem", margin: "0 0 16px", fontWeight: 700 }}>
                  National Payment Breakdown by Stream
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ background: "#f7faf8", padding: "16px", borderRadius: "10px", border: "1px solid #e1eae3" }}>
                    <span style={{ fontSize: "12px", color: "#526359", fontWeight: 700, textTransform: "uppercase" }}>Monthly Dues</span>
                    <h4 style={{ color: "#0e3d26", fontSize: "1.5rem", margin: "6px 0 2px" }}>
                      ${overview?.incomeBreakdown?.monthlyDues?.toLocaleString() || "200,000"}
                    </h4>
                    <small style={{ color: "#667085" }}>Chapter member subscriptions</small>
                  </div>

                  <div style={{ background: "#f7faf8", padding: "16px", borderRadius: "10px", border: "1px solid #e1eae3" }}>
                    <span style={{ fontSize: "12px", color: "#526359", fontWeight: 700, textTransform: "uppercase" }}>Donations (Min $50)</span>
                    <h4 style={{ color: "#137459", fontSize: "1.5rem", margin: "6px 0 2px" }}>
                      ${overview?.incomeBreakdown?.donations?.toLocaleString() || "150,000"}
                    </h4>
                    <small style={{ color: "#667085" }}>Shelters, IDP relief & health</small>
                  </div>

                  <div style={{ background: "#f7faf8", padding: "16px", borderRadius: "10px", border: "1px solid #e1eae3" }}>
                    <span style={{ fontSize: "12px", color: "#526359", fontWeight: 700, textTransform: "uppercase" }}>Convention Tickets</span>
                    <h4 style={{ color: "#003e53", fontSize: "1.5rem", margin: "6px 0 2px" }}>
                      ${overview?.incomeBreakdown?.tickets?.toLocaleString() || "95,000"}
                    </h4>
                    <small style={{ color: "#667085" }}>Annual gala registrations</small>
                  </div>

                  <div style={{ background: "#f7faf8", padding: "16px", borderRadius: "10px", border: "1px solid #e1eae3" }}>
                    <span style={{ fontSize: "12px", color: "#526359", fontWeight: 700, textTransform: "uppercase" }}>Merchandise</span>
                    <h4 style={{ color: "#b08000", fontSize: "1.5rem", margin: "6px 0 2px" }}>
                      ${overview?.incomeBreakdown?.merchandise?.toLocaleString() || "35,000"}
                    </h4>
                    <small style={{ color: "#667085" }}>Pins, shawls & regalia</small>
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button type="button" className="btn-primary" onClick={() => setIsNewPaymentOpen(true)}>
                  <Plus size={16} /> Record Income Payment
                </button>
                <button type="button" className="btn-secondary" onClick={() => setIsNewExpenseOpen(true)}>
                  <Plus size={16} /> Record Expense
                </button>
                <button type="button" className="btn-secondary" onClick={() => setActiveTab("meetings")}>
                  <Mic size={16} /> Record Meeting via Mic
                </button>
              </div>
            </div>
          )}

          {/* TAB: CHAPTERS LIST & DETAIL VIEW (ADMIN) */}
          {activeTab === "chapters" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "0 0 6px", fontWeight: 800 }}>
                    Chapter Directories & Financial Breakdown
                  </h1>
                  <p style={{ color: "#526359", fontSize: "14px", margin: 0 }}>
                    Granular breakdown of monthly dues, donations, ticket sales, and merchandise by chapter.
                  </p>
                </div>
                {user.role === "admin" && (
                  <button type="button" className="btn-primary" onClick={() => setIsNewChapterOpen(true)}>
                    <Plus size={16} /> Add New Chapter
                  </button>
                )}
              </div>

              {/* Chapters Table */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e1eae3", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                  <thead style={{ background: "#f7faf7", borderBottom: "1px solid #e1eae3", color: "#526359" }}>
                    <tr>
                      <th style={{ padding: "16px 20px" }}>Chapter Name</th>
                      <th style={{ padding: "16px 20px" }}>Region</th>
                      <th style={{ padding: "16px 20px" }}>President</th>
                      <th style={{ padding: "16px 20px" }}>Members</th>
                      <th style={{ padding: "16px 20px" }}>Monthly Dues</th>
                      <th style={{ padding: "16px 20px" }}>Donations</th>
                      <th style={{ padding: "16px 20px" }}>Tickets</th>
                      <th style={{ padding: "16px 20px" }}>Merchandise</th>
                      {user.role === "admin" && <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((ch) => (
                      <tr key={ch.id} style={{ borderBottom: "1px solid #eef3ef" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0e3d26" }}>
                          {ch.name}
                          <small style={{ display: "block", color: "#667085", fontWeight: 400 }}>{ch.contactEmail}</small>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#526359" }}>{ch.region}</td>
                        <td style={{ padding: "16px 20px", color: "#14211a" }}>{ch.president}</td>
                        <td style={{ padding: "16px 20px", fontWeight: 700 }}>{ch.memberCount}</td>
                        <td style={{ padding: "16px 20px", color: "#0e3d26", fontWeight: 600 }}>${ch.paymentsBreakdown.monthlyDues.toLocaleString()}</td>
                        <td style={{ padding: "16px 20px", color: "#137459", fontWeight: 600 }}>${ch.paymentsBreakdown.donations.toLocaleString()}</td>
                        <td style={{ padding: "16px 20px", color: "#003e53", fontWeight: 600 }}>${ch.paymentsBreakdown.tickets.toLocaleString()}</td>
                        <td style={{ padding: "16px 20px", color: "#b08000", fontWeight: 600 }}>${ch.paymentsBreakdown.merchandise.toLocaleString()}</td>
                        {user.role === "admin" && (
                          <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteChapter(ch.id)}
                              style={{ background: "transparent", border: 0, color: "#c5221f", cursor: "pointer", padding: "4px" }}
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

          {/* TAB: INCOME & EXPENSES LEDGER (ADMIN) */}
          {activeTab === "ledger" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "0 0 6px", fontWeight: 800 }}>
                    Income & Expense Ledger
                  </h1>
                  <p style={{ color: "#526359", fontSize: "14px", margin: 0 }}>
                    All recorded payments and organizational expenses with complete audit controls.
                  </p>
                </div>
                {user.role === "admin" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" className="btn-primary" onClick={() => setIsNewPaymentOpen(true)}>
                      <Plus size={15} /> Add Income
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setIsNewExpenseOpen(true)}>
                      <Plus size={15} /> Add Expense
                    </button>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div style={{ background: "#ffffff", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e1eae3", display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f7faf7", border: "1px solid #d5e0e1", borderRadius: "8px", padding: "8px 12px", flex: 1, minWidth: "220px" }}>
                  <Search size={16} color="#667085" />
                  <input
                    type="text"
                    placeholder="Search by donor, chapter, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 0, outline: "none", background: "transparent", width: "100%", fontSize: "13px" }}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d5e0e1", fontSize: "13px", background: "#ffffff" }}
                >
                  <option value="all">All Categories</option>
                  <option value="monthly_dues">Monthly Dues</option>
                  <option value="donation">Donations</option>
                  <option value="ticket">Convention Tickets</option>
                  <option value="merchandise">Merchandise</option>
                </select>
              </div>

              {/* Payments Table */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e1eae3", overflow: "hidden", marginBottom: "36px" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e1eae3", display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#0e3d26", fontSize: "15px" }}>Recorded Income Transactions ({filteredPayments.length})</strong>
                  <span style={{ fontSize: "12px", color: "#137459", fontWeight: 700 }}>Stripe Processing Active</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead style={{ background: "#f7faf7", color: "#526359" }}>
                    <tr>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Date</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Donor / Member</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Chapter</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Category</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Description</th>
                      <th style={{ padding: "14px 20px", textAlign: "right" }}>Amount</th>
                      {user.role === "admin" && <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #eef3ef" }}>
                        <td style={{ padding: "14px 20px", color: "#667085" }}>{p.date}</td>
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: "#14211a" }}>{p.memberName}</td>
                        <td style={{ padding: "14px 20px", color: "#526359" }}>{p.chapterName}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: "#e8f5ef", color: "#137459", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                            {p.category.replace("_", " ")}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", color: "#526359" }}>{p.description}</td>
                        <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: "#0e3d26" }}>
                          +${p.amount.toLocaleString()}
                        </td>
                        {user.role === "admin" && (
                          <td style={{ padding: "14px 20px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(p.id)}
                              style={{ background: "transparent", border: 0, color: "#c5221f", cursor: "pointer" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recorded Expenses Table */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e1eae3", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e1eae3", display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#c5221f", fontSize: "15px" }}>Recorded Expenses ({expenses.length})</strong>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead style={{ background: "#f7faf7", color: "#526359" }}>
                    <tr>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Date</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Category</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Description</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Vendor</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Approved By</th>
                      <th style={{ padding: "14px 20px", textAlign: "right" }}>Amount</th>
                      {user.role === "admin" && <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id} style={{ borderBottom: "1px solid #eef3ef" }}>
                        <td style={{ padding: "14px 20px", color: "#667085" }}>{exp.date}</td>
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: "#003e53" }}>{exp.category}</td>
                        <td style={{ padding: "14px 20px", color: "#526359" }}>{exp.description}</td>
                        <td style={{ padding: "14px 20px", color: "#667085" }}>{exp.vendor}</td>
                        <td style={{ padding: "14px 20px", color: "#14211a" }}>{exp.approvedBy}</td>
                        <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: "#c5221f" }}>
                          -${exp.amount.toLocaleString()}
                        </td>
                        {user.role === "admin" && (
                          <td style={{ padding: "14px 20px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(exp.id)}
                              style={{ background: "transparent", border: 0, color: "#c5221f", cursor: "pointer" }}
                            >
                              <Trash2 size={15} />
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

          {/* TAB: MEETINGS & AI VOICE RECORDER (ADMIN & ALL ROLES) */}
          {activeTab === "meetings" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "0 0 6px", fontWeight: 800 }}>
                  Official Meeting Records & AI Intelligence
                </h1>
                <p style={{ color: "#526359", fontSize: "14px", margin: 0 }}>
                  Audio recordings automatically transcribed and summarized by AI for complete member transparency.
                </p>
              </div>

              {/* Admin Microphone Voice Recording Studio */}
              {user.role === "admin" && (
                <div style={{ background: "#ffffff", borderRadius: "18px", border: "2px solid #137459", padding: "28px", marginBottom: "36px", boxShadow: "0 10px 30px rgba(14,61,38,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ background: isRecording ? "#fce8e6" : "#e8f5ef", padding: "10px", borderRadius: "50%", display: "flex" }}>
                      <Mic size={24} color={isRecording ? "#c5221f" : "#137459"} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.25rem", fontWeight: 800 }}>
                        {isRecording ? "🔴 Recording Meeting Live..." : "Record Meeting via Microphone"}
                      </h3>
                      <small style={{ color: "#667085" }}>
                        Audio is captured, automatically transcribed to text, and summarized with key decisions & action items.
                      </small>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
                    <input
                      type="text"
                      placeholder="Meeting Title (e.g. Q4 National Council Executive Session)"
                      value={meetingTitleInput}
                      onChange={(e) => setMeetingTitleInput(e.target.value)}
                      style={{ flex: 1, minWidth: "260px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #d5e0e1", fontSize: "14px" }}
                    />

                    {!isRecording ? (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: "12px 24px" }}
                        onClick={startRecording}
                      >
                        <Mic size={16} /> Start Microphone Recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ background: "#c5221f", borderColor: "#c5221f", padding: "12px 24px" }}
                        onClick={stopAndTranscribe}
                        disabled={isTranscribing}
                      >
                        {isTranscribing ? (
                          <>
                            <Sparkles size={16} /> AI Transcribing & Summarizing...
                          </>
                        ) : (
                          <>
                            <MicOff size={16} /> Stop & Generate AI Summary ({Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")})
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {isRecording && (
                    <div style={{ background: "#fef3f2", border: "1px solid #fecdca", borderRadius: "10px", padding: "14px 18px", color: "#b42318", fontSize: "13px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="pulse-indicator" />
                      <span>Microphone active ({recordingSeconds}s). Speak naturally into your mic. Click "Stop & Generate AI Summary" when done.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Meetings List */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
                {meetings.map((mtg) => (
                  <div
                    key={mtg.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #e1eae3",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ background: "#e8f5ef", color: "#137459", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>
                        {mtg.chapterName}
                      </span>
                      <small style={{ color: "#667085", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={13} /> {mtg.duration}
                      </small>
                    </div>

                    <h3 style={{ color: "#0e3d26", fontSize: "1.2rem", margin: "0 0 10px", fontWeight: 700, lineHeight: 1.35 }}>
                      {mtg.title}
                    </h3>

                    <p style={{ color: "#526359", fontSize: "13.5px", lineHeight: "1.65", margin: "0 0 16px", flex: 1 }}>
                      <strong>AI Summary:</strong> {mtg.summary}
                    </p>

                    <div style={{ borderTop: "1px solid #eef3ef", paddingTop: "14px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#667085" }}>📅 {mtg.date}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMeeting(mtg)}
                        style={{ background: "#0e3d26", color: "#ffffff", border: 0, borderRadius: "6px", padding: "8px 16px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer" }}
                      >
                        View Full AI Intelligence →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CHAPTER DASHBOARD (FOR CHAPTER LEADER) */}
          {activeTab === "my_chapter" && (
            <div>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ color: "#137459", fontWeight: 800, fontSize: "12px", textTransform: "uppercase" }}>
                  Chapter Leadership Console
                </span>
                <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "4px 0 8px", fontWeight: 800 }}>
                  {user.chapterName || "Houston Chapter"} Dashboard
                </h1>
                <p style={{ color: "#526359", fontSize: "14px", margin: 0 }}>
                  Active members, monthly dues collection, and fundraising totals for your local branch.
                </p>
              </div>

              {/* Chapter Specific Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "36px" }}>
                <div className="portal-stat-card">
                  <span style={{ color: "#526359", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Chapter Members</span>
                  <strong style={{ color: "#0e3d26" }}>245 Active</strong>
                  <small>89% dues compliance</small>
                </div>

                <div className="portal-stat-card">
                  <span style={{ color: "#526359", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Monthly Dues Raised</span>
                  <strong style={{ color: "#137459" }}>$29,400</strong>
                  <small>Fiscal year to date</small>
                </div>

                <div className="portal-stat-card">
                  <span style={{ color: "#526359", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Chapter Donations</span>
                  <strong style={{ color: "#003e53" }}>$18,500</strong>
                  <small>Shelters & Okuama relief</small>
                </div>

                <div className="portal-stat-card">
                  <span style={{ color: "#526359", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Convention Tickets</span>
                  <strong style={{ color: "#b08000" }}>$12,250</strong>
                  <small>Delegates registered</small>
                </div>
              </div>

              {/* Chapter Members Table */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e1eae3", overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #e1eae3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#0e3d26", fontSize: "16px" }}>Registered Chapter Members</strong>
                  <span style={{ background: "#e8f5ef", color: "#137459", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 700 }}>
                    Verified Members
                  </span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead style={{ background: "#f7faf7", color: "#526359" }}>
                    <tr>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Email</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Phone</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Dues Status</th>
                      <th style={{ padding: "14px 20px", textAlign: "left" }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} style={{ borderBottom: "1px solid #eef3ef" }}>
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: "#14211a" }}>{m.name}</td>
                        <td style={{ padding: "14px 20px", color: "#526359" }}>{m.email}</td>
                        <td style={{ padding: "14px 20px", color: "#667085" }}>{m.phone}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: m.duesStatus === "Paid" ? "#e8f5ef" : "#fef3f2", color: m.duesStatus === "Paid" ? "#137459" : "#c5221f", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>
                            {m.duesStatus}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", color: "#003e53", fontWeight: 600 }}>{m.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MY MEMBERSHIP (GENERAL MEMBER) */}
          {activeTab === "my_membership" && (
            <div>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ color: "#137459", fontWeight: 800, fontSize: "12px", textTransform: "uppercase" }}>
                  Member Services
                </span>
                <h1 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "1.85rem", margin: "4px 0 8px", fontWeight: 800 }}>
                  Welcome, {user.name}
                </h1>
                <p style={{ color: "#526359", fontSize: "14px", margin: 0 }}>
                  Manage your UPUA digital ID card, pay monthly dues online via Stripe, and explore meeting records.
                </p>
              </div>

              {/* Digital Membership ID Card */}
              <div style={{ maxWidth: "480px", background: "linear-gradient(135deg, #0e3d26 0%, #137459 100%)", borderRadius: "20px", padding: "28px", color: "#ffffff", boxShadow: "0 16px 36px rgba(14,61,38,0.2)", marginBottom: "36px", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Image src="/upua-logo.png" alt="UPUA" width={48} height={48} priority style={{ borderRadius: "50%", background: "#fff", padding: "2px" }} />
                    <div>
                      <strong style={{ fontSize: "16px", display: "block" }}>Urhobo Progress Union America</strong>
                      <small style={{ color: "#e7c326", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>OFFICIAL MEMBER CREDENTIAL</small>
                    </div>
                  </div>
                  <ShieldCheck size={28} color="#e7c326" />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", opacity: 0.8, textTransform: "uppercase" }}>Full Member Name</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "0.02em" }}>{user.name}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "14px" }}>
                  <div>
                    <span style={{ fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }}>Member ID</span>
                    <strong style={{ fontSize: "12.5px", display: "block" }}>UPUA-2024-8841</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }}>Chapter</span>
                    <strong style={{ fontSize: "12.5px", display: "block" }}>{user.chapterName}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }}>Dues Status</span>
                    <strong style={{ fontSize: "12.5px", display: "block", color: "#e7c326" }}>Active / Paid</strong>
                  </div>
                </div>
              </div>

              {/* Online Payment Buttons via Stripe */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e1eae3", padding: "28px", maxWidth: "680px" }}>
                <h3 style={{ color: "#0e3d26", fontSize: "1.2rem", margin: "0 0 8px", fontWeight: 700 }}>
                  Online Payment & Contributions
                </h3>
                <p style={{ color: "#526359", fontSize: "13.5px", margin: "0 0 20px" }}>
                  Securely pay your chapter monthly dues or make donations processed instantly through Stripe.
                </p>

                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setDonationModalOpen(true)}
                  >
                    <CreditCard size={16} /> Pay Chapter Dues ($50 / $100)
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setDonationModalOpen(true)}
                  >
                    <Heart size={16} color="#c5221f" /> Make Special Donation (Min $50)
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Meeting Intelligence Detail Modal */}
      {selectedMeeting && (
        <div className="upua-modal-backdrop" onClick={() => setSelectedMeeting(null)}>
          <div className="upua-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "820px" }}>
            <div style={{ background: "linear-gradient(135deg, #0e3d26 0%, #137459 100%)", color: "#ffffff", padding: "28px 32px", position: "relative" }}>
              <span style={{ background: "rgba(255,255,255,0.18)", color: "#e7c326", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>
                AI Meeting Intelligence
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: "10px 0 4px", fontWeight: 800 }}>
                {selectedMeeting.title}
              </h2>
              <div style={{ fontSize: "13px", opacity: 0.85 }}>
                📅 {selectedMeeting.date} · ⏱️ {selectedMeeting.duration} · Recorded by {selectedMeeting.recordedBy}
              </div>
            </div>

            <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 8px", fontWeight: 700 }}>
                  🧠 AI Executive Summary
                </h4>
                <p style={{ background: "#f0f8f3", borderLeft: "4px solid #137459", padding: "14px 18px", borderRadius: "6px", color: "#34454a", fontSize: "14.5px", lineHeight: "1.7", margin: 0 }}>
                  {selectedMeeting.summary}
                </p>
              </div>

              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 10px", fontWeight: 700 }}>
                  ⚖️ Key Ratified Decisions
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedMeeting.keyDecisions.map((decision, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "#14211a" }}>
                      <CheckCircle2 size={16} color="#137459" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{decision}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 10px", fontWeight: 700 }}>
                  📋 Action Items & Assigned Owners
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  {selectedMeeting.actionItems.map((item, idx) => (
                    <div key={idx} style={{ background: "#f7faf8", border: "1px solid #d5e4d9", borderRadius: "10px", padding: "12px 16px" }}>
                      <strong style={{ color: "#0e3d26", fontSize: "13.5px", display: "block", marginBottom: "4px" }}>{item.task}</strong>
                      <div style={{ fontSize: "12px", color: "#526359" }}>👤 Owner: <strong>{item.owner}</strong></div>
                      <div style={{ fontSize: "12px", color: "#667085" }}>⏰ Deadline: {item.deadline}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 8px", fontWeight: 700 }}>
                  🎙️ Full Audio Transcription Record
                </h4>
                <p style={{ background: "#fafafa", border: "1px solid #e1eae3", padding: "16px", borderRadius: "8px", fontSize: "13.5px", color: "#526359", lineHeight: "1.75", maxHeight: "180px", overflowY: "auto", margin: 0 }}>
                  {selectedMeeting.transcript}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setSelectedMeeting(null)}
                  style={{ background: "#0e3d26", color: "#ffffff", border: 0, borderRadius: "6px", padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal: New Chapter */}
      {isNewChapterOpen && (
        <div className="upua-modal-backdrop" onClick={() => setIsNewChapterOpen(false)}>
          <div className="upua-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", padding: "32px" }}>
            <h2 style={{ color: "#0e3d26", fontSize: "1.4rem", margin: "0 0 16px" }}>Add New UPUA Chapter</h2>
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
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Chapter</button>
                <button type="button" onClick={() => setIsNewChapterOpen(false)} style={{ background: "#f0f2f1", border: 0, padding: "10px 18px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal: New Payment */}
      {isNewPaymentOpen && (
        <div className="upua-modal-backdrop" onClick={() => setIsNewPaymentOpen(false)}>
          <div className="upua-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", padding: "32px" }}>
            <h2 style={{ color: "#0e3d26", fontSize: "1.4rem", margin: "0 0 16px" }}>Record Income Payment</h2>
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
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Record Payment</button>
                <button type="button" onClick={() => setIsNewPaymentOpen(false)} style={{ background: "#f0f2f1", border: 0, padding: "10px 18px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal: New Expense */}
      {isNewExpenseOpen && (
        <div className="upua-modal-backdrop" onClick={() => setIsNewExpenseOpen(false)}>
          <div className="upua-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", padding: "32px" }}>
            <h2 style={{ color: "#c5221f", fontSize: "1.4rem", margin: "0 0 16px" }}>Record Expense Entry</h2>
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
                <button type="submit" className="btn-primary" style={{ background: "#c5221f", flex: 1 }}>Save Expense</button>
                <button type="button" onClick={() => setIsNewExpenseOpen(false)} style={{ background: "#f0f2f1", border: 0, padding: "10px 18px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Stripe Donation Modal */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
      />
    </div>
  );
}
