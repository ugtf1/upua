"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ArticleItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date?: string;
  displayDate?: string;
  image: string;
  excerpt?: string;
  featured?: boolean;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: "annual-convention-2026-announcement",
    slug: "the-2026-annual-urhobo-progress-union-america-convention",
    title: "The 2026 Annual Urhobo Progress Union America Convention",
    category: "NEWS",
    displayDate: "August 28, 2026",
    image: "/update-convention.jpg",
    featured: true,
  },
  {
    id: "medical-outreach-report",
    slug: "upu-america-medical-outreach-worldwide-conference",
    title: "UPU America medical outreach at the 2023 UPU Worldwide Conference",
    category: "NEWS",
    displayDate: "June 28, 2024",
    image: "/update-outreach.jpg",
  },
  {
    id: "donation-okama-idps",
    slug: "upu-america-donation-to-the-okama-idps",
    title: "UPU America donation to the Okama IDPs",
    category: "NEWS",
    displayDate: "June 28, 2024",
    image: "/update-news.jpg",
  },
  {
    id: "stem-ai-training-urhoboland",
    slug: "stem-artificial-intelligence-training-in-urhoboland",
    title: "Science, Technology, Engineering & Mathematics (STEM), Artificial Intelligence (AI) Training in Urhoboland",
    category: "PROGRAMS",
    displayDate: "June 28, 2024",
    image: "/update-stem.jpg",
  },
];

export default function LandingUpdatesSection() {
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);
  const [headerInfo, setHeaderInfo] = useState({
    title: "Updates from UPU America",
    subtitle: "News and blog posts on UPU America and our programs",
    buttonText: "VIEW MORE UPDATE",
    buttonUrl: "/blog",
  });

  useEffect(() => {
    // 1. Fetch articles
    fetch("/api/cms/content?type=collection&name=blog/articles")
      .then((r) => r.json())
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setArticles(res.data);
        }
      })
      .catch(() => {});

    // 2. Fetch section header
    fetch("/api/cms/content?type=page&name=home")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data?.updatesSection) {
          setHeaderInfo({
            title: res.data.updatesSection.heading || "Updates from UPU America",
            subtitle: res.data.updatesSection.subtitle || "News and blog posts on UPU America and our programs",
            buttonText: res.data.updatesSection.buttonText || "VIEW MORE UPDATE",
            buttonUrl: res.data.updatesSection.buttonUrl || "/blog",
          });
        }
      })
      .catch(() => {});

    // 3. Listen to live in-memory updates
    function handleUpdate(e: any) {
      if (e.detail?.name === "blog/articles" && Array.isArray(e.detail.data)) {
        setArticles(e.detail.data);
      }
      if (e.detail?.name === "home" && e.detail.data?.updatesSection) {
        setHeaderInfo((prev) => ({
          ...prev,
          title: e.detail.data.updatesSection.heading || prev.title,
          subtitle: e.detail.data.updatesSection.subtitle || prev.subtitle,
        }));
      }
    }
    window.addEventListener("upua_cms_update", handleUpdate);
    return () => window.removeEventListener("upua_cms_update", handleUpdate);
  }, []);

  const featured = articles.find((a) => a.featured) || articles[0] || DEFAULT_ARTICLES[0];
  const stacked = articles.filter((a) => a.id !== featured.id).slice(0, 3);
  const finalStacked = stacked.length > 0 ? stacked : DEFAULT_ARTICLES.slice(1, 4);

  return (
    <section className="landing-updates-section" id="updates" aria-labelledby="updates-heading">
      <div className="updates-container">
        {/* Section Header */}
        <div className="updates-header">
          <div className="updates-header-text">
            <h2 id="updates-heading" className="updates-title">
              {headerInfo.title.includes("UPU America") ? (
                <>
                  {headerInfo.title.replace(/UPU America/, "")}
                  <span className="heading-gold-accent">UPU America</span>
                </>
              ) : (
                headerInfo.title
              )}
            </h2>
            <p className="updates-subtitle">{headerInfo.subtitle}</p>
          </div>
          <Link href={headerInfo.buttonUrl || "/blog"} className="updates-view-more-btn">
            <span>{headerInfo.buttonText || "VIEW MORE UPDATE"}</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Updates Grid */}
        <div className="updates-grid">
          {/* Featured Large Card (Left) */}
          <article className="update-feature-card">
            <Link href="/blog" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
              <div className="update-feature-media">
                <Image
                  src={featured.image || "/update-convention.jpg"}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="update-img"
                />
              </div>
              <div className="update-feature-info">
                <div className="update-meta">
                  <time className="update-date">{featured.displayDate || featured.date || "August 28, 2026"}</time>
                  <span className="update-tag">{featured.category?.toUpperCase() || "NEWS"}</span>
                </div>
                <h3 className="update-feature-title">{featured.title}</h3>
              </div>
            </Link>
          </article>

          {/* 3 Horizontal Stacked Cards (Right) */}
          <div className="updates-stack">
            {finalStacked.map((item, idx) => (
              <article className="update-stack-card" key={item.id || idx}>
                <Link href="/blog" style={{ textDecoration: "none", color: "inherit", display: "flex", width: "100%", gap: "16px", alignItems: "center" }}>
                  <div className="update-stack-media">
                    <Image
                      src={item.image || "/update-outreach.jpg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      className="update-img"
                    />
                  </div>
                  <div className="update-stack-info">
                    <div className="update-meta">
                      <time className="update-date">{item.displayDate || item.date || "June 28, 2024"}</time>
                      <span className={`update-tag ${item.category?.toLowerCase().includes("program") ? "program-tag" : ""}`}>
                        {item.category?.toUpperCase() || "NEWS"}
                      </span>
                    </div>
                    <h4 className="update-stack-title">{item.title}</h4>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
