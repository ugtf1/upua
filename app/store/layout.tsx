import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official UPUA Store – Merchandise, Regalia & Convention Packages",
  description:
    "Official store of Urhobo Progress Union America. Purchase convention vendor tables, brochure advertisements, cultural regalia, commemorative apparel, and books.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "Official UPUA Store – Urhobo Progress Union America",
    description:
      "Purchase official UPUA merchandise, convention vendor tables, souvenir brochure ads, cultural attire, and educational books online.",
    url: "https://upua-30228073381.us-east1.run.app/store",
    images: [{ url: "/assets/Congress-1.jpg", width: 1200, height: 630, alt: "UPUA Store and Merchandise" }],
  },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
