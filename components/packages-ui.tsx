"use client";

import { useState, type ReactNode } from "react";

export function IntroToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`relative max-w-[900px] text-[15.5px] leading-7 text-inksoft ${open ? "" : "max-h-[52px] overflow-hidden"}`}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-2.5 inline-flex items-center gap-1 border-none bg-transparent font-mono text-[12.5px] tracking-[0.04em] text-spice"
      >
        {open ? "Show less" : "Show more"}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-[13px] w-[13px] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </>
  );
}

export function PromoForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (state === "done") {
    return <p role="status" className="text-[14px] text-paper">Thanks {name.split(" ")[0]} — we&apos;ll call you shortly.</p>;
  }

  return (
    <form
      className="flex flex-wrap gap-2.5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (state === "sending") return;
        setState("sending");
        try {
          const res = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "package",
              name,
              phone,
              page: typeof window !== "undefined" ? window.location.href : undefined,
            }),
          });
          const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
          setState(res.ok && data?.ok ? "done" : "error");
        } catch {
          setState("error");
        }
      }}
    >
      <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter your name" aria-label="Your name"
        className="min-w-[180px] rounded-sm border border-paper/30 bg-paper/10 px-4 py-3 text-[13.5px] text-paper outline-none placeholder:text-paper/55" />
      <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+91 XXXXX XXXXX" aria-label="Phone number"
        className="min-w-[180px] rounded-sm border border-paper/30 bg-paper/10 px-4 py-3 text-[13.5px] text-paper outline-none placeholder:text-paper/55" />
      <button type="submit" disabled={state === "sending"} className="rounded-sm bg-spice px-6 py-3 font-mono text-[13px] tracking-wide text-paper transition-colors hover:bg-[#D69A4D] disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Enquire now"}
      </button>
      {state === "error" && <span role="alert" className="w-full text-[13px] text-paper/90">Couldn&apos;t send. Please try again.</span>}
    </form>
  );
}
export function ChipRow({
  groups,
  value,
  onChange,
}: {
  groups: { value: string; chip: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 pb-2 pt-7">
      {groups.map((g) => (
        <button
          key={g.value}
          type="button"
          onClick={() => onChange(g.value)}
          aria-pressed={value === g.value}
          className={`inline-flex items-center gap-2 rounded-full border px-[18px] py-2.5 text-[13.5px] transition-colors ${
            value === g.value
              ? "border-forest bg-forest text-paper"
              : "border-line bg-paper text-inksoft hover:border-tea hover:text-forest"
          }`}
        >
          {value === g.value && <span className="h-[7px] w-[7px] rounded-full bg-spice" aria-hidden="true" />}
          {g.chip}
        </button>
      ))}
    </div>
  );
}
