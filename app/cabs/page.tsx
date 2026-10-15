import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import CabBooking from "@/components/CabBooking";
import { SITE } from "@/lib/site";
import { CAB_VEHICLES } from "@/lib/cabs";

export const metadata: Metadata = {
  title: "Cab & Taxi Services in Kerala — Sedan, Innova, Tempo Traveller & Bus Hire",
  description:
    "Book cabs with a driver across Kerala: sedans for Kochi airport transfers, Innova and Ertiga for family tours, Tempo Travellers and buses for groups. AC, insured, GPS-tracked. Free quotes in 30 minutes.",
  alternates: { canonical: "/cabs" },
  openGraph: {
    title: "Cab & Taxi Services in Kerala — Dreams Kerala Holiday",
    description:
      "Sedans, Innovas, Tempo Travellers and buses with local drivers: airport pickups, Munnar, Alleppey, Thekkady and group tours.",
    url: "/cabs",
  },
};

function cabServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Dreams Kerala Holiday — Cab & Taxi Services",
    description:
      "Cab and taxi hire across Kerala with local drivers: sedans, SUVs, Tempo Travellers and buses.",
    url: `${SITE.url}/cabs`,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "₹₹",
    provider: {
      "@type": "TravelAgency",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      email: SITE.email,
    },
    areaServed: [
      "Kochi",
      "Munnar",
      "Alleppey",
      "Thekkady",
      "Wayanad",
      "Kumarakom",
      "Kovalam",
      "Trivandrum",
      "Varkala",
      "Kanyakumari",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vehicles for hire",
      itemListElement: CAB_VEHICLES.map((v) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${v.name} — ${v.seats}`,
          description: v.tagline,
        },
      })),
    },
  };
}

export default function CabsPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main">
        <div className="relative overflow-hidden pb-10 pt-28">
          {/* Soft backdrop — decorative only */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src="/images/hero-kerala.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-[0.14]"
              style={{ objectPosition: "center 62%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" />
          </div>
          <div className="relative mx-auto max-w-[1180px] px-8 text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-tea">
              <span className="h-[7px] w-[7px] rounded-full bg-tea" aria-hidden="true" />
              Availability
            </p>
            <h1 className="mx-auto max-w-[820px] font-serif text-[clamp(32px,4.6vw,52px)] font-normal leading-[1.08] text-forest">
              Explore Your Destination with Ease and Comfort
            </h1>
            <p className="mx-auto mt-4 max-w-[620px] text-[15.5px] leading-7 text-inksoft">
              Choose your vehicle type and fill in your details to book instantly — every cab comes
              with a local driver, AC, insurance and GPS tracking.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1180px] px-8 pb-[90px]">
          <CabBooking />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cabServiceJsonLd()) }} />
    </>
  );
}
