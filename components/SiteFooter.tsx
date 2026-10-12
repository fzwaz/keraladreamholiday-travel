import Link from "next/link";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden pt-[72px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 border-b border-line pb-[70px] max-md:grid-cols-2 max-sm:grid-cols-1">
          <div>
            <Link href="/" className="mb-[18px] flex items-center gap-2 font-serif text-[17px] font-semibold text-forest">
              <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
                <path d="M3 18L9 8l4 6 3-4 5 8H3z" fill="currentColor" opacity="0.9" />
              </svg>
              {SITE.name}
            </Link>
            <p className="max-w-[280px] text-sm leading-6 text-inksoft">
              A small trip-planning studio based in Kochi, working across Kerala&rsquo;s hills, backwaters and coast.
            </p>
          </div>
          <nav aria-label="Regions">
            <h2 className="mb-[18px] font-mono text-xs uppercase tracking-[0.1em] text-tea">Regions</h2>
            {["Munnar", "Alleppey", "Wayanad", "Kumarakom"].map((r) => (
              <Link key={r} href="/#regions" className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">
                {r}
              </Link>
            ))}
          </nav>
          <nav aria-label="Studio">
            <h2 className="mb-[18px] font-mono text-xs uppercase tracking-[0.1em] text-tea">Studio</h2>
            <Link href="/packages" className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">Packages</Link>
            <Link href="/#process" className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">How it works</Link>
            <Link href="/#stories" className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">Stories</Link>
            <Link href="#contact" className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">Contact</Link>
          </nav>
          <div>
            <h2 className="mb-[18px] font-mono text-xs uppercase tracking-[0.1em] text-tea">Reach us</h2>
            <a href={`mailto:${SITE.email}`} className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">{SITE.email}</a>
            <a href={SITE.phoneHref} className="mb-3 block text-[14.5px] text-inksoft transition-colors hover:text-forest">{SITE.phone}</a>
            <span className="mb-3 block text-[14.5px] text-inksoft">Kochi, Kerala</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[18px] border-b border-line py-7">
          <a href={SITE.phoneHref} className="flex items-center gap-2.5 text-[15px] font-medium text-forest">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[17px] w-[17px] text-tea" aria-hidden="true">
              <path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2.2 2A16 16 0 015 6.2 2 2 0 015 4z" />
            </svg>
            {SITE.phone}
          </a>
          <div className="flex gap-2.5">
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:border-forest hover:bg-forest hover:text-paper">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M13.5 21v-7.5H16l.5-3H13.5V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.1H7.5v3H10V21h3.5z" /></svg>
            </a>
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:border-forest hover:bg-forest hover:text-paper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" /></svg>
            </a>
          </div>
        </div>

        <div className="relative z-[3] flex flex-wrap justify-between gap-3 py-7 font-mono text-[13px] text-inksoft">
          <span>&copy; 2026 {SITE.name}. All rights reserved.</span>
          <span>Kochi &middot; Kerala &middot; India</span>
        </div>
      </div>

      <div className="relative mt-2.5 h-[150px] overflow-hidden bg-gradient-to-b from-mist via-[#EDE1C4] to-[#E4D3A9]" aria-hidden="true">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-full w-full">
          <path d="M0 55c120-18 240 18 360 6s240-30 360-10 240 24 360 8 240-20 360-4v95H0z" fill="#DEC791" opacity="0.6" />
          <path d="M0 80c120-14 240 14 360 4s240-22 360-8 240 18 360 6 240-15 360-3v71H0z" fill="#D3B87C" />
          <g transform="translate(64 92)" opacity="0.9">
            <path d="M0 34C2 18 14 4 30 2c16-2 28 8 30 22-8-6-18-9-30-7-11 2-21 9-30 17z" fill="#C9895B" />
            <path d="M6 34l6-24M16 34l4-27M26 34l0-28M36 34l-3-26" stroke="#A8703F" strokeWidth="1.2" fill="none" />
          </g>
          <g transform="translate(112 76)" opacity="0.95">
            <path d="M20 0l5 14 15 1-12 9 5 15-13-8-13 8 5-15-12-9 15-1z" fill="#F3EAD3" stroke="#D9C79C" strokeWidth="1" />
          </g>
          <g transform="translate(150 96)" opacity="0.85">
            <ellipse cx="16" cy="12" rx="16" ry="11" fill="#E8DCC0" stroke="#C9895B" strokeWidth="1" />
            <path d="M2 12c4-6 10-9 14-9M4 18c5-4 10-6 15-6" stroke="#C9895B" strokeWidth="0.8" fill="none" />
          </g>
        </svg>
      </div>
    </footer>
  );
}
