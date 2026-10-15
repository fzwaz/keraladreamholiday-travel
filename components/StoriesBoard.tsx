"use client";

import { useEffect, useState } from "react";
import ReviewForm, { type ReviewDraft } from "./ReviewForm";
import {
  SEED_REVIEWS,
  displayName,
  loadReviews,
  saveReviews,
  type Review,
} from "@/lib/reviews";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `rv-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export default function StoriesBoard({ sanityReviews = [] }: { sanityReviews?: Review[] }) {
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [storageNote, setStorageNote] = useState("");

  useEffect(() => {
    setUserReviews(loadReviews());
  }, []);

  async function handleSubmit(draft: ReviewDraft) {
    // First stop: Sanity moderation queue (unpublished draft for owner approval).
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && data?.ok) {
        setStorageNote(
          "Thank you — your review was sent for approval and will appear here once published.",
        );
        return;
      }
    } catch {
      /* fall through to browser-local display */
    }
    const review: Review = {
      id: newId(),
      name: draft.name,
      anonymous: draft.anonymous,
      location: draft.location,
      text: draft.text,
      photos: draft.photos,
      dateLabel: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };
    const next = [review, ...userReviews];
    setUserReviews(next);
    // Persist; if photos blow the browser quota, keep the words and retry photo-less.
    if (!saveReviews(next)) {
      const slim = next.map((r) => ({ ...r, photos: [] as string[] }));
      if (saveReviews(slim)) {
        setStorageNote(
          "Your review is live, but this browser is out of storage — photos are shown for this visit only.",
        );
      } else {
        setStorageNote("Your review is shown for this visit, but this browser blocked saving it.");
      }
    } else {
      setStorageNote("");
    }
  }

  function removeReview(id: string) {
    const next = userReviews.filter((r) => r.id !== id);
    setUserReviews(next);
    saveReviews(next);
  }

  const all = [...sanityReviews, ...userReviews, ...SEED_REVIEWS];
  const gallery = all.flatMap((r) =>
    r.photos.map((src, i) => ({ src, by: displayName(r), loc: r.location, key: `${r.id}-${i}` })),
  );

  return (
    <div>
      <ReviewForm onSubmit={handleSubmit} />
      {storageNote && (
        <p role="status" className="mt-4 rounded border border-line bg-paper px-4 py-2.5 text-sm text-inksoft">
          {storageNote}
        </p>
      )}

      {/* Reviews */}
      <div className="mt-14">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-[clamp(24px,3vw,34px)] font-medium text-forest">
            What travellers say
          </h2>
          <span className="font-mono text-[12.5px] text-inksoft">
            {all.length} {all.length === 1 ? "story" : "stories"}
          </span>
        </div>
        {all.length === 0 ? (
          <p className="rounded border border-line bg-paper px-6 py-10 text-center text-inksoft">
            No stories yet — yours could be the first.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-[22px] max-sm:grid-cols-1">
            {all.map((r) => (
              <article key={r.id} className="relative flex flex-col gap-4 rounded-[3px] border border-line bg-paper p-7">
                {!r.seed && userReviews.some((u) => u.id === r.id) && (
                  <button
                    type="button"
                    aria-label={`Remove your review`}
                    title="Remove your review"
                    onClick={() => removeReview(r.id)}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs text-inksoft transition-colors hover:bg-mist hover:text-ink"
                  >
                    ✕
                  </button>
                )}
                <p className="font-serif text-[15px] italic leading-7 text-ink">“{r.text}”</p>
                {r.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {r.photos.slice(0, 4).map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${r.id}-thumb-${i}`}
                        src={src}
                        alt={`Photo by ${displayName(r)} in ${r.location}`}
                        loading="lazy"
                        className="h-16 w-16 flex-none rounded-[3px] border border-line object-cover"
                      />
                    ))}
                  </div>
                )}
                <footer className="mt-auto border-t border-line pt-4">
                  <p className="font-serif text-[15px] font-medium text-forest">{displayName(r)}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-tea">
                    {r.location} · {r.dateLabel}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="mt-14">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-[clamp(24px,3vw,34px)] font-medium text-forest">
            Traveller gallery
          </h2>
          <span className="font-mono text-[12.5px] text-inksoft">
            {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
          </span>
        </div>
        {gallery.length === 0 ? (
          <div className="rounded border border-dashed border-tea/50 bg-paper px-6 py-12 text-center">
            <p className="font-serif text-xl text-forest">No traveller photos yet</p>
            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-inksoft">
              Photos added with a review appear here automatically. Add yours with the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[14px] max-sm:grid-cols-2">
            {gallery.map((g) => (
              <figure key={g.key} className="group relative aspect-[4/3] overflow-hidden rounded-[3px] border border-line bg-forest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={`Traveller photo from ${g.loc}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A100C]/85 to-transparent px-3 pb-2 pt-6 font-mono text-[10.5px] tracking-wide text-paper/85">
                  {g.by} · {g.loc}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
