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
            <div className="event-feature-media">
              <Image
                src="/update-convention.jpg"
                alt="33rd Annual Urhobo Progress Union America National Convention"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="event-img"
              />
              <div className="event-date-badge">
                <span className="event-badge-month">AUG</span>
                <span className="event-badge-day">28</span>
              </div>
            </div>
            <div className="event-feature-info">
              <div className="event-meta">
                <span className="event-tag convention-tag">CONVENTION</span>
                <span className="event-meta-item">
                  <MapPin size={14} /> Lawrenceburg, IN
                </span>
                <span className="event-meta-item">
                  <Clock size={14} /> Aug 28 – 31, 2026
                </span>
              </div>
              <h3 className="event-feature-title">
                The 33rd Annual UPUA National Convention 2026
              </h3>
              <p className="event-feature-desc">
                The flagship annual gathering of Urhobos across North America. Join Chapter delegations, Royal Fathers, and youth leaders for the General Assembly, Cultural Gala, and Youth Banquet.
              </p>
              <div className="event-feature-footer">
                <Link href="/events" className="event-feature-link">
                  <span>View Details &amp; Registration</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>

          {/* 3 Horizontal Stacked Cards (Right) */}
          <div className="events-stack">
            {/* Event 1 */}
            <article className="event-stack-card">
              <div className="event-stack-media">
                <Image
                  src="/assets/youth-kevwe.jpeg"
                  alt="UPUAYA National Youth Leadership & Career Summit"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag youth-tag">YOUTH WING</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> Oct 18, 2026
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    UPUAYA National Youth Leadership &amp; Career Summit
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> Houston, TX &amp; Virtual Livestream
                </div>
              </div>
            </article>

            {/* Event 2 */}
            <article className="event-stack-card">
              <div className="event-stack-media">
                <Image
                  src="/assets/bot-chairman-blog.jpg"
                  alt="National Executive Council (NEC) & Chapter Delegates Meeting"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag gov-tag">GOVERNANCE</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> Nov 14, 2026
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    National Executive Council (NEC) Quarterly Meeting
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> Virtual Executive Zoom Session
                </div>
              </div>
            </article>

            {/* Event 3 */}
            <article className="event-stack-card">
              <div className="event-stack-media">
                <Image
                  src="/assets/SolCal-4.jpg"
                  alt="Urhobo Cultural Heritage Day & Language Immersion Festival"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag culture-tag">CULTURE</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> Dec 5, 2026
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    Urhobo Cultural Heritage Day &amp; Language Immersion
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> Atlanta, GA (Metro Chapter Host)
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
