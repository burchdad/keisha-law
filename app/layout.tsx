import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import StructuredData from "../components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krachallaw.com"),
  title: {
    default: "Rachal Law Firm APC | Long Beach Estate Planning Lawyer",
    template: "%s | Rachal Law Firm APC",
  },
  description:
    "Long Beach legal guidance for estate planning, probate, conservatorships, guardianships, name changes, limited family law, and notary appointments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rachal Law Firm APC",
    description:
      "Long Beach legal guidance for estate planning, probate, conservatorships, and related family matters.",
    url: "https://www.krachallaw.com",
    siteName: "Rachal Law Firm APC",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Rachal Law Firm APC legal services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rachal Law Firm APC",
    description:
      "Long Beach estate planning, probate, conservatorship, and family legal guidance.",
    images: ["/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <StructuredData />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
