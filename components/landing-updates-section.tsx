"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingUpdatesSection() {
  return (
    <section className="landing-updates-section" id="updates" aria-labelledby="updates-heading">
      <div className="updates-container">
        {/* Section Header */}
        <div className="updates-header">
          <div className="updates-header-text">
            <h2 id="updates-heading" className="updates-title">
              Updates from UPU America
            </h2>
            <p className="updates-subtitle">
              News and blog posts on UPU America and our programs
            </p>
          </div>
          <Link href="/blog" className="updates-view-more-btn">
            <span>VIEW MORE UPDATE</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Updates Grid */}
        <div className="updates-grid">
          {/* Featured Large Card (Left) */}
          <article className="update-feature-card">
            <div className="update-feature-media">
              <Image
                src="/update-convention.jpg"
                alt="The 2026 Annual Urhobo Progress Union America Convention"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="update-img"
              />
            </div>
            <div className="update-feature-info">
              <div className="update-meta">
                <time className="update-date">August 28, 2026</time>
                <span className="update-tag">NEWS</span>
              </div>
              <h3 className="update-feature-title">
                The 2026 Annual Urhobo Progress Union America Convention
              </h3>
            </div>
          </article>

          {/* 3 Horizontal Stacked Cards (Right) */}
          <div className="updates-stack">
            {/* Card 1 */}
            <article className="update-stack-card">
              <div className="update-stack-media">
                <Image
                  src="/update-outreach.jpg"
                  alt="UPU America medical outreach at the 2023 UPU Worldwide Conference"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="update-img"
                />
              </div>
              <div className="update-stack-info">
                <div className="update-meta">
                  <time className="update-date">June 28, 2024</time>
                  <span className="update-tag">NEWS</span>
                </div>
                <h4 className="update-stack-title">
                  UPU America medical outreach at the 2023 UPU Worldwide Conference
                </h4>
              </div>
            </article>

            {/* Card 2 */}
            <article className="update-stack-card">
              <div className="update-stack-media">
                <Image
                  src="/update-news.jpg"
                  alt="UPU America donation to the Okama IDPs"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="update-img"
                />
              </div>
              <div className="update-stack-info">
                <div className="update-meta">
                  <time className="update-date">June 28, 2024</time>
                  <span className="update-tag">NEWS</span>
                </div>
                <h4 className="update-stack-title">
                  UPU America donation to the Okama IDPs
                </h4>
              </div>
            </article>

            {/* Card 3 */}
            <article className="update-stack-card">
              <div className="update-stack-media">
                <Image
                  src="/update-stem.jpg"
                  alt="Science, Technology, Engineering & Mathematics (STEM), Artificial Intelligence (AI) Training in Urhoboland"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="update-img"
                />
              </div>
              <div className="update-stack-info">
                <div className="update-meta">
                  <time className="update-date">June 28, 2024</time>
                  <span className="update-tag program-tag">PROGRAMS</span>
                </div>
                <h4 className="update-stack-title">
                  Science, Technology, Engineering &amp; Mathematics (STEM), Artificial Intelligence (AI) Training in Urhoboland
                </h4>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
