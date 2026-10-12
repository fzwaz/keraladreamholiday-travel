"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * Hero photo lives at `public/images/hero-kerala.jpg` (recovered from the
 * original static site) and is served optimized via next/image instead of
 * the old 400KB inline base64 data-URI.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgRef.current && y < window.innerHeight) {
          bgRef.current.style.transform = `translateY(${y * 0.18}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} aria-label="Introduction" className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-forest pb-24 pt-32">
      {/* Backdrop: original Western Ghats photo + readability gradient */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <Image
          src="/images/hero-kerala.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 62%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A12]/35 via-[#0F1A12]/15 via-40% to-[#0C1410]/55 to-80% to-[#0A110C]/80" />
      </div>

      <div className="relative z-[5] mx-auto flex w-full max-w-[1180px] flex-col items-center px-8 py-10 text-center">
        <p className="mb-[22px] font-mono text-xs uppercase tracking-[0.14em] text-[#D9E4CE]">
          Kerala — God&rsquo;s Own Country
        </p>
        <p className="font-abril text-[clamp(48px,8.5vw,116px)] font-normal leading-none tracking-[0.005em] text-paper drop-shadow-[0_2px_30px_rgba(0,0,0,0.25)]">
          Explore Kerala
        </p>
        <h1 className="mx-auto mt-5 max-w-[640px] font-serif text-[clamp(22px,2.6vw,30px)] font-normal italic leading-[1.3] text-[#EDEAE0]">
          Kerala, at walking pace.
        </h1>
        <p className="mx-auto mt-[22px] max-w-[460px] text-base leading-6 text-paper/80">
          We plan slow, small-group journeys through Kerala&rsquo;s hills, backwaters and shorelines — built around a
          local guide, not a checklist.
        </p>
        <div className="mt-[38px] flex flex-wrap items-center justify-center gap-[18px]">
          <Link
            href="#get-quote"
            className="inline-block rounded-sm bg-spice px-7 py-[15px] font-mono text-sm tracking-wide text-paper transition-all hover:-translate-y-0.5 hover:bg-[#D69A4D]"
          >
            Start planning
          </Link>
          <Link
            href="#regions"
            className="border-b border-paper/40 pb-0.5 text-sm text-paper/85 transition-colors hover:border-paper hover:text-paper"
          >
            See where we go →
          </Link>
        </div>
      </div>
    </section>
  );
}
