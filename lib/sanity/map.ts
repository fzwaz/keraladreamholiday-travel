import type { TourPackage } from "@/lib/site";
import type { Review } from "@/lib/reviews";
import type { SanityPackage, SanityTestimonial } from "./queries";

export function formatINR(n: number): string {
  return `\u20B9${n.toLocaleString("en-IN")}`;
}

const PALETTES: [string, string, string][] = [
  ["#DCE6D2", "#9FB58C", "#4C6B4F"],
  ["#CFE0DE", "#7FA3A0", "#345048"],
  ["#E3E9D6", "#8FA678", "#5B7A52"],
  ["#D7E2CB", "#7FA06B", "#4C6B4F"],
  ["#E7E1CE", "#C7B383", "#8C7A4C"],
  ["#CFE0DE", "#5B8072", "#2F4A34"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Saved picks (resolved names) + free-typed customs, cleaned. */
export function destinationNames(p: SanityPackage): string[] {
  return [...(p.destinations ?? []), ...(p.customDestinations ?? [])].filter(
    (n): n is string => !!n,
  );
}

function motifFor(names: string[], title: string): TourPackage["motif"] {
  const hay = [...names, ""].join(" ").toLowerCase();
  if (/alleppey|kumarakom|backwater|lake|houseboat/.test(hay)) return "water";
  if (/kovalam|kochi|coast|beach/.test(hay)) return "coast";
  if (/honeymoon/.test(title.toLowerCase())) return "sun";
  return "hills";
}

/** Map a Sanity tourPackage doc to the card shape PackageCard expects. */
export function toTourPackage(p: SanityPackage): TourPackage {
  const h = hash(`${p._id}${p.title ?? ""}`);
  const names = destinationNames(p);
  return {
    slug: p._id,
    place: p.place ?? names.join(" \u00B7 ") ?? "Kerala",
    title: p.title ?? "Untitled package",
    duration: p.duration ?? "",
    was: typeof p.originalPrice === "number" ? formatINR(p.originalPrice) : "",
    now: typeof p.price === "number" ? formatINR(p.price) : "Price on request",
    off: p.discountLabel ?? "",
    tags: (p.inclusions ?? []).filter(Boolean),
    group: p.group ?? "kerala",
    palette: PALETTES[h % PALETTES.length],
    motif: motifFor(names, p.title ?? ""),
  };
}

/** Map a Sanity testimonial doc to the Review shape stories UI expects. */
export function toReview(t: SanityTestimonial): Review {
  return {
    id: t._id,
    name: t.name ?? "",
    anonymous: !!t.anonymous,
    location: t.location ?? "Kerala",
    text: t.text ?? "",
    photos: (t.photos ?? []).map((ph) => ph.url).filter((u): u is string => !!u),
    dateLabel: t.dateLabel ?? "",
  };
}
