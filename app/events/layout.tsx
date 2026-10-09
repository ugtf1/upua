import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Conventions – Urhobo Progress Union America",
  description:
    "Official schedule of upcoming UPU America national conventions, youth summits, cultural celebrations, and leadership meetings across North America.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events & Conventions – Urhobo Progress Union America",
    description:
      "Join the Urhobo diaspora in North America for national conventions, youth summits, and cultural celebrations.",
    url: "https://upua-30228073381.us-east1.run.app/events",
    images: [{ url: "/update-convention.jpg", width: 1200, height: 630, alt: "UPUA Events and Conventions" }],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
