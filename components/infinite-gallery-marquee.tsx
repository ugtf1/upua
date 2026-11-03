"use client";

import React from "react";
import Image from "next/image";

interface MarqueeItem {
  id: string;
  image: string;
  alt: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { id: "m1", image: "/assets/slide2/3.jpeg",  alt: "UPU chapter members at a women's shelter" },
  { id: "m2", image: "/assets/slide2/4.jpeg",  alt: "Volunteers donating supplies to shelter residents" },
  { id: "m3", image: "/assets/slide2/5.jpeg",  alt: "Community outreach and welfare event" },
  // { id: "m4", image: "/assets/slide2/6.jpeg",  alt: "UPUA women's initiative gathering" },
  { id: "m5", image: "/assets/slide2/7.jpeg",  alt: "Women in leadership and empowerment program" },
  { id: "m6", image: "/assets/slide2/8.jpeg",  alt: "Diaspora giving back to local communities" },
  { id: "m7", image: "/assets/slide2/10.jpeg", alt: "Educational support for shelter residents" },
  { id: "m8", image: "/assets/slide2/12.jpeg", alt: "Financial stewardship and humanitarian aid" },
  { id: "m9", image: "/assets/slide2/13.jpeg", alt: "Youth wing community welfare activities" },
  { id: "m10", image: "/assets/slide2/14.jpeg", alt: "Humanitarian and community welfare outreach" },
];

export default function InfiniteGalleryMarquee() {
  // Duplicate array for seamless infinite marquee scroll
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="infinite-marquee-section" aria-label="Women in Shelter Initiative Gallery">
      <div className="marquee-ambient-glow" />

      {/* Section header */}
      <div className="marquee-section-header">
        <h2 className="marquee-section-title">Women in Shelter Initiative</h2>
        <p className="marquee-section-subtitle">
          Across North America, UPU chapters are giving back, donating time, resources and love
          to women&apos;s shelters in their communities.
        </p>
      </div>

      {/* Infinite scrolling track */}
      <div className="infinite-marquee-track">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="marquee-glass-card">
            <div className="marquee-card-image-wrap">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 240px, 320px"
                className="marquee-card-img"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
