"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock, CreditCard, Ticket, Lock, ShieldCheck } from "lucide-react";

export default function LandingEventsSection() {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [headerInfo, setHeaderInfo] = useState({
    title: "Latest & Upcoming Events",
    subtitle: "Mark your calendars for our national conventions, youth summits, and cultural gatherings",
    buttonText: "VIEW ALL EVENTS",
    buttonUrl: "/events",
  });

  useEffect(() => {
    // 1. Fetch events
    fetch("/api/cms/content?type=collection&name=events/events")
      .then((r) => r.json())
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setEventsList(res.data);
        }
      })
      .catch(() => {});

    // 2. Fetch section header
    fetch("/api/cms/content?type=page&name=home")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data?.eventsSection) {
          setHeaderInfo({
            title: res.data.eventsSection.heading || "Latest & Upcoming Events",
            subtitle: res.data.eventsSection.subtitle || "Mark your calendars for our national conventions, youth summits, and cultural gatherings",
            buttonText: res.data.eventsSection.buttonText || "VIEW ALL EVENTS",
            buttonUrl: res.data.eventsSection.buttonUrl || "/events",
          });
        }
      })
      .catch(() => {});

    // 3. Listen to live in-memory updates
    function handleUpdate(e: any) {
      if (e.detail?.name === "events/events" && Array.isArray(e.detail.data)) {
        setEventsList(e.detail.data);
      }
      if (e.detail?.name === "home" && e.detail.data?.eventsSection) {
        setHeaderInfo((prev) => ({
          ...prev,
          title: e.detail.data.eventsSection.heading || prev.title,
          subtitle: e.detail.data.eventsSection.subtitle || prev.subtitle,
        }));
      }
    }
    window.addEventListener("upua_cms_update", handleUpdate);
    return () => window.removeEventListener("upua_cms_update", handleUpdate);
  }, []);

  const featuredEvent = eventsList.find((e) => e.featured) || eventsList[0];

  return (
    <section className="landing-events-section" id="events" aria-labelledby="events-heading">
      <div className="events-container">
        {/* Section Header */}
        <div className="events-header">
          <div className="events-header-text">
            <h2 id="events-heading" className="events-title">
              {headerInfo.title.includes("Events") ? (
                <>
                  {headerInfo.title.replace(/Events/, "")}
                  <span className="heading-gold-accent">Events</span>
                </>
              ) : (
                headerInfo.title
              )}
            </h2>
            <p className="events-subtitle">{headerInfo.subtitle}</p>
          </div>
          <Link href={headerInfo.buttonUrl || "/events"} className="events-view-more-btn">
            <span>{headerInfo.buttonText || "VIEW ALL EVENTS"}</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {/* Featured Large Card (Left) */}
          <article className="event-feature-card">
            <div
              className="event-feature-media"
              style={{ position: "relative", display: "block", background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)" }}
            >
              <Image
                src={featuredEvent?.image || featuredEvent?.flyer || "/events/upua-convention-2026-flyer.jpg"}
                alt={featuredEvent?.title || "33rd Annual Urhobo Progress Union America National Convention 2026"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "contain", padding: "8px" }}
                className="event-img"
              />
              <div className="event-date-badge">
                <span className="event-badge-month">{featuredEvent?.monthShort || "SEP"}</span>
                <span className="event-badge-day">{featuredEvent?.day || "03"}</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  width: "calc(100% - 24px)",
                  maxWidth: "420px",
                  zIndex: 2,
                }}
              >
                <Link
                  href="/events/tickets"
                  style={{
                    background: "rgba(14, 61, 38, 0.95)",
                    border: "1.5px solid #d4af37",
                    color: "#f7d070",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "11px",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Ticket size={12} /> Buy Gala &amp; Convention Tickets (Stripe)
                </Link>
                <a
                  href="https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(0, 0, 0, 0.75)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    fontSize: "11px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Register on Donately
                </a>
              </div>
            </div>
            <div className="event-feature-info">
              <div className="event-meta">
                <span className="event-tag convention-tag">{featuredEvent?.category?.toUpperCase() || "CONVENTION"}</span>
                <span className="event-meta-item">
                  <MapPin size={14} /> {featuredEvent?.location || "Lawrenceburg, IN"}
                </span>
                <span className="event-meta-item">
                  <Clock size={14} /> {featuredEvent?.date || "Sept 3 – 7, 2026"}
                </span>
              </div>
              <h3 className="event-feature-title">
                {featuredEvent?.title || "The 33rd Annual UPUA National Convention 2026"}
              </h3>
              <p className="event-feature-desc">
                {featuredEvent?.summary ||
                  featuredEvent?.description ||
                  "Hosted by UPU Ohio at DoubleTree by Hilton, Lawrenceburg, IN. Theme: “Urhobo Global Impact: Leadership, Legacy & Prosperity”. Join national delegates, traditional rulers, and youth for 5 days of culture, golf, and symposiums."}
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
              <div className="event-feature-footer" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  href="/events/tickets"
                  className="event-feature-ticket-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)",
                    color: "#ffffff",
                    border: "1.5px solid #d4af37",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(14, 61, 38, 0.25)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <CreditCard size={16} color="#f7d070" />
                  <span>Buy Tickets (Secured Stripe Checkout)</span>
                </Link>
                <Link href="/events" className="event-feature-link">
                  <span>View Details &amp; Guidelines</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </article>

          {/* 4 Horizontal Stacked Cards (Right) */}
          <div className="events-stack">
            {/* Event 1: Golf Outing */}
            <article className="event-stack-card">
              <div className="event-stack-media" style={{ background: "#f0f7f3" }}>
                <Image
                  src={eventsList[1]?.image || eventsList[1]?.flyer || "/events/upua-golf-outing-card.jpg"}
                  alt={eventsList[1]?.title || "UPUA Annual National Golf Outing 2026"}
                  fill
                  sizes="(max-width: 768px) 140px, 150px"
                  style={{ objectFit: "cover", objectPosition: "center center" }}
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag convention-tag">GOLF OUTING</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> {eventsList[1]?.fullDate || "Fri, Sept 4, 2026"}
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    {eventsList[1]?.title || "UPUA Annual National Golf Outing & Scramble Tournament"}
                  </Link>
                </h4>
                <div className="event-stack-location" style={{ marginBottom: "8px" }}>
                  <MapPin size={13} /> {eventsList[1]?.location || "Dearborn Country Club, Aurora, IN"}
                </div>
                <div>
                  <Link
                    href="/events/tickets?event=golf"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      fontWeight: 800,
                      color: "#0e3d26",
                      background: "#e8f4ec",
                      border: "1px solid #cce2d6",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      textDecoration: "none",
                    }}
                  >
                    <Ticket size={12} /> Buy Golf Pass ($100) &rarr;
                  </Link>
                </div>
              </div>
            </article>

            {/* Event 2: Ohio / Gala Night */}
            <article className="event-stack-card">
              <div className="event-stack-media" style={{ background: "#f8faf8" }}>
                <Image
                  src={eventsList[2]?.image || eventsList[2]?.flyer || "/store/national-cultural-gala-pass.jpg"}
                  alt={eventsList[2]?.title || "Grand Cultural Gala Night & Royal Banquet"}
                  fill
                  sizes="(max-width: 768px) 140px, 150px"
                  style={{ objectFit: "cover", objectPosition: "center center" }}
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag convention-tag" style={{ background: "#fef3c7", color: "#854d0e" }}>ROYAL GALA</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> {eventsList[2]?.fullDate || "Sat, Sept 5, 2026"}
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    {eventsList[2]?.title || "Grand Cultural Gala Night & Royal Banquet"}
                  </Link>
                </h4>
                <div className="event-stack-location" style={{ marginBottom: "8px" }}>
                  <MapPin size={13} /> {eventsList[2]?.location || "DoubleTree Ballroom, Lawrenceburg, IN"}
                </div>
                <div>
                  <Link
                    href="/events/tickets"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      fontWeight: 800,
                      color: "#854d0e",
                      background: "#fef3c7",
                      border: "1px solid #fde68a",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      textDecoration: "none",
                    }}
                  >
                    <Ticket size={12} /> Gala Passes ($150 / $50) &rarr;
                  </Link>
                </div>
              </div>
            </article>

            {/* Event 3: Youth Leadership Symposium */}
            <article className="event-stack-card">
              <div className="event-stack-media" style={{ background: "#f8faf8" }}>
                <Image
                  src={eventsList[3]?.image || eventsList[3]?.flyer || "/update-stem.jpg"}
                  alt={eventsList[3]?.title || "UPUAYA National Youth Leadership & STEM Mentorship"}
                  fill
                  sizes="(max-width: 768px) 140px, 150px"
                  style={{ objectFit: "cover", objectPosition: "center center" }}
                  className="event-img"
                />
              </div>
              <div className="event-stack-info">
                <div className="event-meta">
                  <span className="event-tag youth-tag">YOUTH WING</span>
                  <span className="event-meta-item">
                    <Calendar size={13} /> {eventsList[3]?.fullDate || "Fri, Sept 4, 2026"}
                  </span>
                </div>
                <h4 className="event-stack-title">
                  <Link href="/events">
                    {eventsList[3]?.title || "UPUAYA North America Youth & STEM Mentorship Congress"}
                  </Link>
                </h4>
                <div className="event-stack-location">
                  <MapPin size={13} /> {eventsList[3]?.location || "DoubleTree Conference Center, IN"}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
