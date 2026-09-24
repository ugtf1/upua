export type MemberStatus = "Active" | "Pending" | "Past due" | "Alumni";

export type Member = {
  id: string;
  name: string;
  email: string;
  chapter: string;
  department: string;
  role: string;
  status: MemberStatus;
  dues: number;
  lastSeen: string;
};

export type LedgerEntry = {
  receipt: string;
  member: string;
  type: "Dues" | "Donation" | "Levy" | "Event Fee";
  amount: number;
  method: "Bank Transfer" | "Card" | "Mobile Money" | "Check";
  date: string;
  status: "Paid" | "Overdue" | "Pending";
};

export const members: Member[] = [
  {
    id: "m-001",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    chapter: "California",
    department: "Medical Outreach",
    role: "Chapter Treasurer",
    status: "Active",
    dues: 500,
    lastSeen: "2026-09-18"
  },
  {
    id: "m-002",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    chapter: "Texas",
    department: "Youth & STEM",
    role: "Member",
    status: "Active",
    dues: 50,
    lastSeen: "2026-09-17"
  },
  {
    id: "m-003",
    name: "Amara Okafor",
    email: "amara.okafor@example.com",
    chapter: "Georgia",
    department: "Scholarships",
    role: "Program Lead",
    status: "Active",
    dues: 500,
    lastSeen: "2026-09-14"
  },
  {
    id: "m-004",
    name: "David Chen",
    email: "david.chen@example.com",
    chapter: "DMV",
    department: "Membership",
    role: "Member",
    status: "Past due",
    dues: 50,
    lastSeen: "2026-08-29"
  },
  {
    id: "m-005",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    chapter: "New York",
    department: "Fundraising",
    role: "Donor",
    status: "Pending",
    dues: 250,
    lastSeen: "2026-09-08"
  },
  {
    id: "m-006",
    name: "Ovie Mukoro",
    email: "ovie.mukoro@example.com",
    chapter: "Midwest",
    department: "Culture",
    role: "Chapter President",
    status: "Active",
    dues: 500,
    lastSeen: "2026-09-21"
  }
];

export const ledger: LedgerEntry[] = [
  {
    receipt: "RCP-2026-001",
    member: "Sarah Jenkins",
    type: "Dues",
    amount: 500,
    method: "Bank Transfer",
    date: "2026-01-10",
    status: "Paid"
  },
  {
    receipt: "RCP-2026-082",
    member: "Alex Morgan",
    type: "Dues",
    amount: 50,
    method: "Mobile Money",
    date: "2026-08-01",
    status: "Paid"
  },
  {
    receipt: "RCP-2026-005",
    member: "Amara Okafor",
    type: "Dues",
    amount: 500,
    method: "Card",
    date: "2026-01-15",
    status: "Paid"
  },
  {
    receipt: "RCP-2026-071",
    member: "David Chen",
    type: "Dues",
    amount: 50,
    method: "Mobile Money",
    date: "2026-07-01",
    status: "Overdue"
  },
  {
    receipt: "RCP-2026-064",
    member: "Maria Garcia",
    type: "Donation",
    amount: 250,
    method: "Card",
    date: "2026-06-20",
    status: "Paid"
  }
];

export const monthlyTransactions = [
  { month: "Jan", value: 1000 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 340 },
  { month: "Apr", value: 580 },
  { month: "May", value: 920 },
  { month: "Jun", value: 480 },
  { month: "Jul", value: 710 },
  { month: "Aug", value: 610 }
];

export const departments = [
  { name: "Medical Outreach", value: 34 },
  { name: "Scholarships", value: 22 },
  { name: "Fundraising", value: 18 },
  { name: "Culture", value: 14 },
  { name: "Membership", value: 12 }
];
