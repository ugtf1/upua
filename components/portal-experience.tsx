"use client";

import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  DollarSign,
  Grid2X2,
  Heart,
  LayoutDashboard,
  Menu,
  Mic,
  Pause,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fullMonths, months, seedHostingSchedule, seedMeetings, seedMembers, seedSettings, seedTransactions } from "@/lib/seed-data";
import type { HostingScheduleItem, MeetingSession, Member, OrgSettings, Role, Transaction, User } from "@/types";
import DonationModal from "@/components/donation-modal";

type Panel = "overview" | "members" | "pivot" | "transactions" | "analytics" | "meetings" | "hosting" | "settings" | "member" | "account";
type RecorderTab = "attendance" | "transcript" | "summary";

const chartColors = ["#0e3d26", "#196a43", "#529671", "#88c99e", "#b7e4c7"];

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      setValue(fallback);
    }
  }, [fallback, key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}

export default function PortalExperience() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useStoredState<Member[]>("orgflo_members", seedMembers);
  const [transactions] = useStoredState<Transaction[]>("orgflo_transactions", seedTransactions);
  const [meetings, setMeetings] = useStoredState<MeetingSession[]>("orgflo_meetings", seedMeetings);
  const [hostingSchedule, setHostingSchedule] = useStoredState<HostingScheduleItem[]>("orgflo_hosting_schedule", seedHostingSchedule);
  const [settings, setSettings] = useStoredState<OrgSettings>("orgflo_settings", seedSettings);

  function quickLogin(role: Role) {
    setUser(
      role === "admin"
        ? { id: "u1", username: "admin", name: "Elder Admin", email: "admin@upua.org", role }
        : { id: "u2", username: "member", name: "Sarah Jenkins", email: "sarah@upua.org", role, memberId: "m1" }
    );
    setView("app");
  }

  return (
    <main className="site">
      {view === "landing" ? (
        <LandingPage onLogin={quickLogin} />
      ) : (
        <Workspace
          user={user}
          quickLogin={quickLogin}
          onHome={() => setView("landing")}
          members={members}
          setMembers={setMembers}
          transactions={transactions}
          meetings={meetings}
          setMeetings={setMeetings}
          hostingSchedule={hostingSchedule}
          setHostingSchedule={setHostingSchedule}
          settings={settings}
          setSettings={setSettings}
        />
      )}
    </main>
  );
}

function LandingPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [donationOpen, setDonationOpen] = useState(false);

  return (
    <section className="figma-landing-page" aria-label="UPUA landing page">
      <LandingHeader onLogin={onLogin} onOpenDonation={() => setDonationOpen(true)} />
      <LandingHero onOpenDonation={() => setDonationOpen(true)} />
      <ProblemSolution />
      <LandingWork onOpenDonation={() => setDonationOpen(true)} />
      <LandingBlog />
      <WorldwideLandingFooter onOpenDonation={() => setDonationOpen(true)} />
      <DonationModal isOpen={donationOpen} onClose={() => setDonationOpen(false)} />
    </section>
  );
}

function LandingHeader({
  onLogin,
  onOpenDonation,
}: {
  onLogin: (role: Role) => void;
  onOpenDonation: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="public-site-header">
      {/* Extreme Left: Brand Logo */}
      <Link className="public-brand" href="/" aria-label="UPUA home">
        <Image
          src="/upua-logo.png"
          alt="UPUA Logo"
          width={44}
          height={44}
          priority
          className="public-brand-logo"
        />
        <strong>UPUA</strong>
      </Link>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Middle on mobile, Right on desktop: Donate & Sign in */}
      <div className="public-header-actions">
        <button
          type="button"
          className="public-donate-link"
          onClick={onOpenDonation}
          aria-label="Open donation form"
        >
          Donate <Heart size={14} fill="currentColor" />
        </button>
        <button type="button" onClick={() => onLogin("admin")}>
          Sign in
        </button>
      </div>

      {/* Extreme Right: Mobile Hamburger */}
      <button
        type="button"
        className="mobile-hamburger-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function LandingHero() {
  return (
    <section className="public-landing-hero" id="home" aria-labelledby="landing-title">
      <h1 className="sr-only" id="landing-title">Welcome to Urhobo Progress Union America</h1>
      <Image
        src="/upuahero.png"
        alt="Welcome to Urhobo Progress Union America. We aim to unite and empower the Urhobo community."
        width={2880}
        height={1916}
        priority
        sizes="100vw"
        className="public-hero-reference"
      />
      <a className="hero-reference-learn" href="#problem" aria-label="Learn more about UPU America" />
    </section>
  );
}

