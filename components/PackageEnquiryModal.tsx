"use client";

import { useEffect, useState } from "react";
import type { TourPackage } from "@/lib/site";

export default function PackageEnquiryModal({
  pkg,
  onClose,
}: {
  pkg: TourPackage | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Reset the form every time a different package is opened.
  useEffect(() => {
    setName("");
    setPhone("");
    setEmail("");
    setSending(false);
    setError("");
    setDone(false);
  }, [pkg?.slug]);

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!pkg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [pkg, onClose]);

  if (!pkg) return null;
  const selectedPkg: TourPackage = pkg;

  async function handleSubmit(e: React.FormEvent) {    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "package",
          name,
          phone,
          email: email || undefined,
          packageSlug: selectedPkg.slug,
          packageTitle: selectedPkg.title,
          page: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Couldn't send your enquiry. Please try again or WhatsApp us.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again or WhatsApp us.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pkg-enquiry-heading"
        className="w-full max-w-[480px] rounded-md border border-line bg-paper p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-tea">
              {pkg.place} · {pkg.duration}
            </p>
            <h2 id="pkg-enquiry-heading" className="mt-1 font-serif text-[22px] font-medium leading-snug text-forest">
              {pkg.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry form"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-lg text-inksoft hover:border-forest hover:text-forest"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div role="status" className="mt-6 rounded border border-tea/40 bg-tea/10 px-5 py-6 text-center">
            <p className="font-serif text-xl text-forest">Thanks{name ? ` ${name.split(" ")[0]}` : ""}!</p>
            <p className="mt-2 text-[14.5px] leading-6 text-inksoft">
              We got your enquiry for this package. We&apos;ll call you on {phone} within 30 minutes (9am–9pm IST).
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-sm bg-forest px-6 py-2.5 font-mono text-[13px] tracking-wide text-paper transition-colors hover:bg-tea"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <p className="text-[14px] leading-6 text-inksoft">
              Share your details and we&apos;ll call you back within <span className="font-medium text-forest">30 minutes</span>.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="pkg-name" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
                  Your name <span className="text-spice">*</span>
                </label>
                <input
                  id="pkg-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="e.g. Arjun Menon"
                  autoComplete="name"
                  className="w-full rounded border border-line bg-mist px-4 py-[13px] font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60 focus:border-tea"
                />
              </div>
              <div>
                <label htmlFor="pkg-phone" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
                  Phone number <span className="text-spice">*</span>
                </label>
                <input
                  id="pkg-phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  autoComplete="tel"
                  className="w-full rounded border border-line bg-mist px-4 py-[13px] font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60 focus:border-tea"
                />
              </div>
              <div>
                <label htmlFor="pkg-email" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
                  Email <span className="font-sans normal-case tracking-normal text-inksoft">(optional)</span>
                </label>
                <input
                  id="pkg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="e.g. arjun@example.com"
                  autoComplete="email"
                  className="w-full rounded border border-line bg-mist px-4 py-[13px] font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60 focus:border-tea"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded border border-spice/40 bg-spice/10 px-4 py-2.5 text-sm text-ink">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-5 w-full rounded-sm bg-spice p-[15px] font-mono text-sm uppercase tracking-[0.05em] text-paper transition-colors hover:bg-[#D69A4D] disabled:opacity-60"
            >
              {sending ? "Sending…" : "Request callback"}
            </button>
            <p className="mt-3 text-center text-[12.5px] text-inksoft">
              No spam, no advance needed — just a callback within 30 minutes.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
