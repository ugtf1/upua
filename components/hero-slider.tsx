"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  badge?: string;
  caption?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "/assets/618b2065cb429bf344ce60cbcbaeb44ba78c88fe.png",
    alt: "Urhobo Progress Union America royal delegates and cultural assembly",
    badge: "Urhobo Heritage",
    caption: "Preserving Rich Culture, Royalty & Tradition",
  },
  {
    id: "slide-2",
    image: "/assets/4471b2f1651075d7a987b512d9eec099711476b7.png",
    alt: "UPUA Executive leadership and chapter community gathering",
    badge: "Community Leadership",
    caption: "Empowering 23 Accredited North American Chapters",
  },
  {
    id: "slide-3",
    image: "/assets/3845b14f877d50b26c30cd66978853438368e8db.png",
    alt: "UPUA National Convention & Grand Gala celebration",
    badge: "National Convention",
    caption: "Fostering Unity, Growth & Diaspora Engagement",
  },
  {
    id: "slide-4",
    image: "/assets/60b7f17fe75538dbf432cd371298d4313cd0bd99.png",
    alt: "Youth empowerment, STEM initiatives, and cultural education",
    badge: "Youth & Innovation",
    caption: "Investing in Next-Generation STEM & Scholarships",
  },
  {
    id: "slide-5",
    image: "/assets/c4eadc75696dde9d286ac3ddeb8728c09d36f54c.jpg",
    alt: "Humanitarian medical aid and emergency relief support",
    badge: "Humanitarian Impact",
    caption: "Direct Medical Aid & Humanitarian Outreach in Delta State",
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4800);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="UPUA Highlights Image Carousel"
    >
      {/* Background Slides with Ken Burns Effect */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={`hero-slide ${isActive ? "active" : ""}`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={idx === 0}
              className="hero-slide-img"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        );
      })}

      {/* Magical Multi-Layer Blending Mask */}
      <div className="hero-slider-blend-mask" />
      <div className="hero-slider-radial-glow" />
      <div className="hero-slider-top-fade" />
      <div className="hero-slider-bottom-fade" />

      {/* Slide Floating Caption Card (Bottom Right) */}
      <div className="hero-slide-floating-card">
        {HERO_SLIDES[currentIndex].badge && (
          <div className="hero-slide-badge">
            <span>{HERO_SLIDES[currentIndex].badge}</span>
          </div>
        )}
        <p className="hero-slide-caption">{HERO_SLIDES[currentIndex].caption}</p>

        {/* Carousel Indicators & Controls */}
        <div className="hero-slider-controls">
          <div className="hero-slider-dots">
            {HERO_SLIDES.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`hero-slider-dot ${dotIdx === currentIndex ? "active" : ""}`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <div className="hero-slider-arrows">
            <button
              type="button"
              onClick={prevSlide}
              className="hero-arrow-btn"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="hero-arrow-btn"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
