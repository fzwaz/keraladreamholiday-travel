export type Review = {
  id: string;
  name: string;
  anonymous: boolean;
  location: string;
  text: string;
  /** Downscaled JPEG data-URLs, shown in the traveller gallery. */
  photos: string[];
  dateLabel: string;
  seed?: boolean;
};

export const REVIEW_LOCATIONS = [
  "Munnar",
  "Alleppey",
  "Thekkady",
  "Wayanad",
  "Kumarakom",
  "Kovalam",
  "Kochi",
  "Grand Kerala Circuit",
] as const;

export const SEED_REVIEWS: Review[] = [
  {
    id: "seed-priya-dev",
    name: "Priya & Dev",
    anonymous: false,
    location: "Kumarakom",
    text: "We told them we didn't want a schedule, we wanted a place to slow down in. That's exactly what we got — four days on Vembanad Lake we still talk about.",
    photos: [],
    dateLabel: "March 2026",
    seed: true,
  },
  // DUMMY — for testing only. Delete this entry before launch.
  {
    id: "seed-dummy-test",
    name: "Test Traveller",
    anonymous: false,
    location: "Alleppey",
    text: "Dummy review for testing — delete me before launch. The sunset from our houseboat deck was unreal, and our guide seemed to know every canal by name.",
    photos: [dummyPhoto("water"), dummyPhoto("hills")],
    dateLabel: "October 2026",
    seed: true,
  },
];

const STORAGE_KEY = "dreams-kerala-reviews-v1";

/** Tiny placeholder SVG photos for the dummy test review (encoded at runtime). */
function dummyPhoto(kind: "water" | "hills"): string {
  const p =
    kind === "water"
      ? { sky1: "#CFE0DE", sky2: "#EDEAE0", mid: "#7FA3A0", front: "#345048", sun: "#FBF9F4" }
      : { sky1: "#DCE6D2", sky2: "#F1EEE4", mid: "#9FB58C", front: "#4C6B4F", sun: "#F1EEE4" };
  const boat =
    kind === "water"
      ? `<path d="M250 400 L550 400 L500 440 L300 440 Z" fill="#2F4A34"/><path d="M400 400 L400 300 L470 400 Z" fill="#F1EEE4"/>`
      : "";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">` +
    `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky1}"/><stop offset="1" stop-color="${p.sky2}"/></linearGradient></defs>` +
    `<rect width="800" height="600" fill="url(#s)"/>` +
    `<circle cx="620" cy="120" r="40" fill="${p.sun}" opacity="0.9"/>` +
    `<path d="M0 380 L150 250 L300 350 L480 220 L640 340 L800 260 L800 600 L0 600 Z" fill="${p.mid}"/>` +
    `<path d="M0 470 L200 400 L400 480 L600 390 L800 460 L800 600 L0 600 Z" fill="${p.front}"/>` +
    boat +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function displayName(r: Pick<Review, "name" | "anonymous">): string {
  return r.anonymous || r.name.trim() === "" ? "Anonymous traveller" : r.name;
}

function isReview(v: unknown): v is Review {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.location === "string" &&
    typeof r.text === "string" &&
    Array.isArray(r.photos) &&
    typeof r.dateLabel === "string"
  );
}

/** User-submitted reviews persisted in this browser (until Sanity/DB lands). */
export function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isReview).map((r) => ({ ...r, anonymous: !!r.anonymous }));
  } catch {
    return [];
  }
}

/** Returns false when the browser quota is exceeded. */
export function saveReviews(reviews: Review[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    return true;
  } catch {
    return false;
  }
}

/** Downscale an uploaded photo so it fits browser storage and loads fast. */
export function downscaleImage(file: File, maxDim = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}
