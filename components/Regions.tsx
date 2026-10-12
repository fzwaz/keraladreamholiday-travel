import { REGIONS } from "@/lib/site";
import Reveal from "./Reveal";

const ICONS = [
  "M3 18l5-8 4 5 3-4 6 7H3z",
  "M3 15c3-3 6 3 9 0s6 3 9 0M3 19c3-3 6 3 9 0s6 3 9 0",
  "M4 20c0-6 4-9 8-9s8 3 8 9M9 11V6M15 11V6",
  "M12 3v10M8 9l4 4 4-4M4 21h16",
  "M3 12h18M3 12a9 9 0 0118 0M3 12a9 9 0 0018 0",
  "M2 16c4-4 8 4 12 0s6 2 8 0M12 3l-2 6h4l-2-6z",
];

export default function Regions() {
  return (
    <section id="regions" aria-labelledby="regions-heading" className="scroll-mt-20 py-[84px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal className="mb-11 max-w-[640px]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-tea">Where we go</p>
          <h2 id="regions-heading" className="mt-4 font-serif text-[clamp(30px,4vw,46px)] font-normal leading-[1.1] text-forest">
            Six landscapes, one state.
          </h2>
          <p className="mt-[18px] max-w-[520px] text-base leading-[1.65] text-inksoft">
            Each region gets its own itinerary and its own local guide — someone who grew up on that hillside or that
            backwater, not a rotating driver.
          </p>
        </Reveal>

        <div className="grid grid-cols-3 gap-px border border-line bg-line max-md:grid-cols-1">
          {REGIONS.map((r, i) => (
            <Reveal key={r.name} className="flex min-h-[300px] flex-col gap-[18px] bg-paper p-8 pb-8 transition-colors hover:bg-[#F1EEE4]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[34px] w-[34px] text-tea" aria-hidden="true">
                <path d={ICONS[i % ICONS.length]} />
              </svg>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-spice">{r.place}</p>
              <h3 className="mt-auto font-serif text-[22px] font-medium text-forest">{r.name}</h3>
              <p className="text-[14.5px] leading-6 text-inksoft">{r.blurb}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