function ProblemSolution() {
  return (
    <>
      <section className="problem-section" id="problem" aria-labelledby="problem-title">
        <div className="mission-copy">
          <h2 id="problem-title">The Problem</h2>
          <span className="mission-rule" />
          <p>Across the Urhobo diaspora, families and communities can feel disconnected from one another and from the support they need. Uneven access to education, healthcare, and reliable community resources can make it harder for people to thrive and preserve the connections that sustain us.</p>
        </div>
      </section>
      <section className="solution-section" aria-labelledby="solution-title">
        <div className="mission-copy">
          <h2 id="solution-title">Our Solution</h2>
          <span className="mission-rule" />
          <p>UPU America brings people together through a strong network of members and chapters. We turn that connection into practical action: supporting students, expanding medical outreach, strengthening community programs, and keeping Urhobo culture vibrant for the next generation.</p>
        </div>
      </section>
    </>
  );
}

const workItems = [
  { title: "Medical Outreach", icon: "✚", position: "15% 46%" },
  { title: "Scholarships", icon: "◇", position: "48% 36%" },
  { title: "Community Support", icon: "⌂", position: "72% 45%" },
  { title: "Cultural Programs", icon: "✳", position: "90% 40%" }
];

function LandingWork() {
  return (
    <section className="landing-work-section" id="work" aria-labelledby="work-title">
      <div className="landing-section-heading">
        <h2 id="work-title">OUR WORK</h2>
        <p>Creating opportunity and strengthening communities across the Urhobo land.</p>
      </div>
      <div className="landing-work-grid">
        {workItems.map((item, index) => (
          <article className={`landing-work-card work-tone-${index + 1}`} key={item.title} style={{ backgroundPosition: item.position }}>
            <div className="landing-work-content"><h3>{item.title}</h3><span aria-hidden="true">{item.icon}</span></div>
          </article>
        ))}
      </div>
      <a className="work-more-link" href="#blog">Explore our impact <ArrowRight size={16} /></a>
    </section>
  );
}

const blogItems = [
  { title: "The 2022 Annual Urhobo Progress Union America Convention", category: "News", date: "June 28, 2024", image: "/update-convention.jpg", alt: "Members gathered at the UPU America annual convention" },
  { title: "Science, Technology, Engineering & Mathematics (STEM), Artificial Intelligence (AI) Training in Urhoboland", category: "Program", date: "June 28, 2024", image: "/update-stem.jpg", alt: "Students attending a STEM and technology training program" },
  { title: "UPU America donation to the Okama IDPs", category: "News", date: "June 28, 2024", image: "/update-news.jpg", alt: "UPU America news segment about the donation" },
  { title: "UPU America medical outreach at the 2023 UPU Worldwide Conference", category: "News", date: "June 28, 2024", image: "/update-outreach.jpg", alt: "Medical outreach team supporting a community member" }
];

