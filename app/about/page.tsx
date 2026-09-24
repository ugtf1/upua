import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Heart, Globe, Users, Shield, Award, Landmark, BookOpen, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us – Urhobo Progress Union America",
  description:
    "Urhobo Progress Union America (UPUA) is the umbrella organization of all Urhobo organizations and people resident in North America. Motto: Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress).",
};

const topLeaders = [
  {
    name: "Chief Samuel Ogaga",
    title: "National President, UPUA",
    tagline: '"Okugbe, Egba, Voyan Robaro" (Unity, Strength and Progress)',
    bio: "Serving as the National President of Urhobo Progress Union America, Chief Samuel Ogaga leads the association with a passion for uniting all Urhobo people across North America and preserving the core cultural values, languages, and development of Urhoboland.",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/chief-ogaga-webpix-new.jpeg2_.JPGxxxx-768x1067-1.jpg",
  },
  {
    name: "Mr. Thomas Uwhubetine",
    title: "Chairman, Board of Trustees (BOT)",
    tagline: "MBA, Accountant, RN (retired), JP · President, Urhobo Association of Georgia",
    bio: '“My mission is to move our union forward as attested by our motto: Okugbe, Egba, Voyan Robaro and in the spirit embedded in our national anthem: Edefa me rh\'akpo, Urhobo me warhe (when I reincarnate, I will come through Urhobo). It is time to move UPUA to its rightful place in the 21st century with its own permanent house, offices, and global impact.”',
    image: "https://upuamerica.org/wp-content/uploads/2026/06/UPUA-Mr.-Thomas-Uwhubetine-B.O.T-Chair-r067f4n8nnib7zajo7nz4r4dgwrwa4nreq4uzof8yg.jpg",
  },
];

const executiveTeam = [
  {
    name: "Chief (Dr.) Mrs. Eunice Eruvwetere",
    role: "National Vice President",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/UPUA-Chief-Dr.-Mrs.-Eunice-Eruvwetere-240x300.jpg",
  },
  {
    name: "Chief Godwin Ikporo",
    role: "Secretary-General",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/main-260x300.jpg",
  },
  {
    name: "Ms. Eguonor Tuoyo",
    role: "Assistant Secretary",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/UPUA-Ms.-Eguonor-Tuoyo-Photo-208x300.jpg",
  },
  {
    name: "Mrs. Evelyn Obire-Egbe (Sosime)",
    role: "Director of Membership & Welfare",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/UPUA-Mrs.-Evelyn-Sosime-Photo-225x300.jpg",
  },
  {
    name: "Dr. Abel Okuma",
    role: "Director of Research & Culture",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/UPUA-Dr.-Abel-Okuma-247x300.jpg",
  },
  {
    name: "Mr. Efe Shemi",
    role: "National Treasurer",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/UPUA-Mr.-Efe-Shemi-Photo-1-138x300.jpg",
  },
  {
    name: "Hon. Oghenetega JohnGold",
    role: "Speaker",
    image: "https://upuamerica.org/wp-content/uploads/2026/03/Hon-JohnGold_new.JPGxxx-222x300.jpg",
  },
  {
    name: "Chief Eric Ogbafedje Okoko",
    role: "Director of Publicity",
    image: "https://upuamerica.org/wp-content/uploads/2025/04/Eric-Okoko-Chief-Picture-hat-su-4-3-2025-188x300.jpg",
  },
  {
    name: "Mrs. Betty Ajueyitsi",
    role: "Director of Development",
    image: "https://upuamerica.org/wp-content/uploads/2025/01/UPUA-Mrs.-Betty-Ajueyitsi-Photo-2-197x300.jpg",
  },
  {
    name: "Chief (Dr.) Mrs. Louisa Ukochovwera",
    role: "Deputy BOT Chair / President, UPU Ohio",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/Ohio-1.jpg",
  },
];

