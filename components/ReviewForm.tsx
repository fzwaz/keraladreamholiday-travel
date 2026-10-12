"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEW_LOCATIONS, downscaleImage } from "@/lib/reviews";

export type ReviewDraft = {
  name: string;
  anonymous: boolean;
  location: string;
  text: string;
  photos: string[];
};

const MAX_PHOTOS = 6;
const MAX_FILE_MB = 12;

const inputCls =
  "w-full bg-transparent font-sans text-[14.5px] text-ink outline-none placeholder:text-inksoft/60";

export default function ReviewForm({ onSubmit }: { onSubmit: (d: ReviewDraft) => void }) {
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [thanks, setThanks] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setError("");
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const room = MAX_PHOTOS - files.length;
    if (imgs.length === 0) {
      setError("Please choose image files (JPG or PNG).");
      return;
    }
    if (room <= 0) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    const ok = imgs.filter((f) => {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`“${f.name}” is over ${MAX_FILE_MB}MB and was skipped.`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...ok].slice(0, MAX_PHOTOS));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!anonymous && name.trim() === "") {
      setError("Please add your name, or tick “Stay anonymous”.");
      return;
    }
    if (location === "") {
      setError("Please pick your trip location.");
      return;
    }
    if (text.trim().length < 10) {
      setError("Please write a few words about your trip (min 10 characters).");
      return;
    }
    setBusy(true);
    try {
      const photos: string[] = [];
      for (const f of files) {
        try {
          photos.push(await downscaleImage(f));
        } catch {
          /* skip unreadable files */
        }
      }
      onSubmit({ name: name.trim(), anonymous, location, text: text.trim(), photos });
      setName("");
      setAnonymous(false);
      setLocation("");
      setText("");
      setFiles([]);
      if (fileInput.current) fileInput.current.value = "";
      setThanks(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-line bg-mist px-6 py-8 sm:px-10"
      aria-label="Leave a review"
    >
      <h2 className="font-serif text-[clamp(24px,3vw,34px)] font-medium leading-tight text-forest">
        Leave your review
      </h2>
      <p className="mt-2 text-[15px] text-inksoft">
        Travelled with us? Tell the next traveller how it went. Your words appear below instantly.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        <div>
          <label htmlFor="rv-name" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
            Your name {!anonymous && <span className="text-spice">*</span>}
          </label>
          <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
            <input
              id="rv-name"
              type="text"
              value={name}
              disabled={anonymous}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun Menon"
              autoComplete="name"
              className={`${inputCls} disabled:opacity-40`}
            />
          </div>
          <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-sm text-inksoft">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[3px] border border-line checked:border-tea checked:bg-tea"
            />
            Stay anonymous
          </label>
        </div>
        <div>
          <label htmlFor="rv-location" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
            Trip location <span className="text-spice">*</span>
          </label>
          <div className="flex items-center gap-2.5 rounded border border-line bg-paper px-4 py-[13px]">
            <select
              id="rv-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full cursor-pointer appearance-none bg-transparent font-sans text-[14.5px] text-ink outline-none"
            >
              <option value="">Where did you travel?</option>
              {REVIEW_LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="rv-text" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
          Your review <span className="text-spice">*</span>
        </label>
        <div className="rounded border border-line bg-paper px-4 py-[13px]">
          <textarea
            id="rv-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="What slowed you down, what surprised you, what would you tell a friend?"
            className={`${inputCls} resize-y`}
          />
        </div>
      </div>

      <div className="mt-5">
        <span id="rv-photos-label" className="mb-[9px] block font-mono text-[11.5px] uppercase tracking-[0.05em] text-forest">
          Photos <span className="font-sans normal-case tracking-normal text-inksoft">(optional — shown in the gallery)</span>
        </span>
        <div
          role="group"
          aria-labelledby="rv-photos-label"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          className="rounded border border-dashed border-tea/50 bg-paper px-4 py-6 text-center"
        >
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => addFiles(e.target.files)}
            className="sr-only"
            id="rv-photos"
          />
          <label htmlFor="rv-photos" className="cursor-pointer text-sm text-inksoft">
            <span className="font-medium text-forest underline underline-offset-2">Choose photos</span> or drag &amp; drop
            here
            <span className="mt-1 block font-mono text-[11px] text-inksoft/70">Up to {MAX_PHOTOS} · JPG/PNG · max {MAX_FILE_MB}MB each</span>
          </label>
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {previews.map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-[3px] border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 1} preview`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label={`Remove photo ${i + 1}`}
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-xs text-paper"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded border border-spice/40 bg-spice/10 px-4 py-2.5 text-sm text-ink">
          {error}
        </p>
      )}
      {thanks && !error && (
        <p role="status" className="mt-4 rounded border border-tea/40 bg-tea/10 px-4 py-2.5 text-sm text-ink">
          Thank you — your review is now live below, and your photos are in the gallery.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded bg-spice p-[16px] font-mono text-sm uppercase tracking-[0.05em] text-paper transition-colors hover:bg-[#D69A4D] disabled:opacity-60"
      >
        {busy ? "Publishing…" : "Publish review"}
      </button>
    </form>
  );
}
