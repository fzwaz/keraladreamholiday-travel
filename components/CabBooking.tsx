"use client";

import Image from "next/image";
import { useState } from "react";
import { CAB_LANGUAGES, CAB_TRIP_TYPES, CAB_VEHICLES, type CabVehicle } from "@/lib/cabs";

function CabImage({ vehicle }: { vehicle: CabVehicle }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div
        role="img"
        aria-label={vehicle.alt}
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-[3px] bg-mist"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-14 w-14 text-tea" aria-hidden="true">
          <path d="M3 16v-5l2-5h11l4 5h1v5h-2M3 16h2m12 0h2M3 16v2m18-2v2M7 18a1.6 1.6 0 100 .01M17 18a1.6 1.6 0 100 .01M5 11h14" />
        </svg>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-inksoft">Photo coming soon</span>
      </div>
    );
  }
  return (
    <Image
      src={vehicle.image}
      alt={vehicle.alt}
      width={800}
      height={600}
      sizes="(max-width: 1024px) 100vw, 38vw"
      onError={() => setMissing(true)}
      className="aspect-[4/3] w-full rounded-[3px] border border-line object-cover"
    />
  );
}

const INPUT_CLASS =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-inksoft/60 focus:border-tea";
const LABEL_CLASS =
  "mb-[7px] block font-mono text-[11px] uppercase tracking-[0.08em] text-inksoft";

export default function CabBooking() {
  const [index, setIndex] = useState(0);
  const vehicle = CAB_VEHICLES[index];
  const [form, setForm] = useState({
    tripType: CAB_TRIP_TYPES[0],
    pickup: "",
    dropoff: "",
    name: "",
    phone: "",
    language: CAB_LANGUAGES[0],
    startDate: "",
    endDate: "",
    time: "",
    comments: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "cab",
          vehicle: vehicle.name,
          tripType: form.tripType,
          pickup: form.pickup,
          dropoff: form.dropoff,
          name: form.name,
          phone: form.phone,
          language: form.language,
          startDate: form.startDate,
          endDate: form.endDate,
          time: form.time,
          comments: form.comments,
          page: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        setState("done");
      } else {
        setState("error");
        setError(data?.error ?? "Couldn't send your booking. Please try again or WhatsApp us.");
      }
    } catch {
      setState("error");
      setError("Couldn't send your booking. Please try again or WhatsApp us.");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded border border-line bg-paper px-8 py-16 text-center">
        <p className="font-serif text-[28px] text-forest">Booking received, {form.name.split(" ")[0] || "traveller"}.</p>
        <p className="mx-auto mt-3 max-w-[460px] text-[15px] leading-7 text-inksoft">
          We&apos;ll call you on {form.phone} within 30 minutes (9am–9pm IST) to confirm your {vehicle.name}.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Vehicle picker */}
      <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Choose a vehicle">
        {CAB_VEHICLES.map((v, i) => (
          <button
            key={v.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={`rounded-full border px-5 py-2.5 text-[13.5px] transition-colors ${
              i === index
                ? "border-forest bg-forest text-paper"
                : "border-line bg-paper text-inksoft hover:border-tea hover:text-forest"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-[1fr_1.4fr] items-start gap-8 max-lg:grid-cols-1">
        {/* Vehicle card */}
        <figure key={vehicle.slug} className="rounded border border-line bg-paper p-6">
          <CabImage vehicle={vehicle} />
          <figcaption className="pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-tea">{vehicle.seats}</p>
            <h2 className="mt-1 font-serif text-[26px] font-medium text-forest">{vehicle.name}</h2>
            <p className="mt-2 text-[14.5px] leading-6 text-inksoft">{vehicle.tagline}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {vehicle.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[13px] text-inksoft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-tea" aria-hidden="true">
                    <path d="M4 12l5 5L20 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>

        {/* Booking form */}
        <form onSubmit={onSubmit} className="rounded border border-line bg-paper p-6 sm:p-8" aria-label="Cab booking form">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-tea">Book now</p>
          <h2 className="mt-1 font-serif text-[26px] font-medium text-forest">Plan Your Trip</h2>
          <p className="mt-1.5 text-[14px] text-inksoft">Fill in the details below to book your {vehicle.name}.</p>

          <div className="mt-6 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="col-span-full max-sm:col-span-1">
              <label htmlFor="cab-vehicle" className={LABEL_CLASS}>Vehicle (from your selection above)</label>
              <select
                id="cab-vehicle"
                value={vehicle.slug}
                onChange={(e) => {
                  const i = CAB_VEHICLES.findIndex((v) => v.slug === e.target.value);
                  if (i >= 0) setIndex(i);
                }}
                className={`${INPUT_CLASS} font-medium`}
              >
                {CAB_VEHICLES.map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.name} — {v.seats}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cab-trip" className={LABEL_CLASS}>Booking for</label>
              <select id="cab-trip" value={form.tripType} onChange={set("tripType")} className={INPUT_CLASS}>
                {CAB_TRIP_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cab-pickup" className={LABEL_CLASS}>Pick up</label>
              <input id="cab-pickup" required value={form.pickup} onChange={set("pickup")} type="text" placeholder="e.g. Kochi Airport" autoComplete="off" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="cab-dropoff" className={LABEL_CLASS}>Drop off</label>
              <input id="cab-dropoff" required value={form.dropoff} onChange={set("dropoff")} type="text" placeholder="e.g. Munnar" autoComplete="off" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="cab-name" className={LABEL_CLASS}>Name</label>
              <input id="cab-name" required value={form.name} onChange={set("name")} type="text" placeholder="Your name" autoComplete="name" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="cab-phone" className={LABEL_CLASS}>Phone number</label>
              <input id="cab-phone" required value={form.phone} onChange={set("phone")} type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="cab-lang" className={LABEL_CLASS}>Language</label>
              <select id="cab-lang" value={form.language} onChange={set("language")} className={INPUT_CLASS}>
                {CAB_LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cab-start" className={LABEL_CLASS}>Start date</label>
              <input id="cab-start" required value={form.startDate} onChange={set("startDate")} type="date" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="cab-end" className={LABEL_CLASS}>End date</label>
              <input id="cab-end" required value={form.endDate} onChange={set("endDate")} type="date" className={INPUT_CLASS} />
            </div>
            <div className="col-span-full max-sm:col-span-1">
              <label htmlFor="cab-time" className={LABEL_CLASS}>Time</label>
              <input id="cab-time" value={form.time} onChange={set("time")} type="time" className={INPUT_CLASS} />
            </div>
            <div className="col-span-full max-sm:col-span-1">
              <label htmlFor="cab-comments" className={LABEL_CLASS}>Comments</label>
              <textarea id="cab-comments" value={form.comments} onChange={set("comments")} rows={4} placeholder="Flight number, luggage, stops…" className={`${INPUT_CLASS} resize-y`} />
            </div>
          </div>

          {state === "error" && (
            <p role="alert" className="mt-4 rounded border border-line bg-paper px-4 py-2.5 text-sm text-inksoft">{error}</p>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-forest py-2.5 pl-8 pr-2.5 font-mono text-[14px] tracking-wide text-paper transition-colors hover:bg-tea disabled:opacity-60"
          >
            {state === "sending" ? "Booking…" : "Book Now"}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-forest" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M3.5 11.5L20.5 3.5l-8 17-2.5-6.5-6.5-2.5z" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
