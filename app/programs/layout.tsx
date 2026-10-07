import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs & Initiatives – Urhobo Progress Union America",
  description:
    "Explore UPUA programs: Women in Shelter Initiative, STEM & AI Training in Urhoboland, Free Medical Missions, and Urhobo Language Preservation.",
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Programs & Initiatives – Urhobo Progress Union America",
    description:
      "Signature humanitarian and cultural programs: Women in Shelter, STEM & AI training, medical outreach, and Urhobo language schools.",
    url: "https://upua-30228073381.us-east1.run.app/programs",
    images: [{ url: "/assets/DMV-6.jpg", width: 1200, height: 630, alt: "UPUA Community Programs" }],
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
