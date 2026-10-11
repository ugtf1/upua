"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, MapPin, Quote, ChevronDown, ChevronUp } from "lucide-react";

interface Trustee {
  slug: string;
  name: string;
  title: string;
  chapter: string;
  localPath: string;
}

const TRUSTEES: Trustee[] = [
  {
    slug: "thomas-uwhubetine-chair",
    name: "Mr. Thomas Uwhubetine",
    title: "Chairman, Board of Trustees",
    chapter: "President, Urhobo Association of Georgia",
    localPath: "/assets/bot/thomas-uwhubetine-chair.jpg",
  },
  {
    slug: "samuel-ogaga",
    name: "Chief Samuel Ogaga",
    title: "National President, UPU America",
    chapter: "UPU America",
    localPath: "/assets/bot/samuel-ogaga.jpg",
  },
  {
    slug: "louisa-ukochovwera",
    name: "Chief (Dr.) Mrs. Louisa Ukochovwera",
    title: "Deputy BOT Chair",
    chapter: "President, UPU Ohio",
    localPath: "/assets/bot/louisa-ukochovwera.jpeg",
  },
  {
    slug: "godspower-oniovosa",
    name: "Chief Godspower Oniovosa",
    title: "Trustee",
    chapter: "President, Urhobo Progress Association, Houston",
    localPath: "/assets/bot/godspower-oniovosa.jpg",
  },
  {
    slug: "vivian-ikporo",
    name: "Chief Mrs. Vivian Ikporo",
    title: "Trustee",
    chapter: "President, UPU Midland/Odessa, Texas",
    localPath: "/assets/bot/vivian-ikporo.png",
  },
  {
    slug: "paul-warrence",
    name: "Mr. Paul Edirin Warrence",
    title: "Trustee",
    chapter: "President, UPU Michigan",
    localPath: "/assets/bot/paul-warrence.jpg",
  },
  {
    slug: "agatha-osagie-erese",
    name: "Mrs. Agatha Osagie-Erese",
    title: "Trustee",
    chapter: "President, UA New York, New Jersey & Connecticut",
    localPath: "/assets/bot/agatha-osagie-erese.png",
  },
  {
    slug: "felix-agbabune",
    name: "Mr. Felix Agbabune",
    title: "Trustee",
    chapter: "President, UPU Southern California",
    localPath: "/assets/bot/felix-agbabune.jpg",
  },
  {
    slug: "gordon-sekegor",
    name: "Mr. Gordon Sekegor",
    title: "Trustee",
    chapter: "President, UPU Massachusetts",
    localPath: "/assets/bot/gordon-sekegor.jpg",
  },
  {
    slug: "kelvin-oteri",
    name: "Mr. Kelvin Oteri",
    title: "Trustee",
    chapter: "President, UPU Central Florida",
    localPath: "/assets/bot/kelvin-oteri.jpg",
  },
  {
    slug: "elizabeth-jamaho",
    name: "Mrs. Elizabeth Jamaho",
    title: "Trustee",
    chapter: "President, UPU Delaware-Valley",
    localPath: "/assets/bot/elizabeth-jamaho.jpg",
  },
  {
    slug: "onome-ugbawa",
    name: "Chief Dr. Onome Ugbawa",
    title: "Trustee",
    chapter: "President, UIA Edmonton, Canada",
    localPath: "/assets/bot/onome-ugbawa.jpg",
  },
  {
    slug: "alexander-joel",
    name: "Chief Alexander Joel",
    title: "Trustee",
    chapter: "President, Urhobo-Isoko Association, Arizona",
    localPath: "/assets/bot/alexander-joel.jpg",
  },
  {
    slug: "friday-irorobeje",
    name: "Chief Dr. Friday Irorobeje",
    title: "Trustee",
    chapter: "President, UPU Las Vegas",
    localPath: "/assets/bot/friday-irorobeje.jpg",
  },
  {
    slug: "harrison-itoje",
    name: "Dr. Harrison Itoje",
    title: "Trustee",
    chapter: "President, Urhobo-Isoko Association, Calgary, Canada",
    localPath: "/assets/bot/harrison-itoje.jpeg",
  },
  {
    slug: "jacob-akpoyovware",
    name: "Mr. Jacob Akpoyovware",
    title: "Trustee",
    chapter: "President, Urhobo-Isoko Ass. of Middle Tennessee",
    localPath: "/assets/bot/jacob-akpoyovware.jpg",
  },
  {
    slug: "ejiroghene-egi",
    name: "Mrs. Ejiroghene Egi",
    title: "Trustee",
    chapter: "President, UPU Minnesota",
    localPath: "/assets/bot/ejiroghene-egi.png",
  },
  {
    slug: "paul-otu",
    name: "Chief Paul Otu",
    title: "Trustee",
    chapter: "President, UPU D.C., Maryland, Virginia (DMV)",
    localPath: "/assets/bot/paul-otu.jpg",
  },
  {
    slug: "benard-rerri",
    name: "Dr. Benard Rerri",
    title: "Trustee",
    chapter: "President, UPU Chicagoland",
    localPath: "/assets/bot/benard-rerri.jpg",
  },
  {
    slug: "charles-ovwasa",
    name: "Mr. Charles Ovwasa",
    title: "Trustee",
    chapter: "President, Urhobo Congress, New York",
    localPath: "/assets/bot/charles-ovwasa.jpg",
  },
  {
    slug: "gabriel-oghwe-akateme",
    name: "Chief Gabriel Oghwe-Akateme",
    title: "Trustee",
    chapter: "President, UPU Northern California",
    localPath: "/assets/bot/gabriel-oghwe-akateme.jpg",
  },
  {
    slug: "odafe-akortha",
    name: "Mr. Odafe Alexander Akortha",
    title: "Trustee",
    chapter: "President, Waado Progressive Union, Kansas City",
    localPath: "/assets/bot/odafe-akortha.jpg",
  },
  {
    slug: "deborah-sobotie-damijo",
    name: "Dr. Deborah Sobotie-Damijo",
    title: "Trustee",
    chapter: "President, UPU Louisiana",
    localPath: "/assets/bot/deborah-sobotie-damijo.jpg",
  },
  {
    slug: "emmanuel-obiebi",
    name: "Mr. Emmanuel Obiebi",
    title: "Trustee",
    chapter: "President, Urhobo Cultural Association, MO",
    localPath: "/assets/bot/emmanuel-obiebi.jpg",
  },
];