const youthWingExco = [
  {
    name: "Oghenekevwe Ajueyitsi",
    role: "Youth Wing President",
    chapter: "UPU DMV",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/KEVWE-292x300.jpeg",
  },
  {
    name: "Praise Asanudje",
    role: "Vice President",
    chapter: "Urhobo/Isoko Ass. Arizona",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/VICE-PRESIDENT-225x300.jpg",
  },
  {
    name: "Favour Okotie",
    role: "Secretary",
    chapter: "UPU Ohio",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/HERE-IS-MINE-225x300.jpeg",
  },
  {
    name: "Jess Oghenefejiro Ikporo",
    role: "Assistant Secretary",
    chapter: "UPU Midland/Odessa, TX",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/JESS-228x300.jpeg",
  },
  {
    name: "Eguolor Sam-Ogaga",
    role: "Treasurer",
    chapter: "Urhobo/Isoko Ass. of Middle Tennessee",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/EGUONOR-225x300.jpeg",
  },
  {
    name: "Ufuoma Agarin",
    role: "Social / Publicity Secretary",
    chapter: "UPU DMV",
    image: "https://upuamerica.org/wp-content/uploads/2026/07/UFUOMA-AGARIN2-171x300.jpeg",
  },
];

const chapters = [
  { name: "Urhobo Progress Union, Northern California (UPUNC)", president: "Chief Gabriel Oghwe-Akateme", region: "West Coast", website: "" },
  { name: "Urhobo Progress Union of Southern California (UPUSC)", president: "Mr. Felix Agbabune", region: "West Coast", website: "" },
  { name: "Urhobo Progressive Association (UPA), Houston", president: "Chief Godspower Oniovosa", region: "Texas / South", website: "https://upahouston.org/" },
  { name: "Urhobo Progressive Union, Midland/Odessa, Texas", president: "Chief Mrs. Vivian Ikporo", region: "Texas / South", website: "https://upumidessa.org" },
  { name: "Urhobo Progress Union of DC, Maryland & Virginia (UPUDMV)", president: "Chief Paul Otu", region: "Mid-Atlantic", website: "https://upudmv.org/" },
  { name: "Urhobo Association of Georgia (UAG)", president: "Mr. Thomas Uwhubetine", region: "Southeast", website: "" },
  { name: "Urhobo Progress Union Chicagoland (UPUC)", president: "Dr. Bernard Rerri", region: "Midwest", website: "" },
  { name: "Urhobo Association (UA) of New York, New Jersey & Connecticut", president: "Mrs. Agatha Osagie-Erese", region: "Northeast", website: "" },
  { name: "Urhobo Congress (UC) of Connecticut", president: "Mr. Charles Ovwasa", region: "Northeast", website: "" },
  { name: "Urhobo Progress Union, Delaware Valley (UPUDV - PA, DE, NJ)", president: "Engr. Akpovoke Shaire / Mrs. Elizabeth Jamaho", region: "Northeast", website: "" },
  { name: "Urhobo Progress Union of Ohio", president: "Chief (Dr.) Mrs. Louisa Ukochovwera", region: "Midwest", website: "" },
  { name: "Urhobo Progress Union, Michigan (UPUMI)", president: "Mr. Paul Edirin Warrence", region: "Midwest", website: "" },
  { name: "Urhobo Progressive Union of Minnesota (UPUM)", president: "Mrs. Ejiro Egi", region: "Midwest", website: "http://upumn.org/" },
  { name: "Urhobo Association of Middle Tennessee (UAMT)", president: "Mr. Jacob Akpoyovware", region: "Southeast", website: "" },
  { name: "Urhobo Progress Union of Central Florida", president: "Mr. Kelvin Oteri", region: "Southeast", website: "" },
  { name: "Urhobo Progress Union, Louisiana", president: "Dr. Deborah Sobotie-Damijo", region: "South", website: "" },
  { name: "Waado Progressive Union of Great Kansas City", president: "Mr. Odafe Alexander Akortha", region: "Midwest", website: "" },
  { name: "Urhobo Cultural and Social Change Society (USCSC) Massachusetts", president: "Mr. Gordon Sekegor", region: "Northeast", website: "" },
  { name: "Urhobo Cultural Association (UCA), St. Louis, Missouri", president: "Mr. Emmanuel Obiebi", region: "Midwest", website: "" },
  { name: "Urhobo-Isoko Association of Arizona", president: "Chief Alexander Joel", region: "Southwest", website: "" },
  { name: "Urhobo Progress Union Las Vegas", president: "Chief Dr. Friday Irorobeje", region: "West", website: "" },
  { name: "Urhobo Progress Union of Calgary, Canada", president: "Dr. Harrison Itoje", region: "Canada", website: "https://urhoboisokocalgary.ca/" },
  { name: "Urhobo Isoko Association of Edmonton, Canada", president: "Chief Dr. Onome Ugbawa", region: "Canada", website: "" },
];

