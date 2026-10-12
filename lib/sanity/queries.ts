import { defineQuery } from "next-sanity";

// Shapes returned by the queries below. Nullable because drafts or
// partially filled documents may miss fields.

export interface SanityDestination {
  _id: string;
  name: string | null;
}

export const DESTINATIONS_QUERY = defineQuery(
  `*[_type == "destination"] | order(name asc){ _id, name }`
);

export interface SanityPackage {
  _id: string;
  title: string | null;
  place: string | null;
  destinations: (string | null)[] | null;
  customDestinations: (string | null)[] | null;
  duration: string | null;
  price: number | null;
  originalPrice: number | null;
  discountLabel: string | null;
  group: string | null;
  inclusions: string[] | null;
}

export const PACKAGES_QUERY = defineQuery(
  `*[_type == "tourPackage"] | order(_createdAt desc){
    _id, title, place, duration, price, originalPrice, discountLabel, group, inclusions,
    "destinations": destinations[]->name,
    customDestinations
  }`
);

export const PACKAGE_QUERY = defineQuery(
  `*[_type == "tourPackage" && _id == $id][0]{ _id, title, body }`
);

export interface SanityTestimonialPhoto {
  url: string | null;
}

export interface SanityTestimonial {
  _id: string;
  name: string | null;
  anonymous: boolean | null;
  location: string | null;
  text: string | null;
  dateLabel: string | null;
  photos: SanityTestimonialPhoto[] | null;
}

export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonial"] | order(_createdAt desc){
    _id, name, anonymous, location, text, dateLabel,
    "photos": photos[]{ "url": asset->url }
  }`
);
