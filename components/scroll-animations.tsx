"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Elements that reveal as the user scrolls down
const REVEAL_SELECTORS = [
  // Sections across all pages
  ".figma-landing-page > section",
  "main > section",
  ".about-mission-section",
  ".about-values-section",
  ".about-exec-section",
  ".about-branches-section",
  ".about-cta-section",
  ".programs-list-section",
  ".programs-partner-section",
  ".blog-featured-section",
  ".blog-grid-section",
  ".store-catalog-section",
  ".store-donate-callout-section",
  // Section Headings & Titles
  ".association-section-heading",
  ".ec-header",
  ".bot-header",
  ".bot-grid-header",
  ".leaders-header",
  ".upuaya-exco-header",
  ".updates-header",
  ".events-header",
  ".landing-section-heading",
  ".events-header-text",
  ".about-mission-block",
  ".programs-partner-text",
  ".blog-featured-content",
  ".store-donate-callout-inner",
  ".upua-world-footer",
  // Cards & Grid Content
  ".association-work-card",
  ".ec-officer-card",
  ".bot-spotlight-card",
  ".bot-card",
  ".upuaya-officer-card",
  ".leader-card",
  ".update-feature-card",
  ".update-stack-card",
  ".event-feature-card",
  ".event-stack-card",
  ".about-value-card",
  ".about-stat-card",
  ".leader-featured-card",
  ".about-branch-card",
  ".program-feature-card",
  ".shelter-chapter-card",
  ".blog-featured-card",
  ".blog-post-card",
  ".event-catalog-card",
  ".store-card",
  ".programs-list-inner article",
  ".programs-stat",
  ".join-community-card",
  ".program-card",
  ".pillar-card",
  ".chapter-pill",
  ".store-trust-item",
].join(", ");

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const seenElements = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const attach = () => {
      const elements = document.querySelectorAll(REVEAL_SELECTORS);
      elements.forEach((el) => {
        // Exclude hero banners, sliders, modals, and portal admin interfaces
        if (
          el.closest(
            ".upua-modal-backdrop, .app-layout, .hero-slider-container, .association-hero, .page-hero"
          )
        ) {
          return;
        }

        if (!seenElements.has(el)) {
          seenElements.add(el);
          el.classList.add("scroll-reveal");

          // If element is already in the viewport upon landing/page-load, reveal immediately
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) {
            el.classList.add("revealed");
          } else {
            observer.observe(el);
          }
        }
      });
    };

    // Attach to initial DOM
    attach();

    // Re-check on dynamic updates or lazy renders
    const timer = setTimeout(attach, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

