import type { HostingScheduleItem, MeetingSession, Member, OrgSettings, Transaction, StoreItem } from "@/types";

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


export const seedStoreItems: StoreItem[] = [
  {
    id: "convention-bundle-2-tshirts",
    title: "Convention T-Shirt Duo (2 T-Shirts Bundle)",
    category: "Convention Packages",
    price: 35,
    image: "/store/bundle-2-tshirts.svg",
    badge: "Special Bundle",
    description:
      "Celebrate heritage and unity with the official UPUA (Urhobo Progress Union America) 2-T-Shirt convention bundle pack. Perfect for couples, families, and supporters, this premium bundle is specifically designed for the annual cultural convention and diaspora gatherings. Save with special bundle pricing.",
    features: [
      "2x Official UPUA Convention T-Shirts ($40 value for $35)",
      "Choice of Royal Blue, Emerald Green, or Crisp White",
      "100% premium combed ringspun cotton",
      "Official 2026 Convention graphics & emblems",
    ],
    options: [
      "Royal Blue + Emerald Green",
      "Royal Blue + Crisp White",
      "Emerald Green + Crisp White",
      "2x Royal Blue",
      "2x Emerald Green",
      "2x Crisp White",
    ],
    inStock: true,
  },
  {
    id: "convention-combo-pack-hat-shirt-mug",
    title: "Convention Heritage Combo Pack (1 Hat, 1 T-Shirt, 1 Mug)",
    category: "Convention Packages",
    price: 50,
    image: "/store/bundle-combo-pack.svg",
    badge: "Best Value",
    description:
      "Celebrate heritage and unity with the official UPUA (Urhobo Progress Union America) 3-piece convention combo pack. Includes 1 customized hat (bucket hat or face cap), 1 official convention T-shirt, and 1 ceramic commemorative mug ($50 bundle savings). Perfect for delegates, members, and supporters attending the annual cultural convention and diaspora gatherings.",
    features: [
      "1x UPUA Customized Bucket Hat or Face Cap",
      "1x Official UPUA 2026 Convention T-Shirt",
      "1x UPUA Commemorative Ceramic Mug",
      "Complete delegate keepsake bundle at discounted package pricing",
    ],
    options: [
      "Black Bucket Hat + Blue T-Shirt + White Mug",
      "White Bucket Hat + Green T-Shirt + Red Mug",
      "Black Face Cap + White T-Shirt + White Mug",
      "Blue Face Cap + Blue T-Shirt + Red Mug",
      "Black Bucket Hat + Green T-Shirt + White Mug",
      "Blue Face Cap + White T-Shirt + Red Mug",
    ],
    inStock: true,
  },
  {
    id: "convention-cultural-gala-ticket",
    title: "National Cultural Gala & Banquet Pass",
    category: "Convention Packages",
    price: 150,
    image: "/store/gala-ticket.svg",
    badge: "Royal Gala",
    description:
      "Celebrate heritage and unity at the Grand Cultural Gala Night & Royal Banquet of the 33rd Annual UPUA National Convention at DoubleTree by Hilton Lawrenceburg, IN. Features an authentic 3-course Urhobo banquet, royal dignitaries reception, keynote addresses, and rich cultural music & dance gala. Admission is $150 for Adults and $50 for Children (Ages 3-12; Ages 0-2 Free).",
    features: [
      "All-inclusive admission to Grand Banquet & Royal Gala (Sat, Sept 5, 2026)",
      "Adult Pass: $150 | Children (3-12 yrs): $50 | Under 2: Free",
      "Authentic 3-course Urhobo dinner buffet & beverages",
      "Live royal dance troupes, cultural music & royal awards presentation",
    ],
    options: [
      "Adult Pass - $150",
      "Child Pass (3-12 yrs) - $50",
    ],
    inStock: true,
  },
  {
    id: "convention-souvenir-brochure-advert",
    title: "Convention Souvenir Brochure (Advert)",
    category: "Convention Packages",
    price: 150,
    image: "/store/upua-convention-2026-brochure.jpg",
    badge: "Brochure Advert",
    description:
      "Celebrate heritage and unity by placing your goodwill message, business advertisement, memorial tribute, or family felicitations in the official 2026 UPUA Convention Souvenir Brochure. Distributed to 1,500+ diaspora delegates, royal dignitaries, and archived permanently in the digital compendium.",
    features: [
      "Official 2026 UPUA Convention Souvenir Magazine placement",
      "Distributed to 1,500+ diaspora delegates, royal dignitaries & guests",
      "Premium full-color glossy print & permanent digital edition archive",
      "Options: Outside Back Cover ($1,000), Center Spread ($600), Inside Covers ($500), Full Page ($150), Half Page ($100)",
    ],
    options: [
      "Inside Front Cover - $500",
      "Outside Back Cover - $1,000",
      "Inside Back Cover - $500",
      "Center Spread - $600",
      "Full Page - $150",
      "Half Page - $100",
    ],
    inStock: true,
  },
  {
    id: "convention-vendor-table-2026",
    title: "Convention Vendor Exhibition Table (2026)",
    category: "Convention Packages",
    price: 200,
    image: "/store/convention-booth.svg",
    badge: "Convention 2026",
    description:
      "Reserved 6-foot vendor table with 2 vendor passes and tablecloth at the 33rd Annual UPUA National Convention. Ideal for showcasing cultural clothing, art, jewelry, books, and business services.",
    features: [
      "1x 6ft exhibition table + 2 chairs",
      "2x Vendor attendee credential badges",
      "Listing in official convention souvenir directory",
      "Setup on Friday, Sept 4 through Sunday, Sept 6, 2026",
    ],
    inStock: true,
  },
  {
    id: "upua-ceremonial-sash-coral-set",
    title: "Official UPUA Ceremonial Sash & Coral Beads",
    category: "Apparel & Regalia",
    price: 65,
    image: "/store/regalia-sash-coral.svg",
    badge: "Handcrafted",
    description:
      "Authentic ceremonial attire kit featuring custom gold-embroidered UPUA satin sash accompanied by handcrafted polished royal red coral wrist beads.",
    features: [
      "Gold thread embroidered UPUA emblem and motto",
      "Natural polished coral bead bracelet",
      "Unisex fit for cultural festivals and meetings",
      "Protective velvet keepsake pouch included",
    ],
    options: ["Men's Cut", "Women's Cut"],
    inStock: true,
  },
  {
    id: "upua-heritage-crest-polo",
    title: "UPUA Heritage Crest Embroidered Polo Shirt",
    category: "Apparel & Regalia",
    price: 35,
    image: "/store/apparel-polo.svg",
    description:
      "Premium 100% combed ringspun cotton polo shirt featuring the detailed gold & emerald UPUA crest embroidery on the left chest with contrast sleeve trim.",
    features: [
      "100% breathable pique cotton fabric",
      "High-density embroidery crest that won't fade",
      "Available in Forest Green or Crisp White",
      "Pre-shrunk tailored fit",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL", "3XL"],
    inStock: true,
  },
  {
    id: "urhobo-comprehensive-dictionary-book",
    title: "Comprehensive Urhobo-English Cultural Dictionary",
    category: "Books & Culture",
    price: 45,
    image: "/store/book-dictionary.svg",
    badge: "Educational",
    description:
      "Authoritative illustrated language compendium and cultural reference guide designed for diaspora children, students, and families learning Urhobo grammar, idioms, and folklore.",
    features: [
      "Over 450 pages with phonetics & vocabulary guides",
      "Chapters on Urhobo history, clans, and kingdoms",
      "Common conversational proverbs & phrases translated",
      "Hardcover edition with ribbon bookmark",
    ],
    inStock: true,
  },
  {
    id: "upua-commemorative-lapel-pins",
    title: "UPUA Commemorative Gold Lapel Pin (Set of 2)",
    category: "Accessories",
    price: 20,
    image: "/store/accessory-lapel-pin.svg",
    description:
      "Polished hard-enamel and 24K gold-plated lapel badges featuring the official UPUA coat of arms. Perfect for suits, blazers, caps, and traditional agbada attire.",
    features: [
      "Set of 2 matching gold-plated pins",
      "Military clutch backing for secure wear",
      "Jewelry gift box presentation",
    ],
    inStock: true,
  },
  {
    id: "urhobo-desk-flag-stand",
    title: "Urhobo Ceremonial Desk Banner & Brass Stand",
    category: "Accessories",
    price: 25,
    image: "/store/accessory-desk-flag.svg",
    description:
      "Miniature embroidered Urhobo national banner mounted on an 11-inch solid polished brass stand. Ideal for executive desks, chapter meetings, and home displays.",
    features: [
      "Detailed embroidered colors & royal emblem",
      "Weighted brass base with anti-scratch bottom",
      "Dimensions: 4\" x 6\" silk flag, 11\" brass pole",
    ],
    inStock: true,
  },
  {
    id: "upuaya-youth-fleece-hoodie",
    title: "UPUAYA Next-Gen Heavyweight Fleece Hoodie",
    category: "Apparel & Regalia",
    price: 45,
    image: "/store/apparel-hoodie.svg",
    description:
      "Plush ultra-warm 350 GSM fleece hoodie featuring the modern UPUAYA Youth Wing graphic, double-lined hood, and matching drawstrings.",
    features: [
      "Super soft cotton-poly blend fleece",
      "Ribbed cuffs and waistband with kangaroo pocket",
      "Screen-printed with water-based durable inks",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL"],
    inStock: true,
  },
  {
    id: "upua-cap-blue",
    title: "UPUA Official Convention Face Cap (Blue)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/capblue.png",
    badge: "Convention 2026",
    description:
      "Celebrate heritage and unity with the official UPUA (Urhobo Progress Union America) customized blue face cap. Perfect for delegates, members, and supporters, this premium cap is specifically designed for the annual cultural convention and diaspora gatherings.",
    features: [
      "Embroidered UPUA crest on the front panel",
      "Adjustable snapback closure for universal fit",
      "Breathable cotton-poly fabric blend",
      "Ideal for convention, outdoor events, and everyday wear",
    ],
    options: ["One Size (Adjustable)"],
    inStock: true,
  },
  {
    id: "upua-cap-black",
    title: "UPUA Official Convention Face Cap (Black)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/capblack.png",
    badge: "Convention 2026",
    description:
      "Represent the Urhobo Progress Union America with pride in this sleek black customized face cap. Designed for the 2026 National Convention, this cap is a must-have keepsake for every member, delegate, and supporter at diaspora gatherings.",
    features: [
      "Embroidered UPUA crest on the front panel",
      "Adjustable snapback closure for universal fit",
      "Structured six-panel design with pre-curved brim",
      "Durable and lightweight for all-day comfort",
    ],
    options: ["One Size (Adjustable)"],
    inStock: true,
  },
  {
    id: "upua-hat-black",
    title: "UPUA Customized Bucket Hat (Black)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/hatblack.png",
    badge: "New",
    description:
      "Stay stylish and show your Urhobo pride with the official UPUA black bucket hat. Crafted for comfort and cultural expression, this customized hat is the perfect accessory for convention weekends, outdoor events, and Urhobo diaspora celebrations.",
    features: [
      "UPUA emblem embroidered on the front",
      "Wide brim for sun protection",
      "Soft cotton construction with inner sweatband",
      "Foldable and packable for travel convenience",
    ],
    options: ["One Size (Adjustable)"],
    inStock: true,
  },
  {
    id: "upua-hat-white",
    title: "UPUA Customized Bucket Hat (White)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/hatwhite.png",
    badge: "New",
    description:
      "Step into the 2026 UPUA National Convention in style with the official white bucket hat. A fresh, clean look perfect for delegates, youth members, and supporters who want to wear their heritage proudly at every cultural gathering.",
    features: [
      "UPUA emblem embroidered on the front",
      "Wide protective brim, soft and lightweight",
      "Breathable cotton fabric ideal for warm weather",
      "Available for all convention activities and outdoor events",
    ],
    options: ["One Size (Adjustable)"],
    inStock: true,
  },
  {
    id: "upua-mug-red",
    title: "UPUA Commemorative Convention Mug (Red)",
    category: "Accessories",
    price: 10,
    image: "/store/mugred.png",
    badge: "Convention 2026",
    description:
      "Start every morning with Urhobo pride using the official UPUA red commemorative mug. A beautifully customized keepsake from the 33rd Annual National Convention — perfect for home, office, or gifting to fellow members and supporters.",
    features: [
      "Official UPUA convention 2026 design",
      "11oz ceramic mug, dishwasher safe",
      "Bold, vibrant full-color print that won't fade",
      "Great as a convention souvenir or community gift",
    ],
    inStock: true,
  },
  {
    id: "upua-mug-white",
    title: "UPUA Commemorative Convention Mug (White)",
    category: "Accessories",
    price: 10,
    image: "/store/mugwhite.png",
    badge: "Convention 2026",
    description:
      "A timeless keepsake from the 33rd Annual UPUA National Convention — this classic white ceramic mug features the official UPUA emblem and convention graphics. Ideal for members, delegates, and supporters who want a lasting reminder of their Urhobo heritage.",
    features: [
      "Official UPUA convention 2026 design",
      "11oz ceramic mug, dishwasher safe",
      "Clean white finish with high-quality print",
      "Perfect convention souvenir or community gift",
    ],
    inStock: true,
  },
  {
    id: "upua-polo-4",
    title: "UPUA Official Convention Polo Shirt",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/polo4.png",
    badge: "Convention 2026",
    description:
      "Look sharp and represent the Urhobo Progress Union America in the official UPUA convention polo shirt. Designed for members, executives, and delegates, this premium polo combines comfort and cultural pride for convention sessions, cultural nights, and diaspora events.",
    features: [
      "UPUA emblem embroidered on the chest",
      "Moisture-wicking, breathable pique fabric",
      "Three-button placket with ribbed collar and cuffs",
      "Tailored fit suitable for formal and semi-formal occasions",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL", "3XL"],
    inStock: true,
  },
  {
    id: "upua-tshirt-blue",
    title: "UPUA Convention T-Shirt (Blue)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/tshirtblue.png",
    badge: "Convention 2026",
    description:
      "Wear your Urhobo heritage with pride in the official UPUA blue convention T-shirt. Crafted for comfort and cultural expression, this customized tee is the go-to apparel for convention sessions, cultural marches, and diaspora community events.",
    features: [
      "Official UPUA 2026 National Convention graphic print",
      "100% soft ringspun cotton, pre-shrunk",
      "Crew neck, short sleeve, classic unisex fit",
      "Machine washable with color-fast print",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL", "3XL"],
    inStock: true,
  },
  {
    id: "upua-tshirt-green",
    title: "UPUA Convention T-Shirt (Green)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/tshirtgreen.png",
    badge: "Convention 2026",
    description:
      "Celebrate culture, community, and unity in the official UPUA green convention T-shirt. The emerald green color reflects the Urhobo heritage and national pride, making it a standout piece at the 33rd Annual National Convention and all diaspora gatherings.",
    features: [
      "Official UPUA 2026 National Convention graphic print",
      "100% soft ringspun cotton, pre-shrunk",
      "Crew neck, short sleeve, relaxed unisex fit",
      "Machine washable with color-fast print",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL", "3XL"],
    inStock: true,
  },
  {
    id: "upua-tshirt-white",
    title: "UPUA Convention T-Shirt (White)",
    category: "Apparel & Regalia",
    price: 20,
    image: "/store/tshirtwhite.png",
    badge: "Convention 2026",
    description:
      "Clean, classic, and community-proud — the official UPUA white convention T-shirt is a must-have for every member attending the 33rd Annual National Convention. Lightweight and versatile, it pairs perfectly with traditional attire or casual convention wear.",
    features: [
      "Official UPUA 2026 National Convention graphic print",
      "100% soft ringspun cotton, pre-shrunk",
      "Crew neck, short sleeve, classic unisex fit",
      "Machine washable with color-fast print",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL", "3XL"],
    inStock: true,
  },
];

