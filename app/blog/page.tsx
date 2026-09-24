"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Search, Calendar, User, ArrowRight, X, Heart, Share2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  excerpt: string;
  featured: boolean;
  content: string[];
}

const categories = ["All", "Community", "Programs", "Convention", "Humanitarian", "Leadership", "Culture"];

const blogPosts: BlogPost[] = [
  {
    id: "women-in-shelter-national",
    title: "Across North America: UPUA Chapters Unite for Women in Shelter Initiative",
    category: "Community",
    date: "June 28, 2024",
    readTime: "4 min read",
    author: "UPUA Communications",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/DMV-6.jpg",
    excerpt:
      "From Southern California and Chicagoland to Delaware Valley, Michigan, and the DMV, UPUA chapters mobilized nationwide to donate essential hygiene packages, clothing, supplies, and warmth to local women’s shelters. Giving back to host communities is central to the Urhobo ethos.",
    featured: true,
    content: [
      "In a coordinated nationwide display of humanitarian service, chapters of the Urhobo Progress Union America (UPUA) across sixteen metropolitan areas have conducted in-person donation drives at women’s emergency shelters.",
      "The Women in Shelter Initiative was designed to support women and children escaping domestic hardship, displacement, and economic vulnerability. Chapter delegations delivered hundreds of custom hygiene packs containing personal care products, warm blankets, winter garments, and infant care necessities.",
      "National leadership praised the initiative, emphasizing that the Urhobo culture has always held community generosity and care for the vulnerable as sacred duties. Municipal officials in Detroit, Columbus, and Washington D.C. expressed sincere gratitude to UPUA for their sustained civic leadership.",
      "UPUA plans to expand the initiative to all active North American chapters, establishing permanent philanthropic partnerships with certified shelter organizations across the United States and Canada.",
    ],
  },
  {
    id: "stem-ai-training-urhoboland",
    title: "STEM & Artificial Intelligence (AI) Training Launched for Urhobo Students",
    category: "Programs",
    date: "June 28, 2024",
    readTime: "5 min read",
    author: "Director of Research & Culture",
    image: "/update-stem.jpg",
    excerpt:
      "UPU America completed a transformative digital skills training program in Delta State secondary schools, equipping Urhobo youth with hands-on coding, robotics, and generative AI literacy to prepare them for global technological careers.",
    featured: false,
    content: [
      "Recognizing the critical role of modern technology in economic development, UPU America completed the first phase of its flagship STEM and Artificial Intelligence training tour across selected secondary schools in Delta State.",
      "Over 450 students participated in intensive hands-on modules covering basic algorithms, Python programming, web development fundamentals, and practical applications of artificial intelligence.",
      "The program was organized by the UPUA Research and Culture Directorate in partnership with computer science faculty from Delta State University. Selected schools were also gifted modern desktop computers and internet access routers.",
      "“We want Urhobo children to not merely be consumers of technology, but architects and innovators who lead Africa’s digital revolution,” stated the Program Director during the closing ceremony in Effurun.",
    ],
  },
  {
    id: "bot-chair-21st-century-vision",
    title: 'BOT Chairman Mr. Thomas Uwhubetine: "Moving UPUA to Its Rightful 21st-Century Place"',
    category: "Leadership",
    date: "May 15, 2024",
    readTime: "4 min read",
    author: "Board of Trustees (BOT)",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/UPUA-Mr.-Thomas-Uwhubetine-B.O.T-Chair-r067f4n8nnib7zajo7nz4r4dgwrwa4nreq4uzof8yg.jpg",
    excerpt:
      'In a landmark address to the Board of Trustees, Chairman Thomas Uwhubetine outlined a vision to establish permanent UPUA headquarters, expand full-time administrative capacity, and operationalize our motto: "Okugbe, Egba, Voyan Robaro".',
    featured: false,
    content: [
      "During the second quarter Board of Trustees session, BOT Chairman Mr. Thomas Uwhubetine presented a transformative roadmap aimed at modernizing the organizational architecture of UPU America.",
      "Addressing Chapter Presidents and trustees, Chairman Uwhubetine remarked: “Our union has built a proud thirty-year legacy. It is now imperative that we transition UPUA from an informal model to a fully institutionalized 21st-century non-profit with permanent office facilities, salaried executive staffing, and digital governance.”",
      "Key initiatives outlined include the acquisition of a national UPUA secretariat building, the formalization of youth leadership pipelines through UPUAYA, and the creation of an endowment fund to guarantee uninterrupted support for homeland development initiatives.",
      "Trustees unanimously commended the strategic vision, establishing a fundraising committee to spearhead the permanent headquarters campaign.",
    ],
  },
  {
    id: "okuama-idp-humanitarian-donation",
    title: "UPU America Delivers Critical Emergency Relief to Okuama IDP Families",
    category: "Humanitarian",
    date: "April 18, 2024",
    readTime: "3 min read",
    author: "UPUA Welfare Committee",
    image: "/update-news.jpg",
    excerpt:
      "Responding to the plight of displaced residents from Okuama in Delta State, UPU America mobilized humanitarian donations, food staples, bedding, and medical assistance to ease the hardship of displaced women and children.",
    featured: false,
    content: [
      "Following the displacement crisis in Okuama, Delta State, the Executive Committee of UPU America initiated an urgent humanitarian relief campaign across its North American chapters.",
      "Through member donations and matching contributions, the association raised and disbursed significant emergency relief supplies. Consignments included bags of rice, garri, clean drinking water filtration systems, sleeping mats, and essential emergency medicines.",
      "A trusted committee of local humanitarian observers and religious leaders supervised the equitable distribution directly to displaced mothers, children, and elderly persons in temporary transit shelters.",
      "UPUA continues to call upon both Delta State and federal authorities to expedite permanent rehabilitation, community reconstruction, and the peaceful restoration of livelihoods for the Okuama people.",
    ],
  },
  {
    id: "annual-convention-celebration",
    title: "Annual UPU America National Convention Celebrates Urhobo Unity & Heritage",
    category: "Convention",
    date: "March 20, 2024",
    readTime: "6 min read",
    author: "National Publicity Committee",
    image: "/update-convention.jpg",
    excerpt:
      "Delegates from all 23 North American chapters, joined by Royal Fathers from Delta State, convened for the grand UPUA Annual Convention featuring cultural exhibitions, youth summits, business symposiums, and the traditional gala dinner.",
    featured: false,
    content: [
      "The Annual Urhobo Progress Union America National Convention concluded in grand fashion after three days of cultural celebration, policy deliberations, and fraternal fellowship.",
      "The convention kicked off with the General Assembly of Delegates presided over by National President Chief Samuel Ogaga and the Board of Trustees. Key constitutional amendments were reviewed and audited financial reports presented.",
      "The economic summit brought together diaspora entrepreneurs and homeland investors to explore agricultural value chains, solar electrification, and educational technology partnerships in Delta State.",
      "The highlight of the weekend was the Cultural Gala, featuring traditional royal dance performances, authentic Urhobo culinary displays, and an inspiring speech by visiting Royal Fathers affirming the unbreakable bond between homeland and diaspora.",
    ],
  },
  {
    id: "medical-outreach-worldwide-conference",
    title: "UPU America Medical Outreach Delivers Free Care to Thousands in Warri",
    category: "Programs",
    date: "February 12, 2024",
    readTime: "4 min read",
    author: "Medical Outreach Team",
    image: "/update-outreach.jpg",
    excerpt:
      "During the UPU Worldwide Conference in Delta State, volunteer diaspora medical professionals treated thousands of patients, dispensed free prescription medications, and provided optical screenings and free reading glasses.",
    featured: false,
    content: [
      "A dedicated team of diaspora healthcare practitioners representing UPU America carried out a massive free medical mission on the sidelines of the annual UPU Worldwide Conference in Delta State.",
      "Over the course of three clinical days, volunteer doctors, pharmacists, and nurses treated more than 2,800 patients. Clinical services included chronic hypertension and diabetes management, malaria treatments, pediatric assessments, and minor outpatient surgical procedures.",
      "In addition, an optical clinic conducted over 1,200 eye exams and distributed free prescription eyeglasses to elderly community members suffering from presbyopia and refractive vision impairments.",
      "Local community leaders and royal heads expressed deep appreciation for UPUA's enduring commitment to the physical health and well-being of their ancestral homeland.",
    ],
  },
  {
    id: "youth-wing-upuaya-inauguration",
    title: "UPUAYA: Youth Wing Mobilizes Next Generation of Urhobo Leaders in America",
    category: "Leadership",
    date: "January 25, 2024",
    readTime: "3 min read",
    author: "UPUAYA Council",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/KEVWE-292x300.jpeg",
    excerpt:
      "Led by Youth President Oghenekevwe Ajueyitsi and council executives from Arizona, Ohio, Texas, and DMV, UPUAYA launched collegiate mentorship networks and professional forums connecting young Urhobo scholars.",
    featured: false,
    content: [
      "The Urhobo Progress Union America Youth Wing (UPUAYA) has officially inaugurated its nationwide executive council, ushering in an exciting era of youth empowerment and cultural continuity.",
      "Under the leadership of National Youth President Oghenekevwe Ajueyitsi, UPUAYA has rolled out three signature initiatives: a collegiate mentorship program pairing university students with seasoned professionals, a quarterly career development webinar series, and an annual diaspora youth exchange.",
      "“We want young Urhobo Americans to be proud of who they are, connected to their cultural roots, and equipped with the professional networks necessary to excel in medicine, law, engineering, and entrepreneurship,” stated Ajueyitsi.",
      "UPUAYA will host its annual National Youth Summit during the upcoming UPUA Convention.",
    ],
  },
  {
    id: "urhobo-language-immersion-online",
    title: 'Passing on the Heritage: "Edefa Me Rh\'akpo, Urhobo Me Warhe" Language Classes',
    category: "Culture",
    date: "December 10, 2023",
    readTime: "4 min read",
    author: "Research & Culture Directorate",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/SolCal-4.jpg",
    excerpt:
      "New interactive online Urhobo language and folklore sessions were introduced for children and teenagers across all chapters, ensuring diaspora youth proudly converse in their mother tongue.",
    featured: false,
    content: [
      "In fulfilment of its cultural preservation mandate, the UPUA Directorate of Research and Culture launched interactive digital language classes for diaspora children across the United States and Canada.",
      "The courses are divided into age-appropriate modules: beginner phonics for children aged 5–10, conversational Urhobo for teenagers, and adult conversational masterclasses for members eager to reconnect with their native dialect.",
      "Taught by certified native-speaking linguistic educators, the lessons incorporate interactive games, Urhobo folktales, proverbs, and traditional songs.",
      "Over 300 students have enrolled across the inaugural cohort, receiving praise from parents thrilled to hear their children greeting elders in fluent Urhobo.",
    ],
  },
  {
    id: "michigan-shelter-initiative",
    title: "UPU Michigan Chapter Leads Thanksgiving Outreach to Local Shelter",
    category: "Community",
    date: "November 28, 2023",
    readTime: "3 min read",
    author: "UPU Michigan",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/Michigan-2.jpg",
    excerpt:
      "Members of Urhobo Progress Union Michigan visited Detroit women's shelters with essential personal care supplies and winter coats, representing the spirit of Urhobo philanthropy in the Great Lakes region.",
    featured: false,
    content: [
      "As winter temperatures descended on the Great Lakes, the executive and members of Urhobo Progress Union Michigan (UPUMI) visited two women’s shelters in the metropolitan Detroit area.",
      "The chapter donated thermal coats, insulated boots, personal hygiene kits, and baby care hampers to assist families seeking transitional shelter.",
      "Chapter President Mr. Paul Edirin Warrence remarked: “UPUA is deeply rooted in the American communities where our members live, work, and raise families. Giving back during the Thanksgiving season is our way of sharing God's blessings and honoring Urhobo values.”",
      "Shelter administrators commended UPUMI for their consistent annual donations and community volunteerism.",
    ],
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedPost(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchCategory = activeCategory === "All" || post.category === activeCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = blogPosts.find((p) => p.featured) || blogPosts[0];

  return (
    <div className="figma-landing-page">
      <SiteHeader />

      {/* Hero with authentic image background */}
      <section className="page-hero blog-hero">
        <Image
          src="https://upuamerica.org/wp-content/uploads/2026/06/SolCal-4.jpg"
          alt="UPUA News, Updates and Cultural Gatherings"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <p className="page-hero-tag">News & Field Updates</p>
          <h1>Updates from UPU America</h1>
          <p className="page-hero-sub">
            Authentic stories, chapter reports, and developmental news on UPU America and our programs across North America and Urhoboland.
          </p>
        </div>
      </section>

      {/* Featured Headline Story */}
      <section className="blog-featured-section">
        <div className="blog-featured-inner">
          <div className="blog-featured-badge">Featured Story</div>
          <article className="blog-featured-card">
            <div style={{ position: "relative", minHeight: "340px", width: "100%" }}>
              <Image src={featured.image} alt={featured.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 400px" priority />
            </div>
            <div className="blog-featured-content">
              <div className="blog-post-meta">
                <span className="blog-tag" style={{ background: "rgba(19, 116, 89, 0.12)", color: "#137459" }}>
                  {featured.category}
                </span>
                <time className="blog-date">📅 {featured.date}</time>
                <span className="blog-read-time">⏱️ {featured.readTime}</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="blog-post-footer">
                <span className="blog-author">By {featured.author}</span>
                <button
                  type="button"
                  className="blog-read-btn"
                  onClick={() => setSelectedPost(featured)}
                >
                  Read Full Story →
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Sticky Filter & Search Bar */}
      <section className="blog-filter-section">
        <div className="blog-filter-inner">
          <div className="blog-category-pills">
            {categories.map((cat) => (
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
              placeholder="Search news & updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section">
        <div className="blog-grid-inner">
          {filteredPosts.length === 0 ? (
            <div className="blog-empty">
              <p>No stories found matching your filter. Try clearing the search query or selecting "All".</p>
            </div>
          ) : (
            <div className="blog-posts-grid">
              {filteredPosts.map((post) => (
                <article className="blog-post-card" key={post.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", height: "200px" }}>
                    <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} sizes="360px" />
                    <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(14, 61, 38, 0.9)", color: "#ffffff", padding: "3px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
                      {post.category}
                    </span>
                  </div>

                  <div className="blog-post-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="blog-post-meta" style={{ marginBottom: "8px" }}>
                      <time className="blog-date" style={{ color: "#787878", fontSize: "11px" }}>{post.date}</time>
                      <span className="blog-read-time" style={{ color: "#787878", fontSize: "11px" }}>· {post.readTime}</span>
                    </div>

                    <h3>{post.title}</h3>
                    <p style={{ flex: 1 }}>{post.excerpt}</p>

                    <div className="blog-post-footer" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #e1eae3", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span className="blog-author" style={{ fontSize: "11.5px", color: "#526359" }}>✍️ By {post.author}</span>
                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={() => setSelectedPost(post)}
                      >
                        Read Full Story <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Article Detail Modal Popup */}
      {selectedPost && (
        <div className="upua-modal-backdrop" onClick={() => setSelectedPost(null)}>
          <div className="upua-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
            >
              <X size={20} />
            </button>

            <div className="upua-modal-image-wrap">
              <Image
                src={selectedPost.image}
                alt={selectedPost.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="780px"
              />
              <div style={{ position: "absolute", bottom: "16px", left: "20px", background: "rgba(14, 61, 38, 0.9)", color: "#ffffff", padding: "5px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
                {selectedPost.category}
              </div>
            </div>

            <div className="upua-modal-body">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", color: "#667085", fontSize: "13px" }}>
                <span>📅 {selectedPost.date}</span>
                <span>•</span>
                <span>⏱️ {selectedPost.readTime}</span>
                <span>•</span>
                <span style={{ color: "#137459", fontWeight: 700 }}>✍️ By {selectedPost.author}</span>
              </div>

              <h2 style={{ color: "#0e3d26", fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem, 2.3vw, 1.85rem)", margin: "4px 0 10px", fontWeight: 800, lineHeight: 1.3 }}>
                {selectedPost.title}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
                {selectedPost.content.map((paragraph, idx) => (
                  <p key={idx} style={{ color: "#34454a", fontSize: "15px", lineHeight: "1.8", margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", borderTop: "1px solid #e1eae3", paddingTop: "20px", flexWrap: "wrap", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: "#787878" }}>
                  Published by Urhobo Progress Union America Communications Directorate
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  style={{ background: "#0e3d26", color: "#ffffff", border: 0, borderRadius: "6px", padding: "10px 22px", fontSize: "13.5px", fontWeight: 700, cursor: "pointer" }}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <section className="blog-newsletter-section">
        <div className="blog-newsletter-inner">
          <h2>Subscribe to UPUA Dispatch</h2>
          <p>
            Stay informed with official press releases, convention announcements, chapter spotlights, and cultural events delivered to your inbox.
          </p>
          <form className="blog-newsletter-form">
            <input type="email" placeholder="Enter your email address" aria-label="Email address" />
            <button type="button">Subscribe Free</button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
