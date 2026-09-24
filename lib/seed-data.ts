import type { HostingScheduleItem, MeetingSession, Member, OrgSettings, Transaction } from "@/types";

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const seedMembers: Member[] = [
  {
    id: "m1",
    memberCode: "UPUA-001",
    name: "Sarah Jenkins",
    email: "sarah@upua.org",
    phone: "+1 (310) 555-0181",
    department: "Medical Outreach",
    role: "Chapter Treasurer",
    status: "Active",
    joinDate: "2024-02-14",
    duesOwed: 0,
    duesPaid: 500,
    avatar: "SJ",
    address: "California, USA"
  },
  {
    id: "m2",
    memberCode: "UPUA-002",
    name: "Alex Morgan",
    email: "alex@upua.org",
    phone: "+1 (713) 555-0194",
    department: "Youth & STEM",
    role: "Member",
    status: "Active",
    joinDate: "2025-06-02",
    duesOwed: 0,
    duesPaid: 50,
    avatar: "AM",
    address: "Texas, USA"
  },
  {
    id: "m3",
    memberCode: "UPUA-003",
    name: "Amara Okafor",
    email: "amara@upua.org",
    phone: "+1 (404) 555-0128",
    department: "Scholarships",
    role: "Program Lead",
    status: "Active",
    joinDate: "2023-09-10",
    duesOwed: 0,
    duesPaid: 500,
    avatar: "AO",
    address: "Georgia, USA"
  },
  {
    id: "m4",
    memberCode: "UPUA-004",
    name: "David Chen",
    email: "david@upua.org",
    phone: "+1 (202) 555-0150",
    department: "Membership",
    role: "Member",
    status: "Pending",
    joinDate: "2026-08-01",
    duesOwed: 50,
    duesPaid: 0,
    avatar: "DC",
    address: "DMV, USA"
  },
  {
    id: "m5",
    memberCode: "UPUA-005",
    name: "Maria Garcia",
    email: "maria@upua.org",
    phone: "+1 (212) 555-0112",
    department: "Fundraising",
    role: "Donor",
    status: "Alumni",
    joinDate: "2020-03-22",
    duesOwed: 0,
    duesPaid: 250,
    avatar: "MG",
    address: "New York, USA"
  },
  {
    id: "m6",
    memberCode: "UPUA-006",
    name: "Ovie Mukoro",
    email: "ovie@upua.org",
    phone: "+1 (312) 555-0133",
    department: "Culture",
    role: "Chapter President",
    status: "Active",
    joinDate: "2021-11-08",
    duesOwed: 0,
    duesPaid: 500,
    avatar: "OM",
    address: "Midwest, USA"
  }
];

export const seedTransactions: Transaction[] = [
  { id: "t1", transactionId: "TXN-001", memberId: "m1", memberName: "Sarah Jenkins", type: "Dues", amount: 500, status: "Paid", paymentMethod: "Bank Transfer", date: "2026-01-10", month: "January", year: 2026, receiptNumber: "RCP-2026-001" },
  { id: "t2", transactionId: "TXN-082", memberId: "m2", memberName: "Alex Morgan", type: "Dues", amount: 50, status: "Paid", paymentMethod: "Mobile Money", date: "2026-08-01", month: "August", year: 2026, receiptNumber: "RCP-2026-082" },
  { id: "t3", transactionId: "TXN-005", memberId: "m3", memberName: "Amara Okafor", type: "Dues", amount: 500, status: "Paid", paymentMethod: "Card", date: "2026-01-15", month: "January", year: 2026, receiptNumber: "RCP-2026-005" },
  { id: "t4", transactionId: "TXN-071", memberId: "m4", memberName: "David Chen", type: "Dues", amount: 50, status: "Overdue", paymentMethod: "Mobile Money", date: "2026-07-01", month: "July", year: 2026, receiptNumber: "RCP-2026-071" },
  { id: "t5", transactionId: "TXN-064", memberId: "m5", memberName: "Maria Garcia", type: "Donation", amount: 250, status: "Paid", paymentMethod: "Card", date: "2026-06-20", month: "June", year: 2026, receiptNumber: "RCP-2026-064" },
  { id: "t6", transactionId: "TXN-044", memberId: "m6", memberName: "Ovie Mukoro", type: "Special Levy", amount: 400, status: "Paid", paymentMethod: "Cash", date: "2026-05-15", month: "May", year: 2026, receiptNumber: "RCP-2026-044" },
  { id: "t7", transactionId: "TXN-038", memberId: "m1", memberName: "Sarah Jenkins", type: "Event Fee", amount: 120, status: "Paid", paymentMethod: "Card", date: "2026-04-13", month: "April", year: 2026, receiptNumber: "RCP-2026-038" }
];

export const seedMeetings: MeetingSession[] = [
  {
    id: "meet-1",
    title: "Executive Council Meeting",
    date: "2026-09-28",
    time: "7:00 PM",
    location: "Zoom",
    totalMembers: 6,
    presentCount: 4,
    absentCount: 1,
    excusedCount: 1,
    status: "Upcoming",
    attendanceRecords: { m1: "Present", m2: "Present", m3: "Present", m4: "Absent", m5: "Excused", m6: "Present" }
  },
  {
    id: "meet-2",
    title: "Convention Planning Session",
    date: "2026-10-16",
    time: "6:30 PM",
    location: "Atlanta, GA",
    totalMembers: 6,
    presentCount: 5,
    absentCount: 1,
    excusedCount: 0,
    status: "Completed",
    duration: "52m",
    transcript: "[00:00] Chair opened the planning session.\n[00:04] Members reviewed convention logistics and hospitality assignments.",
    attendanceRecords: { m1: "Present", m2: "Present", m3: "Present", m4: "Absent", m5: "Present", m6: "Present" },
    aiSummary: {
      executiveSummary: "The convention committee reviewed registration, hotel coordination, and cultural programming. Members agreed to publish a final logistics update to all chapters.",
      actionItems: ["Confirm hotel block by October 1", "Publish volunteer roster", "Send registration reminder to chapter presidents"],
      motionsPassed: ["Motion passed to approve the convention hospitality budget"]
    }
  }
];

export const seedHostingSchedule: HostingScheduleItem[] = fullMonths.map((month, index) => {
  const member = seedMembers[index % seedMembers.length];
  return {
    id: `host-${index + 1}`,
    year: 2026,
    month,
    hostMemberId: member.id,
    hostMemberName: member.name,
    assignedDate: `2026-${String(index + 1).padStart(2, "0")}-15`,
    notes: index % 3 === 0 ? "Coordinate venue and refreshments." : undefined
  };
});

export const seedSettings: OrgSettings = {
  orgName: "Urhobo Progress Union America",
  orgTagline: "Culture, unity, service, and progress",
  monthlyDues: 50,
  annualDues: 500,
  currency: "$",
  allowMemberPayments: true,
  notifyOnPayment: true,
  contactEmail: "info@upua.org",
  contactPhone: "+1 (555) 010-2026"
};