export default function BoardOfTrusteesSection() {
  const [showAll, setShowAll] = useState(false);

  // Show first 12 initially, with a clean "View All 24 Trustees" toggle
  const displayedTrustees = showAll ? TRUSTEES : TRUSTEES.slice(0, 12);

  return (
    <section className="bot-section" id="board-of-trustees" aria-labelledby="bot-heading">
      <div className="bot-container">
        {/* Section Header */}
        <div className="bot-header">
          <div className="bot-header-badge">
            <ShieldCheck size={16} />
            <span>Governance &amp; Stewardship</span>
          </div>
          <h2 id="bot-heading" className="bot-title">
            Board of <span className="heading-gold-accent">Trustees (BOT)</span>
          </h2>
          <p className="bot-subtitle">
            Comprising our Chapter Presidents and distinguished elders across North America, guiding constitutional governance, institutional stability, and our 21st-century vision.
          </p>
        </div>

        {/* Chairman's Message Spotlight Card */}
        <div className="bot-spotlight-card">
          <div className="bot-spotlight-text">
            <div className="bot-spotlight-badge">
              <Quote size={14} />
              <span>Chairman&apos;s Address</span>
            </div>
            <h3 className="bot-spotlight-name">Mr. Thomas Uwhubetine</h3>
            <p className="bot-spotlight-role">Chairman, Board of Trustees</p>
            <div className="bot-spotlight-divider" />
            <blockquote className="bot-spotlight-quote">
              &ldquo;My esteemed BOT members, sons and daughters of UPUA. I am honored to serve as your BOT chairman. My mission is to move our union forward as attested by our motto: <em>Okugbe, Egba, Voyan Robaro</em> (unity, strength and progress) and in the spirit imbedded in our national anthem: <em>Edefa me rh&apos;akpo, Urhobo me warhe</em> (when I reincarnate, I will come through Urhobo). Our union is thirty-three years old and it&apos;s time to move it from a mom &amp; pop not for profit organization with grace, resilience, and transparency to its right place in the 21st century. What does this mean? UPUA needs its own house and offices with paid staff and volunteers to achieve the 21st century dream. So, let&apos;s join hands together to actualize the words of our Urhobo National Anthem: <em>Urhobo - e, Orere Ivie san</em> (Urhobo a town of distinguished KINGS). Long Live UPUA, May we be distinguished amongst our peers.&rdquo;
            </blockquote>
            <div className="bot-spotlight-sig">
              <strong>Thomas Uwhubetine</strong>
              <span>MBA, Accountant, RN (retired), JP</span>
              <span className="bot-sig-affiliation">President, Urhobo Association of Georgia &bull; Chairman BOT, UPUA</span>
            </div>
          </div>

          <div className="bot-spotlight-media">
            <div className="bot-spotlight-frame">
              <Image
                src="/assets/bot/thomas-uwhubetine-chair.jpg"
                alt="Mr. Thomas Uwhubetine - Chairman, Board of Trustees"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="bot-spotlight-img"
                style={{ objectFit: "cover", objectPosition: "center 20%" }}
                priority
              />
              <div className="bot-spotlight-pill">
                <span>BOT Chairman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trustees Grid */}
        <div className="bot-grid-header">
          <h3 className="bot-grid-title">Chapter Presidents &amp; Trustees</h3>
          <span className="bot-grid-count">{TRUSTEES.length} Distinguished Leaders</span>
        </div>

        <div className="bot-grid">
          {displayedTrustees.map((trustee) => (
            <article className="bot-card" key={trustee.slug}>
              <div className="bot-card-media">
                <Image
                  src={trustee.localPath}
                  alt={trustee.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="bot-card-img"
                  style={{ objectFit: "contain", objectPosition: "center center", padding: "10px" }}
                />
                <span className="bot-card-tag">{trustee.title}</span>
              </div>

              <div className="bot-card-body">
                <h4 className="bot-card-name">{trustee.name}</h4>
                <p className="bot-card-chapter">
                  <MapPin size={13} className="bot-pin-icon" />
                  <span>{trustee.chapter}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* View All / Collapse Button */}
        {TRUSTEES.length > 12 && (
          <div className="bot-toggle-wrap">
            <button
              type="button"
              className="bot-toggle-btn"
              onClick={() => setShowAll(!showAll)}
            >
              <span>{showAll ? "Show Less" : `View All ${TRUSTEES.length} Trustees`}</span>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
