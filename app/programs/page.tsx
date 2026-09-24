"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Heart, CheckCircle2, ArrowRight, X, ExternalLink, ShieldCheck } from "lucide-react";

interface ProgramItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  details: string[];
  impact: string;
  accent: string;
  featuredImage: string;
  fullWriteup: string[];
  objectives: string[];
}

const shelterChapters = [
  { chapter: "DC, Maryland & Virginia (UPUDMV)", location: "Washington DC, MD, VA", image: "https://upuamerica.org/wp-content/uploads/2026/06/DMV-6.jpg" },
  { chapter: "Michigan (UPUMI)", location: "Detroit, Michigan", image: "https://upuamerica.org/wp-content/uploads/2026/06/Michigan-2.jpg" },
  { chapter: "Ohio (UPU Ohio)", location: "Columbus & Cleveland, OH", image: "https://upuamerica.org/wp-content/uploads/2026/06/Ohio-1.jpg" },
  { chapter: "Southern California (UPUSC)", location: "Los Angeles & San Diego, CA", image: "https://upuamerica.org/wp-content/uploads/2026/06/SolCal-4.jpg" },
  { chapter: "Chicagoland (UPUC)", location: "Chicago, Illinois", image: "https://upuamerica.org/wp-content/uploads/2026/06/ChicagoLand-1x.jpg" },
  { chapter: "Delaware Valley (UPUDV)", location: "PA, DE & NJ", image: "https://upuamerica.org/wp-content/uploads/2026/06/Delaware-1.jpg" },
  { chapter: "Great Kansas City (Waado)", location: "Kansas City, MO / KS", image: "https://upuamerica.org/wp-content/uploads/2026/06/wadoo-1.jpg" },
  { chapter: "Minnesota (UPUM)", location: "Minneapolis & St. Paul, MN", image: "https://upuamerica.org/wp-content/uploads/2026/06/Minnesota-3.jpg" },
];

