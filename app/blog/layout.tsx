import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Blog – Urhobo Progress Union America",
  description:
    "Official reports, announcements, leadership updates, and cultural coverage from UPU America across the United States, Canada, and Delta State.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "News & Blog – Urhobo Progress Union America",
    description:
      "Latest news, chapter reports, and event updates from the Urhobo Progress Union America.",
    url: "https://upua-30228073381.us-east1.run.app/blog",
    images: [{ url: "/assets/SolCal-4.jpg", width: 1200, height: 630, alt: "UPUA News and Blog" }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
