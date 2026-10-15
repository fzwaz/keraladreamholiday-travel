import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/packages`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/cabs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/stories`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];
}
