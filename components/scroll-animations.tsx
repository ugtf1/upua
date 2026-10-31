"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const SECTION_HEADERS = [
  ".association-section-heading",
  ".ec-header",
  ".bot-header",
  ".bot-grid-header",
  ".leaders-header",
  ".upuaya-exco-header",
  ".updates-header",
  ".events-header",
  ".page-hero-inner",
  ".landing-section-heading",
  ".events-header-text",
  ".about-mission-block",
  ".programs-partner-text",
  ".blog-featured-content",
  ".store-donate-callout-inner",
  ".upua-world-footer",
  ".page-hero-content",
  ".programs-list-heading",
].join(", ");

const CARD_ELEMENTS = [
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

// Matches main sections across Home, About, Programs, Events, Blog, and Store
const PUBLIC_SECTIONS = [
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
].join(", ");

const REVEAL_DISTANCE = 42;

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let observer: IntersectionObserver;
    const pending = new Set<HTMLElement>();
    const initialized = new WeakSet<HTMLElement>();
    const fadeOnlySections = new WeakSet<HTMLElement>();
    const tweens = new Set<gsap.core.Tween>();

    const reveal = (element: HTMLElement, y: number, delay: number, fadeOnly = false) => {
      if (initialized.has(element)) return;
      initialized.add(element);
      pending.delete(element);

      try {
        const tween = gsap.fromTo(
          element,
          fadeOnly
            ? { opacity: 0 }
            : { opacity: 0, y, scale: 0.98 },
          {
            opacity: 1,
            ...(fadeOnly ? {} : { y: 0, scale: 1 }),
            duration: 0.85,
            delay,
            ease: "power2.out",
            onComplete: () => {
              // Return transform/visibility control to the element's own styles.
              gsap.set(element, { clearProps: "opacity,visibility,transform" });
            },
          },
        );
        tweens.add(tween);
      } catch {
        // A failed animation must never leave content hidden.
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
      }
    };

    function getStagger(element: HTMLElement) {
      const siblings = Array.from(element.parentElement?.children ?? []).filter(
        (sibling): sibling is HTMLElement =>
          sibling instanceof HTMLElement && sibling.matches(CARD_ELEMENTS),
      );
      const index = Math.max(0, siblings.indexOf(element));
      return Math.min(0.36, index * 0.08);
    }

    const onIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        const isCard = element.matches(CARD_ELEMENTS);
        const fadeOnly = fadeOnlySections.has(element);
        const y = isCard ? REVEAL_DISTANCE : 28;
        reveal(element, y, isCard ? getStagger(element) : 0, fadeOnly);
        observer.unobserve(element);
      });
    };

    observer = new IntersectionObserver(onIntersection, {
      threshold: 0.08,
      rootMargin: "0px 0px -50px 0px",
    });

    const scan = () => {
      const candidates = document.querySelectorAll<HTMLElement>(
        `${PUBLIC_SECTIONS}, ${SECTION_HEADERS}, ${CARD_ELEMENTS}`,
      );

      candidates.forEach((element) => {
        if (initialized.has(element) || pending.has(element)) return;
        // Do not animate internal admin modals or hero sliders
        if (element.closest(".upua-modal-backdrop, .app-layout, .hero-slider-container, .page-hero")) return;

        // Keep section to a clean fade when its own child cards or headers animate separately
        const isSection = element.matches(PUBLIC_SECTIONS);
        const hasAnimatedContent = isSection && element.querySelector(`${SECTION_HEADERS}, ${CARD_ELEMENTS}`);
        if (hasAnimatedContent) {
          fadeOnlySections.add(element);
        }

        pending.add(element);
        observer.observe(element);
      });
    };

    scan();
    const mutations = new MutationObserver(() => {
      scan();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      tweens.forEach((tween) => tween.kill());
      pending.forEach((element) => {
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
      });
    };
  }, [pathname]);

  return null;
}
