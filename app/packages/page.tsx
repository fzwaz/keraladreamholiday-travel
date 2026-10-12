import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import PackagesBrowser from "@/components/PackagesBrowser";
import { IntroToggle } from "@/components/packages-ui";
import { PACKAGES } from "@/lib/site";
import { packageListJsonLd } from "@/lib/seo";
import { client } from "@/lib/sanity/client";
import { PACKAGES_QUERY, DESTINATIONS_QUERY, type SanityPackage, type SanityDestination } from "@/lib/sanity/queries";
import { toTourPackage } from "@/lib/sanity/map";

export const metadata: Metadata = {
  title: "Kerala Tour Packages — Munnar, Alleppey, Thekkady, Wayanad, Kovalam",
  description:
    "Explore curated Kerala tour packages: Munnar tea trails, Alleppey & Kumarakom houseboats, Thekkady wildlife, Wayanad retreats, Kovalam coast and honeymoon specials. Free custom quotes.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Kerala Tour Packages — Dreams Kerala Holiday",
    description:
      "Curated Kerala itineraries with local guides: hills, backwaters, wildlife and coast. Free custom quotes.",
    url: "/packages",
  },
};

export default async function PackagesPage() {
  const [docs, destDocs] = await Promise.all([
    client.fetch<SanityPackage[]>(PACKAGES_QUERY, {}, { next: { revalidate: 30 } }),
    client.fetch<SanityDestination[]>(DESTINATIONS_QUERY, {}, { next: { revalidate: 30 } }),
  ]);
  // Sanity is the source of truth; static list is only a fallback until
  // the first packages are published.
  const list = docs.length > 0 ? docs.map(toTourPackage) : PACKAGES;
  const destNames = destDocs.map((d) => d.name).filter((n): n is string => !!n);
  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main">
        <div className="pb-8 pt-28">
          <div className="mx-auto max-w-[1180px] px-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-tea">
              {list.length} curated {list.length === 1 ? "itinerary" : "itineraries"}
            </p>
            <h1 className="mb-[18px] font-serif text-[clamp(30px,4vw,44px)] font-normal text-forest">
              Kerala Tour Packages
            </h1>
            <IntroToggle>
              Kerala is one of the few places where a single trip can cover mist-covered tea hills, backwater canals, a
              tiger reserve and a stretch of Arabian Sea coast — without long transfers in between. Our Kerala tour
              packages are built region by region: a few days in Munnar&rsquo;s tea country, a night on a houseboat in
              Alleppey or Kumarakom, a walk through Thekkady&rsquo;s forest edge, and a coastal finish in Kovalam or
              Kochi. Every package below comes with a named local guide, not a rotating driver, and a route we&rsquo;re
              happy to rearrange before you pay for anything.
            </IntroToggle>
          </div>
        </div>

        <div className="mx-auto max-w-[1180px] px-8">
          <PackagesBrowser packages={list} allDestinations={destNames} />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packageListJsonLd()) }} />
    </>
  );
}