const mainPrograms: ProgramItem[] = [
  {
    id: "women-shelter",
    title: "Women in Shelter Initiative",
    category: "Signature Community Action",
    summary:
      "Across North America, UPUA chapters actively give back by donating time, resources, essential hygiene kits, food supplies, and compassion to women's shelters in their host American cities.",
    details: [
      "Providing women in shelters with dignity packages, essential toiletries, and personal care items",
      "Over 16 accredited UPUA chapters actively visiting local shelters annually",
      "Building positive integration and philanthropic partnerships with host municipalities across the US and Canada",
      "Championed by chapter presidents and women leaders across all regions",
    ],
    impact: "16+ North American metro areas mobilized",
    accent: "#137459",
    featuredImage: "https://upuamerica.org/wp-content/uploads/2026/06/DMV-6.jpg",
    fullWriteup: [
      "The UPUA Women in Shelter Initiative is a signature humanitarian outreach program established to support vulnerable women and children residing in emergency shelters across the United States and Canada.",
      "At UPUA, giving back to those in need is at the heart of our cultural ethos. Each chapter coordinates directly with recognized shelter facilities in cities such as Detroit, Washington D.C., Columbus, Los Angeles, Chicago, Philadelphia, and Minneapolis.",
      "Chapters assemble and personally deliver hundreds of dignity kits containing feminine hygiene products, warm winter clothing, dental care sets, non-perishable food, and baby supplies. Beyond physical items, members spend time with shelter staff and residents, fostering goodwill and demonstrating the compassionate spirit of the Urhobo diaspora.",
    ],
    objectives: [
      "Mobilize all 23+ UPUA chapters for annual charitable giving to local shelters",
      "Provide over 5,000 comprehensive personal care and hygiene packages yearly",
      "Strengthen community partnerships between African diaspora organizations and municipal social services",
    ],
  },
  {
    id: "stem-ai",
    title: "STEM & Artificial Intelligence (AI) Training in Urhoboland",
    category: "Youth & Technology",
    summary:
      "A forward-looking initiative equipping Urhobo students in secondary and tertiary institutions across Delta State with cutting-edge computer literacy, programming, robotics, and generative AI skills.",
    details: [
      "Hands-on coding bootcamps and artificial intelligence awareness workshops",
      "Donation of desktop computers, laptops, and internet connectivity to community secondary schools",
      "Mentorship with diaspora Urhobo tech executives from Silicon Valley, Texas, and New York",
      "Preparing Urhobo youth to compete and excel in the global 21st-century digital economy",
    ],
    impact: "Hundreds of Urhobo students trained across Delta State",
    accent: "#003e53",
    featuredImage: "/update-stem.jpg",
    fullWriteup: [
      "As artificial intelligence and digital technologies redefine the global workforce, UPU America launched the STEM & AI Training in Urhoboland initiative to bridge the digital divide for Urhobo students.",
      "Conducted in partnership with educational stakeholders and universities in Delta State, this curriculum introduces secondary and university students to fundamental computer programming, data literacy, algorithm basics, and ethical AI applications.",
      "UPUA finances modern computer workstations, licensed software tools, and reliable internet access in selected community school labs, while volunteer tech professionals from the American diaspora mentor students virtually and during annual visits.",
    ],
    objectives: [
      "Establish functional digital learning labs in community schools across all 24 Urhobo kingdoms",
      "Deliver annual intensive coding and AI bootcamps for 1,000+ secondary students",
      "Create internship and scholarship pathways for talented Urhobo tech students",
    ],
  },
  {
    id: "medical-outreach",
    title: "UPU America Medical Outreach & Health Missions",
    category: "Healthcare & Wellness",
    summary:
      "Volunteer physicians, nurses, pharmacists, and healthcare professionals from the diaspora conduct free medical missions in Urhoboland, delivering healthcare to underserved rural communities.",
    details: [
      "Free medical consultations, diagnostic screenings, and dispensary of life-saving prescription drugs",
      "Hypertension, diabetes, malaria, and optical vision clinics with free prescription reading glasses",
      "Executed during the annual UPU Worldwide Conferences and community health outreach tours in Delta State",
      "Collaborations with local health authorities, hospitals, and primary health centres in Urhobo kingdoms",
    ],
    impact: "Thousands of patients treated free of charge",
    accent: "#0e3d26",
    featuredImage: "/update-outreach.jpg",
    fullWriteup: [
      "Access to quality primary healthcare remains a critical challenge in rural areas of Delta State. UPU America’s Medical Outreach program addresses this need through organized clinical missions deployed across Urhobo communities.",
      "The mission team consists of board-certified Urhobo doctors, pharmacists, nurse practitioners, and dentists who volunteer their time and expertise. They travel with essential pharmaceutical supplies, diagnostic kits, and optical equipment procured through member contributions.",
      "Clinics provide free medical evaluations, treatment for prevalent infections, cardiovascular and diabetic management, vision testing with corrective eyeglasses distribution, and community health hygiene seminars.",
    ],
    objectives: [
      "Treat at least 3,000 patients during each annual conference and rural medical mission",
      "Supply primary health centres with essential antibiotics, antimalarials, and diagnostic test kits",
      "Offer preventative education on cardiovascular health, hypertension, and diabetes management",
    ],
  },
  {
    id: "okuama-relief",
    title: "Humanitarian Relief & Support for Okuama IDPs",
    category: "Emergency Humanitarian Aid",
    summary:
      "In response to the tragic crisis affecting the Okuama community in Delta State, UPU America mobilized urgent relief funds, nutritional supplies, and advocacy for displaced Urhobo families and children.",
    details: [
      "Provision of critical food supplies, clean drinking water, sleeping mats, and medication to IDP camps",
      "Public advocacy urging regional and federal stakeholders to facilitate rehabilitation and resettlement",
      "Educational assistance and trauma relief supplies for displaced school children",
      "Transparent administration and direct delivery via trusted local humanitarian monitors",
    ],
    impact: "Over $150,000 equivalent in emergency relief provided",
    accent: "#8b3a00",
    featuredImage: "/update-news.jpg",
    fullWriteup: [
      "Following the displacement crisis in Okuama, UPU America immediately inaugurated an emergency relief taskforce to assist affected families, nursing mothers, and elderly persons forced into temporary shelters.",
      "Working through verified local humanitarian contacts and community leaders, UPUA mobilized and disbursed financial aid, bags of staple food items, clean water filtration, bedding materials, and emergency medication.",
      "In addition to material relief, UPUA leadership maintains active communication with governmental authorities and civic organizations to ensure transparent accountability and advocate for the safe, dignified rehabilitation of Okuama residents.",
    ],
    objectives: [
      "Ensure food security and clean water access for all displaced Okuama families",
      "Support educational continuity for displaced primary and secondary students",
      "Advocate for full reconstruction and permanent community rehabilitation",
    ],
  },
  {
    id: "convention",
    title: "Annual UPU America National Convention",
    category: "National Gathering & Governance",
    summary:
      "The premier annual assembly of the Urhobo diaspora in North America, bringing together thousands of delegates, leaders, traditional rulers, and families for cultural celebration, business expos, and organizational governance.",
    details: [
      "Elects the National Executive Committee and ratifies constitutional and policy resolutions",
      "Showcases vibrant traditional dance troupes, Urhobo cuisine, traditional attire, and youth pageants",
      "Economic summits exploring investment in Delta State infrastructure, agriculture, and education",
      "Hosted rotationally across major US chapter cities: Houston, Atlanta, Chicago, Newark, Dallas, Los Angeles",
    ],
    impact: "Over 30 years of continuous diaspora conventions",
    accent: "#00527a",
    featuredImage: "/update-convention.jpg",
    fullWriteup: [
      "For over three decades, the Annual UPU America National Convention has stood as the vibrant centerpiece of Urhobo cultural and civic life in North America.",
      "The three-day convention brings together hundreds of official delegates from our 23 accredited chapters, alongside visiting Royal Fathers from Delta State, dignitaries, Urhobo professionals, and families from all generations.",
      "Highlights include the National Congress where governance decisions and elections are conducted, an Economic Empowerment Symposium focused on homeland trade and investments, a Youth Summit hosted by UPUAYA, and the grand Cultural Gala Night celebrating Urhobo music, language, traditional dress, and culinary traditions.",
    ],
    objectives: [
      "Unite the Urhobo diaspora across the United States and Canada in common purpose",
      "Facilitate transparent constitutional governance, elections, and annual financial reporting",
      "Provide networking and mentorship forums connecting young Urhobo professionals with industry leaders",
    ],
  },
  {
    id: "language-culture",
    title: "Urhobo Language Preservation & Cultural Education",
    category: "Culture & Language",
    summary:
      "Fulfilling the core UPUA mandate of passing on to our children the positive aspects of Urhobo culture, language, folklore, and heritage in a multi-cultural diaspora setting.",
    details: [
      "Online Urhobo language courses taught by certified educators for children and adults",
      "Production and distribution of Urhobo alphabet books, vocabulary guides, and cultural primers",
      "Annual Urhobo Day festivities celebrated across all 23 local chapters every autumn",
      "Encouraging youth to take pride in the Urhobo National Anthem and ancient royal customs",
    ],
    impact: "Connecting diaspora children with ancestral roots",
    accent: "#6b0e6b",
    featuredImage: "https://upuamerica.org/wp-content/uploads/2026/06/SolCal-4.jpg",
    fullWriteup: [
      "Language is the lifeblood of cultural identity. Recognizing the risk of language erosion among second and third-generation diaspora children, UPU America created a structured language curriculum.",
      "The program delivers weekly live online classes tailored for children, teens, and adult learners. Lessons focus on conversational proficiency, traditional greetings, folklore songs, and proper pronounciation of Urhobo proverbs.",
      "Chapters also organize in-person Urhobo Day cultural exhibitions, youth dance troupes, traditional wrestling demonstrations, and costume showcases that instill lifelong pride in Urhobo ancestral heritage.",
    ],
    objectives: [
      "Enroll over 500 diaspora youths annually in conversational Urhobo language classes",
      "Digitize Urhobo folklore, historical records, and musical traditions for open educational access",
      "Sponsor cultural competitions and scholarships during the annual National Convention",
    ],
  },
];

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedProgram(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="figma-landing-page">
      <SiteHeader />

      {/* Hero with authentic image background */}
      <section className="page-hero programs-hero">
        <Image
          src="https://upuamerica.org/wp-content/uploads/2026/06/DMV-6.jpg"
          alt="UPUA Community Outreach and Programs"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 25%" }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <p className="page-hero-tag">Empowering Our People</p>
          <h1>UPUA Programs & Community Action</h1>
          <p className="page-hero-sub">
            From women's shelters across North America to STEM training, healthcare missions, and humanitarian relief in Urhoboland — turning diaspora unity into tangible progress.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="programs-stats-bar">
        <div className="programs-stat">
          <strong>23+</strong>
          <span>Active Chapters</span>
        </div>
        <div className="programs-stat">
          <strong>16+</strong>
          <span>Women Shelters Supported</span>
        </div>
        <div className="programs-stat">
          <strong>10,000+</strong>
          <span>Medical Patients Treated</span>
        </div>
        <div className="programs-stat">
          <strong>30+ Yrs</strong>
          <span>Annual Conventions</span>
        </div>
      </section>

      {/* Featured Spotlight: Women in Shelter Initiative */}
      <section style={{ background: "#ffffff", padding: "64px clamp(24px, 8vw, 100px)", width: "100%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ color: "#137459", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Signature Community Outreach
            </span>
            <h2 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", margin: "8px 0 12px" }}>
              The Women in Shelter Initiative
            </h2>
            <p style={{ color: "#526359", maxWidth: "750px", margin: "0 auto", fontSize: "15px" }}>
              Across North America, UPUA chapters are giving back — donating time, resources, hygiene items, and love to women's shelters in their local communities. Giving back to those in need is at the heart of who we are.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
            {shelterChapters.map((sc) => (
              <div
                key={sc.chapter}
                style={{
                  background: "#f7faf7",
                  border: "1px solid #e1eae3",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "180px" }}>
                  <Image src={sc.image} alt={sc.chapter} fill style={{ objectFit: "cover" }} sizes="260px" />
                </div>
                <div style={{ padding: "16px 18px", marginTop: "auto" }}>
                  <h4 style={{ color: "#0e3d26", fontSize: "0.95rem", margin: "0 0 4px", fontWeight: 700 }}>{sc.chapter}</h4>
                  <span style={{ color: "#137459", fontSize: "12px", fontWeight: 600 }}>📍 {sc.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Programs Grid with clean, non-overlapping design */}
      <section className="programs-list-section">
        <div className="programs-list-inner">
          <div className="landing-section-heading" style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ color: "#0e3d26" }}>Key Programmatic Pillars</h2>
            <p>Practical interventions advancing education, healthcare, culture, and humanitarian welfare.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px" }}>
            {mainPrograms.map((prog) => (
              <article
                key={prog.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #dce8e0",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(14, 61, 38, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 220ms ease, box-shadow 220ms ease",
                }}
              >
                {/* Image Header with embedded category pill */}
                <div style={{ position: "relative", width: "100%", height: "210px" }}>
                  <Image src={prog.featuredImage} alt={prog.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 380px" />
                  <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(14, 61, 38, 0.92)", color: "#ffffff", padding: "5px 14px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", backdropFilter: "blur(4px)" }}>
                    {prog.category}
                  </div>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: "24px 22px 24px", display: "flex", flexDirection: "column", flex: 1, gap: "14px" }}>
                  <h3 style={{ color: prog.accent, margin: 0, fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.3 }}>
                    {prog.title}
                  </h3>

                  <p style={{ color: "#526359", fontSize: "13.5px", lineHeight: "1.65", margin: 0 }}>
                    {prog.summary}
                  </p>

                  <div style={{ borderTop: "1px solid #eef3ef", paddingTop: "14px", marginTop: "auto" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#14211a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Key Highlights:
                    </div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                      {prog.details.slice(0, 3).map((detail, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12.5px", color: "#526359", lineHeight: 1.5 }}>
                          <CheckCircle2 size={15} color={prog.accent} style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "#f7faf7", border: `1px solid ${prog.accent}33`, borderRadius: "8px", padding: "8px 12px", color: prog.accent, fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🌟 Impact:</span>
                    <span>{prog.impact}</span>
                  </div>

                  {/* View Details Popup Trigger */}
                  <button
                    type="button"
                    className="btn-view-details"
                    style={{ background: prog.accent }}
                    onClick={() => setSelectedProgram(prog)}
                  >
                    View Program Details <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Program Details Modal Popup */}
      {selectedProgram && (
        <div className="upua-modal-backdrop" onClick={() => setSelectedProgram(null)}>
          <div className="upua-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => setSelectedProgram(null)}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <div className="upua-modal-image-wrap">
              <Image
                src={selectedProgram.featuredImage}
                alt={selectedProgram.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="780px"
              />
              <div style={{ position: "absolute", bottom: "16px", left: "20px", background: "rgba(14, 61, 38, 0.9)", color: "#ffffff", padding: "5px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
                {selectedProgram.category}
              </div>
            </div>

            <div className="upua-modal-body">
              <h2 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 2.5vw, 1.95rem)", margin: "0 0 8px", fontWeight: 800 }}>
                {selectedProgram.title}
              </h2>

              <div style={{ background: "#f0f8f3", borderLeft: "4px solid #137459", padding: "12px 16px", borderRadius: "6px", color: "#137459", fontWeight: 700, fontSize: "13.5px" }}>
                📊 Measured Impact: {selectedProgram.impact}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "8px 0 0", fontWeight: 700 }}>
                  Detailed Overview
                </h4>
                {selectedProgram.fullWriteup.map((p, idx) => (
                  <p key={idx} style={{ color: "#526359", fontSize: "14.5px", lineHeight: "1.75", margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>

              <div style={{ marginTop: "12px" }}>
                <h4 style={{ color: "#0e3d26", fontSize: "1.1rem", margin: "0 0 10px", fontWeight: 700 }}>
                  Core Objectives & Deliverables
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedProgram.objectives.map((obj, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "#34454a" }}>
                      <CheckCircle2 size={17} color="#137459" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", marginTop: "20px", borderTop: "1px solid #e1eae3", paddingTop: "20px", flexWrap: "wrap" }}>
                <Link
                  href="/#join-community"
                  className="public-donate-link"
                  style={{ display: "inline-flex", textDecoration: "none", padding: "12px 24px", fontSize: "14px" }}
                  onClick={() => setSelectedProgram(null)}
                >
                  Support This Initiative <Heart size={15} fill="currentColor" style={{ marginLeft: "8px" }} />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  style={{ background: "#f0f2f1", border: "1px solid #d5e0e1", borderRadius: "6px", padding: "12px 22px", fontSize: "14px", fontWeight: 700, color: "#34454a", cursor: "pointer" }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support CTA */}
      <section className="programs-partner-section">
        <div className="programs-partner-inner">
          <div className="programs-partner-text">
            <h2>Partner With UPU America</h2>
            <p>
              Your generous contribution directly funds women’s shelter packages, STEM equipment for Urhobo students, life-saving medicines, and emergency IDP relief. Every dollar strengthens our community.
            </p>
          </div>
          <div className="programs-partner-actions">
            <Link href="/#join-community" className="public-donate-link" style={{ display: "inline-flex", textDecoration: "none", fontSize: "15px", padding: "14px 28px" }}>
              Support Our Programs <Heart size={16} fill="currentColor" style={{ marginLeft: 8 }} />
            </Link>
            <Link href="/about" className="about-cta-secondary" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.45)" }}>
              View Executive Team →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
