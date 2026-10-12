import Link from "next/link";
import { groupLabel, type TourPackage } from "@/lib/site";

export function PackageThumb({ pkg, className = "" }: { pkg: TourPackage; className?: string }) {
  const [bg, mid, front] = pkg.palette;
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="400" height="250" fill={bg} />
      {pkg.motif === "water" || pkg.motif === "coast" ? (
        <>
          <path d={`M0 190c60-20 100 20 160 0s100 20 160 0 80-15 80-15v75H0z`} fill={mid} />
          <path d={`M0 210c60-15 100 15 160 0s100 15 160 0 80-10 80-10v50H0z`} fill={front} />
        </>
      ) : (
        <>
          <path d="M0 170 L60 120 L120 160 L190 90 L260 150 L330 110 L400 160 L400 250 L0 250 Z" fill={mid} />
          <path d="M0 210 L90 170 L180 205 L280 165 L400 200 L400 250 L0 250 Z" fill={front} />
        </>
      )}
      {pkg.motif === "sun" && <circle cx="330" cy="70" r="16" fill="#F1EEE4" />}
    </svg>
  );
}

export default function PackageCard({ pkg }: { pkg: TourPackage }) {
  return (
    <article className="flex flex-col border border-line bg-paper transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_14px_34px_rgba(31,51,36,0.1)]">
      <div className="relative aspect-[16/10.5] overflow-hidden">
        <PackageThumb pkg={pkg} className="h-full w-full" />
        <span className="absolute left-3 top-3 flex items-center gap-[5px] rounded-[3px] bg-ink/70 px-2.5 py-[5px] font-mono text-[11px] tracking-wide text-paper">
          📅 {pkg.duration}
        </span>
        <button type="button" aria-label={`Save ${pkg.title} to wishlist`} className="absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-paper/90">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px] text-forest" aria-hidden="true">
            <path d="M12 21s-7-4.4-9.5-8.8C.7 8.5 2.3 5 6 5c2.1 0 3.5 1.2 4 2.3.5-1.1 1.9-2.3 4-2.3 3.7 0 5.3 3.5 3.5 7.2C19 16.6 12 21 12 21z" />
          </svg>
        </button>
        <span className="absolute bottom-3 left-3 rounded-[3px] bg-spice px-[9px] py-1 font-mono text-[10.5px] tracking-wide text-paper">
          {pkg.off}
        </span>
        {pkg.group && pkg.group !== "kerala" && (
          <span className="absolute bottom-3 right-3 rounded-[3px] bg-paper/90 px-[9px] py-1 font-mono text-[10.5px] tracking-wide text-forest">
            {groupLabel(pkg.group)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5 pb-5">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-tea">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden="true">
            <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
          {pkg.place}
        </p>
        <h3 className="font-serif text-[17px] font-medium leading-[1.3] text-forest">{pkg.title}</h3>
        <p className="flex items-baseline gap-2">
          <span className="text-[12.5px] text-inksoft line-through">{pkg.was}</span>
          <span className="font-serif text-xl font-semibold text-forest">{pkg.now}</span>
          <span className="text-[11.5px] text-inksoft">/ adult</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {pkg.tags.map((t) => (
            <span key={t} className="rounded-[3px] border border-line px-2 py-1 text-[10.5px] text-inksoft">{t}</span>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-1.5">
          <Link href="/#get-quote" className="rounded-sm bg-forest p-[11px] text-center font-mono text-[13px] tracking-wide text-paper transition-colors hover:bg-tea">
            Get Free Quotes
          </Link>
          <Link href="/#get-quote" className="rounded-sm border border-line p-2.5 text-center text-[13px] text-inksoft transition-colors hover:border-forest hover:text-forest">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
