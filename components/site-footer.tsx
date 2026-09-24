import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
  const navItems = ["Home", "About", "Chapters", "Programs", "Blog", "Gallery"];
  const navLinks: Record<string, string> = {
    Home: "/",
    About: "/about",
    Chapters: "/about#chapters",
    Programs: "/programs",
    Blog: "/blog",
    Gallery: "/gallery",
  };

  return (
    <section className="upua-world-footer" aria-label="UPUA footer">
      <div className="upua-world-inner">
        {/* Join the Community card */}
        <div className="join-community-card" id="join-community">
          <div>
            <h3>Join the Community</h3>
            <p>Sign up for the very best updates and the latest UPU America news.</p>
          </div>
          <form>
            <div className="join-input-row">
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="button">Subscribe</button>
            </div>
            <small>
              We care about your data in our{" "}
              <Link href="#">privacy policy</Link>.
            </small>
          </form>
        </div>
      </div>

      <footer className="upua-main-footer">
        <div className="upua-footer-bar">
          <strong>UPUA</strong>
          <nav aria-label="Footer navigation">
            {navItems.map((item) => (
              <Link href={navLinks[item] ?? "#"} key={item}>
                {item}
              </Link>
            ))}
          </nav>
          <div className="footer-socials" aria-label="Social links">
            <span aria-label="Twitter">𝕏</span>
            <span aria-label="Instagram">◎</span>
            <span aria-label="Facebook">f</span>
          </div>
        </div>
        <div className="upua-copyright">
          Copyright © 2024 Urhobo Progress Union America
        </div>
      </footer>
    </section>
  );
}
