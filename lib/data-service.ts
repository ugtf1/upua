// In-memory & Persistent Data Service for Urhobo Progress Union America (UPUA)
// Compatible with Prisma, SQLite, Google Cloud SQL, and Netlify Serverless deployments.

import { LIVE_CHAPTERS, getParsedQBTransactions, ChapterAuditData } from "./excel-live-data";

export interface ChapterData extends ChapterAuditData {
  paymentsBreakdown: {
    monthlyDues: number;
    donations: number;
    tickets: number;
    merchandise: number;
    total: number;
  };
}

export interface PaymentRecord {
  id: string;
  chapterId: string;
  chapterName: string;
  memberId?: string;
  memberName: string;
  category: "monthly_dues" | "donation" | "ticket" | "merchandise";
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  confirmationNo?: string;
  stripePaymentIntentId?: string;
  status: "completed" | "pending" | "failed";
}

export interface ExpenseRecord {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  approvedBy: string;
  vendor: string;
  status: "Approved" | "Paid" | "Pending";
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  chapterId?: string | null;
  chapterName: string;
  duration: string;
  recordedBy: string;
  audioBlobUrl?: string;
  transcript: string;
  summary: string;
  keyDecisions: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
}

export interface MemberRecord {
  id: string;
  chapterId: string;
  chapterName: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Lapsed";
  duesStatus: "Paid" | "Outstanding" | "Exempt";
  role: string;
  joinedDate: string;
}

// Official Live Dataset from UPUA Audit
const INITIAL_CHAPTERS: ChapterData[] = LIVE_CHAPTERS as ChapterData[];

const INITIAL_PAYMENTS: PaymentRecord[] = getParsedQBTransactions().map((tx) => ({
  id: tx.id,
  chapterId: tx.chapterId,
  chapterName: tx.chapterName,
  memberName: tx.customer,
  category: tx.category,
  amount: tx.amount,
  date: tx.date,
  description: tx.description,
  paymentMethod: tx.paymentMethod,
  confirmationNo: tx.confirmationNo,
  status: "completed",
}));

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: "exp-201",
    category: "Humanitarian Aid",
    amount: 8500,
    date: "2024-09-12",
    description: "Procurement of clean water filtration, bedding & food for Okuama IDPs",
    approvedBy: "Chief Samuel Ogaga (President)",
    vendor: "Delta Humanitarian Direct Support Services",
    status: "Paid",
  },
  {
    id: "exp-202",
    category: "Medical Supplies",
    amount: 6200,
    date: "2024-09-04",
    description: "Prescription antibiotics, hypertension medication & optical test kits",
    approvedBy: "Mr. Thomas Uwhubetine (BOT Chair)",
    vendor: "AfriMed Global Pharmaceutical Supplies",
    status: "Paid",
  },
  {
    id: "exp-203",
    category: "STEM & AI Lab",
    amount: 4500,
    date: "2024-08-25",
    description: "Donation of 15 desktop computer workstations & solar battery inverters",
    approvedBy: "Dr. Abel Okuma (Director of Research)",
    vendor: "TechEd Delta Systems Ltd.",
    status: "Paid",
  },
  {
    id: "exp-204",
    category: "Convention Logistics",
    amount: 12500,
    date: "2024-08-15",
    description: "National Convention hall rental, audiovisual broadcast & security",
    approvedBy: "Hon. Oghenetega JohnGold",
    vendor: "Metropolitan Civic Center & AV Guild",
    status: "Paid",
  },
  {
    id: "exp-205",
    category: "Youth Programs",
    amount: 2800,
    date: "2024-08-01",
    description: "UPUAYA collegiate mentorship portal & webinars streaming licenses",
    approvedBy: "Oghenekevwe Ajueyitsi (Youth President)",
    vendor: "CloudStream Digital Media",
    status: "Paid",
  },
];

