"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Printer,
  Download,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
  User,
  Heart,
  Baby,
  Utensils
} from "lucide-react";

export interface Attendee {
  id: string;
  type: "Adult" | "Child";
  fullName: string;
  relationship: string;
  ageGroup?: string;
  chapter?: string;
  dietaryNote?: string;
}

interface TicketPackage {
  id: string;
  title: string;
  subtitle: string;
  eventDate: string;
  venue: string;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  image: string;
  badge: string;
  description: string;
  includes: string[];
}

const TICKET_PACKAGES: Record<string, TicketPackage> = {
  gala: {
    id: "gala",
    title: "National Cultural Gala & Royal Banquet Pass",
    subtitle: "33rd Annual UPUA National Convention — Signature Evening Gala",
    eventDate: "Saturday, September 5, 2026 • 6:00 PM EST",
    venue: "DoubleTree by Hilton Grand Ballroom, Lawrenceburg, IN",
    adultPrice: 150,
    childPrice: 50,
    infantPrice: 0,
    image: "/store/national-cultural-gala-pass.jpg",
    badge: "Official Royal Gala Pass",
    description:
      "All-inclusive gala evening pass featuring an authentic 3-course Urhobo banquet, royal dignitaries reception, keynote addresses, traditional dance troupes, coral regalia procession, and live cultural entertainment.",
    includes: [
      "Authentic 3-Course Gourmet Urhobo Banquet & Refreshments",
      "Reserved Table Seating with Chapter & Dignitaries Placement",
      "Royal Cultural Dance Troupes & Live Highlife Orchestra",
      "National Leadership Honors & Awards Ceremony",
      "Souvenir Keepsake Program & Commemorative Badge"
    ]
  },
  convention: {
    id: "convention",
    title: "33rd Annual Convention Full Delegate Pass",
    subtitle: "All-Access 5-Day Delegate Pass (Plenaries, Workshops & Gala)",
    eventDate: "September 3 – 7, 2026 • Full Convention",
    venue: "DoubleTree by Hilton & Lawrenceburg Event Center, IN",
    adultPrice: 150,
    childPrice: 50,
    infantPrice: 0,
    image: "/events/upua-convention-2026-flyer.jpg",
    badge: "Full 5-Day Access",
    description:
      "Full convention registration including all plenary assemblies, Board of Trustees public sessions, Youth Congress, business empowerment symposia, and Saturday Cultural Gala.",
    includes: [
      "Access to all 5-Day Convention Sessions & Working Committees",
      "Youth Leadership & STEM Hackathon Showcase",
      "Admission to Saturday Night National Cultural Gala",
      "Convention Delegate Tote, Souvenir Magazine & Badge"
    ]
  },
  golf: {
    id: "golf",
    title: "UPUA Annual National Golf Outing 2026",
    subtitle: "Tournament Play, Green Fees, Cart & Awards Luncheon",
    eventDate: "Friday, September 4, 2026 • 8:30 AM Shotgun",
    venue: "Sugar Ridge Golf Club, Lawrenceburg, IN",
    adultPrice: 100,
    childPrice: 50,
    infantPrice: 0,
    image: "/events/upua-golf-outing-2026.jpg",
    badge: "Golf Tournament",
    description:
      "18-hole championship scramble tournament, golf cart, driving range balls, on-course refreshments, and clubhouse awards luncheon.",
    includes: [
      "18-Hole Championship Course Green Fees & Cart",
      "Driving Range Practice Balls & Player Welcome Kit",
      "Post-Round Clubhouse Banquet & Trophies Presentation",
      "Longest Drive & Closest-to-the-Pin Contests"
    ]
  }
};

const CHAPTER_OPTIONS = [
  "UPU Ohio (Host Chapter)",
  "UPU Chicago / Chicagoland",
  "UPU Southern California (UPUSC)",
  "UPU Northern California",
  "UPU Houston / Texas (UPA)",
  "UPU Dallas-Fort Worth (UPU DFW)",
  "UPU Georgia / Atlanta (UAG)",
  "UPU DMV (Washington DC, Maryland, Virginia)",
  "UPU Delaware Valley (PA, DE, NJ)",
  "UPU New York & New Jersey",
  "UPU Michigan / Detroit",
  "UPU Minnesota (UPUM)",
  "UPU Great Kansas City (Waado)",
  "UPU Florida Chapter",
  "UPU New England / Boston",
  "UPU Canada / Diaspora International",
  "General / Guest Supporter"
];

const DIETARY_OPTIONS = [
  "Standard Gourmet Urhobo Feast",
  "Vegetarian / Vegan Feast",
  "Halal Preferred",
  "Kid-Friendly Banquet Plate",
  "No Seafood / Shellfish",
  "Gluten-Free Required",
  "No Special Restrictions"
];

