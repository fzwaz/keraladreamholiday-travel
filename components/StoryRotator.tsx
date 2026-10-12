"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SEED_REVIEWS, displayName, loadReviews, type Review } from "@/lib/reviews";

const ROTATE_MS = 5000;

function Lightbox({
  photos,
  index,
  by,
  loc,
  onClose,
  onNav,
}: {
  photos: string[];
  index: number;
  by: string;
  loc: string;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNav]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos by ${by} from ${loc}`}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/85 p-4 sm:p-10"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative flex max-h-full flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close photo viewer"
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          ✕
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photos[index]}
          src={photos[index]}
          alt={`Traveller photo by ${by} from ${loc} (${index + 1} of ${photos.length})`}
          className="story-enter max-h-[75vh] max-w-full rounded-[3px] object-contain"
        />
        <div className="mt-3 flex items-center gap-4">
          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => onNav(-1)}
              aria-label="Previous photo"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              ‹
            </button>
          )}
          <p className="font-mono text-xs tracking-wide text-paper/85">
            {by} · {loc} · {index + 1} / {photos.length}
          </p>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => onNav(1)}
              aria-label="Next photo"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StoryRotator({ initial = [] }: { initial?: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(() => [...initial, ...SEED_REVIEWS]);
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReviews([...initial, ...loadReviews(), ...SEED_REVIEWS]);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [initial]);

  const count = reviews.length;
  const current = reviews[count === 0 ? 0 : index % count];
  const frozen = hoverPaused || photoIdx !== null;
  const isLong = !!current && current.text.length > 240;

  // Fresh review → collapse back to clamped view, close any lightbox.
  useEffect(() => {
    setExpanded(false);
    setPhotoIdx(null);
  }, [index]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setPhotoIdx(null);
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (frozen || reduced || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(t);
  }, [frozen, reduced, count]);

  if (!current) return null;

  return (
    <section
      id="stories"
      aria-labelledby="stories-heading"
      aria-roledescription="carousel"
      className="scroll-mt-20 py-24 text-center"
    >
      <div className="mx-auto max-w-[1180px] px-8">
        <h2 id="stories-heading" className="sr-only">
          Traveller stories
        </h2>
        <p className="font-serif text-[64px] leading-none text-sage" aria-hidden="true">
          &ldquo;
        </p>

        <div key={current.id} className="story-enter">
          {/* Fixed-height quote zone: rotation never moves what sits below it.
              Hovering the text pauses rotation; hovering anywhere else keeps it going. */}
          <div
            className="mx-auto min-h-[11rem] max-w-4xl sm:min-h-[16rem]"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onFocus={() => setHoverPaused(true)}
            onBlur={() => setHoverPaused(false)}
          >
            <blockquote
              className={`font-serif text-[clamp(24px,3.4vw,38px)] font-normal italic leading-[1.35] text-forest ${
                isLong && !expanded ? "line-clamp-4" : ""
              }`}
            >
              {current.text}
            </blockquote>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-3 border-b border-tea/50 pb-0.5 text-sm text-tea transition-colors hover:border-forest hover:text-forest"
              >
                {expanded ? "Show less ↑" : "Read more ↓"}
              </button>
            )}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <p className="font-mono text-[13px] tracking-[0.05em] text-inksoft">
              {displayName(current)} · {current.location}, {current.dateLabel}
            </p>
            {/* Always rendered — hidden via `invisible` when there are no photos,
                so the row keeps the exact same height and nothing below it moves. */}
            <button
              type="button"
              onClick={() => current.photos.length > 0 && setPhotoIdx(0)}
              tabIndex={current.photos.length > 0 ? 0 : -1}
              aria-hidden={current.photos.length === 0}
              className={`inline-flex items-center gap-2 rounded-full border border-tea/50 px-5 py-2 font-mono text-xs tracking-wide text-tea transition-colors hover:border-forest hover:bg-forest hover:text-paper ${
                current.photos.length === 0 ? "invisible" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
                <circle cx="9" cy="9" r="1.6" />
                <path d="M4 17l5-5 3 3 4-4 4 4" />
              </svg>
              View {current.photos.length === 1 ? "photo" : "photos"} ({current.photos.length})
            </button>
          </div>
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous story"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-lg text-inksoft transition-colors hover:border-forest hover:text-forest"
            >
              ‹
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose story">
              {reviews.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index % count}
                  aria-label={`Story ${i + 1} by ${displayName(r)}`}
                  onClick={() => {
                    setPhotoIdx(null);
                    setIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === index % count ? "w-6 bg-forest" : "w-2 bg-line hover:bg-sage"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next story"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-lg text-inksoft transition-colors hover:border-forest hover:text-forest"
            >
              ›
            </button>
          </div>
        )}

        <Link
          href="/stories"
          className="mt-6 inline-block border-b border-tea/50 pb-0.5 text-sm text-tea transition-colors hover:border-forest hover:text-forest"
        >
          Read all stories &amp; leave yours →
        </Link>
      </div>

      {photoIdx !== null && current.photos.length > 0 && (
        <Lightbox
          photos={current.photos}
          index={photoIdx % current.photos.length}
          by={displayName(current)}
          loc={current.location}
          onClose={() => setPhotoIdx(null)}
          onNav={(dir) =>
            setPhotoIdx((i) => (i === null ? 0 : (i + dir + current.photos.length) % current.photos.length))
          }
        />
      )}
    </section>
  );
}