const INITIAL_MEETINGS: MeetingRecord[] = [
  {
    id: "mtg-301",
    title: "UPUA National Board of Trustees Q3 2024 Executive Assembly",
    date: "2024-09-15",
    chapterId: null,
    chapterName: "National Executive Assembly",
    duration: "1h 42m",
    recordedBy: "Chief Godwin Ikporo (Secretary-General)",
    transcript:
      "President Chief Samuel Ogaga called the meeting to order at 2:00 PM EST with prayer and the Urhobo National Anthem. Chairman Thomas Uwhubetine outlined the strategic plan for transitioning UPUA into a permanent headquarters model. Discussion shifted to the Women in Shelter initiative report presented by Chief Mrs. Vivian Ikporo, highlighting participation across 16 chapters. The treasurer, Mr. Efe Shemi, delivered the Q3 financial report confirming total revenues of $426,850 with an operating surplus. On homeland affairs, the Board ratified an additional emergency grant of $15,000 for Okuama IDP rehabilitation. Next annual convention hosting proposals from Houston and Atlanta were tabled for committee review.",
    summary:
      "The Board ratified the 21st-century organizational roadmap, endorsed the nationwide Women in Shelter program expansion, approved financial audit statements, and appropriated $15,000 in emergency aid for Okuama IDP families.",
    keyDecisions: [
      "Approved $15,000 supplemental humanitarian appropriation for Okuama community rehabilitation",
      "Adopted the permanent national secretariat acquisition committee framework",
      "Mandated all 23 accredited chapters to conduct their annual financial reconciliations by November 30",
    ],
    actionItems: [
      { task: "Transmit emergency relief funds to on-ground monitors in Delta State", owner: "Chief Godwin Ikporo", deadline: "2024-09-22" },
      { task: "Prepare site inspection report for potential permanent headquarters locations", owner: "Mr. Thomas Uwhubetine", deadline: "2024-10-15" },
      { task: "Distribute audited Q3 financial ledgers to all chapter presidents", owner: "Mr. Efe Shemi", deadline: "2024-09-30" },
    ],
  },
  {
    id: "mtg-302",
    title: "Houston Chapter General Assembly & Annual Gala Planning",
    date: "2024-09-08",
    chapterId: "c-houston",
    chapterName: "UPA Houston",
    duration: "58m",
    recordedBy: "Chief Godspower Oniovosa",
    transcript:
      "Meeting convened at the UPA Community Center. President Oniovosa commended members on achieving 89% annual dues compliance. Committee chairs presented plans for the upcoming Urhobo Day Cultural Festival and fundraising gala. Discussion touched on local food bank drives and the recruitment of second-generation youth members into UPUAYA.",
    summary:
      "Reviewed high dues collection rate, finalized logistics for the October cultural banquet, and established a youth outreach taskforce.",
    keyDecisions: [
      "Set gala patron ticket prices at $100 and VIP tables at $1,000",
      "Assigned youth scholarship coordination to the educational committee",
    ],
    actionItems: [
      { task: "Finalize hall deposit and vendor agreements for banquet", owner: "Secretary, Houston Exco", deadline: "2024-09-25" },
    ],
  },
];

const INITIAL_MEMBERS: MemberRecord[] = LIVE_CHAPTERS.map((ch, idx) => ({
  id: `m-${ch.id}`,
  chapterId: ch.id,
  chapterName: ch.name,
  name: ch.president.replace(/\s*\(President\)/i, "").trim(),
  email: ch.contactEmail,
  phone: ch.contactPhone,
  status: "Active",
  duesStatus: ch.duesBalance >= 0 ? "Paid" : "Outstanding",
  role: "Chapter President",
  joinedDate: "2023-01-01",
}));

// In-Memory Storage Cache (persists for the session / serverless execution)
let chaptersCache: ChapterData[] = [...INITIAL_CHAPTERS];
let paymentsCache: PaymentRecord[] = [...INITIAL_PAYMENTS];
let expensesCache: ExpenseRecord[] = [...INITIAL_EXPENSES];
let meetingsCache: MeetingRecord[] = [...INITIAL_MEETINGS];
let membersCache: MemberRecord[] = [...INITIAL_MEMBERS];

