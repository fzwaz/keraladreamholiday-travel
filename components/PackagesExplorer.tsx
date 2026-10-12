"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PackageCard from "@/components/PackageCard";
import { PromoForm } from "@/components/packages-ui";
import type { TourPackage } from "@/lib/site";

const FALLBACK_DESTINATIONS = ["Munnar", "Alleppey", "Thekkady", "Wayanad", "Kumarakom", "Kovalam", "Kochi"];
const DURATIONS = ["1–3 Days", "4–6 Days", "7–10 Days", "10+ Days"];
const THEMES = ["Honeymoon", "Family", "Friends", "Solo", "Adventure"];

const MIN_BUDGET = 8000;
const MAX_BUDGET = 35000;
const PAGE_SIZE = 9;

function priceOf(pkg: TourPackage): number {
  const n = Number((pkg.now ?? "").replace(/[^0-9]/g, ""));
  return n > 0 ? n : Number.POSITIVE_INFINITY;
}

/** Longest day count found in "5D / 4N"-style strings, else null. */
function daysOf(pkg: TourPackage): number | null {
  const nums = (pkg.duration ?? "").match(/\d+/g)?.map(Number) ?? [];
  return nums.length > 0 ? Math.max(...nums) : null;
}

function bucketOf(days: number): string {
  if (days <= 3) return DURATIONS[0];
  if (days <= 6) return DURATIONS[1];
  if (days <= 10) return DURATIONS[2];
  return DURATIONS[3];
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-[9px] text-[13.5px] text-inksoft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="grid h-[15px] w-[15px] shrink-0 cursor-pointer appearance-none place-content-center rounded-[3px] border border-line checked:border-tea checked:bg-tea"
      />
      {label}
    </label>
  );
}

const SUMMARY_CLASS =
  "flex cursor-pointer list-none items-center justify-between text-[13px] font-medium uppercase tracking-[0.03em] text-forest [&::-webkit-details-marker]:hidden after:font-mono after:text-base after:text-tea after:content-['+'] open:after:content-['−']";

