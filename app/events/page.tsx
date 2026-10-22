"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  X,
  ExternalLink,
  Users,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Plane,
  Award,
  DollarSign,
  Building,
  Ticket,
  FileText,
} from "lucide-react";

export interface EventItem {
  id: string;
  title: string;
  category: "Convention" | "Youth Wing" | "Leadership" | "Culture" | "Community" | "Fundraiser";
  date: string;
  fullDate: string;
  time: string;
  monthShort: string;
  day: string;
  location: string;
  venueName: string;
  address: string;
  image: string;
  excerpt: string;
  featured?: boolean;
  registrationUrl?: string;
  hotelUrl?: string;
  vendorUrl?: string;
  theme?: string;
  host?: string;
  airport?: string;
  pricing?: { label: string; price: string; note?: string }[];
  pricingNote?: string;
  contactInfo?: { name: string; email?: string; phone?: string }[];
  schedule?: { time: string; activity: string }[];
  highlights: string[];
}

const eventCategories = ["All", "Convention", "Fundraiser", "Youth Wing", "Leadership", "Culture", "Community"];

const eventsData: EventItem[] = [
  {
    id: "upua-33rd-national-convention-2026",
    title: "The 33rd Annual Urhobo Progress Union America National Convention 2026",
    category: "Convention",
    date: "Sept 3 – 7, 2026",
    fullDate: "Thursday, September 3 – Monday, September 7, 2026",
    time: "9:00 AM – 11:30 PM EDT Daily",
    monthShort: "SEP",
    day: "03",
    location: "Lawrenceburg, Indiana, USA",
    venueName: "DoubleTree by Hilton Hotel",
    address: "51 Walnut Street, Lawrenceburg, IN 47025. USA",
    image: "/events/upua-convention-2026-flyer.jpg",
    featured: true,
    host: "UPU Ohio (Host Chapter)",
    theme: "Urhobo Global Impact: Leadership, Legacy & Prosperity",
    airport: "(CVG) Cincinnati & Northern Kentucky International Airport",
    excerpt:
      "Iniovo Wadoo! Urhobo Progress Union America (UPUA) proudly announces the 2026 33rd Annual National Convention hosted by UPU Ohio. Join national delegates, chapter executives, royal traditional rulers from Delta State, youth ambassadors, and diaspora families for 5 monumental days celebrating Urhobo heritage, leadership, and prosperity.",
    registrationUrl: "https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59",
    hotelUrl: "https://group.doubletree.com/hu478e",
    vendorUrl: "https://pages.donately.com/upuamerica/campaign/upua-2026-convention-vendor-table-registration-200-table",
    pricing: [
      { label: "0 to 2 Years", price: "Free", note: "Infant & Toddler Pass" },
      { label: "3 to 12 Years", price: "$50.00 USD", note: "Children Registration" },
      { label: "13 Years and Above", price: "$150.00 USD", note: "Adult & Youth Registration" },
    ],
    pricingNote: "All registration fees are in USD, not Canadian Dollars.",
    schedule: [
      { time: "Thu, Sept 3 · 2:00 PM", activity: "Delegate Arrival, CVG Airport Reception & Hotel Check-in" },
      { time: "Thu, Sept 3 · 6:30 PM", activity: "Welcome Cocktail & Host Chapter Meet-and-Greet" },
      { time: "Fri, Sept 4 · 9:00 AM", activity: "National Executive Council & Chapter Presidents Session" },
      { time: "Fri, Sept 4 · 3:00 PM", activity: "UPUA Annual National Golf Outing at Sugar Ridge Golf Club" },
      { time: "Fri, Sept 4 · 7:30 PM", activity: "Opening Cultural Night & Traditional Urhobo Reception" },
      { time: "Sat, Sept 5 · 9:00 AM", activity: "33rd National General Assembly & Plenary Deliberations" },
      { time: "Sat, Sept 5 · 2:00 PM", activity: "Economic Symposium: Urhobo Global Impact & Heritage" },
      { time: "Sat, Sept 5 · 7:00 PM", activity: "Grand Cultural Banquet, Royal Awards & Dignitaries Gala" },
      { time: "Sun, Sept 6 · 10:00 AM", activity: "Interdenominational Thanksgiving Worship Service" },
      { time: "Sun, Sept 6 · 2:00 PM", activity: "UPUAYA National Youth Wing Banquet & Mentorship Forum" },
      { time: "Sun, Sept 6 · 8:00 PM", activity: "President's Ball & Communiqué Release" },
      { time: "Mon, Sept 7 · 10:00 AM", activity: "Farewell Breakfast & Delegate Departures" },
    ],
    highlights: [
      "Official Host: UPU Ohio Chapter welcoming attendees from across the USA, Canada, and Nigeria",
      "Venue: DoubleTree by Hilton, 51 Walnut Street, Lawrenceburg, IN 47025. USA",
      "Arrival Airport: (CVG) Cincinnati & Northern Kentucky International Airport",
      "Convention Theme: 'Urhobo Global Impact: Leadership, Legacy & Prosperity'",
      "Registration Categories: 0–2 Yrs: Free | 3–12 Yrs: $50.00 | 13+ Yrs: $150.00 (All fees in USD)",
      "Annual National Golf Outing at Sugar Ridge Golf Club on Friday, Sept 4th",
      "Convention brochure advertisement & goodwill messages available from $100 to $1,000",
      "Special royal address from visiting Delta State traditional rulers and cultural leaders",
      "UPUAYA National Youth Wing Networking Banquet & Awards Ceremony",
    ],
  },
  {
    id: "upu-ohio-zoom-fundraiser-2026",
    title: "UPU Ohio Chapter Zoom Fundraiser — 2026 Convention Host Support",
    category: "Fundraiser",
    date: "This Saturday, Oct 24, 2026",
    fullDate: "Saturday, October 24, 2026",
    time: "7:00 PM – 10:00 PM EDT",
    monthShort: "OCT",
    day: "24",
    location: "Virtual Gathering (Zoom Live)",
    venueName: "UPU Ohio Virtual Convention Chamber",
    address: "Official Zoom Meeting ID & Link shared across all UPUA Chapter Channels",
    image: "/events/upua-convention-2026-flyer.jpg",
    host: "UPU Ohio (Convention Host Chapter)",
    theme: "Iniovo Wadoo — Supporting the 2026 National Convention",
    registrationUrl: "https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59",
    excerpt:
      "Iniovo Wadoo! It's happening this Saturday — UPU Ohio warmly invites you all to their Zoom Fundraiser to support their activities as they host the 2026 National Convention. Kindly join and support them however you can — nothing is too small or too big. See you all on Saturday. Have your check books, credit and debit cards ready for easy access.",
    highlights: [
      "Special Zoom fundraising event hosted by UPU Ohio to power 2026 convention operations",
      "Support community initiatives, convention logistics, and diaspora mobilization",
      "Online donations, check books, and cards processed securely via Donately",
      "Interactive fellowship with Urhobo diaspora members from all 23 chapters",
    ],
  },
  {
    id: "upua-annual-golf-outing-2026",
    title: "UPUA Annual National Golf Outing 2026",
    category: "Convention",
    date: "Sept 4, 2026",
    fullDate: "Friday, September 4th, 2026",
    time: "03:00 PM Registration · 04:00 PM Shotgun Start",
    monthShort: "SEP",
    day: "04",
    location: "Lawrenceburg, IN (20 mins from Cincinnati, OH)",
    venueName: "Sugar Ridge Golf Club",
    address: "Pine Street, State Line Road, Lawrenceburg, IN 47025. USA",
    image: "/events/upua-golf-outing-2026.jpg",
    host: "UPU Ohio & National Organizing Committee",
    theme: "Unity, Strength, Progress — Touching Lives, Changing Generations",
    registrationUrl: "https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59",
    pricing: [
      { label: "Individual Golfer", price: "$100.00 USD", note: "Includes 18 holes, cart, lunch & awards" },
      { label: "Foursome Team", price: "$350.00 USD", note: "Team of 4 players" },
      { label: "Hole Sponsorship", price: "$200.00+ USD", note: "Individual or company hole signage" },
    ],
    pricingNote: "Register by August 15th, 2026. Anyone or company is welcome to sponsor a hole.",
    contactInfo: [
      { name: "Chief Mrs Ethel Felix-Okpe", email: "ethelurs@gmail.com", phone: "513-557-9181" },
      { name: "Chief Godwin Ikporo", phone: "+1 (618) 789-2943" },
    ],
    excerpt:
      "We are excited to invite you to the UPUA National Golf Outing. Whether you be a seasoned golfer or just looking for a fun day on the course, we would love to have you join us. Proceeds will support UPUA programs and initiatives.",
    schedule: [
      { time: "03:00 PM", activity: "Golfer Registration, Check-in & Practice Putting Green" },
      { time: "04:00 PM", activity: "Shotgun Start — 4-Person Scramble Tournament" },
      { time: "07:30 PM", activity: "Post-Tournament Lunch & Awards Ceremony Following Play" },
    ],
    highlights: [
      "Sugar Ridge Golf Club: Pine Street, State Line Road, Lawrenceburg, IN 47025 (20 mins from Cincinnati, OH)",
      "4-Person Scramble format suitable for seasoned golfers and newcomers alike",
      "Cost: $100 per golfer / $350 per foursome team",
      "Hole Sponsorship: $200 and above — individuals and corporate sponsors welcome",
      "Registration Deadline: August 15th, 2026",
      "Lunch and Awards Ceremony following play",
      "Contacts: Chief Mrs Ethel Felix-Okpe (513-557-9181) & Chief Godwin Ikporo (+1 618-789-2943)",
    ],
  },
  {
    id: "upua-convention-brochure-ads-2026",
    title: "2026 Convention Brochure Advertisement & Goodwill Messages",
    category: "Convention",
    date: "Book by Aug 15, 2026",
    fullDate: "Reservations Open Through August 15, 2026",
    time: "Official Souvenir Publication",
    monthShort: "AUG",
    day: "15",
    location: "Lawrenceburg, IN & Distributed Globally",
    venueName: "Official Convention Souvenir Brochure",
    address: "DoubleTree by Hilton, 51 Walnut Street, Lawrenceburg, IN 47025. USA",
    image: "/events/upua-convention-2026-brochure.jpg",
    host: "UPU Ohio (Host Chapter)",
    theme: "Urhobo Global Impact: Leadership, Legacy & Prosperity",
    registrationUrl: "https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59",
    pricing: [
      { label: "Outside Back Cover", price: "$1,000.00 USD", note: "Premium full-page color back cover" },
      { label: "Inside Front Cover", price: "$500.00 USD", note: "Prime inside front cover position" },
      { label: "Inside Back Cover", price: "$500.00 USD", note: "Prime inside back cover position" },
      { label: "Center Spread", price: "$600.00 USD", note: "Double-page center spread ($300 per page)" },
      { label: "Full Page", price: "$150.00 USD", note: "Full color standard advert / goodwill page" },
      { label: "1/2 Page", price: "$100.00 USD", note: "Half page advert / goodwill placement" },
    ],
    pricingNote: "Deadline for all artwork, family photos, and text is August 15th, 2026.",
    excerpt:
      "Immortalize your family greetings, chapter congratulations, and business brands in the official 2026 UPU America National Convention Souvenir Brochure. Distributed to national delegates, royal dignitaries, and diaspora leaders.",
    highlights: [
      "Official commemorative full-color souvenir magazine for the 33rd Annual Convention",
      "Outside Back Cover: $1,000.00 | Inside Front/Back Cover: $500.00",
      "Center Spread (2 Pages): $600.00 ($300/page) | Full Page: $150.00 | Half Page: $100.00",
      "Convention Theme: 'Urhobo Global Impact: Leadership, Legacy & Prosperity'",
      "Host: UPU Ohio Chapter | Venue: DoubleTree by Hilton, Lawrenceburg, IN",
      "Submit high-resolution photos, organization logos, and goodwill text before August 15, 2026",
    ],
  },
  {
    id: "upuaya-youth-leadership-summit-2026",
    title: "UPUAYA National Youth Leadership & Career Symposium",
    category: "Youth Wing",
    date: "October 18 – 19, 2026",
    fullDate: "Saturday, October 18 – Sunday, October 19, 2026",
    time: "10:00 AM – 5:00 PM CDT",
    monthShort: "OCT",
    day: "18",
    location: "Houston, TX & Virtual Stream",
    venueName: "Marriott Westchase & Zoom Global Live",
    address: "2900 Briarpark Dr, Houston, TX 77042",
    image: "/assets/youth-kevwe.jpeg",
    excerpt:
      "Convening young Urhobo scholars, innovators, engineers, and corporate leaders across North America. Featuring high-impact panels on AI & tech careers, medical residencies, finance, and cultural pride in the diaspora.",
    registrationUrl: "https://upuamerica.org/calendar/",
    schedule: [
      { time: "10:00 AM", activity: "Welcome Address by UPUAYA President Oghenekevwe Ajueyitsi" },
      { time: "11:15 AM", activity: "Keynote: Navigating High-Tech & Corporate America" },
      { time: "1:00 PM", activity: "Networking Luncheon & Collegiate Mentorship Matching" },
      { time: "2:30 PM", activity: "Breakout Labs: Medicine, Law, Software & Entrepreneurship" },
      { time: "4:00 PM", activity: "Youth Wing Communiqué & Evening Mixer" },
    ],
    highlights: [
      "Keynote panels with Urhobo executives in Silicon Valley, Wall Street, and Healthcare",
      "One-on-one resume reviews and career development guidance",
      "Mentorship pairing for university undergraduates",
      "Full digital stream available for remote chapter members",
    ],
  },
  {
    id: "nec-quarterly-assembly-nov-2026",
    title: "National Executive Council (NEC) & Chapter Delegates Meeting",
    category: "Leadership",
    date: "November 14, 2026",
    fullDate: "Saturday, November 14, 2026",
    time: "11:00 AM – 3:30 PM EST",
    monthShort: "NOV",
    day: "14",
    location: "Virtual Executive Assembly (Zoom)",
    venueName: "UPUA Digital Governance Chamber",
    address: "Private Zoom Access for Registered Chapter Delegates",
    image: "/assets/bot-chairman-blog.jpg",
    excerpt:
      "Quarterly constitutional governance meeting bringing together Chapter Presidents, Board of Trustees, and National Officers to deliberate on ongoing welfare projects, financial stewardship, and strategic roadmaps.",
    registrationUrl: "https://upuamerica.org/calendar/",
    schedule: [
      { time: "11:00 AM", activity: "Opening Prayer & National Anthem" },
      { time: "11:20 AM", activity: "National President's Quarterly Address" },
      { time: "12:15 PM", activity: "Treasury Report & Auditor General's Review" },
      { time: "1:30 PM", activity: "Status Report on Homeland Projects & Disaster Relief" },
      { time: "2:45 PM", activity: "Resolutions, AOB & Closing Formalities" },
    ],
    highlights: [
      "Review of national humanitarian relief initiatives",
      "Chapter growth reports from 23 North American branches",
      "Presentation of 2027 calendar and budget projections",
    ],
  },
  {
    id: "urhobo-cultural-heritage-day-2026",
    title: "Urhobo Cultural Heritage Day & Language Immersion Festival",
    category: "Culture",
    date: "December 5, 2026",
    fullDate: "Saturday, December 5, 2026",
    time: "1:00 PM – 9:00 PM EST",
    monthShort: "DEC",
    day: "05",
    location: "Atlanta, GA, USA",
    venueName: "Atlanta Convention Center & Gardens",
    address: "Atlanta Metro Area, GA (Hosted by UPU Georgia Chapter)",
    image: "/assets/SolCal-4.jpg",
    excerpt:
      "A grand family celebration of Urhobo identity. Featuring traditional folklore, authentic culinary demonstrations (Ukodo, Oghwo-evwri, Banga soup), royal ceremonial dances, and youth language competitions.",
    registrationUrl: "https://upuamerica.org/calendar/",
    schedule: [
      { time: "1:00 PM", activity: "Cultural Artifacts & Traditional Attire Exhibition" },
      { time: "2:30 PM", activity: "Children's Urhobo Storytelling & Proverb Recitation" },
      { time: "4:00 PM", activity: "Authentic Culinary Tasting & Live Cooking Showcase" },
      { time: "6:00 PM", activity: "Royal Dance Troupe Showcase & Evening Celebration" },
    ],
    highlights: [
      "Hands-on interactive Urhobo language workshops for kids and teens",
      "Traditional Urhobo cuisine buffet featuring traditional delicacies",
      "Cultural dance troupes representing various Urhobo kingdoms",
      "Display of handwoven traditional Akwa-Ocha and coral bead regal wear",
    ],
  },
  {
    id: "women-in-shelter-drive-jan-2027",
    title: "Women in Shelter Humanitarian Outreach & Winter Relief Drive",
    category: "Community",
    date: "January 16, 2027",
    fullDate: "Saturday, January 16, 2027",
    time: "10:00 AM – 3:00 PM Local Time",
    monthShort: "JAN",
    day: "16",
    location: "Nationwide Chapters (USA & Canada)",
    venueName: "Local Community Emergency Centers",
    address: "Coordinated across Detroit, Chicago, DMV, Houston, LA & Twin Cities",
    image: "/assets/DMV-6.jpg",
    excerpt:
      "Chapters across North America unite on a single day of service to deliver critical hygiene packages, winter coats, and infant supplies to local emergency women's shelters, honoring Urhobo community compassion.",
    registrationUrl: "https://upuamerica.org/women-in-shelter/",
    schedule: [
      { time: "10:00 AM", activity: "Chapter Volunteer Gathering & Supply Packaging" },
      { time: "11:30 AM", activity: "Convoy Delivery to Partner Shelter Facilities" },
      { time: "1:30 PM", activity: "Community Service Certificate Presentation" },
    ],
    highlights: [
      "Simultaneous chapter drives in 16 North American metropolitan areas",
      "Over 1,500 hygiene and winter warmth kits prepared for donation",
      "Partnership with accredited local shelters supporting women and children",
    ],
  },
  {
    id: "upua-agm-thanksgiving-2027",
    title: "Annual General Meeting (AGM) & Thanksgiving Service",
    category: "Leadership",
    date: "February 21, 2027",
    fullDate: "Sunday, February 21, 2027",
    time: "2:00 PM – 6:30 PM CST",
    monthShort: "FEB",
    day: "21",
    location: "Dallas / Fort Worth, TX & Virtual",
    venueName: "DFW Urhobo Community Center & Live Broadcast",
    address: "Dallas-Fort Worth Metroplex, Texas",
    image: "/assets/Congress-1.jpg",
    excerpt:
      "Our yearly general gathering to render audited financial stewardship accounts, ratify new policy resolutions, and celebrate God's blessings over the Urhobo nation at home and abroad.",
    registrationUrl: "https://upuamerica.org/calendar/",
    schedule: [
      { time: "2:00 PM", activity: "Interdenominational Thanksgiving & Worship Service" },
      { time: "3:30 PM", activity: "Annual Stewardship Report & Constitutional Updates" },
      { time: "5:00 PM", activity: "Community Banquet & Fellowship" },
    ],
    highlights: [
      "Presentation of annual audited reports to all registered members",
      "Recognition of outstanding chapter community leaders",
      "Thanksgiving celebration and community feast",
    ],
  },
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedEvent(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredEvents = eventsData.filter((event) => {
    const matchCategory = activeCategory === "All" || event.category === activeCategory;
    const matchSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = eventsData.find((e) => e.featured) || eventsData[0];

  return (
    <div className="figma-landing-page">
      <SiteHeader />

      {/* Hero section */}
      <section className="page-hero blog-hero">
        <Image
          src="/assets/Congress-1.jpg"
          alt="UPUA National Conventions and Events"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 25%" }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <p className="page-hero-tag">Official Association Calendar</p>
          <h1>
            Events &amp; <span className="heading-gold-accent">Conventions</span>
          </h1>
          <p className="page-hero-sub">
            Join the Urhobo community across North America. Explore our annual national convention, youth symposiums, leadership meetings, and cultural gatherings.
          </p>
        </div>
      </section>

      {/* Featured Headline Event (The 33rd Annual Convention) */}
      <section className="blog-featured-section">
        <div className="blog-featured-inner">
          <div className="blog-featured-badge">Featured National Event</div>
          <article className="blog-featured-card">
            {/* Clickable Flyer leading directly to Donately */}
            <a
              href={featured.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-featured-media-wrap"
              style={{
                position: "relative",
                display: "block",
                cursor: "pointer",
                background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)",
                borderRadius: "16px",
                overflow: "hidden",
                minHeight: "380px",
              }}
              title="Click on the registration flyer to register on Donately"
            >
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                style={{ objectFit: "contain", padding: "10px" }}
                sizes="(max-width: 768px) 100vw, 420px"
                priority
              />
              <div className="event-date-badge" style={{ position: "absolute", top: 16, left: 16, zIndex: 5 }}>
                <span className="event-badge-month">{featured.monthShort}</span>
                <span className="event-badge-day">{featured.day}</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(14, 61, 38, 0.95)",
                  border: "1.5px solid #d4af37",
                  color: "#f7d070",
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  zIndex: 5,
                }}
              >
                <span>👉 Click Flyer to Register on Donately</span>
                <ExternalLink size={13} />
              </div>
            </a>

            <div className="blog-featured-content">
              <div className="blog-post-meta">
                <span className="blog-tag" style={{ background: "rgba(19, 116, 89, 0.12)", color: "#137459" }}>
                  {featured.category}
                </span>
                <span className="blog-date">📅 {featured.date}</span>
                <span className="blog-read-time">📍 {featured.location}</span>
              </div>

              {featured.theme && (
                <div
                  style={{
                    background: "linear-gradient(90deg, #f0f7f3 0%, #fef9e7 100%)",
                    borderLeft: "4px solid #d4af37",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#854d0e", letterSpacing: "0.05em" }}>
                    Convention Theme
                  </span>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0e3d26", fontFamily: "var(--font-heading)" }}>
                    &ldquo;{featured.theme}&rdquo;
                  </div>
                </div>
              )}

              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>

              {/* Registration Categories Quick View */}
              <div style={{ marginTop: "14px", marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#0e3d26", textTransform: "uppercase", marginBottom: "6px" }}>
                  Registration Categories (USD)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span style={{ fontSize: "12px", background: "#f0f7f3", color: "#0e3d26", padding: "6px 12px", borderRadius: "8px", fontWeight: 700, border: "1px solid #c7e5d3" }}>
                    👶 0–2 Yrs: <strong>Free</strong>
                  </span>
                  <span style={{ fontSize: "12px", background: "#f0f7f3", color: "#0e3d26", padding: "6px 12px", borderRadius: "8px", fontWeight: 700, border: "1px solid #c7e5d3" }}>
                    🧒 3–12 Yrs: <strong>$50.00</strong>
                  </span>
                  <span style={{ fontSize: "12px", background: "#f0f7f3", color: "#0e3d26", padding: "6px 12px", borderRadius: "8px", fontWeight: 700, border: "1px solid #c7e5d3" }}>
                    🧑 13+ Yrs: <strong>$150.00</strong>
                  </span>
                  <span style={{ fontSize: "12px", background: "#fef3c7", color: "#854d0e", padding: "6px 12px", borderRadius: "8px", fontWeight: 700 }}>
                    ✈️ CVG Airport
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", background: "#f8faf8", color: "#475467", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>
                  🏨 DoubleTree by Hilton, Lawrenceburg, IN
                </span>
                <span style={{ fontSize: "12px", background: "#f8faf8", color: "#475467", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>
                  ⛳ Golf Outing (Sept 4th)
                </span>
                <span style={{ fontSize: "12px", background: "#f8faf8", color: "#475467", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>
                  📖 Brochure Ads ($100–$1,000)
                </span>
              </div>

              <div className="blog-post-footer">
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  <a
                    href={featured.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-read-btn"
                    style={{
                      background: "#0e3d26",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: 800,
                      padding: "11px 22px",
                      borderRadius: "10px",
                      boxShadow: "0 4px 14px rgba(14,61,38,0.25)",
                    }}
                  >
                    <span>Register on Donately</span>
                    <ExternalLink size={15} />
                  </a>
                  <button
                    type="button"
                    className="event-secondary-btn"
                    onClick={() => setSelectedEvent(featured)}
                    style={{ padding: "10px 18px", borderRadius: "10px" }}
                  >
                    View Guidelines &amp; Schedule →
                  </button>
                  {featured.hotelUrl && (
                    <a
                      href={featured.hotelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-secondary-btn"
                      style={{ padding: "10px 16px", borderRadius: "10px" }}
                    >
                      Book Hotel Room <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="blog-filter-section">
        <div className="blog-filter-inner">
          <div className="blog-category-pills">
            {eventCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`blog-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="blog-search-wrap">
            <Search size={16} color="#667085" />
            <input
              type="text"
              className="blog-search-input"
              placeholder="Search by event, location, city, golf, brochure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="blog-grid-section">
        <div className="blog-grid-inner">
          {filteredEvents.length === 0 ? (
            <div className="blog-empty">
              <p>No events found matching your search. Try resetting filters or searching with another keyword.</p>
            </div>
          ) : (
            <div className="blog-posts-grid">
              {filteredEvents.map((evt) => (
                <article className="blog-post-card event-catalog-card" key={evt.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div className="blog-card-media" style={{ position: "relative", minHeight: "220px", background: "#f8faf8" }}>
                    <Image
                      src={evt.image}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="blog-card-img"
                      style={{ objectFit: "contain", objectPosition: "center center", padding: "8px" }}
                    />
                    <div className="event-date-badge" style={{ position: "absolute", top: 12, left: 12, zIndex: 4 }}>
                      <span className="event-badge-month">{evt.monthShort}</span>
                      <span className="event-badge-day">{evt.day}</span>
                    </div>
                    <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(14, 61, 38, 0.92)", color: "#ffffff", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", zIndex: 4 }}>
                      {evt.category}
                    </span>
                  </div>

                  <div className="blog-post-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="event-card-metas" style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#0f6a4b", fontWeight: 700 }}>
                        <Clock size={13} /> {evt.date}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#667085" }}>
                        <MapPin size={13} /> {evt.location}
                      </div>
                    </div>

                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827", lineHeight: 1.35, margin: "0 0 8px" }}>
                      {evt.title}
                    </h3>
                    <p style={{ flex: 1, color: "#475467", fontSize: "13.5px", lineHeight: 1.6, margin: "0 0 16px" }}>
                      {evt.excerpt}
                    </p>

                    <div className="blog-post-footer" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #e1eae3", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={() => setSelectedEvent(evt)}
                      >
                        Event Details <ArrowRight size={14} />
                      </button>
                      {evt.registrationUrl && (
                        <a
                          href={evt.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "#0e3d26",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            textDecoration: "none",
                            background: "#f0f8f3",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #a7d6b6",
                          }}
                        >
                          <span>Register</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Event Detail Modal */}
      {selectedEvent && (
        <div className="upua-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="upua-modal-box event-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
            >
              <X size={20} />
            </button>

            {/* Clickable Modal Image */}
            <div className="upua-modal-image-wrap" style={{ position: "relative", minHeight: "340px", background: "#f8faf8" }}>
              {selectedEvent.registrationUrl ? (
                <a
                  href={selectedEvent.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", position: "relative", width: "100%", height: "100%", cursor: "pointer" }}
                  title="Click flyer to register online on Donately"
                >
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    style={{ objectFit: "contain", objectPosition: "center center", padding: "10px" }}
                    sizes="780px"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      background: "rgba(14, 61, 38, 0.95)",
                      border: "1.5px solid #d4af37",
                      color: "#f7d070",
                      padding: "6px 14px",
                      borderRadius: "100px",
                      fontSize: "12px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      zIndex: 10,
                    }}
                  >
                    <span>👉 Click Flyer to Register on Donately</span>
                    <ExternalLink size={13} />
                  </div>
                </a>
              ) : (
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center center", padding: "10px" }}
                  sizes="780px"
                />
              )}
              <div style={{ position: "absolute", bottom: "16px", left: "20px", background: "rgba(14, 61, 38, 0.95)", color: "#ffffff", padding: "5px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", zIndex: 10 }}>
                {selectedEvent.category}
              </div>
            </div>

            <div className="upua-modal-body">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", color: "#475467", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#0f6a4b", fontWeight: 700 }}>
                  <Calendar size={14} /> {selectedEvent.fullDate}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Clock size={14} /> {selectedEvent.time}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <MapPin size={14} /> {selectedEvent.venueName}, {selectedEvent.location}
                </span>
              </div>

              {selectedEvent.theme && (
                <div
                  style={{
                    background: "linear-gradient(90deg, #f0f7f3 0%, #fef9e7 100%)",
                    borderLeft: "4px solid #d4af37",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#854d0e", letterSpacing: "0.05em" }}>
                    Official Theme
                  </span>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#0e3d26", fontFamily: "var(--font-heading)" }}>
                    &ldquo;{selectedEvent.theme}&rdquo;
                  </div>
                </div>
              )}

              <h2 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)", margin: "4px 0 12px", fontWeight: 800, lineHeight: 1.3 }}>
                {selectedEvent.title}
              </h2>

              <p style={{ color: "#34454a", fontSize: "15px", lineHeight: "1.75", margin: "0 0 18px" }}>
                {selectedEvent.excerpt}
              </p>

              {/* Action Buttons Bar */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "14px", background: "#f4f8f5", borderRadius: "10px", marginBottom: "20px" }}>
                {selectedEvent.registrationUrl && (
                  <a
                    href={selectedEvent.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-action-primary-btn"
                    style={{ background: "#0e3d26", color: "#ffffff", fontWeight: 800 }}
                  >
                    <span>Register Online via Donately</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedEvent.hotelUrl && (
                  <a
                    href={selectedEvent.hotelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-action-secondary-btn"
                  >
                    <span>Reserve Hotel Room</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedEvent.vendorUrl && (
                  <a
                    href={selectedEvent.vendorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-action-secondary-btn"
                  >
                    <span>Book Vendor Table ($200)</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Pricing / Categories Table if available */}
              {selectedEvent.pricing && selectedEvent.pricing.length > 0 && (
                <div style={{ marginBottom: "22px" }}>
                  <h4 style={{ color: "#0e3d26", fontSize: "15px", fontWeight: 800, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Ticket size={16} color="#d4af37" /> Registration Categories &amp; Pricing
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                    {selectedEvent.pricing.map((p, i) => (
                      <div key={i} style={{ background: "#f0f8f3", border: "1.5px solid #a7d6b6", borderRadius: "10px", padding: "12px 14px" }}>
                        <div style={{ fontSize: "12px", color: "#526359", fontWeight: 700 }}>{p.label}</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0e3d26", margin: "4px 0" }}>{p.price}</div>
                        {p.note && <div style={{ fontSize: "11px", color: "#6b7280" }}>{p.note}</div>}
                      </div>
                    ))}
                  </div>
                  {selectedEvent.pricingNote && (
                    <div style={{ fontSize: "12px", color: "#b45309", fontWeight: 700, marginTop: "8px", background: "#fef3c7", padding: "8px 12px", borderRadius: "6px" }}>
                      ⚠️ {selectedEvent.pricingNote}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information if available */}
              {selectedEvent.contactInfo && selectedEvent.contactInfo.length > 0 && (
                <div style={{ marginBottom: "22px" }}>
                  <h4 style={{ color: "#0e3d26", fontSize: "15px", fontWeight: 800, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={16} color="#0f6a4b" /> Contacts &amp; Registration Enquiries
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                    {selectedEvent.contactInfo.map((c, i) => (
                      <div key={i} style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "10px", padding: "12px 14px", fontSize: "13px" }}>
                        <strong style={{ color: "#0e3d26", display: "block", marginBottom: "4px" }}>{c.name}</strong>
                        {c.phone && (
                          <div style={{ marginBottom: "2px" }}>
                            📞 <a href={`tel:${c.phone}`} style={{ color: "#0e3d26", fontWeight: 600, textDecoration: "none" }}>{c.phone}</a>
                          </div>
                        )}
                        {c.email && (
                          <div>
                            ✉️ <a href={`mailto:${c.email}`} style={{ color: "#0e3d26", fontWeight: 600, textDecoration: "none" }}>{c.email}</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights */}
              <div style={{ marginBottom: "22px" }}>
                <h4 style={{ color: "#0e3d26", fontSize: "15px", fontWeight: 800, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={16} color="#d4af37" /> Event Highlights &amp; Guidelines
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedEvent.highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#374151" }}>
                      <CheckCircle2 size={16} color="#0f6a4b" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Schedule Timeline */}
              {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ color: "#0e3d26", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>
                    Program Schedule
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "14px" }}>
                    {selectedEvent.schedule.map((slot, i, arr) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: i < arr.length - 1 ? "8px" : "0" }}>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f6a4b" }}>{slot.time}</span>
                        <span style={{ fontSize: "13.5px", color: "#374151" }}>{slot.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue details */}
              <div style={{ padding: "14px 18px", background: "#f9fafb", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", color: "#4b5563", marginBottom: "20px" }}>
                <div><strong>📍 Venue:</strong> {selectedEvent.venueName} &bull; {selectedEvent.address}</div>
                {selectedEvent.airport && <div style={{ marginTop: "4px" }}><strong>✈️ Arrival Airport:</strong> {selectedEvent.airport}</div>}
                {selectedEvent.host && <div style={{ marginTop: "4px" }}><strong>🏛️ Host:</strong> {selectedEvent.host}</div>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e1eae3", paddingTop: "18px", flexWrap: "wrap", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: "#787878" }}>
                  Executive Committee &amp; National Organizing Committee &bull; Urhobo Progress Union America
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  style={{ background: "#0e3d26", color: "#ffffff", border: 0, borderRadius: "8px", padding: "10px 22px", fontSize: "13.5px", fontWeight: 700, cursor: "pointer" }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <section className="blog-newsletter-section">
        <div className="blog-newsletter-inner">
          <h2>
            Never Miss a <span className="heading-gold-accent">UPUA Gathering</span>
          </h2>
          <p>
            Subscribe to receive convention registration announcements, hotel discount codes, and chapter cultural schedules.
          </p>
          <form className="blog-newsletter-form">
            <input type="email" placeholder="Enter your email address" aria-label="Email address" />
            <button type="button">Get Event Alerts</button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
