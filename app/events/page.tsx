"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Search, Calendar, MapPin, Clock, ArrowRight, X, ExternalLink, Users, Sparkles, CheckCircle2 } from "lucide-react";

export interface EventItem {
  id: string;
  title: string;
  category: "Convention" | "Youth Wing" | "Leadership" | "Culture" | "Community";
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
  schedule: { time: string; activity: string }[];
  highlights: string[];
}

const eventCategories = ["All", "Convention", "Youth Wing", "Leadership", "Culture", "Community"];

const eventsData: EventItem[] = [
  {
    id: "upua-33rd-national-convention-2026",
    title: "The 33rd Annual Urhobo Progress Union America National Convention",
    category: "Convention",
    date: "Aug 28 – 31, 2026",
    fullDate: "Friday, August 28 – Monday, August 31, 2026",
    time: "9:00 AM – 11:30 PM EDT Daily",
    monthShort: "AUG",
    day: "28",
    location: "Lawrenceburg, Indiana, USA",
    venueName: "DoubleTree by Hilton Hotel",
    address: "51 Walnut Street, Lawrenceburg, IN 47025",
    image: "/update-convention.jpg",
    featured: true,
    excerpt:
      "The premier annual gathering of Urhobo sons and daughters in the diaspora. Join national delegates, chapter executives, royal dignitaries from Delta State, and friends of Urhobo for three unforgettable days of cultural gala, youth empowerment, economic symposium, and fraternal brotherhood.",
    registrationUrl: "https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59",
    hotelUrl: "https://group.doubletree.com/hu478e",
    vendorUrl: "https://pages.donately.com/upuamerica/campaign/upua-2026-convention-vendor-table-registration-200-table",
    schedule: [
      { time: "Fri, Aug 28 · 2:00 PM", activity: "Delegate Arrival, Accreditation & Welcome Cocktail" },
      { time: "Fri, Aug 28 · 7:00 PM", activity: "Opening Cultural Night & Traditional Urhobo Reception" },
      { time: "Sat, Aug 29 · 9:00 AM", activity: "National General Assembly & Chapter Reports" },
      { time: "Sat, Aug 29 · 2:00 PM", activity: "Economic Summit & Investment in Urhoboland" },
      { time: "Sat, Aug 29 · 7:30 PM", activity: "Grand Cultural Banquet & Royal Dignitaries Gala" },
      { time: "Sun, Aug 30 · 10:00 AM", activity: "Interdenominational Thanksgiving Service" },
      { time: "Sun, Aug 30 · 2:00 PM", activity: "UPUAYA National Youth Wing Banquet & Awards" },
      { time: "Sun, Aug 30 · 8:00 PM", activity: "President's Ball & Communiqué Release" },
    ],
    highlights: [
      "Official Host Hotel: DoubleTree by Hilton Lawrenceburg ($149/night group rate)",
      "Vendor exhibition tables available for cultural attire, books, and business services ($200 donation)",
      "Convention brochure goodwill messages and corporate advertisements",
      "Special royal address from visiting Delta State traditional rulers",
      "UPUAYA Youth Wing networking banquet and mentoring breakfast",
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
            <div className="blog-featured-media-wrap">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
              <div className="event-date-badge" style={{ position: "absolute", top: 18, left: 18 }}>
                <span className="event-badge-month">{featured.monthShort}</span>
                <span className="event-badge-day">{featured.day}</span>
              </div>
            </div>
            <div className="blog-featured-content">
              <div className="blog-post-meta">
                <span className="blog-tag" style={{ background: "rgba(19, 116, 89, 0.12)", color: "#137459" }}>
                  {featured.category}
                </span>
                <span className="blog-date">📅 {featured.date}</span>
                <span className="blog-read-time">📍 {featured.location}</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", background: "#f0f7f3", color: "#0e3d26", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
                  🏨 DoubleTree by Hilton Lawrenceburg
                </span>
                <span style={{ fontSize: "12px", background: "#f0f7f3", color: "#0e3d26", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
                  🛍️ Vendor Table Spaces ($200)
                </span>
                <span style={{ fontSize: "12px", background: "#f0f7f3", color: "#0e3d26", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
                  📖 Brochure Ads Open
                </span>
              </div>

              <div className="blog-post-footer">
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="blog-read-btn"
                    onClick={() => setSelectedEvent(featured)}
                  >
                    View Full Schedule &amp; Info →
                  </button>
                  {featured.hotelUrl && (
                    <a
                      href={featured.hotelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-secondary-btn"
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
              placeholder="Search by event, location, city..."
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
                  <div className="blog-card-media" style={{ position: "relative" }}>
                    <Image
                      src={evt.image}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="blog-card-img"
                    />
                    <div className="event-date-badge" style={{ position: "absolute", top: 12, left: 12 }}>
                      <span className="event-badge-month">{evt.monthShort}</span>
                      <span className="event-badge-day">{evt.day}</span>
                    </div>
                    <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(14, 61, 38, 0.92)", color: "#ffffff", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
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

                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827", lineHeight: 1.35, margin: "0 0 8px" }}>
                      {evt.title}
                    </h3>
                    <p style={{ flex: 1, color: "#475467", fontSize: "13.5px", lineHeight: 1.6, margin: "0 0 16px" }}>
                      {evt.excerpt}
                    </p>

                    <div className="blog-post-footer" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #e1eae3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={() => setSelectedEvent(evt)}
                      >
                        Event Details <ArrowRight size={14} />
                      </button>
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
          <div className="upua-modal-box event-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
            >
              <X size={20} />
            </button>

            <div className="upua-modal-image-wrap">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="780px"
              />
              <div style={{ position: "absolute", bottom: "16px", left: "20px", background: "rgba(14, 61, 38, 0.95)", color: "#ffffff", padding: "5px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
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
                  >
                    <span>Register Online</span>
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

              {/* Key Highlights */}
              <div style={{ marginBottom: "22px" }}>
                <h4 style={{ color: "#0e3d26", fontSize: "15px", fontWeight: 800, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={16} color="#d4af37" /> Event Highlights
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
                    {selectedEvent.schedule.map((slot, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", borderBottom: i < selectedEvent.schedule.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: i < selectedEvent.schedule.length - 1 ? "8px" : "0" }}>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f6a4b" }}>{slot.time}</span>
                        <span style={{ fontSize: "13.5px", color: "#374151" }}>{slot.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue details */}
              <div style={{ padding: "12px 16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px", color: "#4b5563", marginBottom: "20px" }}>
                <strong>📍 Venue:</strong> {selectedEvent.venueName} &bull; {selectedEvent.address}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e1eae3", paddingTop: "18px", flexWrap: "wrap", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: "#787878" }}>
                  Organized by Urhobo Progress Union America National Executive &amp; Host Committees
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  style={{ background: "#0e3d26", color: "#ffffff", border: 0, borderRadius: "6px", padding: "10px 22px", fontSize: "13.5px", fontWeight: 700, cursor: "pointer" }}
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