export default function PackagesExplorer({
  packages,
  allDestinations,
  group,
}: {
  packages: TourPackage[];
  allDestinations?: string[];
  group: string;
}) {
  const destinations =
    allDestinations && allDestinations.length > 0 ? allDestinations : FALLBACK_DESTINATIONS;
  const [dest, setDest] = useState<string[]>([]);
  const [dur, setDur] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [budget, setBudget] = useState(MAX_BUDGET);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      packages.filter((p) => {
        if (group !== "kerala" && p.group !== group) return false;
        if (dest.length > 0) {
          const hay = `${p.place} ${p.title}`.toLowerCase();
          if (!dest.some((d) => hay.includes(d.toLowerCase()))) return false;
        }
        if (budget < MAX_BUDGET && priceOf(p) > budget) return false;
        if (dur.length > 0) {
          const days = daysOf(p);
          if (days === null || !dur.includes(bucketOf(days))) return false;
        }
        if (themes.length > 0) {
          const hay = `${p.title} ${p.place} ${p.tags.join(" ")}`.toLowerCase();
          if (!themes.some((t) => hay.includes(t.toLowerCase()))) return false;
        }
        return true;
      }),
    [packages, group, dest, dur, themes, budget],
  );

  // Any filter change drops back to page 1.
  useEffect(() => {
    setPage(1);
  }, [group, dest, dur, themes, budget]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Sliding window of up to 5 page numbers around the current page.
  const pageNumbers = useMemo(() => {
    const max = 5;
    const end = Math.min(totalPages, Math.max(max, safePage + 2));
    const start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [safePage, totalPages]);

  function goToPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeCount =
    dest.length + dur.length + themes.length + (budget < MAX_BUDGET ? 1 : 0);

  function clearAll() {
    setDest([]);
    setDur([]);
    setThemes([]);
    setBudget(MAX_BUDGET);
    setPage(1);
  }

  return (
    <div className="grid grid-cols-[260px_1fr] items-start gap-10 pb-[90px] pt-8 max-lg:grid-cols-1">
      {/* Filters */}
      <aside aria-label="Filter packages" className="sticky top-[88px] border border-line bg-paper p-6 max-lg:static">
        <div className="mb-[18px] flex items-center justify-between">
          <h2 className="font-mono text-[13px] uppercase tracking-[0.06em] text-forest">
            All filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </h2>
          <button type="button" onClick={clearAll} className="text-[12.5px] text-spice hover:underline">
            Clear
          </button>
        </div>
        <details open className="border-t border-line py-[18px] first:border-t-0 first:pt-0">
          <summary className={SUMMARY_CLASS}>Destinations</summary>
          <div className="mt-[14px] flex flex-col gap-[11px]">
            {destinations.map((d) => (
              <Check key={d} label={d} checked={dest.includes(d)} onChange={() => setDest((v) => toggle(v, d))} />
            ))}
          </div>
        </details>
        <details className="border-t border-line py-[18px]">
          <summary className={SUMMARY_CLASS}>Budget (per person)</summary>
          <p className="mt-[14px] font-mono text-[12px] text-forest">
            Up to ₹{budget.toLocaleString("en-IN")}
          </p>
          <input
            type="range"
            aria-label="Maximum budget per person"
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step={500}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mb-2 mt-2 w-full"
          />
          <div className="flex justify-between font-mono text-[11.5px] text-inksoft">
            <span>₹8,000</span>
            <span>₹35,000</span>
          </div>
        </details>
        <details className="border-t border-line py-[18px]">
          <summary className={SUMMARY_CLASS}>Duration</summary>
          <div className="mt-[14px] flex flex-col gap-[11px]">
            {DURATIONS.map((d) => (
              <Check key={d} label={d} checked={dur.includes(d)} onChange={() => setDur((v) => toggle(v, d))} />
            ))}
          </div>
        </details>
        <details className="border-t border-line py-[18px]">
          <summary className={SUMMARY_CLASS}>Theme</summary>
          <div className="mt-[14px] flex flex-col gap-[11px]">
            {THEMES.map((t) => (
              <Check key={t} label={t} checked={themes.includes(t)} onChange={() => setThemes((v) => toggle(v, t))} />
            ))}
          </div>
        </details>
      </aside>

      {/* Results */}
      <div>
        <div ref={topRef} className="mb-[22px] flex scroll-mt-24 flex-wrap items-baseline justify-between gap-2.5">
          <h2 className="font-serif text-xl font-medium text-forest">Explore Kerala tour packages</h2>
          <span className="font-mono text-[12.5px] text-inksoft">
            Showing {filtered.length} of {packages.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded border border-line bg-paper px-6 py-14 text-center">
            <p className="font-serif text-xl text-forest">No packages match those filters</p>
            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-inksoft">
              Try widening the budget or clearing a filter — or tell us what you want and we&apos;ll build it.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 rounded-sm bg-forest px-6 py-2.5 font-mono text-[13px] tracking-wide text-paper transition-colors hover:bg-tea"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[22px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {pageItems.slice(0, 6).map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}

            {/* Promo banner — first page only */}
            {safePage === 1 && (
              <div className="col-span-full flex flex-wrap items-center justify-between gap-6 rounded bg-gradient-to-r from-tea/60 to-forest px-9 py-[34px]">
                <p className="font-italiana text-[26px] font-normal text-paper">Don&rsquo;t just dream, travel.</p>
                <PromoForm />
              </div>
            )}

            {pageItems.slice(6).map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[12.5px] text-inksoft">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} Kerala tour packages
            </span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous page" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="flex h-[34px] w-[34px] items-center justify-center rounded-[3px] border border-line bg-paper text-[13px] text-inksoft disabled:opacity-40">‹</button>
              {pageNumbers.map((n) => (
                <button key={n} type="button" aria-label={`Page ${n}`} aria-current={n === safePage ? "page" : undefined} onClick={() => goToPage(n)}
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-[3px] border text-[13px] ${n === safePage ? "border-forest bg-forest text-paper" : "border-line bg-paper text-inksoft"}`}>
                  {n}
                </button>
              ))}
              <button type="button" aria-label="Next page" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="flex h-[34px] w-[34px] items-center justify-center rounded-[3px] border border-line bg-paper text-[13px] text-inksoft disabled:opacity-40">›</button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
