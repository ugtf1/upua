"use client";

import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".figma-landing-page section",
  ".figma-landing-page [class*='-card']",
  ".landing-blog-card",
  ".about-value-card",
  ".about-exec-card",
  ".program-card",
  ".association-hero-panel",
].join(",");

export default function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.dataset.revealed = "true";
          observer.unobserve(target);

          const cleanup = () => {
            target.dataset.revealDone = "true";
            target.removeEventListener("transitionend", cleanup);
          };
          target.addEventListener("transitionend", cleanup);
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -20px 0px" },
    );

    const observeTargets = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_TARGETS).forEach((element) => {
        if (element.dataset.scrollReveal) return;

        // Skip modals, drawers, or headers
        if (element.closest(".upua-modal-backdrop") || element.closest(".site-header") || element.closest("header")) {
          return;
        }

        const isCard =
          element.tagName === "ARTICLE" ||
          Array.from(element.classList).some((className) => className.endsWith("-card"));

        if (!element.matches("section") && !isCard) return;

        const rect = element.getBoundingClientRect();
        const isInitiallyInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

        element.dataset.scrollRevealType = isCard ? "card" : "section";

        if (element.matches("section") && element.querySelector("article[class*='card'], [class$='-card']")) {
          element.dataset.scrollRevealType = "section-with-cards";
        }

        if (isCard) {
          const siblings = Array.from(element.parentElement?.children ?? []).filter(
            (sibling) =>
              sibling instanceof HTMLElement &&
              (sibling.tagName === "ARTICLE" ||
                Array.from(sibling.classList).some((className) => className.endsWith("-card"))),
          );
          const index = Math.min(Math.max(siblings.indexOf(element), 0), 6);
          element.style.setProperty("--reveal-index", String(index));
        }

        element.dataset.scrollReveal = "true";

        if (isInitiallyInView) {
          // Immediately revealed if already above fold, eliminating flash-of-invisibility
          element.dataset.revealed = "true";
          element.dataset.revealDone = "true";
        } else {
          observer.observe(element);
        }
      });
    };

    observeTargets();
    const mutations = new MutationObserver(observeTargets);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
