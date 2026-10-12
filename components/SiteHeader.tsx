"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export default function SiteHeader({ variant }: { variant: "overlay" | "solid" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = variant === "solid" || scrolled;

  useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 py-6 transition-all duration-300 ${
        solid
          ? "bg-paper/90 py-4 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="relative flex w-full items-center justify-between px-6 lg:px-10"
      >
        <Link
          href="/"
          aria-label={SITE.name}
          className="relative flex h-[52px] flex-none items-center whitespace-nowrap"
        >
          {/* White over the hero, black once scrolled — crossfaded, no flash */}
          <Image
            src="/images/Dream logo white.png"
            alt={SITE.name}
            width={480}
            height={200}
            priority
            aria-hidden={solid}
            className={`h-[52px] w-auto transition-opacity duration-300 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] ${solid ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src="/images/Dream logo black.png"
            alt={SITE.name}
            width={480}
            height={200}
            priority
            aria-hidden={!solid}
            className={`absolute left-0 top-0 h-[52px] w-auto transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
          />
        </Link>
        <div
          className={`items-center gap-9 max-md:fixed max-md:right-0 max-md:top-0 max-md:h-screen max-md:w-[min(320px,80vw)] max-md:flex-col max-md:items-start max-md:bg-paper max-md:px-8 max-md:pt-24 max-md:shadow-[-8px_0_30px_rgba(0,0,0,0.08)] max-md:transition-transform max-md:duration-300 md:absolute md:left-1/2 md:top-1/2 md:flex md:-translate-x-1/2 md:-translate-y-1/2 ${
            open ? "max-md:flex max-md:translate-x-0" : "max-md:translate-x-full max-md:flex"
          }`}
        >
          <Link
            href="/packages"
            onClick={() => setOpen(false)}
            className={`text-sm transition-colors max-md:text-base max-md:text-inksoft ${
              solid ? "text-inksoft hover:text-forest" : "text-paper/85 hover:text-paper"
            }`}
          >
            Packages
          </Link>
          <Link
            href="/#process"
            onClick={() => setOpen(false)}
            className={`text-sm transition-colors max-md:text-base max-md:text-inksoft ${
              solid ? "text-inksoft hover:text-forest" : "text-paper/85 hover:text-paper"
            }`}
          >
            How it works
          </Link>
          <Link
            href="/stories"
            onClick={() => setOpen(false)}
            className={`text-sm transition-colors max-md:text-base max-md:text-inksoft ${
              solid ? "text-inksoft hover:text-forest" : "text-paper/85 hover:text-paper"
            }`}
          >
            Stories
          </Link>
          <Link
            href="/#get-quote"
            onClick={() => setOpen(false)}
            className={`rounded-sm border px-5 py-2.5 font-mono text-[13px] tracking-wide transition-colors md:hidden ${
              "border-forest text-forest hover:bg-forest hover:text-paper"
            }`}
          >
            Plan a trip
          </Link>
        </div>
        <div className="flex flex-none items-center gap-3">
          <Link
            href="/#get-quote"
            className={`rounded-sm border px-5 py-2.5 font-mono text-[13px] tracking-wide transition-colors max-md:hidden ${
              solid
                ? "border-forest text-forest hover:bg-forest hover:text-paper"
                : "border-paper/70 text-paper hover:bg-paper hover:text-forest"
            }`}
          >
            Plan a trip
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden ${solid ? "text-forest" : "text-paper"}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
