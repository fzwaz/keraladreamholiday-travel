import { FAQS, PACKAGES, SITE } from "./site";

export function travelAgencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    areaServed: ["Munnar", "Alleppey", "Thekkady", "Wayanad", "Kumarakom", "Kovalam", "Kochi"],
    priceRange: "₹₹",
    sameAs: [],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function packageListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kerala Tour Packages",
    itemListElement: PACKAGES.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TouristTrip",
        name: p.title,
        touristType: "Families, couples and solo travellers",
        itinerary: { "@type": "ItemList", name: p.place },
        offers: {
          "@type": "Offer",
          price: p.now.replace(/[₹,]/g, ""),
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE.url}/packages`,
        },
      },
    })),
  };
}
