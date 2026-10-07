import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-heading-opt",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-main-opt",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0e3d26",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://upua-30228073381.us-east1.run.app"),
  title: {
    default: "Urhobo Progress Union America (UPUA)",
    template: "%s | UPUA",
  },
  description:
    "Developing Urhobo Culture and Ideals · Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress). The umbrella organization of all Urhobo people across North America.",
  keywords: [
    "UPUA",
    "Urhobo Progress Union America",
    "Urhobo diaspora",
    "Urhobo community USA",
    "Okugbe Egba Voyan Robaro",
    "Urhobo cultural programs",
    "Urhoboland",
    "Delta State",
  ],
  authors: [{ name: "Urhobo Progress Union America" }],
  creator: "Urhobo Progress Union America",
  publisher: "Urhobo Progress Union America",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://upua-30228073381.us-east1.run.app",
    siteName: "Urhobo Progress Union America",
    title: "Urhobo Progress Union America (UPUA)",
    description:
      "Developing Urhobo Culture and Ideals · Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress). Official association across North America.",
    images: [
      {
        url: "/upua-logo.png",
        width: 512,
        height: 512,
        alt: "UPUA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urhobo Progress Union America (UPUA)",
    description:
      "Developing Urhobo Culture and Ideals · Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress).",
    images: ["/upua-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/upua-logo.png", type: "image/png" },
    ],
    shortcut: "/upua-logo.png",
    apple: "/upua-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