function LandingBlog() {
  return (
    <section className="landing-blog-section" id="updates" aria-labelledby="blog-title">
      <div className="landing-section-heading">
        <h2 id="blog-title">Updates from UPU America</h2>
        <p>News and blog posts on UPU America and our programs</p>
        <a className="updates-explore-link" href="#updates">Explore more <ArrowRight size={16} /></a>
      </div>
      <div className="landing-blog-grid">
        {blogItems.map((item, index) => (
          <article className={`landing-blog-card blog-card-${index + 1}`} key={item.title}>
            <div className="landing-blog-photo"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 45vw" /></div>
            <div className="landing-blog-copy"><small><time>{item.date}</time><span>{item.category}</span></small><h3>{item.title}</h3></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorldwideLandingFooter() {
  const navItems = ["Home", "About", "Chapters", "Programs", "Blog", "Gallery"];

  return (
    <section className="upua-world-footer" aria-label="UPUA worldwide community and footer">
      <div className="upua-world-inner">
        <h2>Urhobo Progress Union is WORLDWIDE!</h2>
        <div className="upua-map-card">
          <Image className="world-map-art" src="/world-map.svg" alt="Dotted world map showing UPU America community locations" width={980} height={336} unoptimized />
          <div className="upua-map-tooltip">
            <span className="us-flag" role="img" aria-label="United States flag"><i /></span>
            <strong>California, USA</strong>
            <small>100 Smith Street</small>
            <small>Collingwood VIC 3066 AU</small>
          </div>
          {["pin-a", "pin-b", "pin-c", "pin-d", "pin-e", "pin-f", "pin-g", "pin-h"].map((pin) => (
            <span className={`map-glow ${pin}`} key={pin} />
          ))}
        </div>
        <div className="join-community-card" id="join-community">
          <div>
            <h3>Join the Community</h3>
            <p>Sign up for the very best tutorials and the latest news.</p>
          </div>
          <form>
            <div className="join-input-row">
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="button">Subscribe</button>
            </div>
            <small>
              We care about your data in our <a href="#">privacy policy</a>.
            </small>
          </form>
        </div>
      </div>
      <footer className="upua-main-footer">
        <div className="upua-footer-bar">
          <strong>UPUA</strong>
          <nav aria-label="Footer navigation">
            {navItems.map((item) => {
              const hrefMap: Record<string, string> = {
                Home: "/",
                About: "/about",
                Chapters: "/about#chapters",
                Programs: "/programs",
                Blog: "/blog",
                Gallery: "/about",
              };
              return (
                <Link href={hrefMap[item] || "/"} key={item}>{item}</Link>
              );
            })}
          </nav>
          <div className="footer-socials" aria-label="Social links">
            <span>♥</span>
            <span>◎</span>
            <span>f</span>
          </div>
        </div>
        <div className="upua-copyright">Copyright © 2024 Urhobo Progress Union America</div>
      </footer>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-status"><span>9:41</span><span>UPUA</span></div>
        <div className="phone-top"><div><strong>Admin Overview</strong><p>Live member insights</p></div><Bell size={14} /></div>
        <div className="phone-search">Search members, dues, meetings</div>
        <div className="metric-grid">
          <div><Users size={18} /><span>Members</span><strong>1,284</strong><small>+76</small></div>
          <div><DollarSign size={18} /><span>Dues</span><strong>$6.1k</strong><small>+18%</small></div>
          <div><AlertCircle size={18} /><span>Due</span><strong>$500</strong><small className="down">6 pending</small></div>
          <div><CalendarCheck size={18} /><span>Meetings</span><strong>91%</strong><small>attendance</small></div>
        </div>
        <div className="mini-chart"><strong>Transactions</strong><svg viewBox="0 0 220 90"><polyline points="0,65 35,30 70,54 105,20 140,38 175,18 220,42" /><circle cx="175" cy="18" r="4" /></svg></div>
        <div className="pie-row"><div className="pie" /><p>Department distribution across outreach, scholarships, culture and fundraising.</p></div>
      </div>
    </div>
  );
}

function Workspace(props: {
  user: User | null;
  quickLogin: (role: Role) => void;
  onHome: () => void;
  members: Member[];
  setMembers: (members: Member[]) => void;
  transactions: Transaction[];
  meetings: MeetingSession[];
  setMeetings: (meetings: MeetingSession[]) => void;
  hostingSchedule: HostingScheduleItem[];
  setHostingSchedule: (schedule: HostingScheduleItem[]) => void;
  settings: OrgSettings;
  setSettings: (settings: OrgSettings) => void;
}) {
  const activeUser = props.user ?? { id: "u1", username: "admin", name: "Elder Admin", email: "admin@upua.org", role: "admin" as Role };
  const [panel, setPanel] = useState<Panel>(activeUser.role === "admin" ? "overview" : "member");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meetingsOpen, setMeetingsOpen] = useState(true);
  const nav = activeUser.role === "admin"
    ? [
        ["overview", "Overview", <LayoutDashboard size={18} key="o" />],
        ["members", "Member Directory", <Users size={18} key="m" />],
        ["pivot", "Pivot View", <Grid2X2 size={18} key="p" />],
        ["transactions", "Transactions", <CreditCard size={18} key="t" />],
        ["analytics", "Financial Analytics", <BarChart3 size={18} key="a" />]
      ] as const
    : [
        ["member", "Member Portal", <UserRound size={18} key="mp" />],
        ["transactions", "My Dues & History", <CreditCard size={18} key="dt" />],
        ["account", "My Account", <Settings size={18} key="ac" />]
      ] as const;

  function navigate(next: Panel) {
    setPanel(next);
    setMobileOpen(false);
  }

  return (
    <section className={`app-layout workspace ${mobileOpen ? "mobile-nav-open" : ""}`}>
      {mobileOpen && <button className="app-sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className="app-sidebar sidebar">
        <button className="close-sidebar" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        <button className="org-emblem" type="button" onClick={props.onHome} aria-label="Back home"><span>UP</span></button>
        <p className="rail-label">{activeUser.role === "admin" ? "Admin console" : "Member console"}</p>
        <nav className="side-nav" aria-label="Workspace navigation">
          {nav.map(([id, label, icon]) => <button key={id} className={panel === id ? "active" : ""} type="button" onClick={() => navigate(id as Panel)}>{icon}<span>{label}</span></button>)}
          <button className={panel === "meetings" || panel === "hosting" ? "active" : ""} type="button" onClick={() => setMeetingsOpen(!meetingsOpen)}><CalendarCheck size={18} /><span>Meetings</span><ChevronDown size={16} className={meetingsOpen ? "rotate" : ""} /></button>
          {meetingsOpen && <div className="sub-nav"><button className={panel === "meetings" ? "active" : ""} type="button" onClick={() => navigate("meetings")}>Meeting Tracker</button><button className={panel === "hosting" ? "active" : ""} type="button" onClick={() => navigate("hosting")}>Meeting Hosting</button></div>}
          {activeUser.role === "admin" && <button className={panel === "settings" ? "active" : ""} type="button" onClick={() => navigate("settings")}><Settings size={18} /><span>Settings</span></button>}
        </nav>
        <div className="login-switcher"><button type="button" onClick={() => props.quickLogin(activeUser.role === "admin" ? "member" : "admin")}>Switch to {activeUser.role === "admin" ? "member" : "admin"}</button></div>
      </aside>

      <div className="app-main admin-stage">
        <header className="admin-topbar">
          <button className="mobile-menu app-mobile-menu-toggle" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="app-header-copy"><h1>UPUA Workspace</h1><p>{props.settings.orgTagline}</p></div>
          <div className="topbar-actions"><span className="role-pill"><ShieldCheck size={16} />{activeUser.role} role</span><button className="icon-button" type="button" aria-label="Notifications"><Bell size={18} /></button></div>
        </header>
        <section className="app-page-content admin-content">
          {activeUser.role === "admin" && panel === "overview" && <AdminDashboard {...props} setPanel={setPanel} />}
          {panel === "members" && <MemberDirectory members={props.members} setMembers={props.setMembers} />}
          {panel === "pivot" && <PivotView members={props.members} />}
          {panel === "transactions" && <TransactionsPage user={activeUser} transactions={props.transactions} settings={props.settings} />}
          {panel === "analytics" && <AnalyticsPage transactions={props.transactions} settings={props.settings} />}
          {panel === "meetings" && <MeetingRecorderPage members={props.members} meetings={props.meetings} setMeetings={props.setMeetings} user={activeUser} />}
          {panel === "hosting" && <MeetingHostingPage user={activeUser} members={props.members} schedule={props.hostingSchedule} setSchedule={props.setHostingSchedule} />}
          {panel === "settings" && <SettingsPage settings={props.settings} setSettings={props.setSettings} />}
          {panel === "member" && <MemberPortal user={activeUser} members={props.members} transactions={props.transactions} meetings={props.meetings} settings={props.settings} />}
          {panel === "account" && <AccountPage user={activeUser} members={props.members} />}
        </section>
      </div>
    </section>
  );
}

function getMonthlyData(transactions: Transaction[]) {
  const monthlySumMap = Object.fromEntries(months.map((month) => [month, 0]));
  transactions.forEach((tx) => {
    const monthShort = tx.month ? tx.month.slice(0, 3) : months[new Date(tx.date).getMonth()];
    if (monthlySumMap[monthShort] !== undefined) monthlySumMap[monthShort] += Number(tx.amount || 0);
  });
  return months.slice(0, 8).map((month) => ({ month, totalSum: monthlySumMap[month] }));
}

function getDepartmentData(members: Member[]) {
  const counts = members.reduce<Record<string, number>>((acc, member) => {
    acc[member.department] = (acc[member.department] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function AdminDashboard(props: { members: Member[]; transactions: Transaction[]; meetings: MeetingSession[]; settings: OrgSettings; setPanel: (panel: Panel) => void }) {
  const totalMembers = props.members.length;
  const activeMembers = props.members.filter((member) => member.status === "Active").length;
  const totalDuesPaid = props.members.reduce((sum, member) => sum + member.duesPaid, 0);
  const totalDuesOwed = props.members.reduce((sum, member) => sum + member.duesOwed, 0);

  return (
    <div className="stack-page">
      <section className="console-hero dash-welcome-banner"><div><h2>Admin Overview & Analytics</h2><p>Real-time insights for member engagement, dues collections, and attendance.</p></div><div className="dash-banner-actions"><button type="button" onClick={() => props.setPanel("members")}><Plus size={16} />Manage Members</button><button type="button" onClick={() => props.setPanel("transactions")}><CreditCard size={16} />Dues Ledger</button></div></section>
      <section className="dash-metrics-grid metrics-grid">
        <Metric title="Total Directory Members" value={totalMembers.toString()} note={`${activeMembers} Active - ${totalMembers - activeMembers} Pending/Alumni`} icon={<Users />} />
        <Metric title="Total Dues Collected" value={`${props.settings.currency}${totalDuesPaid.toLocaleString()}`} note="+18.4% this year" icon={<DollarSign />} trend />
        <Metric title="Outstanding Dues" value={`${props.settings.currency}${totalDuesOwed.toLocaleString()}`} note={`${props.members.filter((m) => m.duesOwed > 0).length} members pending payment`} icon={<AlertCircle />} warning />
        <Metric title="Attendance Rate" value="91.6%" note={`${props.meetings.length} Recorded Meetings`} icon={<CalendarCheck />} />
      </section>
      <section className="overview-grid"><RevenueChart transactions={props.transactions} settings={props.settings} /><DepartmentChart data={getDepartmentData(props.members)} /></section>
      <TransactionsTable transactions={props.transactions.slice(0, 5)} settings={props.settings} />
    </div>
  );
}

function Metric({ title, value, note, icon, warning, trend }: { title: string; value: string; note: string; icon: React.ReactNode; warning?: boolean; trend?: boolean }) {
  return <article className="metric-card"><div><span>{title}</span><strong className={warning ? "metric-warning" : ""}>{value}</strong><small className={warning ? "warning" : ""}>{trend && <TrendingUp size={14} />}{note}</small></div><i>{icon}</i></article>;
}

function RevenueChart({ transactions, settings }: { transactions: Transaction[]; settings: OrgSettings }) {
  return (
    <article className="panel-card chart-card">
      <div className="card-title-row"><div><h3>Monthly Total Sum of All Recorded Transactions</h3><p>Visualizing total sum across dues, donations, levies, and event fees per month.</p></div><button type="button" className="text-chart-link">Full Analytics <ArrowUpRight size={16} /></button></div>
      <div className="recharts-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={getMonthlyData(transactions)}><defs><linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0e3d26" stopOpacity={0.4} /><stop offset="95%" stopColor="#0e3d26" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="month" stroke="#888" fontSize={12} /><YAxis stroke="#888" fontSize={12} /><Tooltip formatter={(value) => [`${settings.currency}${Number(value).toLocaleString()}`, "Total Sum"]} /><Area type="monotone" dataKey="totalSum" stroke="#0e3d26" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" /></AreaChart></ResponsiveContainer></div>
    </article>
  );
}

function DepartmentChart({ data }: { data: { name: string; value: number }[] }) {
  return <article className="panel-card departments-card"><h3>Departments</h3><p>Member distribution by unit</p><div className="pie-chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">{data.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></article>;
}

function MemberDirectory({ members, setMembers }: { members: Member[]; setMembers: (members: Member[]) => void }) {
  const [query, setQuery] = useState("");
  const filtered = members.filter((member) => [member.name, member.email, member.department, member.status].join(" ").toLowerCase().includes(query.toLowerCase()));

  function addMember() {
    const id = `m${members.length + 1}`;
    setMembers([...members, { id, memberCode: `UPUA-${String(members.length + 1).padStart(3, "0")}`, name: "New Member", email: `member${members.length + 1}@upua.org`, phone: "+1 (555) 010-0000", department: "Membership", role: "Member", status: "Pending", joinDate: "2026-09-23", duesOwed: 50, duesPaid: 0, avatar: "NM" }]);
  }

  return <section className="panel-card"><div className="table-toolbar"><div><h3>Member Directory</h3><p>Search, verify status, and manage chapter assignments.</p></div><div className="toolbar-actions"><label className="search-control"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search directory" /></label><button className="btn-primary" type="button" onClick={addMember}><Plus size={16} />Add Member</button></div></div><div className="responsive-table"><table><thead><tr><th>Member</th><th>Code</th><th>Department</th><th>Role</th><th>Status</th><th>Dues</th></tr></thead><tbody>{filtered.map((member) => <tr key={member.id}><td data-label="Member"><strong>{member.name}</strong><small>{member.email}</small></td><td data-label="Code">{member.memberCode}</td><td data-label="Department">{member.department}</td><td data-label="Role">{member.role}</td><td data-label="Status"><Badge value={member.status} /></td><td data-label="Dues"><strong>${member.duesPaid}</strong></td></tr>)}</tbody></table></div></section>;
}

function PivotView({ members }: { members: Member[] }) {
  return <section className="pivot-grid">{getDepartmentData(members).map((dept) => <article className="panel-card pivot-card" key={dept.name}><span>{dept.name}</span><strong>{dept.value}</strong><div><i style={{ width: `${Math.min(100, dept.value * 18)}%` }} /></div></article>)}</section>;
}

function TransactionsPage({ user, transactions, settings }: { user: User; transactions: Transaction[]; settings: OrgSettings }) {
  const filtered = user.role === "member" && user.memberId ? transactions.filter((tx) => tx.memberId === user.memberId) : transactions;
  return <TransactionsTable transactions={filtered} settings={settings} />;
}

function TransactionsTable({ transactions, settings }: { transactions: Transaction[]; settings: OrgSettings }) {
  return <section className="panel-card ledger-card"><div className="card-title-row"><div><h3>Recent Dues & Payment Ledger</h3><p>Latest transactions logged</p></div><button className="btn-outline" type="button">View All Ledger</button></div><div className="responsive-table"><table><thead><tr><th>Receipt / TXN</th><th>Member</th><th>Type</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead><tbody>{transactions.map((tx) => <tr key={tx.id}><td data-label="Receipt / TXN"><strong>{tx.receiptNumber}</strong></td><td data-label="Member">{tx.memberName}</td><td data-label="Type">{tx.type}</td><td data-label="Amount"><strong>{settings.currency}{tx.amount}</strong></td><td data-label="Method">{tx.paymentMethod}</td><td data-label="Date">{tx.date}</td><td data-label="Status"><Badge value={tx.status} /></td></tr>)}</tbody></table></div></section>;
}

function AnalyticsPage({ transactions, settings }: { transactions: Transaction[]; settings: OrgSettings }) {
  return <section className="stack-page"><RevenueChart transactions={transactions} settings={settings} /><TransactionsTable transactions={transactions} settings={settings} /></section>;
}

function MeetingRecorderPage({ members, meetings, setMeetings, user }: { members: Member[]; meetings: MeetingSession[]; setMeetings: (meetings: MeetingSession[]) => void; user: User }) {
  const [tab, setTab] = useState<RecorderTab>("attendance");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("[00:00] Waiting for meeting audio...");
  const activeMeeting = meetings[0];

  useEffect(() => {
    if (!recording) return;
    const lines = ["Chair welcomed chapter representatives and confirmed quorum.", "Treasurer reviewed dues, donations, and special levy collections.", "Members discussed medical outreach logistics and volunteer assignments.", "Secretary captured motions for convention planning follow-up."];
    let index = 0;
    const interval = window.setInterval(() => {
      const stamp = `00:${String((index + 1) * 4).padStart(2, "0")}`;
      setTranscript((current) => `${current}\n[${stamp}] ${lines[index % lines.length]}`);
      index += 1;
    }, 4000);
    return () => window.clearInterval(interval);
  }, [recording]);

  function saveRecording() {
    setMeetings([{ ...activeMeeting, id: `meet-${meetings.length + 1}`, title: "Recorded UPUA Meeting", date: "2026-09-23", status: "Completed", duration: "16m", transcript, audioUrl: "local-audio-session.webm" }, ...meetings]);
    setRecording(false);
  }

  function generateSummary() {
    setMeetings(meetings.map((meeting, index) => index === 0 ? { ...meeting, aiSummary: { executiveSummary: "The meeting confirmed program priorities, reviewed collection performance, and assigned operational follow-ups for chapter leaders.", actionItems: ["Publish dues reminder", "Confirm outreach volunteer roster", "Send convention logistics update"], motionsPassed: ["Motion passed to approve the outreach supply budget"] } } : meeting));
  }

  return <section className="stack-page recorder-page"><div className="panel-card"><div className="card-title-row"><div><h3>Meeting Tracker</h3><p>Attendance roll call, audio transcript, and AI executive summary.</p></div><Badge value={activeMeeting.status} /></div><div className="mtg-tab-bar"><button className={`mtg-tab-btn ${tab === "attendance" ? "active" : ""}`} type="button" onClick={() => setTab("attendance")}><Users size={18} />Attendance Roll Call</button><button className={`mtg-tab-btn ${tab === "transcript" ? "active" : ""}`} type="button" onClick={() => setTab("transcript")}><Mic size={18} />Audio & Speech Transcript</button><button className={`mtg-tab-btn ${tab === "summary" ? "active" : ""}`} type="button" onClick={() => setTab("summary")}><Sparkles size={18} />AI Executive Summary</button></div>{tab === "attendance" && <div className="attendance-grid">{members.map((member) => <article key={member.id}><span className="avatar-mini">{member.avatar}</span><div><strong>{member.name}</strong><small>{activeMeeting.attendanceRecords[member.id] ?? "Absent"}</small></div></article>)}</div>}{tab === "transcript" && <div className="transcript-panel"><div className="waveform">{Array.from({ length: 12 }).map((_, index) => <i key={index} style={{ height: recording ? `${10 + ((index * 7) % 25)}px` : "8px" }} />)}</div><pre>{transcript}</pre><div className="host-actions"><button type="button" onClick={() => setRecording(!recording)}>{recording ? <Pause size={16} /> : <Mic size={16} />}{recording ? "Pause Recording" : "Start Recording"}</button><button type="button" onClick={saveRecording}>Save Session</button></div></div>}{tab === "summary" && <div className="summary-panel"><button className="btn-primary" type="button" onClick={generateSummary}><Sparkles size={16} />Generate AI Summary Now</button>{meetings[0]?.aiSummary && <article><h4>Executive Summary</h4><p>{meetings[0].aiSummary.executiveSummary}</p><h4>Action Items</h4><ul>{meetings[0].aiSummary.actionItems.map((item) => <li key={item}>{item}</li>)}</ul><h4>Motions Passed</h4><ul>{meetings[0].aiSummary.motionsPassed.map((item) => <li key={item}>{item}</li>)}</ul></article>}</div>}</div>{user.role === "admin" && <button className={`mic-fab ${recording ? "recording" : ""}`} type="button" onClick={() => setRecording(!recording)} aria-label="Toggle microphone"><Mic size={24} /></button>}</section>;
}

function MeetingHostingPage({ user, members, schedule, setSchedule }: { user: User; members: Member[]; schedule: HostingScheduleItem[]; setSchedule: (schedule: HostingScheduleItem[]) => void }) {
  const [year, setYear] = useState(2026);
  const currentMember = members.find((member) => member.id === user.memberId);
  const ownHosting = currentMember ? schedule.find((item) => item.hostMemberId === currentMember.id && item.year === year) : undefined;

  function assignHost(item: HostingScheduleItem, memberId: string) {
    const member = members.find((candidate) => candidate.id === memberId);
    if (!member) return;
    setSchedule(schedule.map((slot) => slot.id === item.id ? { ...slot, hostMemberId: member.id, hostMemberName: member.name } : slot));
  }

  return <section className="stack-page">{ownHosting && <div className="celebration-banner">You are scheduled to host the meeting in {ownHosting.month}! Please coordinate venue and refreshment logistics.</div>}<div className="card-title-row"><div><h3>Monthly Meeting Hosting Schedule</h3><p>Assign monthly hosts and track chapter hospitality responsibilities.</p></div><div className="year-switcher"><button type="button" onClick={() => setYear(2025)}>2025</button><button className="active" type="button" onClick={() => setYear(2026)}>2026</button></div></div><div className="hosting-grid">{fullMonths.map((month) => { const item = schedule.find((slot) => slot.month === month && slot.year === year) ?? { id: month, year, month, hostMemberId: members[0]?.id ?? "", hostMemberName: members[0]?.name ?? "Unassigned", assignedDate: "" }; return <article className="panel-card host-month" key={month}><span>{month}</span><div className="host-person"><span className="avatar-mini">{item.hostMemberName.slice(0, 2).toUpperCase()}</span><div><strong>{item.hostMemberName}</strong><small>{members.find((member) => member.id === item.hostMemberId)?.phone ?? "No phone"}</small></div></div>{user.role === "admin" && <select value={item.hostMemberId} onChange={(event) => assignHost(item, event.target.value)}>{members.map((member) => <option value={member.id} key={member.id}>{member.name}</option>)}</select>}</article>; })}</div></section>;
}

function SettingsPage({ settings, setSettings }: { settings: OrgSettings; setSettings: (settings: OrgSettings) => void }) {
  return <section className="panel-card settings-card"><h3>Organization Settings</h3><label><span>Organization name</span><input value={settings.orgName} onChange={(event) => setSettings({ ...settings, orgName: event.target.value })} /></label><label><span>Contact email</span><input value={settings.contactEmail} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} /></label><label><span>Monthly dues</span><input type="number" value={settings.monthlyDues} onChange={(event) => setSettings({ ...settings, monthlyDues: Number(event.target.value) })} /></label><label><span>Allow member payments</span><input type="checkbox" checked={settings.allowMemberPayments} onChange={(event) => setSettings({ ...settings, allowMemberPayments: event.target.checked })} /></label><label><span>Notify on payment</span><input type="checkbox" checked={settings.notifyOnPayment} onChange={(event) => setSettings({ ...settings, notifyOnPayment: event.target.checked })} /></label></section>;
}

function MemberPortal({ user, members, transactions, meetings, settings }: { user: User; members: Member[]; transactions: Transaction[]; meetings: MeetingSession[]; settings: OrgSettings }) {
  const member = members.find((item) => item.id === user.memberId) ?? members[0];
  const myTransactions = transactions.filter((tx) => tx.memberId === member.id);
  return <section className="stack-page"><div className="console-hero"><div><h2>Welcome, {member.name}</h2><p>Review dues, meetings, hosting assignments, and account records.</p></div><div><button type="button"><CreditCard size={16} />Pay Dues</button></div></div><section className="metrics-grid"><Metric title="Dues Paid" value={`${settings.currency}${member.duesPaid}`} note="Current contribution history" icon={<DollarSign />} /><Metric title="Outstanding" value={`${settings.currency}${member.duesOwed}`} note="Remaining balance" icon={<AlertCircle />} warning={member.duesOwed > 0} /><Metric title="Meetings" value={meetings.length.toString()} note="Visible meeting records" icon={<CalendarCheck />} /><Metric title="Status" value={member.status} note={member.memberCode} icon={<CheckCircle2 />} /></section><TransactionsTable transactions={myTransactions} settings={settings} /></section>;
}

function AccountPage({ user, members }: { user: User; members: Member[] }) {
  const member = members.find((item) => item.id === user.memberId) ?? members[0];
  return <section className="panel-card account-card"><h3>My Account</h3><p>{member.name}</p><dl><div><dt>Email</dt><dd>{member.email}</dd></div><div><dt>Phone</dt><dd>{member.phone}</dd></div><div><dt>Department</dt><dd>{member.department}</dd></div><div><dt>Join Date</dt><dd>{member.joinDate}</dd></div></dl></section>;
}

function Badge({ value }: { value: string }) {
  const status = value.toLowerCase().replace(" ", "-");
  const badgeClass = status === "paid" || status === "active" || status === "completed" ? "badge-active" : status === "overdue" || status === "inactive" || status === "absent" ? "badge-overdue" : status === "pending" || status === "upcoming" ? "badge-pending" : status === "alumni" ? "badge-alumni" : "badge-active";
  return <span className={`badge ${badgeClass}`}>{value}</span>;
}