const royalKingdoms = [
  { name: "Owhorode of Olomu Kingdom", king: "HRM Richard Layeguen Ogbon, (JP), PhD, OON, Ogoni Oghoro I" },
  { name: "Ovie of Agbon Kingdom", king: "HRM Mike Omeru Ogurimerime, Ukori I, (CON)" },
  { name: "Ovie of Umiaghwa Abraka Kingdom", king: "HRM Air Vice Marshal Lucky Ochuko Ararile (RTD), Avwaeke I" },
  { name: "Okobaro of Ughievwen Kingdom", king: "HRM Matthew Ediri Egbi, (JP), FOD, Owawha II" },
  { name: "Osuivie of Agbarho Kingdom", king: "HRM Samson Owhe, Ogugu I" },
  { name: "Ovie of Oghara Kingdom", king: "HRM Noble Eshemitan Uku Oghara N'Ame, Orefe III" },
  { name: "Orodje of Okpe Kingdom", king: "HRM Gen. Felix Mujakperuo, (JP), CFR, Orhue I" },
  { name: "Ovie of Uvwie Kingdom", king: "HRM Emmanuel Ekemejewan Sideso, (JP), OON, Abe I" },
  { name: "Ovie of Ughelli Kingdom", king: "HRM Wilson Ojakovo, (JP), Oharisi III" },
  { name: "Ovie of Agbarha-Otor Kingdom", king: "HRM Richard Oghenevwogaga Ebelle, (JP), Okorefe I" },
  { name: "Ovie of Eghwu Kingdom", king: "HRM Jabin Onesa Mukoro, Okpo R'Ufuoma I" },
  { name: "Okpara-Uku of Orogun Kingdom", king: "HRM Matthew Iwemife Akpobi, Omoga I" },
  { name: "Ovie of Ogor Kingdom", king: "HRM Okiemute Onajite, Igere I" },
  { name: "Ovie of Agbarha (Warri) Kingdom", king: "HRM Kingsley Emakpo Orereh" },
  { name: "Ovie of Idjerhe Kingdom", king: "HRM Monday Obukowho Whiskey, Udurhie I" },
  { name: "Orosuen of Okere Kingdom", king: "HRM Emmanuel Okumagba II" },
  { name: "Ovie of Evwreni Kingdom", king: "HRM Oghenekevwe Owin Kuname, Eruvwedede III" },
  { name: "Ovie of Mosogar Kingdom", king: "HRM Samson Omene, Udurhie I" },
  { name: "Ovie of Oruarivie Abraka Kingdom", king: "HRM Akpomeyoma Majoroh, Ojeta II" },
  { name: "Odion Rhode of Uwheru Kingdom", king: "HRM Agbovwe Afugbeya, Oyise II" },
  { name: "Ovie of Arhavwarien Kingdom", king: "HRM Solomon Okporhiere, Okukeren III" },
  { name: "Ovie of Okparabe Kingdom", king: "HRM Andrew Oghenevwodo, Osakpa III" },
  { name: "Ovie of Udu Kingdom", king: "HRM Barr. Bethel Delekpe, Owhorhu I" },
  { name: "Orovworere of Effurun-Otor Kingdom", king: "HRM Dr. King Johnson Enemudia Oyovwino, (JP), Duku II" },
];

