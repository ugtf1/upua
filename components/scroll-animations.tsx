"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger plugin with GSAP
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
  ".store-product-card",
  ".event-detail-card",
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

    // 1. Initialize Lenis Smooth Scroll (Kevtrex Signature Inertial Glide)
    let lenis: Lenis | null = null;
    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.2,
        infinite: false,
      });

      lenisRef.current = lenis;

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Scroll to top on pathname change
    lenis?.scrollTo(0, { immediate: true });

    // Track initialized elements
    const initializedElements = new WeakSet<Element>();
    const triggers: ScrollTrigger[] = [];

    // 2. Setup Spotlight Cursor Tracking (.has-spotlight)
    function setupSpotlights() {
      const spotlights = document.querySelectorAll<HTMLElement>(".has-spotlight");
      spotlights.forEach((el) => {
        if (el.dataset.spotlightReady) return;
        el.dataset.spotlightReady = "true";

        const size = el.dataset.spotlightSize || "260px";
        const color = el.dataset.spotlightColor || "rgba(14, 61, 38, 0.14)";
        el.style.setProperty("--spotlight-size", size);
        el.style.setProperty("--spotlight-color", color);

        if (!el.querySelector(".nk-spotlight")) {
          const spot = document.createElement("div");
          spot.className = "nk-spotlight";
          el.appendChild(spot);
        }

        el.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          el.style.setProperty("--spotlight-x", `${x}px`);
          el.style.setProperty("--spotlight-y", `${y}px`);
        });

        el.addEventListener("mouseleave", () => {
          el.style.setProperty("--spotlight-x", "50%");
          el.style.setProperty("--spotlight-y", "50%");
        });
      });
    }

    // 3. Auto-tag and Bind Kevtrex [data-gsap-in] Animations
    function scanAndAnimate() {
      // Auto-tag section headers
      document.querySelectorAll<HTMLElement>(SECTION_HEADERS).forEach((el) => {
        if (!el.hasAttribute("data-gsap-in")) {
          el.setAttribute("data-gsap-in", '{"opacity": 0, "y": 42}');
          el.setAttribute("data-gsap-duration", "0.75");
          el.setAttribute("data-gsap-ease", "power2.out");
        }
      });

      // Auto-tag cards with staggered delays and spotlight
      document.querySelectorAll<HTMLElement>(CARD_ELEMENTS).forEach((el) => {
        if (!el.classList.contains("has-spotlight")) {
          el.classList.add("has-spotlight");
        }

        if (!el.hasAttribute("data-gsap-in")) {
          // Calculate stagger offset among siblings
          let staggerDelay = 0.08;
          if (el.parentElement) {
            const siblings = Array.from(el.parentElement.children);
            const index = siblings.indexOf(el);
            if (index >= 0) {
              staggerDelay = Math.min(0.55, 0.06 + (index % 5) * 0.08);
            }
          }
          el.setAttribute("data-gsap-in", '{"opacity": 0, "y": 48}');
          el.setAttribute("data-gsap-delay", staggerDelay.toString());
          el.setAttribute("data-gsap-duration", "0.7");
          el.setAttribute("data-gsap-ease", "power2.out");
        }
      });

      // Bind spotlight mouse tracker
      setupSpotlights();

      // Process all [data-gsap-in] elements exactly as done on Kevtrex
      const elements = document.querySelectorAll<HTMLElement>("[data-gsap-in]");

      elements.forEach((el) => {
        // Never disrupt .association-hero layout or hero slider
        if (el.closest(".association-hero") || el.closest(".hero-slider-container")) {
          return;
        }

        if (initializedElements.has(el)) return;
        initializedElements.add(el);

        if (prefersReducedMotion) {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
          return;
        }

        try {
          const inAttr = el.dataset.gsapIn || "{}";
          const parsedIn = JSON.parse(inAttr.replace(/'/g, '"'));
          const duration = parseFloat(el.dataset.gsapDuration || "0.68");
          const delay = parseFloat(el.dataset.gsapDelay || "0");
          const ease = el.dataset.gsapEase || "power2.out";
          const start = el.dataset.gsapStart || "top 90%";
          const end = el.dataset.gsapEnd || "bottom center";
          const scrub = el.dataset.gsapScrub === "true" ? 1 : el.dataset.gsapScrub ? parseFloat(el.dataset.gsapScrub) : false;

          const perspective = el.dataset.gsapPerspective;
          if (perspective && el.parentElement) {
            el.parentElement.style.perspective = perspective;
          }

          // If the element is already in the top viewport at page load, play immediately
          const rect = el.getBoundingClientRect();
          const isInitiallyVisible = rect.top >= 0 && rect.top <= window.innerHeight;

          const anim = gsap.from(el, {
            ...parsedIn,
            duration: duration,
            delay: isInitiallyVisible ? delay * 0.5 : delay,
            ease: ease,
            clearProps: scrub ? "" : "transform",
            paused: !isInitiallyVisible && !scrub,
          });

          if (!isInitiallyVisible || scrub) {
            const st = ScrollTrigger.create({
              trigger: el,
              start: start,
              end: end,
              scrub: scrub,
              toggleActions: "play none none none",
              onEnter: () => {
                if (!scrub) anim.play();
              },
            });
            triggers.push(st);
          }
        } catch (err) {
          console.warn("Kevtrex gsap-in parse error on:", el, err);
        }
      });

      // Refresh ScrollTrigger calculations
      ScrollTrigger.refresh();
    }

    // Run scan after initial render
    const scanTimer = setTimeout(scanAndAnimate, 120);

    // Watch for dynamic route transitions & portal tab switching
    const mutationObserver = new MutationObserver(() => {
      scanAndAnimate();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(scanTimer);
      mutationObserver.disconnect();
      triggers.forEach((st) => st.kill());
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
