"use client";

import { useMemo, useState } from "react";
import { TRAVELLERS_ROW_1, TRAVELLERS_ROW_2 } from "@/lib/site";

const PALETTES: [string, string, string][] = [
  ["#DCE6D2", "#9FB58C", "#4C6B4F"],
  ["#CFE0DE", "#7FA3A0", "#345048"],
  ["#E3E9D6", "#8FA678", "#5B7A52"],
  ["#D7E2CB", "#7FA06B", "#4C6B4F"],
  ["#E7E1CE", "#C7B383", "#8C7A4C"],
  ["#CFE0DE", "#5B8072", "#2F4A34"],
];

function scene(bg: string, mid: string, front: string, boat: boolean) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">` +
    `<rect width="300" height="200" fill="${bg}"/>` +
    `<path d="M0 138 L60 96 L125 132 L190 82 L255 128 L300 100 L300 200 L0 200 Z" fill="${mid}"/>` +
    `<path d="M0 168 L80 142 L160 174 L240 138 L300 162 L300 200 L0 200 Z" fill="${front}"/>` +
    (boat
      ? `<path d="M40 118 L150 118 L135 132 L55 132 Z" fill="${front}"/><path d="M95 118 L95 88 L118 118 Z" fill="${bg}" opacity="0.8"/>`
      : "") +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Row({ items, reverse, offset }: { items: { name: string; caption: string }[]; reverse?: boolean; offset: number }) {
  const [paused, setPaused] = useState(false);
  const cards = useMemo(
    () =>
      items.map((t, i) => {
        const p = PALETTES[(i + offset) % PALETTES.length];
        return { ...t, image: scene(p[0], p[1], p[2], (i + offset) % 3 === 1) };
      }),
    [items, offset],
  );
  const doubled = [...cards, ...cards];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max items-center gap-[22px] ${
          reverse ? "animate-cw-reverse" : "animate-cw"
        } ${paused ? "cw-paused" : ""}`}
      >
        {doubled.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            role="img"
            aria-label={`${c.name}, ${c.caption}`}
            tabIndex={0}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative h-[158px] w-[230px] flex-none overflow-hidden rounded-[10px] bg-forest shadow-[0_14px_32px_-14px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.03] max-sm:h-32 max-sm:w-[180px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt="" loading="lazy" decoding="async" draggable={false} className="block h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A100C]/90 to-transparent px-4 pb-3 pt-[14px]">
              <strong className="block font-serif text-[14.5px] font-medium text-paper">{c.name}</strong>
              <span className="mt-0.5 block font-mono text-[10px] tracking-wide text-paper/70">{c.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TravellerWall() {
  return (
    <section aria-labelledby="travellers-heading" className="relative overflow-hidden bg-[#132018] py-[100px] max-sm:py-[72px]">
      <div className="relative mx-auto mb-16 max-w-[680px] px-5 text-center">
        <span className="absolute left-[12%] top-[-10px] h-2 w-2 rounded-full bg-spice opacity-70" aria-hidden="true" />
        <span className="absolute left-[4%] top-5 h-[5px] w-[5px] rounded-full bg-spice opacity-70" aria-hidden="true" />
        <span className="absolute right-[10%] top-1.5 h-2.5 w-2.5 rounded-full bg-spice opacity-70" aria-hidden="true" />
        <span className="absolute right-[2%] top-10 h-[5px] w-[5px] rounded-full bg-spice opacity-70" aria-hidden="true" />
        <p className="flex justify-center font-mono text-xs uppercase tracking-[0.14em] text-sage">Happy travellers</p>
        <h2 id="travellers-heading" className="mt-[14px] font-serif text-[clamp(28px,4vw,44px)] font-normal text-paper">
          Trips our travellers keep talking about
        </h2>
        <p className="mt-[18px] text-[15.5px] leading-6 text-paper/60">
          A running showcase of moments from Kerala itineraries we&rsquo;ve planned — hover a card to pause and see who, and where.
        </p>
      </div>
      <div className="cw-mask relative flex flex-col gap-[22px] max-sm:gap-[14px]">
        <Row items={TRAVELLERS_ROW_1} offset={0} />
        <Row items={TRAVELLERS_ROW_2} reverse offset={TRAVELLERS_ROW_1.length} />
      </div>
    </section>
  );
}
