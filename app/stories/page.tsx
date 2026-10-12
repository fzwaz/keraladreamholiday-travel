import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import StoriesBoard from "@/components/StoriesBoard";
import { SITE } from "@/lib/site";
import { client } from "@/lib/sanity/client";
import { TESTIMONIALS_QUERY, type SanityTestimonial } from "@/lib/sanity/queries";
import { toReview } from "@/lib/sanity/map";

export const metadata: Metadata = {
  title: "Traveller Stories & Reviews — Kerala Trips",
  description:
    "Read honest reviews from Dreams Kerala Holiday travellers — Munnar, Alleppey houseboats, Thekkady, Wayanad, Kovalam. Travelled with us? Leave your own story and photos.",
  alternates: { canonical: "/stories" },
  openGraph: {
    title: "Traveller Stories & Reviews — Dreams Kerala Holiday",
    description:
      "Real words and photos from Kerala itineraries we've planned. Add your own story.",
    url: "/stories",
  },
};

export default async function StoriesPage() {
  const docs = await client.fetch<SanityTestimonial[]>(
    TESTIMONIALS_QUERY,
    {},
    { next: { revalidate: 30 } },
  );
  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main">
        <div className="pb-4 pt-28">
          <div className="mx-auto max-w-[1180px] px-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-tea">
              Traveller stories
            </p>
            <h1 className="mb-[18px] max-w-[640px] font-serif text-[clamp(30px,4vw,44px)] font-normal leading-[1.1] text-forest">
              Kerala, in their words.
            </h1>
            <p className="max-w-[620px] text-[15.5px] leading-7 text-inksoft">
              Unscripted reviews from people who travelled with {SITE.shortName} — through the tea
              hills, the backwaters and the coast. Came back recently? Your story and photos join
              this wall the moment you hit publish.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-[1180px] px-8 pb-[90px] pt-8">
          <StoriesBoard sanityReviews={docs.map(toReview)} />
        </div>
      </main>
    </>
  );
}
