"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";

export default function LandingEventsSection() {
  return (
    <section className="landing-events-section" id="events" aria-labelledby="events-heading">
      <div className="events-container">
        {/* Section Header */}
        <div className="events-header">
          <div className="events-header-text">
            <h2 id="events-heading" className="events-title">
              Latest &amp; Upcoming <span className="heading-gold-accent">Events</span>
            </h2>
            <p className="events-subtitle">
              Mark your calendars for our national conventions, youth summits, and cultural gatherings
            </p>
          </div>
          <Link href="/events" className="events-view-more-btn">
            <span>VIEW ALL EVENTS</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {/* Featured Large Card (Left) */}
          <article className="event-feature-card">
            <a
              href="https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59"
              target="_blank"
              rel="noopener noreferrer"
              className="event-feature-media"
              style={{ position: "relative", display: "block", background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)", cursor: "pointer" }}
              title="Click on the registration flyer to register on Donately"
            >
              <Image
                src="/events/upua-convention-2026-flyer.jpg"
                alt="33rd Annual Urhobo Progress Union America National Convention 2026"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "contain", padding: "8px" }}
                className="event-img"
              />
              <div className="event-date-badge">
                <span className="event-badge-month">SEP</span>
                <span className="event-badge-day">03</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(14, 61, 38, 0.95)",
                  border: "1.5px solid #d4af37",
                  color: "#f7d070",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                👉 Click Flyer to Register on Donately
              </div>
            </a>
            <div className="event-feature-info">
              <div className="event-meta">
                <span className="event-tag convention-tag">CONVENTION</span>
                <span className="event-meta-item">
                  <MapPin size={14} /> Lawrenceburg, IN
                </span>
                <span className="event-meta-item">
                  <Clock size={14} /> Sept 3 – 7, 2026
                </span>
              </div>
              <h3 className="event-feature-title">
                The 33rd Annual UPUA National Convention 2026
              </h3>
              <p className="event-feature-desc">
                Hosted by UPU Ohio at DoubleTree by Hilton, Lawrenceburg, IN. Theme: <em>&ldquo;Urhobo Global Impact: Leadership, Legacy &amp; Prosperity&rdquo;</em>. Join national delegates, traditional rulers, and youth for 5 days of culture, golf, and symposiums.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0 14px" }}>
                <span style={{ fontSize: "11px", background: "#f0f7f3", color: "#0e3d26", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  0–2 Yrs: Free
                </span>
                <span style={{ fontSize: "11px", background: "#f0f7f3", color: "#0e3d26", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  3–12 Yrs: $50
                </span>
                <span style={{ fontSize: "11px", background: "#f0f7f3", color: "#0e3d26", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  13+ Yrs: $150 USD
                </span>
                <span style={{ fontSize: "11px", background: "#fef3c7", color: "#854d0e", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  ✈️ CVG Airport
                </span>
              </div>
              <div className="event-feature-footer">
                <Link href="/events" className="event-feature-link">
                  <span>View Details &amp; Registration Guidelines</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>

          {/* 3 Horizontal Stacked Cards (Right) */}
          <div className="events-stack">
            {/* Event 1: Golf Outing */}
            <article className="event-stack-card">
              <div className="event-stack-media" style={{ background: "#f0f7f3" }}>
                <Image
                  src="/events/upua-golf-outing-2026.jpg"
                  alt="UPUA Annual National Golf Outing 2026"
                  fill
                  sizes="(max-width: 768px) 140px, 150px"
                  style={{ objectFit: "contain", objectPosition: "center center", padding: "4px" }}
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag convention-tag">GOLF OUTING</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> Fri, Sept 4, 2026
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    UPUA Annual National Golf Outing 2026
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> Sugar Ridge Golf Club, Lawrenceburg, IN
                </div>
              </div>
            </article>

            {/* Event 2: Ohio Zoom Fundraiser */}
            <article className="event-stack-card">
              <div className="event-stack-media" style={{ background: "#f8faf8" }}>
                <Image
                  src="/events/upua-convention-2026-flyer.jpg"
                  alt="UPU Ohio Chapter Zoom Fundraiser"
                  fill
                  sizes="(max-width: 768px) 140px, 150px"
                  style={{ objectFit: "contain", objectPosition: "center center", padding: "4px" }}
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag gov-tag" style={{ background: "#e8f0fe", color: "#1a73e8" }}>FUNDRAISER</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> This Saturday, Oct 24
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    UPU Ohio Zoom Fundraiser — 2026 Convention Support
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> Virtual Zoom Live Assembly
                </div>
              </div>
            </article>

            {/* Event 3: Brochure Advertisements */}
            <article className="event-stack-card">
              <div className="event-stack-media" style={{ background: "#f8faf8" }}>
                <Image
                  src="/events/upua-convention-2026-brochure.jpg"
                  alt="Convention Brochure Advertisement & Goodwill Messages"
                  fill
                  sizes="(max-width: 768px) 140px, 150px"
                  style={{ objectFit: "contain", objectPosition: "center center", padding: "4px" }}
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag culture-tag">PUBLICATIONS</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> Book by Aug 15, 2026
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    2026 Convention Brochure Ads &amp; Goodwill Messages
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> Souvenir Brochure ($100 – $1,000)
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
