import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urhobo Progress Union America (UPUA)",
  description:
    "Developing Urhobo Culture and Ideals · Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress).",
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
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
