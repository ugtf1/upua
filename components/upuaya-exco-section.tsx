"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, MapPin } from "lucide-react";

interface ExcoMember {
  id: string;
  name: string;
  role: string;
  chapter: string;
  image: string;
  isUpcoming?: boolean;
}

const UPUAYA_OFFICERS: ExcoMember[] = [
  {
    id: "upuaya-1",
    name: "Oghenekevwe Ajueyitsi",
    role: "President",
    chapter: "UPU DMV",
    image: "/assets/upuaya/kevwe.jpg",
  },
  {
    id: "upuaya-2",
    name: "Praise Asanudje",
    role: "Vice President",
    chapter: "Urhobo/Isoko Ass. Arizona",
    image: "/assets/upuaya/praise.jpg",
  },
  {
    id: "upuaya-3",
    name: "Favour Okotie",
    role: "Secretary",
    chapter: "UPU Ohio",
    image: "/assets/upuaya/favour.jpg",
  },
  {
    id: "upuaya-4",
    name: "Jess Oghenefejiro Ikporo",
    role: "Asst. Secretary",
    chapter: "UPU Midland/Odessa, TX",
    image: "/assets/upuaya/jess.jpg",
  },
  {
    id: "upuaya-5",
    name: "Eguolor Sam-Ogaga",
    role: "Treasurer",
    chapter: "Urhobo/Isoko Ass of Middle Tennessee",
    image: "/assets/upuaya/eguolor.jpg",
  },
  {
    id: "upuaya-6",
    name: "Ufuoma Agarin",
    role: "Social/Publicity Secretary",
    chapter: "UPU DMV",
    image: "/assets/upuaya/ufuoma.jpg",
  },
  {
    id: "upuaya-7",
    name: "Coming Soon",
    role: "Financial Secretary",
    chapter: "Diaspora Youth Wing",
    image: "/upua-logo.png",
    isUpcoming: true,
  },
  {
    id: "upuaya-8",
    name: "Coming Soon",
    role: "Director of Programs",
    chapter: "Diaspora Youth Wing",
    image: "/upua-logo.png",
    isUpcoming: true,
  },
  {
    id: "upuaya-9",
    name: "Coming Soon",
    role: "Director of Welfare",
    chapter: "Diaspora Youth Wing",
    image: "/upua-logo.png",
    isUpcoming: true,
  },
];

export default function UpuayaExcoSection() {
  return (
    <section className="upuaya-exco-section" id="upuaya-exco" aria-labelledby="upuaya-exco-heading">
      <div className="upuaya-exco-container">
        <div className="upuaya-exco-header">
          <div className="upuaya-pill-badge">
            <Sparkles size={14} className="upuaya-pill-icon" />
            <span>Youth Leadership Wing</span>
          </div>
          <h2 id="upuaya-exco-heading" className="upuaya-exco-title">
            UPUAYA <span className="heading-gold-accent">EXCO</span>
          </h2>
          <p className="upuaya-exco-subtitle">
            The Urhobo Progress Union America Youth Association executive leaders driving next-generation cultural identity, innovation, and unity across the diaspora.
          </p>
        </div>

        <div className="upuaya-exco-grid">
          {UPUAYA_OFFICERS.map((officer) => (
            <article
              className={`upuaya-officer-card ${officer.isUpcoming ? "upuaya-card-upcoming" : ""}`}
              key={officer.id}
            >
              <div className="upuaya-card-media">
                <Image
                  src={officer.image}
                  alt={officer.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`upuaya-card-img ${officer.isUpcoming ? "upuaya-logo-img" : ""}`}
                />
                <span className="upuaya-role-tag">{officer.role}</span>
              </div>
              <div className="upuaya-card-body">
                <h3 className="upuaya-officer-name">{officer.name}</h3>
                <div className="upuaya-chapter-row">
                  <MapPin size={13} className="upuaya-chapter-icon" />
                  <span className="upuaya-chapter-text">{officer.chapter}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
