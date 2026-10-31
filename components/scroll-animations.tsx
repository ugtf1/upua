"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Smooth, light scroll reveal starting from Youth Leadership Wing UPUAYA EXCO onwards
const REVEAL_SELECTORS = [
  // Youth Leadership Wing UPUAYA EXCO (Home page)
  ".upuaya-exco-header",
  ".upuaya-officer-card",
  // Updates Section (from Youth Wing onward)
  ".updates-header",
  ".update-feature-card",
  ".update-stack-card",
  // Events Section (from Youth Wing onward)
  ".events-header",
  ".event-feature-card",
  ".event-stack-card",
  // Youth Wing on About Page
  ".about-exec-section .ec-grid:last-of-type .ec-officer-card",
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
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    const attach = () => {
      const elements = document.querySelectorAll(REVEAL_SELECTORS);
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      elements.forEach((el) => {
        // Exclude modals and portal console
        if (el.closest(".upua-modal-backdrop, .app-layout")) {
          return;
        }

        if (seenElements.has(el)) return;
        seenElements.add(el);

        const rect = el.getBoundingClientRect();
        // If element is already visible or above viewport, mark revealed immediately (zero flash/glitch)
        if (rect.top <= viewportHeight * 0.95) {
          el.classList.add("revealed");
        } else {
          el.classList.add("scroll-reveal");
          observer.observe(el);
        }
      });

      // Stagger cards in the UPUAYA EXCO and subsequent grids for smooth cascade
      document
        .querySelectorAll(".upuaya-exco-grid, .updates-grid, .events-grid, .about-exec-section .ec-grid:last-of-type")
        .forEach((grid) => {
          const cards = grid.querySelectorAll(".scroll-reveal:not(.revealed)");
          cards.forEach((card, idx) => {
            (card as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(idx * 60, 360)}ms`);
          });
        });
    };

    attach();

    // Re-check briefly after client-side hydration and images settle
    const timer = setTimeout(attach, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
