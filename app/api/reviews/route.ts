import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { randomUUID } from "crypto";

const MAX_PHOTOS = 6;

/**
 * Visitor reviews land in Sanity as UNPUBLISHED drafts (testimonial type),
 * so the owner approves them in the Studio before they go live.
 * Needs a server-only Editor token: SANITY_API_WRITE_TOKEN
 * (sanity.io/manage → project → API → Tokens). Without it, the site
 * keeps its old browser-local behaviour and this route reports 503.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const name = String(b.name ?? "").trim().slice(0, 120);
  const anonymous = b.anonymous === true;
  const location = String(b.location ?? "").trim().slice(0, 80);
  const text = String(b.text ?? "").trim().slice(0, 5000);
  const photos = Array.isArray(b.photos)
    ? b.photos.filter((p): p is string => typeof p === "string").slice(0, MAX_PHOTOS)
    : [];

  if (!anonymous && name.length < 2)
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  if (!location)
    return NextResponse.json({ ok: false, error: "Please pick your trip location." }, { status: 400 });
  if (text.length < 10)
    return NextResponse.json({ ok: false, error: "Please write a few words (min 10 characters)." }, { status: 400 });

  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!token || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return NextResponse.json(
      { ok: false, error: "Review inbox is not configured yet.", fallback: true },
      { status: 503 },
    );
  }

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2026-10-11",
    useCdn: false,
    token,
  });

  try {
    const assets: { _type: "image"; _key: string; asset: { _type: "reference"; _ref: string } }[] = [];
    for (let i = 0; i < photos.length; i++) {
      const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(photos[i]);
      if (!m) continue;
      const uploaded = await client.assets.upload("image", Buffer.from(m[2], "base64"), {
        filename: `review-${Date.now()}-${i}.jpg`,
        contentType: m[1],
      });
      assets.push({
        _type: "image",
        _key: randomUUID(),
        asset: { _type: "reference", _ref: uploaded._id },
      });
    }

    // Published but gated by `approved` — only approved reviews are read
    // by the site queries. (drafts.* IDs are silently dropped by the API,
    // so moderation uses this flag instead.)
    const created = await client.create({
      _type: "testimonial",
      name: anonymous || !name ? "Anonymous traveller" : name,
      anonymous,
      location,
      text,
      approved: false,
      dateLabel: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      ...(assets.length > 0 ? { photos: assets } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[reviews] Sanity draft failed:", e);
    return NextResponse.json(
      { ok: false, error: "Couldn't send your review. Please try again." },
      { status: 500 },
    );
  }
}