export const DataService = {
  // General Overview
  getGeneralOverview() {
    const totalMembers = chaptersCache.reduce((sum, c) => sum + c.memberCount, 0);
    const totalChapters = chaptersCache.length;

    let totalMonthlyDues = 0;
    let totalDonations = 0;
    let totalTickets = 0;
    let totalMerchandise = 0;

    // Factor in recorded payments
    paymentsCache.forEach((p) => {
      if (p.category === "monthly_dues") totalMonthlyDues += p.amount;
      else if (p.category === "donation") totalDonations += p.amount;
      else if (p.category === "ticket") totalTickets += p.amount;
      else if (p.category === "merchandise") totalMerchandise += p.amount;
    });

    const totalIncome = totalMonthlyDues + totalDonations + totalTickets + totalMerchandise;
    const totalExpenses = expensesCache.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    return {
      totalMembers,
      totalChapters,
      totalIncome,
      totalExpenses,
      netBalance,
      incomeBreakdown: {
        monthlyDues: totalMonthlyDues,
        donations: totalDonations,
        tickets: totalTickets,
        merchandise: totalMerchandise,
      },
      recentPayments: paymentsCache.slice(0, 5),
      recentExpenses: expensesCache.slice(0, 5),
    };
  },

  // Chapters
  getChapters() {
    return chaptersCache;
  },

  getChapterById(id: string) {
    const chapter = chaptersCache.find((c) => c.id === id);
    if (!chapter) return null;
    const members = membersCache.filter((m) => m.chapterId === id);
    const payments = paymentsCache.filter((p) => p.chapterId === id);
    const meetings = meetingsCache.filter((m) => m.chapterId === id);
    return { ...chapter, members, payments, meetings };
  },

  addChapter(chapter: Partial<ChapterData> & Pick<ChapterData, "id" | "name" | "code" | "region" | "president" | "contactEmail" | "memberCount">) {
    const newChapter: ChapterData = {
      contactPhone: "",
      website: "",
      members2023: 0,
      dues2023Exp: 0,
      dues2023Paid: 0,
      members2024: 0,
      dues2024Exp: 0,
      dues2024Paid: 0,
      members2025: 0,
      dues2025Exp: 0,
      dues2025Paid: 0,
      members2026: 0,
      dues2026Exp: 0,
      dues2026Paid: 0,
      duesBalance: 0,
      insurance2023Paid: 0,
      insurance2024Paid: 0,
      insurance2025Paid: 0,
      insuranceTotal: 0,
      insuranceColonial: 0,
      raffleStatus: "Pending",
      raffleSent: 0,
      rafflePaid: 0,
      raffleBalance: 0,
      ...chapter,
      paymentsBreakdown: chapter.paymentsBreakdown || { monthlyDues: 0, donations: 0, tickets: 0, merchandise: 0, total: 0 },
    };
    chaptersCache.unshift(newChapter);
    return newChapter;
  },

  updateChapter(id: string, updates: Partial<ChapterData>) {
    const index = chaptersCache.findIndex((c) => c.id === id);
    if (index === -1) return null;
    chaptersCache[index] = { ...chaptersCache[index], ...updates };
    return chaptersCache[index];
  },

  deleteChapter(id: string) {
    chaptersCache = chaptersCache.filter((c) => c.id !== id);
    return true;
  },

  // Payments / Income
  getPayments(filters?: { chapterId?: string; category?: string; search?: string }) {
    let result = [...paymentsCache];
    if (filters?.chapterId) {
      result = result.filter((p) => p.chapterId === filters.chapterId);
    }
    if (filters?.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.memberName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.chapterName.toLowerCase().includes(q)
      );
    }
    return result;
  },

  addPayment(payment: Omit<PaymentRecord, "id">) {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    paymentsCache.unshift(newPayment);
    return newPayment;
  },

  updatePayment(id: string, updates: Partial<PaymentRecord>) {
    const index = paymentsCache.findIndex((p) => p.id === id);
    if (index === -1) return null;
    paymentsCache[index] = { ...paymentsCache[index], ...updates };
    return paymentsCache[index];
  },

  deletePayment(id: string) {
    paymentsCache = paymentsCache.filter((p) => p.id !== id);
    return true;
  },

  // Expenses
  getExpenses() {
    return expensesCache;
  },

  addExpense(expense: Omit<ExpenseRecord, "id">) {
    const newExpense: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    expensesCache.unshift(newExpense);
    return newExpense;
  },

  updateExpense(id: string, updates: Partial<ExpenseRecord>) {
    const index = expensesCache.findIndex((e) => e.id === id);
    if (index === -1) return null;
    expensesCache[index] = { ...expensesCache[index], ...updates };
    return expensesCache[index];
  },

  deleteExpense(id: string) {
    expensesCache = expensesCache.filter((e) => e.id !== id);
    return true;
  },

  // Meetings & AI Transcription
  getMeetings(chapterId?: string | null) {
    if (chapterId) {
      return meetingsCache.filter((m) => m.chapterId === chapterId || m.chapterId === null);
    }
    return meetingsCache;
  },

  addMeeting(meeting: Omit<MeetingRecord, "id">) {
    const newMeeting: MeetingRecord = {
      ...meeting,
      id: `mtg-${Date.now()}`,
    };
    meetingsCache.unshift(newMeeting);
    return newMeeting;
  },

  updateMeeting(id: string, updates: Partial<MeetingRecord>) {
    const index = meetingsCache.findIndex((m) => m.id === id);
    if (index === -1) return null;
    meetingsCache[index] = { ...meetingsCache[index], ...updates };
    return meetingsCache[index];
  },

  deleteMeeting(id: string) {
    meetingsCache = meetingsCache.filter((m) => m.id !== id);
    return true;
  },

  // Members
  getMembers(chapterId?: string) {
    if (chapterId) {
      return membersCache.filter((m) => m.chapterId === chapterId);
    }
    return membersCache;
  },

  addMember(member: Omit<MemberRecord, "id">) {
    const newMember: MemberRecord = {
      ...member,
      id: `m-${Date.now()}`,
    };
    membersCache.unshift(newMember);
    return newMember;
  },

  updateMember(id: string, updates: Partial<MemberRecord>) {
    const index = membersCache.findIndex((m) => m.id === id);
    if (index === -1) return null;
    membersCache[index] = { ...membersCache[index], ...updates };
    return membersCache[index];
  },

  deleteMember(id: string) {
    membersCache = membersCache.filter((m) => m.id !== id);
    return true;
  },
};
