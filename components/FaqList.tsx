import { FAQS } from "@/lib/site";
import Reveal from "./Reveal";

export default function FaqList() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 py-[84px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal className="mx-auto mb-11 max-w-[640px] text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-tea">Questions</p>
          <h2 id="faq-heading" className="mt-4 font-serif text-[clamp(30px,4vw,46px)] font-normal leading-[1.1] text-forest">
            Before you write to us
          </h2>
          <p className="mx-auto mt-[18px] max-w-[520px] text-base leading-[1.65] text-inksoft">
            A few things people usually ask before booking a Kerala trip with us.
          </p>
        </Reveal>

        <Reveal className="mx-auto max-w-[820px]">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b border-line py-[22px] first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-lg font-medium text-forest [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-line transition-colors group-open:bg-forest" aria-hidden="true">
                  <span className="absolute h-[1.4px] w-[11px] bg-forest group-open:bg-paper" />
                  <span className="absolute h-[11px] w-[1.4px] bg-forest transition-transform group-open:rotate-90 group-open:scale-y-0 group-open:bg-paper" />
                </span>
              </summary>
              <p className="mt-[14px] max-w-[700px] text-[14.5px] leading-7 text-inksoft">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
