import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const isSanityConfigured = Boolean(projectId);

const fallbackClient = {
  fetch: async <R = unknown>(): Promise<R> => [] as unknown as R,
} as unknown as SanityClient;

const baseClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion: "2026-10-11",
      useCdn: true,
    })
  : null;

export const client: SanityClient = baseClient
  ? new Proxy(baseClient, {
      get(target, prop, receiver) {
        if (prop === "fetch") {
          return async (...args: Parameters<SanityClient["fetch"]>) => {
            try {
              return await target.fetch(...args);
            } catch (err) {
              console.warn("Sanity fetch failed (falling back to static defaults):", err);
              return [];
            }
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    })
  : fallbackClient;

