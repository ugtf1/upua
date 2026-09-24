// In-memory & Persistent Data Service for Urhobo Progress Union America (UPUA)
// Compatible with Prisma, SQLite, Google Cloud SQL, and Netlify Serverless deployments.

export interface ChapterData {
  id: string;
  name: string;
  code: string;
  region: string;
  president: string;
  contactEmail: string;
  memberCount: number;
  website?: string;
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
  paymentMethod: "stripe" | "card" | "bank_transfer";
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

// Initial Seed Dataset for UPUA
const INITIAL_CHAPTERS: ChapterData[] = [
  {
    id: "c-houston",
    name: "Urhobo Progressive Association (UPA), Houston",
    code: "HOUSTON",
    region: "Texas / South",
    president: "Chief Godspower Oniovosa",
    contactEmail: "houston@upuamerica.org",
    memberCount: 245,
    website: "https://upahouston.org/",
    paymentsBreakdown: { monthlyDues: 29400, donations: 18500, tickets: 12250, merchandise: 3400, total: 63550 },
  },
  {
    id: "c-dmv",
    name: "UPU of DC, Maryland & Virginia (UPUDMV)",
    code: "DMV",
    region: "Mid-Atlantic",
    president: "Chief Paul Otu",
    contactEmail: "dmv@upuamerica.org",
    memberCount: 210,
    website: "https://upudmv.org/",
    paymentsBreakdown: { monthlyDues: 25200, donations: 22000, tickets: 10500, merchandise: 4100, total: 61800 },
  },
  {
    id: "c-chicago",
    name: "UPU Chicagoland (UPUC)",
    code: "CHICAGOLAND",
    region: "Midwest",
    president: "Dr. Bernard Rerri",
    contactEmail: "chicago@upuamerica.org",
    memberCount: 160,
    paymentsBreakdown: { monthlyDues: 19200, donations: 14000, tickets: 8000, merchandise: 2800, total: 44000 },
  },
  {
    id: "c-socal",
    name: "UPU of Southern California (UPUSC)",
    code: "SOCAL",
    region: "West Coast",
    president: "Mr. Felix Agbabune",
    contactEmail: "socal@upuamerica.org",
    memberCount: 175,
    paymentsBreakdown: { monthlyDues: 21000, donations: 16500, tickets: 8750, merchandise: 3200, total: 49450 },
  },
  {
    id: "c-georgia",
    name: "Urhobo Association of Georgia (UAG)",
    code: "GEORGIA",
    region: "Southeast",
    president: "Mr. Thomas Uwhubetine",
    contactEmail: "georgia@upuamerica.org",
    memberCount: 190,
    paymentsBreakdown: { monthlyDues: 22800, donations: 19500, tickets: 9500, merchandise: 3600, total: 55400 },
  },
  {
    id: "c-delaware",
    name: "UPU Delaware Valley (PA, DE, NJ)",
    code: "DELAWARE_VALLEY",
    region: "Northeast",
    president: "Engr. Akpovoke Shaire",
    contactEmail: "delaware@upuamerica.org",
    memberCount: 130,
    paymentsBreakdown: { monthlyDues: 15600, donations: 11000, tickets: 6500, merchandise: 2100, total: 35200 },
  },
  {
    id: "c-ohio",
    name: "UPU of Ohio",
    code: "OHIO",
    region: "Midwest",
    president: "Chief (Dr) Mrs. Louisa Ukochovwera",
    contactEmail: "ohio@upuamerica.org",
    memberCount: 115,
    paymentsBreakdown: { monthlyDues: 13800, donations: 9500, tickets: 5750, merchandise: 1900, total: 30950 },
  },
  {
    id: "c-michigan",
    name: "UPU Michigan (UPUMI)",
    code: "MICHIGAN",
    region: "Midwest",
    president: "Mr. Paul Edirin Warrence",
    contactEmail: "michigan@upuamerica.org",
    memberCount: 95,
    paymentsBreakdown: { monthlyDues: 11400, donations: 8500, tickets: 4750, merchandise: 1500, total: 26150 },
  },
  {
    id: "c-minnesota",
    name: "UPU of Minnesota (UPUM)",
    code: "MINNESOTA",
    region: "Midwest",
    president: "Mrs. Ejiro Egi",
    contactEmail: "minnesota@upuamerica.org",
    memberCount: 105,
    website: "http://upumn.org/",
    paymentsBreakdown: { monthlyDues: 12600, donations: 9000, tickets: 5250, merchandise: 1700, total: 28550 },
  },
  {
    id: "c-calgary",
    name: "UPU of Calgary, Canada",
    code: "CALGARY",
    region: "Canada",
    president: "Dr. Harrison Itoje",
    contactEmail: "calgary@upuamerica.org",
    memberCount: 120,
    website: "https://urhoboisokocalgary.ca/",
    paymentsBreakdown: { monthlyDues: 14400, donations: 10500, tickets: 6000, merchandise: 2200, total: 33100 },
  },
  {
    id: "c-edmonton",
    name: "UIA of Edmonton, Canada",
    code: "EDMONTON",
    region: "Canada",
    president: "Chief Dr. Onome Ugbawa",
    contactEmail: "edmonton@upuamerica.org",
    memberCount: 85,
    paymentsBreakdown: { monthlyDues: 10200, donations: 7500, tickets: 4250, merchandise: 1400, total: 23350 },
  },
  {
    id: "c-tennessee",
    name: "Urhobo Association of Middle Tennessee",
    code: "TENNESSEE",
    region: "Southeast",
    president: "Mr. Jacob Akpoyovware",
    contactEmail: "tennessee@upuamerica.org",
    memberCount: 90,
    paymentsBreakdown: { monthlyDues: 10800, donations: 8000, tickets: 4500, merchandise: 1600, total: 24900 },
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-101",
    chapterId: "c-houston",
    chapterName: "UPA Houston",
    memberName: "Chief Godspower Oniovosa",
    category: "monthly_dues",
    amount: 120,
    date: "2024-09-18",
    description: "Q3 2024 Chapter Monthly Dues Contribution",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqX9eLkdIwHu7ix0482Bv8K",
    status: "completed",
  },
  {
    id: "pay-102",
    chapterId: "c-dmv",
    chapterName: "UPUDMV",
    memberName: "Chief Paul Otu",
    category: "donation",
    amount: 500,
    date: "2024-09-15",
    description: "Women in Shelter Initiative Hygiene Drive Grant",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqZ1wLkdIwHu7ix0912Xq2M",
    status: "completed",
  },
  {
    id: "pay-103",
    chapterId: "c-houston",
    chapterName: "UPA Houston",
    memberName: "Mrs. Evelyn Obire-Egbe",
    category: "donation",
    amount: 250,
    date: "2024-09-14",
    description: "Okuama Displaced Families Emergency Medical Fund",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqA8bLkdIwHu7ix0823Yn9P",
    status: "completed",
  },
  {
    id: "pay-104",
    chapterId: "c-georgia",
    chapterName: "UAG Georgia",
    memberName: "Mr. Thomas Uwhubetine",
    category: "ticket",
    amount: 350,
    date: "2024-09-10",
    description: "Annual Convention Banquet VIP Patron Table",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqM5mLkdIwHu7ix0741Kl6L",
    status: "completed",
  },
  {
    id: "pay-105",
    chapterId: "c-chicago",
    chapterName: "UPU Chicagoland",
    memberName: "Dr. Bernard Rerri",
    category: "merchandise",
    amount: 85,
    date: "2024-09-08",
    description: "UPUA Royal Heritage Woven Shawl & Lapel Pin Set",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqB2vLkdIwHu7ix0319Nm4R",
    status: "completed",
  },
  {
    id: "pay-106",
    chapterId: "c-socal",
    chapterName: "UPU Southern California",
    memberName: "Mr. Felix Agbabune",
    category: "monthly_dues",
    amount: 100,
    date: "2024-09-05",
    description: "September Chapter Membership Dues",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqC9kLkdIwHu7ix0115Za7W",
    status: "completed",
  },
  {
    id: "pay-107",
    chapterId: "c-ohio",
    chapterName: "UPU Ohio",
    memberName: "Favour Okotie",
    category: "ticket",
    amount: 150,
    date: "2024-09-02",
    description: "Youth Wing Leadership Summit Delegate Registration",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqD4yLkdIwHu7ix0664Vx3B",
    status: "completed",
  },
  {
    id: "pay-108",
    chapterId: "c-calgary",
    chapterName: "UPU Calgary",
    memberName: "Dr. Harrison Itoje",
    category: "donation",
    amount: 1000,
    date: "2024-08-28",
    description: "Delta State Secondary School STEM Lab Digital Equipment",
    paymentMethod: "stripe",
    stripePaymentIntentId: "pi_3PqE7xLkdIwHu7ix0991Qw5C",
    status: "completed",
  },
];

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

const INITIAL_MEMBERS: MemberRecord[] = [
  { id: "m-1", chapterId: "c-houston", chapterName: "UPA Houston", name: "Chief Godspower Oniovosa", email: "g.oniovosa@upahouston.org", phone: "(713) 555-0192", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2008-04-12" },
  { id: "m-2", chapterId: "c-houston", chapterName: "UPA Houston", name: "Mrs. Evelyn Obire-Egbe", email: "evelyn.obire@upua.org", phone: "(713) 555-0144", status: "Active", duesStatus: "Paid", role: "National Director", joinedDate: "2012-06-20" },
  { id: "m-3", chapterId: "c-dmv", chapterName: "UPUDMV", name: "Chief Paul Otu", email: "paul.otu@upudmv.org", phone: "(202) 555-0176", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2006-11-15" },
  { id: "m-4", chapterId: "c-dmv", chapterName: "UPUDMV", name: "Oghenekevwe Ajueyitsi", email: "kevwe.a@upuaya.org", phone: "(202) 555-0188", status: "Active", duesStatus: "Paid", role: "Youth Wing President", joinedDate: "2021-02-10" },
  { id: "m-5", chapterId: "c-georgia", chapterName: "UAG Georgia", name: "Mr. Thomas Uwhubetine", email: "t.uwhubetine@upuamerica.org", phone: "(404) 555-0133", status: "Active", duesStatus: "Paid", role: "BOT Chairman", joinedDate: "2003-12-05" },
  { id: "m-6", chapterId: "c-chicago", chapterName: "UPU Chicagoland", name: "Dr. Bernard Rerri", email: "b.rerri@upuc.org", phone: "(312) 555-0155", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2010-09-14" },
  { id: "m-7", chapterId: "c-socal", chapterName: "UPU Southern California", name: "Mr. Felix Agbabune", email: "felix.a@upusocal.org", phone: "(213) 555-0122", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2014-03-18" },
  { id: "m-8", chapterId: "c-ohio", chapterName: "UPU Ohio", name: "Chief (Dr) Mrs. Louisa Ukochovwera", email: "louisa.u@upuohio.org", phone: "(614) 555-0167", status: "Active", duesStatus: "Paid", role: "Deputy BOT Chair", joinedDate: "2009-08-25" },
];

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

    chaptersCache.forEach((c) => {
      totalMonthlyDues += c.paymentsBreakdown.monthlyDues;
      totalDonations += c.paymentsBreakdown.donations;
      totalTickets += c.paymentsBreakdown.tickets;
      totalMerchandise += c.paymentsBreakdown.merchandise;
    });

    // Also factor in dynamic recorded payments
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

  addChapter(chapter: Omit<ChapterData, "paymentsBreakdown">) {
    const newChapter: ChapterData = {
      ...chapter,
      paymentsBreakdown: { monthlyDues: 0, donations: 0, tickets: 0, merchandise: 0, total: 0 },
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
