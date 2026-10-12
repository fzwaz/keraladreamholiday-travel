"use client";

import { useState } from "react";

const STEP_LABELS = [
  "Step 1: Enter your name",
  "Step 2: Add your mobile number",
  "Step 3: Add your email",
  "Step 4: Pick a travel date",
  "Step 5: Choose your duration",
  "Step 6: Set your budget preference",
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">{children}</label>
);

export default function QuoteForm() {
  const [values, setValues] = useState({ name: "", mobile: "", email: "", date: "", duration: "4 Nights / 5 Days", budget: "" });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const filled = [values.name, values.mobile, values.email, values.date, values.duration, values.budget].filter(
    (v) => v.trim() !== "",
  ).length;
  const pct = done ? 100 : Math.max(8, Math.round((filled / 6) * 100));

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <section id="get-quote" aria-labelledby="quote-heading" className="scroll-mt-20 bg-paper py-[84px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="reveal is-visible mx-auto max-w-[900px] rounded-md border border-line bg-mist px-12 pb-12 pt-14 max-md:px-6 max-md:pt-10">
          <span className="mx-auto mb-[22px] block w-fit rounded-full border border-sage bg-paper px-5 py-[9px] font-mono text-[11.5px] uppercase tracking-[0.1em] text-tea">
            Free customised quote
          </span>
          <h2 id="quote-heading" className="text-center font-serif text-[clamp(28px,4vw,42px)] font-medium leading-[1.1] text-forest">
            Get your customised quote
          </h2>
          <p className="mt-[14px] text-center text-[15.5px] text-inksoft">
            Just fill in your details and we&rsquo;ll call you within 30 minutes.
          </p>

          <div className="mt-9 rounded border border-line bg-paper px-6 py-5" aria-live="polite">
            <div className="flex items-center justify-between text-[13.5px] font-medium text-forest">
              <span>Form fill progress</span>
              <span className="rounded-full bg-tea/10 px-3 py-[5px] font-mono text-xs text-tea">{pct}% completed</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded bg-gradient-to-r from-forest to-spice transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2.5 text-right text-xs text-inksoft">
              {done ? "Thank you — we'll call you within 30 minutes" : STEP_LABELS[Math.min(filled, STEP_LABELS.length - 1)]}
            </p>
          </div>

          <form
            className="mt-8"
            onSubmit={async (e) => {
              e.preventDefault();
              if (sending) return;
              setError("");
              setSending(true);
              try {
                const res = await fetch("/api/lead", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    source: "quote",
                    name: values.name,
                    phone: values.mobile,
                    email: values.email || undefined,
                    date: values.date,
                    duration: values.duration,
                    budget: values.budget || undefined,
                    adults,
                    children,
                    page: typeof window !== "undefined" ? window.location.href : undefined,
                  }),
                });
                const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
                if (!res.ok || !data?.ok) {
                  setError(data?.error || "Couldn't send your request. Please try again or WhatsApp us.");
                  return;
                }
                setDone(true);
              } catch {
                setError("Network error. Please try again or WhatsApp us.");
              } finally {
                setSending(false);
              }
            }}
          >
            <div className="mb-[22px] grid grid-cols-3 gap-5 max-md:grid-cols-1">
              <div>
                <Label>Your full name <span className="text-spice">*</span></Label>
                <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <input required value={values.name} onChange={set("name")} type="text" placeholder="e.g. Arjun Menon" autoComplete="name"
                    className="w-full bg-transparent font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60" />
                </div>
              </div>
              <div>
                <Label>Mobile number <span className="text-spice">*</span></Label>
                <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <input required value={values.mobile} onChange={set("mobile")} type="tel" placeholder="10-digit mobile no." autoComplete="tel" pattern="[0-9+ ]{10,15}"
                    className="w-full bg-transparent font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60" />
                </div>
              </div>
              <div>
                <Label>Email address <span className="font-sans normal-case tracking-normal text-inksoft">(optional)</span></Label>
                <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <input value={values.email} onChange={set("email")} type="email" placeholder="e.g. arjun@example.com" autoComplete="email"
                    className="w-full bg-transparent font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60" />
                </div>
              </div>
            </div>

            <div className="mb-[22px] grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <div>
                <Label>Travel date <span className="text-spice">*</span></Label>
                <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <input required value={values.date} onChange={set("date")} type="date"
                    className="w-full bg-transparent font-sans text-[14.5px] text-ink outline-none" />
                </div>
              </div>
              <div>
                <Label>Interested duration</Label>
                <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <select value={values.duration} onChange={set("duration")} className="w-full cursor-pointer appearance-none bg-transparent font-sans text-[14.5px] text-ink outline-none">
                    <option>3 Nights / 4 Days — Backwaters only</option>
                    <option>4 Nights / 5 Days — Hills &amp; backwaters</option>
                    <option>6 Nights / 7 Days — Complete Kerala circuit</option>
                    <option>8+ Nights — Kerala at a slower pace</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-[22px] grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <div>
                <div className="mb-[9px] flex items-center justify-between">
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">No. of adults (12+ yrs)</span>
                  <span className="rounded-full bg-spice/10 px-2.5 py-1 font-mono text-[11px] text-spice">Min 2 adults</span>
                </div>
                <div className="flex items-center justify-between gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <span className="flex-1 text-[14.5px] text-inksoft">Adults</span>
                  <button type="button" aria-label="Fewer adults" onClick={() => setAdults((a) => Math.max(1, Math.min(10, a - 1)))}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded bg-line text-[15px] text-forest hover:bg-sage">−</button>
                  <span className="min-w-5 text-center font-serif text-base font-semibold text-forest" aria-live="polite">{adults}</span>
                  <button type="button" aria-label="More adults" onClick={() => setAdults((a) => Math.max(1, Math.min(10, a + 1)))}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded bg-line text-[15px] text-forest hover:bg-sage">+</button>
                </div>
              </div>
              <div>
                <Label>No. of children (below 12 yrs)</Label>
                <div className="flex items-center justify-between gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                  <span className="flex-1 text-[14.5px] text-inksoft">Children</span>
                  <button type="button" aria-label="Fewer children" onClick={() => setChildren((c) => Math.max(0, Math.min(8, c - 1)))}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded bg-line text-[15px] text-forest hover:bg-sage">−</button>
                  <span className="min-w-5 text-center font-serif text-base font-semibold text-forest" aria-live="polite">{children}</span>
                  <button type="button" aria-label="More children" onClick={() => setChildren((c) => Math.max(0, Math.min(8, c + 1)))}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded bg-line text-[15px] text-forest hover:bg-sage">+</button>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <Label>Your budget preference <span className="font-sans normal-case tracking-normal text-inksoft">(optional)</span></Label>
              <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
                <select value={values.budget} onChange={set("budget")} className="w-full cursor-pointer appearance-none bg-transparent font-sans text-[14.5px] text-ink outline-none">
                  <option value="">Select budget preference (optional)</option>
                  <option>Under ₹15,000 per person</option>
                  <option>₹15,000 – ₹25,000 per person</option>
                  <option>₹25,000 – ₹40,000 per person</option>
                  <option>₹40,000+ per person</option>
                </select>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded border border-spice/40 bg-spice/10 px-4 py-2.5 text-sm text-ink">
                {error}
              </p>
            )}

            <button type="submit" disabled={sending}
              className="mt-2.5 flex w-full items-center justify-center gap-2.5 rounded bg-spice p-[18px] font-mono text-sm uppercase tracking-[0.05em] text-paper transition-colors hover:bg-[#D69A4D] disabled:opacity-60">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
              {sending ? "Sending…" : "Get instant quote"}
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-[13px] text-inksoft">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px] text-tea" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /></svg>
            100% secure · your information is safe with us · zero spam guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
