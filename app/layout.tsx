import type { Metadata, Viewport } from "next";
import { Abril_Fatface, Fraunces, IBM_Plex_Mono, Inter, Italiana } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/site";
import { travelAgencyJsonLd } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const abril = Abril_Fatface({ subsets: ["latin"], weight: "400", variable: "--font-abril", display: "swap" });
const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-italiana", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Dreams Kerala Holiday — Kerala Tour Packages, Houseboats & Honeymoon Trips",
    template: "%s | Dreams Kerala Holiday",
  },
  description: SITE.description,
  keywords: [
    "Kerala tour packages",
    "Munnar tour packages",
    "Alleppey houseboat",
    "Thekkady tour",
    "Wayanad tour packages",
    "Kovalam tour packages",
    "Kerala honeymoon packages",
    "Kumarakom houseboat",
    "Dreams Kerala Holiday",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: "Dreams Kerala Holiday — Kerala, at walking pace",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreams Kerala Holiday — Kerala, at walking pace",
    description: SITE.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  category: "travel",
};

export const viewport: Viewport = {
  themeColor: "#1F3324",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} ${abril.variable} ${italiana.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencyJsonLd()) }}
        />
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
        <SiteFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
