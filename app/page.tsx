import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Regions from "@/components/Regions";
import Process from "@/components/Process";
import TravellerWall from "@/components/TravellerWall";
import QuoteForm from "@/components/QuoteForm";
import FaqList from "@/components/FaqList";
import StoryRotator from "@/components/StoryRotator";
import { SITE } from "@/lib/site";
import { faqJsonLd } from "@/lib/seo";
import { client } from "@/lib/sanity/client";
import { TESTIMONIALS_QUERY, DESTINATIONS_QUERY, type SanityTestimonial, type SanityDestination } from "@/lib/sanity/queries";
import { toReview } from "@/lib/sanity/map";

export const metadata: Metadata = {
  title: "Kerala Tour Packages, Houseboats & Honeymoon Trips from Kochi",
  description:
    "Slow, small-group Kerala tour packages: Munnar tea hills, Alleppey & Kumarakom houseboats, Thekkady wildlife, Wayanad and Kovalam. Local guides, custom quotes in 30 minutes.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dreams Kerala Holiday — Kerala, at walking pace",
    description: SITE.description,
    url: "/",
  },
};

const STRIP = ["Munnar", "Alleppey", "Wayanad", "Thekkady", "Kumarakom", "Kovalam"];

export default async function HomePage() {
  const [docs, destDocs] = await Promise.all([
    client.fetch<SanityTestimonial[]>(TESTIMONIALS_QUERY, {}, { next: { revalidate: 30 } }),
    client.fetch<SanityDestination[]>(DESTINATIONS_QUERY, {}, { next: { revalidate: 30 } }),
  ]);
  const sanityReviews = docs.map(toReview);
  const strip = destDocs.map((d) => d.name).filter((n): n is string => !!n);
  const marquee = strip.length > 0 ? strip : STRIP;
  return (
    <>
      <SiteHeader variant="overlay" />
      <main id="main">
        <Hero />

        {/* Marquee strip */}
        <div className="relative z-10 overflow-hidden border-y border-line bg-paper py-4" aria-label="Destinations we cover">
          <div className="animate-strip flex w-max gap-14 whitespace-nowrap">
            {[...marquee, ...marquee].map((s, i) => (
              <span
                key={`${s}-${i}`}
                aria-hidden={i >= marquee.length}
                className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.08em] text-inksoft after:ml-[46px] after:text-sage after:content-['—']"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Regions />
        <Process />

        {/* Rotating reviews — text crossfades, photo button when available */}
        <StoryRotator initial={sanityReviews} />

        <TravellerWall />
        <QuoteForm />
        <FaqList />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
    </>
  );
}
