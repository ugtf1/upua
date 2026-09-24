"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import DonationModal from "@/components/donation-modal";

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/blog", label: "Blog" },
    // { href: "/chapters", label: "Chapters" },
    // { href: "/gallery", label: "Gallery" },
  ];

  return (
    <>
      <header className="public-site-header">
        {/* Extreme Left: Brand Logo */}
        <Link className="public-brand" href="/" aria-label="UPUA home">
          <Image
            src="/upua-logo.png"
            alt="Urhobo Progress Union America Logo"
            width={44}
            height={44}
            priority
            className="public-brand-logo"
          />
          <strong>UPUA</strong>
        </Link>

        {/* Desktop Nav (Center on desktop) */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Middle on mobile, Right on desktop) */}
        <div className="public-header-actions">
          <button
            type="button"
            className="public-donate-link"
            onClick={() => setDonationOpen(true)}
            aria-label="Open donation form"
          >
            Donate <Heart size={14} fill="currentColor" />
          </button>
          <Link href="/portal" className="header-signin-btn">
            Sign in
          </Link>
        </div>

        {/* Extreme Right: Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-links">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={pathname === item.href ? "mobile-nav-active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Global Donation Modal */}
      <DonationModal
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
      />
    </>
  );
}
