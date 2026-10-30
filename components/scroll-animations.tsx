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
].join(", ");

const PUBLIC_SECTIONS = ".figma-landing-page > section";
const REVEAL_DISTANCE = 50;

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
          fadeOnly ? { autoAlpha: 0 } : { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            ...(fadeOnly ? {} : { y: 0 }),
            duration: 0.75,
            delay,
            ease: "power3.out",
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
      return Math.min(0.32, index * 0.07);
    }

    const onIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        const isCard = element.matches(CARD_ELEMENTS);
        const fadeOnly = fadeOnlySections.has(element);
        const y = isCard ? REVEAL_DISTANCE : 36;
        reveal(element, y, isCard ? getStagger(element) : 0, fadeOnly);
        observer.unobserve(element);
      });
    };

    observer = new IntersectionObserver(onIntersection, {
      threshold: 0.01,
      rootMargin: "0px 0px -24px 0px",
    });

    const scan = () => {
      const candidates = document.querySelectorAll<HTMLElement>(
        `${PUBLIC_SECTIONS}, ${SECTION_HEADERS}, ${CARD_ELEMENTS}`,
      );

      candidates.forEach((element) => {
        if (initialized.has(element) || pending.has(element)) return;
        if (element.closest(".upua-modal-backdrop, .association-hero .hero-slider-container")) return;

        // Keep the whole section to a simple fade when its own cards or heading
        // will animate separately, avoiding nested movement and layout conflict.
        const isSection = element.matches(PUBLIC_SECTIONS);
        const hasAnimatedContent = isSection && element.querySelector(`${SECTION_HEADERS}, ${CARD_ELEMENTS}`);
        if (hasAnimatedContent) {
          // The section is a fade-only parent; its children supply the movement.
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
