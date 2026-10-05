"use client";

import React from "react";
import Image from "next/image";

interface MarqueeItem {
  id: string;
  image: string;
  title: string;
  tag: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { id: "m1", image: "/assets/slide2/3.jpeg", title: "National Assembly & Cultural Gala", tag: "Tradition" },
  { id: "m2", image: "/assets/slide2/4.jpeg", title: "Board of Trustees Convocation", tag: "Leadership" },
  { id: "m3", image: "/assets/slide2/5.jpeg", title: "Executive Dignitaries Session", tag: "Convention" },
  { id: "m4", image: "/assets/slide2/6.jpeg", title: "Urhobo Cultural Attire & Regalia", tag: "Heritage" },
  { id: "m5", image: "/assets/slide2/7.jpeg", title: "Women in Leadership Initiative", tag: "Empowerment" },
  { id: "m6", image: "/assets/slide2/8.jpeg", title: "Diaspora Cultural Celebration", tag: "Unity" },
  { id: "m7", image: "/assets/slide2/10.jpeg", title: "Educational & Cultural Research", tag: "Education" },
  { id: "m8", image: "/assets/slide2/12.jpeg", title: "Financial Audit & Stewardship", tag: "Governance" },
  { id: "m9", image: "/assets/slide2/13.jpeg", title: "Youth Wing & Assembly Speakers", tag: "Youth" },
  { id: "m10", image: "/assets/slide2/14.jpeg", title: "Humanitarian & Community Welfare", tag: "Impact" },
];

export default function InfiniteGalleryMarquee() {
  // Duplicate array for seamless infinite marquee scroll
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="infinite-marquee-section" aria-label="UPUA Cultural & Leadership Gallery">
      <div className="marquee-ambient-glow" />
      
      {/* Infinite scrolling track */}
      <div className="infinite-marquee-track">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="marquee-glass-card">
            <div className="marquee-card-image-wrap">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 240px, 320px"
                className="marquee-card-img"
              />
              <div className="marquee-card-overlay" />
              <div className="marquee-card-tag">{item.tag}</div>
            </div>
            <div className="marquee-card-content">
              <h4 className="marquee-card-title">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
