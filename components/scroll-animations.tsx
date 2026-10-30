"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger plugin with GSAP once on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Selectors for automatic Kevtrex animation tagging across all pages
const SECTION_HEADERS = [
  ".association-section-heading",
  ".ec-header",
  ".bot-grid-header",
  ".leaders-header",
  ".upuaya-exco-header",
  ".updates-header",
  ".events-header",
  ".about-hero-copy",
  ".landing-section-heading",
  ".page-hero",
  ".console-hero",
].join(", ");

const CARD_ELEMENTS = [
  ".association-work-card",
  ".ec-officer-card",
  ".bot-card",
  ".upuaya-officer-card",
  ".leader-card",
  ".updates-blog-card",
  ".landing-event-card",
  ".about-value-card",
  ".about-stat-card",
  ".leader-featured-card",
  ".program-feature-card",
  ".shelter-chapter-card",
  ".blog-post-card",
  ".event-catalog-card",
  ".store-card",
  ".panel-card",
  ".dash-metrics-grid > *",
  ".metrics-grid > *",
].join(", ");

export default function ScrollAnimations() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Initialize Lenis Smooth Scroll safely (Kevtrex Signature Smooth Momentum)
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    if (!prefersReducedMotion) {
      try {
        lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 1.2,
          infinite: false,
        });

        lenisRef.current = lenis;

        // Connect Lenis to GSAP ScrollTrigger safely
        lenis.on("scroll", () => {
          ScrollTrigger.update();
        });

        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.warn("Lenis init skipped:", err);
      }
    }

    // Scroll to top on pathname change
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // 2. Setup Spotlight Cursor Tracking via a single passive mousemove listener on document
    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(".has-spotlight");
      if (target) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty("--spotlight-x", `${x}px`);
        target.style.setProperty("--spotlight-y", `${y}px`);
      }
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Track active triggers for clean teardown
    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];
    const initializedElements = new WeakSet<Element>();

    // 3. Bind Animations safely without recursive loops
    function initAnimations() {
      // Add spotlight class to cards
      document.querySelectorAll<HTMLElement>(CARD_ELEMENTS).forEach((el) => {
        if (!el.classList.contains("has-spotlight")) {
          el.classList.add("has-spotlight");
        }
      });

      // Target headers
      document.querySelectorAll<HTMLElement>(SECTION_HEADERS).forEach((el) => {
        if (el.closest(".association-hero") || el.closest(".hero-slider-container")) return;
        if (initializedElements.has(el)) return;
        initializedElements.add(el);

        if (prefersReducedMotion) {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
          return;
        }

        const tween = gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
            once: true,
          },
        });
        tweens.push(tween);
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      // Target cards with stagger
      document.querySelectorAll<HTMLElement>(CARD_ELEMENTS).forEach((el) => {
        if (el.closest(".association-hero") || el.closest(".hero-slider-container")) return;
        if (initializedElements.has(el)) return;
        initializedElements.add(el);

        if (prefersReducedMotion) {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
          return;
        }

        let staggerDelay = 0.05;
        if (el.parentElement) {
          const siblings = Array.from(el.parentElement.children);
          const index = siblings.indexOf(el);
          if (index >= 0) {
            staggerDelay = Math.min(0.35, (index % 4) * 0.08);
          }
        }

        const tween = gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.65,
          delay: staggerDelay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
            once: true,
          },
        });
        tweens.push(tween);
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      // Explicit [data-gsap-in] elements
      document.querySelectorAll<HTMLElement>("[data-gsap-in]").forEach((el) => {
        if (el.closest(".association-hero") || el.closest(".hero-slider-container")) return;
        if (initializedElements.has(el)) return;
        initializedElements.add(el);

        if (prefersReducedMotion) {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
          return;
        }

        try {
          const inAttr = el.dataset.gsapIn || "{}";
          const parsedIn = JSON.parse(inAttr.replace(/'/g, '"'));
          const duration = parseFloat(el.dataset.gsapDuration || "0.65");
          const delay = parseFloat(el.dataset.gsapDelay || "0");
          const ease = el.dataset.gsapEase || "power2.out";

          const tween = gsap.from(el, {
            ...parsedIn,
            duration,
            delay,
            ease,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          });
          tweens.push(tween);
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        } catch {
          // Ignore parse errors safely
        }
      });

      // Refresh ScrollTrigger once safely
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }

    // Run animation scan once after DOM settles
    const timer = setTimeout(initAnimations, 100);

    return () => {
      clearTimeout(timer);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      triggers.forEach((st) => st.kill());
      tweens.forEach((tw) => tw.kill());
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
