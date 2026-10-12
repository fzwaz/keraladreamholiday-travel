import Reveal from "./Reveal";

const STEPS = [
  { n: "01", t: "Tell us the shape of it", p: "Dates, pace, who's coming — and what “relaxing” actually means to you." },
  { n: "02", t: "We draft a route", p: "A day-by-day plan across two or three regions, with a local guide attached to each." },
  { n: "03", t: "You adjust it", p: "Swap a stop, add a slow day, cut something that sounds like a duty rather than a wish." },
  { n: "04", t: "We're on call throughout", p: "A phone number in your pocket for the whole trip, not just the booking." },
];

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="scroll-mt-20 bg-forest py-[84px] text-paper">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal className="mb-11 max-w-[640px]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-sage">How it works</p>
          <h2 id="process-heading" className="mt-4 font-serif text-[clamp(30px,4vw,46px)] font-normal leading-[1.1] text-paper">
            Four conversations, one itinerary.
          </h2>
          <p className="mt-[18px] max-w-[520px] text-base leading-[1.65] text-paper/70">
            No fixed packages. We build the route around how you actually like to travel.
          </p>
        </Reveal>
        <div className="grid grid-cols-4 gap-9 max-md:grid-cols-2 max-sm:grid-cols-1">
          {STEPS.map((s) => (
            <Reveal key={s.n} className="border-t border-paper/20 pt-[22px]">
              <p className="font-mono text-[13px] text-spice">{s.n}</p>
              <h3 className="mt-[14px] font-serif text-[19px] font-medium text-paper">{s.t}</h3>
              <p className="mt-2.5 text-sm leading-6 text-paper/65">{s.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