export default function AboutPage() {
  return (
    <div className="figma-landing-page">
      <SiteHeader />

      {/* Hero with authentic image background */}
      <section className="page-hero about-hero">
        <Image
          src="https://upuamerica.org/wp-content/uploads/2026/06/Congress-1.jpg"
          alt="UPUA National Congress and Gathering"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <p className="page-hero-tag">Official UPUA Heritage</p>
          <h1>About Urhobo Progress Union America</h1>
          <p className="page-hero-sub">
            Developing Urhobo Culture and Ideals · “Okugbe, Egba, Voyan Robaro” (Unity, Strength and Progress)
          </p>
        </div>
      </section>

      {/* Official History & Accreditation */}
      <section className="about-mission-section">
        <div className="about-mission-grid">
          <div className="about-mission-block">
            <span className="about-label">Historical Foundation</span>
            <h2>The Umbrella Organization of the Urhobo Diaspora</h2>
            <span className="mission-rule" />
            <p>
              <strong>Urhobo Progress Union America (UPUA)</strong> is the umbrella organization of all Urhobo organizations and people resident in North America. In December 2003, it was formally recognized and accredited at the annual Urhobo Day Congress held in the auditorium of the Petroleum Training Institute (PTI), Effurun, Delta State, Nigeria, by the <strong>Urhobo Progress Union (UPU) Worldwide</strong> — the mother organization of all Urhobo people globally.
            </p>
            <p>
              This historic event occurred during the administration of former President <strong>Dr. Austin Atiyota (2003–2007)</strong>. Urhobo Progress Union America membership is open to all Urhobo people by birth, marriage, or by adoption of Urhobo ethnicity and culture.
            </p>
            <p>
              The day-to-day administration of the association is the responsibility of the Executive Committee (EC) headed by the National President, elected at the annual convention for a 2-year term. The policy-making body is the <strong>Board of Trustees (BOT)</strong>, comprising the Presidents of the various UPUA local chapters across North America.
            </p>
          </div>
          <div className="about-vision-cards">
            <div className="about-stat-card">
              <strong>Dec 2003</strong>
              <span>Accredited at PTI Effurun</span>
            </div>
            <div className="about-stat-card">
              <strong>23+</strong>
              <span>Accredited Chapters</span>
            </div>
            <div className="about-stat-card">
              <strong>24</strong>
              <span>Urhobo Royal Kingdoms</span>
            </div>
            <div className="about-stat-card">
              <strong>100%</strong>
              <span>Volunteer Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision from UPUA */}
      <section className="about-values-section" style={{ background: "#f1f6f3" }}>
        <div className="about-values-inner">
          <div className="landing-section-heading" style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ color: "#0e3d26" }}>Our Mission & Vision</h2>
            <p>Guided by our ancestral heritage and progressive vision for generations unborn.</p>
          </div>
          <div className="about-values-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="about-value-card" style={{ borderLeft: "4px solid #137459" }}>
              <span className="about-value-icon">🎯</span>
              <h3>Our Mission</h3>
              <p>
                To unite people of Urhobo descent and others who identify with the Urhobo people and culture, both abroad and at home, for the promotion of human development and Urhobo culture and ideals. Our nonprofit association promotes charitable, scientific, literary, and educational projects in North America and Nigeria.
              </p>
            </div>
            <div className="about-value-card" style={{ borderLeft: "4px solid #e7c326" }}>
              <span className="about-value-icon">👁️</span>
              <h3>Our Vision</h3>
              <p>
                UPU America members value our common ancestry and cultural heritage. Our organization believes in the critical importance of passing on to our children the positive aspects of Urhobo culture and values. As a nonprofit organization, we recognize the importance of giving back to our host communities, Urhoboland, and North America in general.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* National Leadership Feature: President & BOT Chairman with large prominent portraits */}
      <section className="about-exec-section">
        <div className="about-exec-inner">
          <div className="landing-section-heading" style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2>National Leadership</h2>
            <p>Guiding UPU America with integrity, cultural pride, and 21st-century administrative excellence.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "36px", marginBottom: "56px" }}>
            {topLeaders.map((leader, index) => (
              <div key={leader.name} className="leader-featured-card">
                <div className="leader-portrait-wrap">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    priority
                    style={{
                      objectFit: "cover",
                      objectPosition: index === 0 ? "center 12%" : "center 15%",
                    }}
                    sizes="(max-width: 820px) 280px, 320px"
                  />
                  <div style={{ position: "absolute", bottom: 0, insetInline: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)", padding: "12px 14px", textAlign: "center" }}>
                    <span style={{ color: "#e7c326", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {index === 0 ? "Presidential Office" : "BOT Executive"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ background: "#e8f5ef", color: "#0e3d26", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {leader.title}
                    </span>
                  </div>
                  <h3 style={{ color: "#0e3d26", fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)", margin: "4px 0", fontWeight: 800 }}>
                    {leader.name}
                  </h3>
                  <p style={{ color: "#b08000", fontWeight: 700, fontSize: "13.5px", margin: "0 0 6px", fontStyle: "italic" }}>
                    {leader.tagline}
                  </p>
                  <p style={{ color: "#526359", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Full Executive Team Grid */}
          <div className="landing-section-heading" style={{ textAlign: "center", margin: "48px auto 32px" }}>
            <h3 style={{ color: "#0e3d26", fontSize: "1.5rem" }}>The Executive Committee (EC)</h3>
            <p>Elected officers managing day-to-day administrative and developmental portfolios.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px", marginBottom: "56px" }}>
            {executiveTeam.map((exec) => (
              <div
                key={exec.name}
                style={{
                  background: "#f7faf7",
                  border: "1px solid #e1eae3",
                  borderRadius: "14px",
                  padding: "20px 16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", position: "relative", marginBottom: "14px", border: "2px solid #137459" }}>
                  <Image src={exec.image} alt={exec.name} fill style={{ objectFit: "cover" }} sizes="96px" />
                </div>
                <h4 style={{ color: "#0e3d26", fontSize: "1rem", margin: "0 0 4px", fontWeight: 700 }}>{exec.name}</h4>
                <span style={{ color: "#137459", fontSize: "12px", fontWeight: 600 }}>{exec.role}</span>
              </div>
            ))}
          </div>

          {/* UPUAYA (Youth Wing) Exco */}
          <div className="landing-section-heading" style={{ textAlign: "center", margin: "48px auto 32px" }}>
            <h3 style={{ color: "#003e53", fontSize: "1.5rem" }}>UPUAYA Executive Council (Youth Wing)</h3>
            <p>Empowering dynamic Urhobo young professionals and students across the United States.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {youthWingExco.map((youth) => (
              <div
                key={youth.name}
                style={{
                  background: "#ffffff",
                  border: "1px solid #d5e0e1",
                  borderRadius: "12px",
                  padding: "18px 14px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", position: "relative", margin: "0 auto 12px", border: "2px solid #e7c326" }}>
                  <Image src={youth.image} alt={youth.name} fill style={{ objectFit: "cover" }} sizes="80px" />
                </div>
                <h5 style={{ color: "#003e53", fontSize: "0.95rem", margin: "0 0 2px", fontWeight: 700 }}>{youth.name}</h5>
                <span style={{ color: "#137459", fontSize: "11px", fontWeight: 700, display: "block", textTransform: "uppercase" }}>{youth.role}</span>
                <small style={{ color: "#787878", fontSize: "11px" }}>{youth.chapter}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Across America */}
      <section className="about-branches-section" id="chapters">
        <div className="about-branches-inner">
          <div className="landing-section-heading" style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2>UPUA Chapters Across America</h2>
            <p>Grassroots Urhobo communities united under the UPUA Board of Trustees (BOT).</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {chapters.map((ch) => (
              <article key={ch.name} className="about-branch-card">
                <div className="about-branch-header">
                  <span className="about-branch-dot" />
                  <span style={{ color: "#e7c326", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{ch.region}</span>
                </div>
                <h3>{ch.name}</h3>
                <p style={{ margin: "8px 0 12px", color: "rgba(255,255,255,0.85)", fontSize: "13.5px" }}>
                  <strong>President:</strong> {ch.president}
                </p>
                {ch.website && (
                  <a
                    href={ch.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#e7c326", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "underline" }}
                  >
                    Visit Chapter Website <ExternalLink size={12} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Urhobo Royal Kingdoms & Royal Fathers */}
      <section className="about-values-section" style={{ background: "#ffffff" }}>
        <div className="about-values-inner">
          <div className="landing-section-heading" style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ color: "#0e3d26" }}>The 24 Urhobo Royal Kingdoms</h2>
            <p>Honoring our traditional heritage, ancient dynasties, and Royal Fathers.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "16px" }}>
            {royalKingdoms.map((k) => (
              <div
                key={k.name}
                style={{
                  background: "#f7faf7",
                  border: "1px solid #e1eae3",
                  borderRadius: "10px",
                  padding: "16px 18px",
                }}
              >
                <div style={{ color: "#137459", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                  👑 {k.name}
                </div>
                <div style={{ color: "#526359", fontSize: "12.5px", lineHeight: "1.4" }}>
                  {k.king}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urhobo National Anthem */}
      <section style={{ background: "#0e3d26", color: "#ffffff", padding: "64px 24px", width: "100%" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ background: "rgba(255,255,255,0.15)", color: "#e7c326", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Urhobo Heritage
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "#ffffff", margin: "16px 0 8px" }}>
            The Urhobo National Anthem
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", marginBottom: "36px" }}>
            The sacred anthem echoing the royal lineage and eternal bond of all Urhobo people.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", textAlign: "left" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "28px 24px" }}>
              <h4 style={{ color: "#e7c326", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
                In Urhobo Language
              </h4>
              <p style={{ fontStyle: "italic", lineHeight: "1.8", fontSize: "14.5px", color: "rgba(255,255,255,0.92)", margin: 0 }}>
                Urhobo eh, Orere r’Ivie sa-a.<br />
                Urhobo eh, Orere r’Ivie sa-a.<br />
                Urhobo kokore Ogbare eh,<br />
                Urhobo eh, Orere r’Ivie sa-a.<br />
                Obo r’Urhobo jevwe na,<br />
                Aso ‘fa jevwe otio ye-eh.<br />
                Edefa me rhiakpo, Urhobo me wan rhe,<br />
                Urhobo eh, Orere r’Ivie sa-a Anoma-a.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "28px 24px" }}>
              <h4 style={{ color: "#e7c326", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
                English Translation
              </h4>
              <p style={{ lineHeight: "1.8", fontSize: "14px", color: "rgba(255,255,255,0.85)", margin: 0 }}>
                Hail Urhobo, distinct land of royal people.<br />
                Hail Urhobo, distinct land of royal people.<br />
                Arise together, the time has come.<br />
                Hail Urhobo, distinct land of royal people.<br />
                The love I have for Urhobo<br />
                Surpasses the love I have for any other place.<br />
                When next I come to this world,<br />
                I will come as Urhobo.<br />
                Hail Urhobo, distinct land of royal people — no doubt about this assertion!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="about-cta-inner">
          <h2>Be Part of the Urhobo Progress Story</h2>
          <p>Whether by birth, marriage, or cultural affinity — join your local UPUA chapter or become an associate member today.</p>
          <div className="about-cta-buttons">
            <Link href="/#join-community" className="public-donate-link" style={{ display: "inline-flex", textDecoration: "none" }}>
              Request Membership <Heart size={15} fill="currentColor" style={{ marginLeft: 8 }} />
            </Link>
            <Link href="/programs" className="about-cta-secondary">
              Explore Our Programs →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
