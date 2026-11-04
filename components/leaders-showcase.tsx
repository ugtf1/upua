"use client";

import React from "react";
import Image from "next/image";

export default function LeadersShowcase() {
  const [leaders, setLeaders] = React.useState<any[]>([
    {
      name: "Chief Samuel Ogaga",
      title: "National President, UPUA",
      tagline: "‘Okugbe, Egba, Voyan Robaro’ (Unity, Strength and Progress)",
      bio: "Serving as the National President of Urhobo Progress Union America, Chief Samuel Ogaga leads the association with a passion for uniting all Urhobo people across North America and preserving the core cultural values, languages, and development of Urhoboland.",
      image: "/assets/president.png",
    },
    {
      name: "Mr. Thomas Uwhubetine",
      title: "Chairman, Board of Trustees (BOT)",
      tagline: "MBA, Accountant, RN (retired), JP - President, Urhobo Association of Georgia",
      bio: "My mission is to move our union forward as attested by our motto: Okugbe, Egba, Voyan Robaro and in the spirit embedded in our national anthem: Edefa me rh’akpo, Urhobo me warhe (when I reincarnate, I will come through Urhobo). It is time to move UPUA to its rightful place in the 21st century with its own permanent house, offices, and global impact.",
      image: "/assets/chairman.png",
    },
  ]);

  React.useEffect(() => {
    fetch("/api/cms/content?type=collection&name=organization/leadership")
      .then((r) => r.json())
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length >= 2) {
          setLeaders(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const pres = leaders[0] || {};
  const botChair = leaders[1] || {};

  return (
    <section className="leaders-showcase-section" id="leadership" aria-labelledby="leaders-heading">
      <div className="leaders-container">
        {/* Section Header */}
        <div className="leaders-header">
          <h2 id="leaders-heading" className="leaders-title">
            Leaders who keep the <span className="heading-gold-accent">union moving</span>
          </h2>
          <p className="leaders-subtitle">
            Guiding UPU America with integrity, cultural pride, and 21st-century administrative excellence.
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="leaders-grid">
          {/* President Card */}
          <article className="leader-card">
            <div className="leader-arch-media">
              <div className="leader-arch-frame">
                <Image
                  src={pres.image || "/assets/president.png"}
                  alt={`${pres.name} - ${pres.title}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="leader-img"
                />
              </div>
            </div>
            <div className="leader-body">
              <div className="leader-role-badge">
                <span className="badge-dot" />
                <span>{pres.title || "National President, UPUA"}</span>
              </div>
              <h3 className="leader-name">{pres.name}</h3>
              <p className="leader-motto">{pres.tagline}</p>
              <p className="leader-bio">{pres.bio}</p>
            </div>
          </article>

          {/* BOT Chairman Card */}
          <article className="leader-card">
            <div className="leader-arch-media">
              <div className="leader-arch-frame">
                <Image
                  src={botChair.image || "/assets/chairman.png"}
                  alt={`${botChair.name} - ${botChair.title}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="leader-img"
                />
              </div>
            </div>
            <div className="leader-body">
              <div className="leader-role-badge">
                <span className="badge-dot" />
                <span>{botChair.title || "Chairman, Board of Trustees (BOT)"}</span>
              </div>
              <h3 className="leader-name">{botChair.name}</h3>
              <p className="leader-credentials">{botChair.tagline}</p>
              <p className="leader-bio">{botChair.bio}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