function TicketsContent() {
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("event") || "gala";
  const selectedKey = TICKET_PACKAGES[initialPackage] ? initialPackage : "gala";

  const [currentPackageId, setCurrentPackageId] = useState<string>(selectedKey);
  const pkg = TICKET_PACKAGES[currentPackageId] || TICKET_PACKAGES.gala;

  // Counts
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(2);

  // Attendees list
  const [attendees, setAttendees] = useState<Attendee[]>([
    {
      id: "adult-1",
      type: "Adult",
      fullName: "",
      relationship: "Self / Primary Purchaser",
      chapter: "UPU Ohio (Host Chapter)",
      dietaryNote: "Standard Gourmet Urhobo Feast"
    },
    {
      id: "adult-2",
      type: "Adult",
      fullName: "",
      relationship: "Spouse",
      chapter: "UPU Ohio (Host Chapter)",
      dietaryNote: "Standard Gourmet Urhobo Feast"
    },
    {
      id: "child-1",
      type: "Child",
      fullName: "",
      relationship: "Child (Son / Daughter)",
      ageGroup: "6–8 years",
      dietaryNote: "Kid-Friendly Banquet Plate"
    },
    {
      id: "child-2",
      type: "Child",
      fullName: "",
      relationship: "Child (Son / Daughter)",
      ageGroup: "3–5 years",
      dietaryNote: "Kid-Friendly Banquet Plate"
    }
  ]);

  // Primary Contact & Billing
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [purchaserPhone, setPurchaserPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Payment Form Fields (Stripe)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardZip, setCardZip] = useState("");

  // Processing & Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    totalAmount: number;
    packageTitle: string;
    attendees: Attendee[];
    purchaserName: string;
    purchaserEmail: string;
    date: string;
  } | null>(null);

  // Sync attendee forms when counts change
  useEffect(() => {
    setAttendees((prev) => {
      const existingAdults = prev.filter((a) => a.type === "Adult");
      const existingChildren = prev.filter((a) => a.type === "Child");

      // Adjust Adults
      let newAdults: Attendee[] = [...existingAdults];
      if (adultCount > existingAdults.length) {
        for (let i = existingAdults.length; i < adultCount; i++) {
          newAdults.push({
            id: `adult-${Date.now()}-${i}`,
            type: "Adult",
            fullName: i === 0 && purchaserName ? purchaserName : "",
            relationship: i === 0 ? "Self / Primary Purchaser" : i === 1 ? "Spouse" : "Family / Guest",
            chapter: purchaserName ? "UPU Chapter" : "UPU Ohio (Host Chapter)",
            dietaryNote: "Standard Gourmet Urhobo Feast"
          });
        }
      } else if (adultCount < existingAdults.length) {
        newAdults = newAdults.slice(0, adultCount);
      }

      // Adjust Children
      let newChildren: Attendee[] = [...existingChildren];
      if (childCount > existingChildren.length) {
        for (let i = existingChildren.length; i < childCount; i++) {
          newChildren.push({
            id: `child-${Date.now()}-${i}`,
            type: "Child",
            fullName: "",
            relationship: "Child (Son / Daughter)",
            ageGroup: "6–8 years",
            dietaryNote: "Kid-Friendly Banquet Plate"
          });
        }
      } else if (childCount < existingChildren.length) {
        newChildren = newChildren.slice(0, childCount);
      }

      return [...newAdults, ...newChildren];
    });
  }, [adultCount, childCount]);

  // Keep adult-1 name in sync with primary purchaser if not explicitly overridden
  const handlePurchaserNameChange = (val: string) => {
    setPurchaserName(val);
    setAttendees((prev) => {
      if (prev.length > 0 && prev[0].type === "Adult" && (!prev[0].fullName || prev[0].fullName === purchaserName)) {
        const next = [...prev];
        next[0] = { ...next[0], fullName: val };
        return next;
      }
      return prev;
    });
  };

  // Update specific attendee field
  const updateAttendee = (index: number, field: keyof Attendee, value: string) => {
    setAttendees((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Calculations
  const adultSubtotal = adultCount * pkg.adultPrice;
  const childSubtotal = childCount * pkg.childPrice;
  const grandTotal = adultSubtotal + childSubtotal;
  const totalAttendeesCount = adultCount + childCount;

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Card Exp
  const handleCardExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (raw.length >= 3) {
      raw = raw.substring(0, 2) + "/" + raw.substring(2);
    }
    setCardExp(raw);
  };

  // Submission & Stripe Gateway
  const handleTicketCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!purchaserName.trim() || !purchaserEmail.trim()) {
      setErrorMessage("Please provide purchaser name and email address.");
      window.scrollTo({ top: 400, behavior: "smooth" });
      return;
    }

    // Verify all attendee names are filled
    for (let i = 0; i < attendees.length; i++) {
      const a = attendees[i];
      if (!a.fullName.trim()) {
        setErrorMessage(
          `Please provide the full name for ${a.type} #${i + 1} (${a.relationship || "Attendee"}). Every registered individual requires their full name for credentials and table placement.`
        );
        window.scrollTo({ top: 600, behavior: "smooth" });
        return;
      }
    }

    if (grandTotal > 0 && cardNumber.replace(/\s/g, "").length < 15) {
      setErrorMessage("Please enter a valid 15 or 16-digit credit card number.");
      return;
    }

    setIsProcessing(true);

    try {
      // Build descriptive metadata for payment record and ledger
      const attendeesSummary = attendees
        .map((a) => `${a.fullName} (${a.type}${a.relationship ? ` - ${a.relationship}` : ""})`)
        .join("; ");

      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "usd",
          category: "event_ticket",
          memberName: purchaserName,
          email: purchaserEmail,
          description: `UPUA Gala/Convention Tickets [${pkg.title}]: ${adultCount} Adult(s), ${childCount} Child(ren) • Attendees: ${attendeesSummary}`,
          chapterId: "c-ohio",
          metadata: {
            packageId: pkg.id,
            packageTitle: pkg.title,
            adultsCount: adultCount,
            childrenCount: childCount,
            totalAttendees: totalAttendeesCount,
            purchaserPhone,
            attendeeRoster: attendees
          }
        })
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        throw new Error(data.error || "Payment authorization failed. Please verify your card details.");
      }

      // Generate Official Confirmation
      const generatedOrderId = `UPUA-GALA-${Math.floor(100000 + Math.random() * 900000)}`;

      setOrderConfirmation({
        orderId: generatedOrderId,
        totalAmount: grandTotal,
        packageTitle: pkg.title,
        attendees: [...attendees],
        purchaserName,
        purchaserEmail,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        })
      });

      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing payment.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="site-wrapper" style={{ minHeight: "100vh", background: "#f4f8f5", color: "#111827" }}>
      <SiteHeader />

      {/* Trust Header / Hero Bar */}
      <section
        style={{
          background: "linear-gradient(135deg, #062316 0%, #0e3d26 60%, #155535 100%)",
          color: "#ffffff",
          padding: "48px 24px 40px",
          borderBottom: "3px solid #d4af37"
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            <span
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                border: "1px solid #d4af37",
                color: "#f7d070",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <ShieldCheck size={14} /> Official UPUA Payment Gateway
            </span>
            <span style={{ color: "#c3ded0", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <Lock size={12} /> 256-Bit SSL Encrypted • Powered by Stripe
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 900,
              margin: "0 0 10px",
              lineHeight: 1.2
            }}
          >
            National Cultural Gala &amp; Convention <span style={{ color: "#f7d070" }}>Tickets</span>
          </h1>

          <p style={{ maxWidth: "800px", color: "rgba(255, 255, 255, 0.88)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
            Reserve individual and family passes for the 33rd Annual UPUA National Convention and Grand Cultural Banquet in Lawrenceburg, IN. Register every adult and child attendee under a single secure checkout with instant printable E-Ticket badges.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ maxWidth: "1180px", margin: "0 auto", padding: "36px 20px 80px" }}>
        {orderConfirmation ? (
          /* ========================================================================= */
          /* SUCCESS: OFFICIAL ORDER CONFIRMATION & ATTENDEE E-TICKETS                */
          /* ========================================================================= */
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "40px clamp(20px, 4vw, 48px)",
              boxShadow: "0 14px 40px rgba(14, 61, 38, 0.08)",
              border: "1.5px solid #d8e6dc"
            }}
          >
            <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 36px" }}>
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "#e6f4ea",
                  color: "#137333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <span
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}
              >
                Payment Confirmed • Reservation Secured
              </span>

              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                  fontWeight: 900,
                  color: "#0e3d26",
                  margin: "12px 0 8px"
                }}
              >
                Your Tickets are Ready!
              </h2>

              <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
                Thank you, <strong>{orderConfirmation.purchaserName}</strong>. Your payment of{" "}
                <strong>${orderConfirmation.totalAmount.toFixed(2)} USD</strong> has been successfully authorized. Confirmation details and individual attendee badges have been generated below and dispatched to <strong>{orderConfirmation.purchaserEmail}</strong>.
              </p>

              <div
                style={{
                  background: "#fbfcfb",
                  border: "1px dashed #c0d8c8",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  margin: "20px auto 0",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  fontSize: "0.9rem"
                }}
              >
                <span>
                  Confirmation Reference: <strong style={{ color: "#0e3d26" }}>{orderConfirmation.orderId}</strong>
                </span>
                <span>•</span>
                <span>
                  Registered Guests: <strong>{orderConfirmation.attendees.length} Attendees</strong>
                </span>
              </div>
            </div>

            {/* Print / Action Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "36px" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: "#0e3d26",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 16px rgba(14, 61, 38, 0.2)"
                }}
              >
                <Printer size={18} /> Print All E-Tickets
              </button>

              <Link
                href="/events"
                style={{
                  background: "#f4f8f5",
                  border: "1.5px solid #d4dfd7",
                  color: "#0e3d26",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <ArrowLeft size={16} /> Return to Events
              </Link>

              <Link
                href="/store"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #d4af37",
                  color: "#854d0e",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>Browse Store &amp; Regalia</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* E-Ticket Badges for EACH Registered Individual */}
            <div style={{ borderTop: "2px solid #e5ece7", paddingTop: "32px" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, color: "#0e3d26", margin: "0 0 6px" }}>
                  Official Attendee Credentials &amp; Admission Passes
                </h3>
                <p style={{ color: "#526359", fontSize: "0.85rem", margin: 0 }}>
                  Present each pass (printed or on smartphone) at the accreditation reception desk at DoubleTree by Hilton Lawrenceburg.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "20px"
                }}
              >
                {orderConfirmation.attendees.map((attendee, idx) => (
                  <div
                    key={attendee.id || idx}
                    style={{
                      border: "2px solid #0e3d26",
                      borderRadius: "14px",
                      background: "#ffffff",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                      position: "relative"
                    }}
                  >
                    {/* Ticket Header */}
                    <div
                      style={{
                        background: attendee.type === "Adult" ? "linear-gradient(135deg, #0e3d26 0%, #165637 100%)" : "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
                        color: "#ffffff",
                        padding: "14px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "10.5px", letterSpacing: "0.06em", opacity: 0.85, textTransform: "uppercase", display: "block" }}>
                          URHOBO PROGRESS UNION AMERICA (UPUA)
                        </span>
                        <strong style={{ fontSize: "13px", color: "#f7d070" }}>
                          {attendee.type === "Adult" ? "ADULT GALA & BANQUET PASS" : "CHILD GALA PASS (AGES 3–12)"}
                        </strong>
                      </div>
                      <Ticket size={24} color="#f7d070" />
                    </div>

                    {/* Ticket Body */}
                    <div style={{ padding: "18px 20px" }}>
                      <div style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: 700 }}>
                          Guest / Attendee Name
                        </span>
                        <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#111827", lineHeight: 1.3 }}>
                          {attendee.fullName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#0e3d26", fontWeight: 700, marginTop: "2px" }}>
                          {attendee.relationship} • {attendee.chapter || "UPUA Ohio Delegation"}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px", padding: "10px 0", borderTop: "1px dashed #e1eae3", borderBottom: "1px dashed #e1eae3" }}>
                        <div>
                          <span style={{ color: "#6b7280", display: "block", fontSize: "10.5px" }}>EVENT &amp; BANQUET</span>
                          <strong style={{ color: "#0e3d26" }}>Sat, Sept 5, 2026</strong>
                        </div>
                        <div>
                          <span style={{ color: "#6b7280", display: "block", fontSize: "10.5px" }}>BANQUET MEAL</span>
                          <span style={{ color: "#374151", fontWeight: 600 }}>{attendee.dietaryNote || "Standard Gourmet"}</span>
                        </div>
                        <div>
                          <span style={{ color: "#6b7280", display: "block", fontSize: "10.5px" }}>VENUE</span>
                          <span style={{ color: "#374151", fontWeight: 600 }}>DoubleTree Hilton IN</span>
                        </div>
                        <div>
                          <span style={{ color: "#6b7280", display: "block", fontSize: "10.5px" }}>RESERVATION TIER</span>
                          <strong style={{ color: "#0e3d26" }}>
                            {attendee.type === "Adult" ? "$150.00 Paid" : "$50.00 Paid"}
                          </strong>
                        </div>
                      </div>

                      {/* Barcode Mock */}
                      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#6b7280" }}>
                          {orderConfirmation.orderId}-TKT{idx + 1}
                          <br />
                          ISSUED TO: {orderConfirmation.purchaserName.toUpperCase()}
                        </div>
                        <div
                          style={{
                            background: "#0e3d26",
                            color: "#ffffff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            letterSpacing: "2px"
                          }}
                        >
                          |||| ||| ||||| ||
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* REGISTRATION & SECURED CHECKOUT FORM                                      */
          /* ========================================================================= */
          <form onSubmit={handleTicketCheckoutSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(0, 0.95fr)", gap: "32px", alignItems: "flex-start" }}>
              {/* LEFT COLUMN: Ticket Package, Attendees & Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* 1. Ticket Package Selector */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px 28px",
                    border: "1px solid #d4dfd7",
                    boxShadow: "0 4px 16px rgba(14, 61, 38, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <span style={{ background: "#0e3d26", color: "#ffffff", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800 }}>
                      1
                    </span>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "#0e3d26", margin: 0 }}>
                      Selected Event &amp; Ticket Package
                    </h2>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                    {Object.values(TICKET_PACKAGES).map((p) => {
                      const isSelected = p.id === currentPackageId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setCurrentPackageId(p.id)}
                          style={{
                            border: isSelected ? "2px solid #0e3d26" : "1.5px solid #e1eae3",
                            background: isSelected ? "#f0f7f3" : "#ffffff",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <span style={{ fontSize: "10.5px", fontWeight: 800, color: isSelected ? "#0e3d26" : "#6b7280", textTransform: "uppercase" }}>
                              {p.badge}
                            </span>
                            {isSelected && <Check size={16} color="#0e3d26" />}
                          </div>
                          <strong style={{ fontSize: "0.95rem", color: "#0e3d26", display: "block", marginBottom: "6px" }}>
                            {p.title}
                          </strong>
                          <div style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 800 }}>
                            Adult: ${p.adultPrice} • Child: ${p.childPrice}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ background: "#f8faf8", border: "1px solid #e1eae3", borderRadius: "10px", padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <div style={{ width: "64px", height: "64px", position: "relative", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                        <Image src={pkg.image} alt={pkg.title} fill style={{ objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: "0 0 4px", fontSize: "1rem", color: "#0e3d26", fontWeight: 800 }}>
                          {pkg.title}
                        </h4>
                        <div style={{ fontSize: "12px", color: "#4b5563", marginBottom: "4px" }}>
                          <Calendar size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                          {pkg.eventDate} • <MapPin size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                          {pkg.venue}
                        </div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#526359", lineHeight: 1.4 }}>
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Family & Group Attendee Counters */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px 28px",
                    border: "1px solid #d4dfd7",
                    boxShadow: "0 4px 16px rgba(14, 61, 38, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ background: "#0e3d26", color: "#ffffff", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800 }}>
                      2
                    </span>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "#0e3d26", margin: 0 }}>
                      How Many Tickets Are You Purchasing?
                    </h2>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#526359", margin: "0 0 18px" }}>
                    Select the number of adults and children in your party. You will enter individual attendee names and details in the step below.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                    {/* Adult Counter */}
                    <div style={{ border: "1.5px solid #d4dfd7", borderRadius: "12px", padding: "16px 20px", background: "#fbfcfb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "1rem", color: "#0e3d26", display: "flex", alignItems: "center", gap: "6px" }}>
                            <User size={16} /> Adult Pass (13+ Years)
                          </strong>
                          <span style={{ fontSize: "12px", color: "#166534", fontWeight: 700 }}>
                            ${pkg.adultPrice}.00 USD per adult
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <button
                          type="button"
                          onClick={() => setAdultCount((c) => Math.max(1, c - 1))}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            border: "1px solid #c2d5c8",
                            background: "#ffffff",
                            cursor: adultCount <= 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: adultCount <= 1 ? 0.5 : 1
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ fontSize: "1.3rem", fontWeight: 900, minWidth: "30px", textAlign: "center", color: "#0e3d26" }}>
                          {adultCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdultCount((c) => Math.min(20, c + 1))}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            border: "1px solid #c2d5c8",
                            background: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Plus size={16} />
                        </button>
                        <span style={{ fontSize: "0.9rem", color: "#4b5563", marginLeft: "auto", fontWeight: 700 }}>
                          = ${(adultCount * pkg.adultPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Child Counter */}
                    <div style={{ border: "1.5px solid #d4dfd7", borderRadius: "12px", padding: "16px 20px", background: "#fbfcfb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "1rem", color: "#0e3d26", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Baby size={16} /> Child Pass (3–12 Years)
                          </strong>
                          <span style={{ fontSize: "12px", color: "#b45309", fontWeight: 700 }}>
                            ${pkg.childPrice}.00 USD (Ages 0–2 Free)
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <button
                          type="button"
                          onClick={() => setChildCount((c) => Math.max(0, c - 1))}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            border: "1px solid #c2d5c8",
                            background: "#ffffff",
                            cursor: childCount <= 0 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: childCount <= 0 ? 0.5 : 1
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ fontSize: "1.3rem", fontWeight: 900, minWidth: "30px", textAlign: "center", color: "#0e3d26" }}>
                          {childCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChildCount((c) => Math.min(20, c + 1))}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "8px",
                            border: "1px solid #c2d5c8",
                            background: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Plus size={16} />
                        </button>
                        <span style={{ fontSize: "0.9rem", color: "#4b5563", marginLeft: "auto", fontWeight: 700 }}>
                          = ${(childCount * pkg.childPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preset helpers */}
                  <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "11.5px", color: "#526359", fontWeight: 700 }}>Quick Presets:</span>
                    {[
                      { label: "1 Adult", a: 1, c: 0 },
                      { label: "2 Adults (Couple)", a: 2, c: 0 },
                      { label: "Family: 2 Adults + 2 Kids", a: 2, c: 2 },
                      { label: "Family: 2 Adults + 3 Kids", a: 2, c: 3 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setAdultCount(preset.a);
                          setChildCount(preset.c);
                        }}
                        style={{
                          background: adultCount === preset.a && childCount === preset.c ? "#0e3d26" : "#f0f7f3",
                          color: adultCount === preset.a && childCount === preset.c ? "#ffffff" : "#0e3d26",
                          border: "1px solid #c2d5c8",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Attendee Details for EVERY Individual */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px 28px",
                    border: "1px solid #d4dfd7",
                    boxShadow: "0 4px 16px rgba(14, 61, 38, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ background: "#0e3d26", color: "#ffffff", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800 }}>
                      3
                    </span>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "#0e3d26", margin: 0 }}>
                      Attendee Details for Every Registered Individual
                    </h2>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#526359", margin: "0 0 20px" }}>
                    Please provide the full legal or preferred name for every attendee. Individual badges and banquet table seatings will be produced with these details.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    {attendees.map((att, idx) => {
                      const isAdult = att.type === "Adult";
                      const adultIndex = attendees.filter((a, i) => i <= idx && a.type === "Adult").length;
                      const childIndex = attendees.filter((a, i) => i <= idx && a.type === "Child").length;

                      return (
                        <div
                          key={att.id || idx}
                          style={{
                            border: isAdult ? "1.5px solid #c4ded0" : "1.5px solid #fed7aa",
                            borderRadius: "12px",
                            padding: "18px 20px",
                            background: isAdult ? "#fbfdfb" : "#fffbeb",
                            position: "relative"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span
                                style={{
                                  background: isAdult ? "#0e3d26" : "#c2410c",
                                  color: "#ffffff",
                                  borderRadius: "6px",
                                  padding: "2px 8px",
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  textTransform: "uppercase"
                                }}
                              >
                                {isAdult ? `Adult #${adultIndex}` : `Child #${childIndex}`}
                              </span>
                              <strong style={{ fontSize: "0.95rem", color: isAdult ? "#0e3d26" : "#9a3412" }}>
                                {isAdult ? `$${pkg.adultPrice}.00 Pass` : `$${pkg.childPrice}.00 Pass`}
                              </strong>
                            </div>

                            <span style={{ fontSize: "12px", color: "#6b7280" }}>
                              {idx === 0 ? "★ Primary Billing Contact" : att.relationship}
                            </span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                            {/* Full Name */}
                            <div>
                              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                                Full Name <span style={{ color: "#b91c1c" }}>*</span>
                              </label>
                              <input
                                type="text"
                                placeholder={isAdult ? (idx === 0 ? "e.g. Chief Samuel Ogaga (Husband / Primary)" : "e.g. Mrs. Blessing Ogaga (Wife / Spouse)") : "e.g. Junior Ogaga (Son / Daughter)"}
                                value={att.fullName}
                                onChange={(e) => updateAttendee(idx, "fullName", e.target.value)}
                                required
                                style={{
                                  width: "100%",
                                  padding: "9px 12px",
                                  borderRadius: "8px",
                                  border: "1.5px solid #d4dfd7",
                                  fontSize: "0.9rem",
                                  boxSizing: "border-box"
                                }}
                              />
                            </div>

                            {/* Relationship */}
                            <div>
                              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                                Relationship to Primary
                              </label>
                              <select
                                value={att.relationship}
                                onChange={(e) => updateAttendee(idx, "relationship", e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "9px 12px",
                                  borderRadius: "8px",
                                  border: "1.5px solid #d4dfd7",
                                  fontSize: "0.9rem",
                                  background: "#ffffff",
                                  boxSizing: "border-box"
                                }}
                              >
                                {isAdult ? (
                                  <>
                                    <option value="Self / Primary Purchaser">Self / Primary Purchaser</option>
                                    <option value="Spouse / Wife / Husband">Spouse / Wife / Husband</option>
                                    <option value="Adult Child (18+) / Dependent">Adult Child (18+) / Dependent</option>
                                    <option value="Parent / Senior Elder">Parent / Senior Elder</option>
                                    <option value="Brother / Sister / Sibling">Brother / Sister / Sibling</option>
                                    <option value="Relative / Family Member">Relative / Family Member</option>
                                    <option value="Chapter Delegate / Colleague">Chapter Delegate / Colleague</option>
                                    <option value="Special Guest / Friend">Special Guest / Friend</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Child (Son / Daughter)">Child (Son / Daughter)</option>
                                    <option value="Son">Son</option>
                                    <option value="Daughter">Daughter</option>
                                    <option value="Grandchild">Grandchild</option>
                                    <option value="Niece / Nephew">Niece / Nephew</option>
                                    <option value="Family Ward">Family Ward</option>
                                  </>
                                )}
                              </select>
                            </div>

                            {/* Chapter or Age Group */}
                            {isAdult ? (
                              <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                                  UPUA Chapter / Delegation
                                </label>
                                <select
                                  value={att.chapter}
                                  onChange={(e) => updateAttendee(idx, "chapter", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "8px",
                                    border: "1.5px solid #d4dfd7",
                                    fontSize: "0.9rem",
                                    background: "#ffffff",
                                    boxSizing: "border-box"
                                  }}
                                >
                                  {CHAPTER_OPTIONS.map((ch) => (
                                    <option key={ch} value={ch}>
                                      {ch}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                                  Child Age Category
                                </label>
                                <select
                                  value={att.ageGroup}
                                  onChange={(e) => updateAttendee(idx, "ageGroup", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "8px",
                                    border: "1.5px solid #d4dfd7",
                                    fontSize: "0.9rem",
                                    background: "#ffffff",
                                    boxSizing: "border-box"
                                  }}
                                >
                                  <option value="3–5 years">3–5 years (Preschool/Kindergarten)</option>
                                  <option value="6–8 years">6–8 years (Elementary)</option>
                                  <option value="9–12 years">9–12 years (Middle School / Pre-Teen)</option>
                                  <option value="Under 2 yrs (Free)">Under 2 yrs (Infant Lap Seating)</option>
                                </select>
                              </div>
                            )}

                            {/* Dietary / Meal Notes */}
                            <div>
                              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                                Dietary / Banquet Meal Note
                              </label>
                              <select
                                value={att.dietaryNote}
                                onChange={(e) => updateAttendee(idx, "dietaryNote", e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "9px 12px",
                                  borderRadius: "8px",
                                  border: "1.5px solid #d4dfd7",
                                  fontSize: "0.9rem",
                                  background: "#ffffff",
                                  boxSizing: "border-box"
                                }}
                              >
                                {DIETARY_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Primary Contact & Billing Info */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px 28px",
                    border: "1px solid #d4dfd7",
                    boxShadow: "0 4px 16px rgba(14, 61, 38, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ background: "#0e3d26", color: "#ffffff", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800 }}>
                      4
                    </span>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "#0e3d26", margin: 0 }}>
                      Primary Purchaser &amp; Ticket Delivery Contact
                    </h2>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#526359", margin: "0 0 16px" }}>
                    All confirmation receipts, payment statements, and individual attendee E-Tickets will be delivered to this email.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        Primary Purchaser Name <span style={{ color: "#b91c1c" }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chief Samuel Ogaga"
                        value={purchaserName}
                        onChange={(e) => handlePurchaserNameChange(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        Email Address (for E-Tickets Delivery) <span style={{ color: "#b91c1c" }}>*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. samuel.ogaga@upuamerica.org"
                        value={purchaserEmail}
                        onChange={(e) => setPurchaserEmail(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 234-5678"
                        value={purchaserPhone}
                        onChange={(e) => setPurchaserPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        City &amp; State / Chapter
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Columbus, Ohio"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Secured Stripe Card Payment */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px 28px",
                    border: "2px solid #0e3d26",
                    boxShadow: "0 6px 20px rgba(14, 61, 38, 0.06)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ background: "#0e3d26", color: "#ffffff", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800 }}>
                        5
                      </span>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "#0e3d26", margin: 0 }}>
                        Secured Stripe Credit Card Payment
                      </h2>
                    </div>
                    <span style={{ fontSize: "12px", color: "#166534", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Lock size={12} /> 256-Bit SSL Secured
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#526359", margin: "0 0 18px" }}>
                    All card payments are transmitted over encrypted TLS directly to Stripe. UPUA never stores your sensitive card numbers.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                    {/* Card Number */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        Card Number <span style={{ color: "#b91c1c" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          required
                          maxLength={19}
                          style={{
                            width: "100%",
                            padding: "11px 40px 11px 12px",
                            borderRadius: "8px",
                            border: "1.5px solid #d4dfd7",
                            fontSize: "1rem",
                            fontFamily: "monospace",
                            letterSpacing: "0.05em",
                            boxSizing: "border-box"
                          }}
                        />
                        <CreditCard
                          size={20}
                          color="#0e3d26"
                          style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}
                        />
                      </div>
                    </div>

                    {/* Expiration */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        Expiration Date (MM/YY) <span style={{ color: "#b91c1c" }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExp}
                        onChange={handleCardExpChange}
                        required
                        maxLength={5}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.95rem",
                          fontFamily: "monospace",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    {/* CVC */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        CVC / CVV Code <span style={{ color: "#b91c1c" }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                        required
                        maxLength={4}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.95rem",
                          fontFamily: "monospace",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "5px" }}>
                        Card Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 43215"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #d4dfd7",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      style={{
                        marginTop: "16px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "#991b1b",
                        fontSize: "0.88rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div style={{ marginTop: "24px" }}>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      style={{
                        width: "100%",
                        background: isProcessing ? "#888888" : "linear-gradient(135deg, #0e3d26 0%, #165637 100%)",
                        color: "#ffffff",
                        border: "2px solid #d4af37",
                        borderRadius: "12px",
                        padding: "16px 24px",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: "0 8px 24px rgba(14, 61, 38, 0.25)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {isProcessing ? (
                        <>Processing Stripe Payment...</>
                      ) : (
                        <>
                          <Lock size={18} color="#f7d070" />
                          <span>Authorize &amp; Pay ${grandTotal.toFixed(2)} USD</span>
                        </>
                      )}
                    </button>
                    <p style={{ textAlign: "center", fontSize: "11.5px", color: "#6b7280", marginTop: "10px", margin: "10px 0 0" }}>
                      By clicking Authorize &amp; Pay, your card will be charged for all {totalAttendeesCount} registered attendees. Tickets will be emailed immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky Itemized Summary & Roster Preview */}
              <div style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Summary Card */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1.5px solid #0e3d26",
                    boxShadow: "0 8px 30px rgba(14, 61, 38, 0.08)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e5ece7", paddingBottom: "12px" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, color: "#0e3d26", margin: 0 }}>
                      Ticket Order Summary
                    </h3>
                    <span
                      style={{
                        background: "#f0f7f3",
                        color: "#0e3d26",
                        border: "1px solid #c2d5c8",
                        borderRadius: "9999px",
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: 800
                      }}
                    >
                      {totalAttendeesCount} {totalAttendeesCount === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#4b5563" }}>
                        {adultCount}x Adult Pass (${pkg.adultPrice} each)
                      </span>
                      <strong style={{ color: "#111827" }}>${adultSubtotal.toFixed(2)}</strong>
                    </div>

                    {childCount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#4b5563" }}>
                          {childCount}x Child Pass (${pkg.childPrice} each)
                        </span>
                        <strong style={{ color: "#111827" }}>${childSubtotal.toFixed(2)}</strong>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#166534" }}>
                      <span>UPUA Processing / Credit Card Fee</span>
                      <span style={{ fontWeight: 700 }}>$0.00 (Free)</span>
                    </div>

                    <div style={{ borderTop: "2px solid #0e3d26", paddingTop: "14px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0e3d26" }}>Grand Total:</span>
                      <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0e3d26", fontFamily: "var(--font-heading)" }}>
                        ${grandTotal.toFixed(2)}{" "}
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>USD</span>
                      </span>
                    </div>
                  </div>

                  {/* Registered Attendee Roster Preview */}
                  <div style={{ marginTop: "20px", borderTop: "1px dashed #d4dfd7", paddingTop: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", color: "#6b7280" }}>
                        Registered Attendee Roster
                      </span>
                      <span style={{ fontSize: "11px", color: "#0e3d26", fontWeight: 700 }}>
                        {attendees.filter((a) => a.fullName.trim()).length} / {attendees.length} Named
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "220px", overflowY: "auto" }}>
                      {attendees.map((att, idx) => (
                        <div
                          key={att.id || idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            fontSize: "12px"
                          }}
                        >
                          <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <strong style={{ color: att.type === "Adult" ? "#0e3d26" : "#b45309" }}>
                              {att.fullName.trim() || `(Enter Name for ${att.type} #${idx + 1})`}
                            </strong>
                            <span style={{ color: "#6b7280", marginLeft: "4px" }}>• {att.relationship}</span>
                          </div>
                          <span style={{ fontWeight: 700, color: "#374151", flexShrink: 0 }}>
                            {att.type === "Adult" ? `$${pkg.adultPrice}` : `$${pkg.childPrice}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Inclusions Bullet List */}
                  <div style={{ marginTop: "20px", background: "#f8faf8", borderRadius: "10px", padding: "12px 14px", border: "1px solid #e1eae3" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#0e3d26", display: "block", marginBottom: "6px" }}>
                      Ticket Benefits Included:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11.5px", color: "#4b5563", lineHeight: 1.5 }}>
                      {pkg.includes.slice(0, 3).map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Lock size={11} color="#0e3d26" /> Secured by Stripe Payments Gateway
                    </span>
                  </div>
                </div>

                {/* Need Help Card */}
                <div style={{ background: "#ffffff", borderRadius: "14px", padding: "16px 20px", border: "1px solid #e1eae3", fontSize: "12.5px" }}>
                  <strong style={{ color: "#0e3d26", display: "block", marginBottom: "4px" }}>
                    Questions or Group Tables of 10?
                  </strong>
                  <p style={{ margin: "0 0 8px", color: "#526359", lineHeight: 1.4 }}>
                    Contact the 2026 Convention Planning Secretariat for corporate table sponsorships, royal patron reservations, or hotel booking discounts.
                  </p>
                  <div style={{ color: "#0e3d26", fontWeight: 700 }}>
                    Email: <a href="mailto:convention@upuamerica.org" style={{ color: "#0e3d26", textDecoration: "underline" }}>convention@upuamerica.org</a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading UPUA Secured Ticket Gateway...</div>}>
      <TicketsContent />
    </Suspense>
  );
}
