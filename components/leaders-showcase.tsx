"use client";

import React from "react";
import Image from "next/image";

export default function LeadersShowcase() {
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
                  src="/assets/president.png"
                  alt="Chief Samuel Ogaga - National President, UPUA"
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
                <span>National President, UPUA</span>
              </div>
              <h3 className="leader-name">Chief Samuel Ogaga</h3>
              <p className="leader-motto">
                &lsquo;Okugbe, Egba, Voyan Robaro&rsquo; (Unity, Strength and Progress)
              </p>
              <p className="leader-bio">
                Serving as the National President of Urhobo Progress Union America, Chief Samuel Ogaga leads the association with a passion for uniting all Urhobo people across North America and preserving the core cultural values, languages, and development of Urhoboland.
              </p>
            </div>
          </article>

          {/* BOT Chairman Card */}
          <article className="leader-card">
            <div className="leader-arch-media">
              <div className="leader-arch-frame">
                <Image
                  src="/assets/chairman.png"
                  alt="Mr. Thomas Uwhubetine - Chairman, Board of Trustees"
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
                <span>Chairman, Board of Trustees (BOT)</span>
              </div>
              <h3 className="leader-name">Mr. Thomas Uwhubetine</h3>
              <p className="leader-credentials">
                MBA, Accountant, RN (retired), JP - President, Urhobo Association of Georgia
              </p>
              <p className="leader-bio">
                My mission is to move our union forward as attested by our motto: Okugbe, Egba, Voyan Robaro and in the spirit embedded in our national anthem: Edefa me rh&rsquo;akpo, Urhobo me warhe (when I reincarnate, I will come through Urhobo). It is time to move UPUA to its rightful place in the 21st century with its own permanent house, offices, and global impact.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
