"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGET_SELECTORS = [
  ".reveal-on-scroll",
  "[data-reveal]",
  ".association-section-heading",
  ".association-work-card",
  ".ec-header",
  ".ec-officer-card",
  ".bot-grid-header",
  ".bot-card",
  ".bot-spotlight",
  ".leaders-header",
  ".leader-card",
  ".upuaya-exco-header",
  ".upuaya-officer-card",
  ".updates-header",
  ".updates-blog-card",
  ".events-header",
  ".landing-event-card",
  ".about-hero-copy",
  ".about-value-card",
  ".about-stat-card",
  ".about-mission-grid",
  ".leader-featured-card",
  ".program-feature-card",
  ".store-product-card",
  ".event-detail-card",
  ".panel-card",
  ".dash-metrics-grid > *",
].join(", ");

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observedElements = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add("is-revealed");

            // After animation finishes, clear the transform so it doesn't create stacking context side effects
            const onTransitionEnd = () => {
              target.classList.add("reveal-done");
              target.removeEventListener("transitionend", onTransitionEnd);
            };
            target.addEventListener("transitionend", onTransitionEnd);

            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    function scanAndObserve() {
      const elements = document.querySelectorAll(TARGET_SELECTORS);

      elements.forEach((el) => {
        // Never apply scroll reveal to association-hero or inside the hero slider
        if (el.closest(".association-hero") || el.closest(".hero-slider-container")) {
          return;
        }

        if (prefersReducedMotion) {
          el.classList.add("is-revealed", "reveal-done");
          return;
        }

        if (!observedElements.has(el)) {
          observedElements.add(el);
          el.classList.add("reveal-element");

          // Calculate stagger index among siblings in grid/flex containers
          if (el.parentElement) {
            const siblings = Array.from(el.parentElement.children).filter((c) =>
              c.matches(TARGET_SELECTORS)
            );
            const index = siblings.indexOf(el);
            if (index > 0 && index < 10) {
              (el as HTMLElement).style.setProperty("--stagger-idx", index.toString());
            }
          }

          // If element is already within the top initial viewport, reveal it immediately
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add("is-revealed");
            setTimeout(() => el.classList.add("reveal-done"), 700);
          } else {
            observer.observe(el);
          }
        }
      });
    }

    // Initial scan with slight delay for DOM hydration
    const timer = setTimeout(scanAndObserve, 80);

    // Watch for dynamic DOM changes (e.g. tab switches in portal)
    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
