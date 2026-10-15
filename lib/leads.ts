export type LeadSource = "quote" | "package" | "cab";

export type LeadPayload = {
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  date?: string;
  duration?: string;
  budget?: string;
  adults?: number;
  children?: number;
  packageSlug?: string;
  packageTitle?: string;
  page?: string;
  // Cab bookings
  vehicle?: string;
  tripType?: string;
  pickup?: string;
  dropoff?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  language?: string;
  comments?: string;
  // Honeypot — bots fill this, humans leave it empty.
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(input: unknown): { ok: true; lead: LeadPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request body." };
  const b = input as Record<string, unknown>;

  // Honeypot: silently accept but drop.
  if (typeof b.company === "string" && b.company.trim() !== "") {
    return { ok: false, error: "spam" };
  }

  const sourceRaw = typeof b.source === "string" ? b.source.toLowerCase() : "quote";
  const source: LeadSource = sourceRaw.includes("cab")
    ? "cab"
    : sourceRaw.includes("pack") || sourceRaw.includes("promo")
      ? "package"
      : "quote";

  const name = String(b.name ?? b.fullName ?? "").trim().slice(0, 120);
  const phone = String(b.phone ?? b.mobile ?? "").trim().slice(0, 30);
  const email = String(b.email ?? "").trim().slice(0, 160);
  const date = String(b.date ?? b.travelDate ?? "").trim().slice(0, 40);
  const duration = String(b.duration ?? "").trim().slice(0, 120);
  const budget = String(b.budget ?? "").trim().slice(0, 120);
  const packageSlug = String(b.packageSlug ?? "").trim().slice(0, 120);
  const packageTitle = String(b.packageTitle ?? "").trim().slice(0, 160);
  const page = String(b.page ?? "").trim().slice(0, 300);
  const vehicle = String(b.vehicle ?? "").trim().slice(0, 120);
  const tripType = String(b.tripType ?? b.bookingFor ?? "").trim().slice(0, 60);
  const pickup = String(b.pickup ?? "").trim().slice(0, 160);
  const dropoff = String(b.dropoff ?? b.dropOff ?? "").trim().slice(0, 160);
  const startDate = String(b.startDate ?? "").trim().slice(0, 40);
  const endDate = String(b.endDate ?? "").trim().slice(0, 40);
  const time = String(b.time ?? "").trim().slice(0, 20);
  const language = String(b.language ?? "").trim().slice(0, 40);
  const comments = String(b.comments ?? "").trim().slice(0, 1000);

  let adults: number | undefined;
  let children: number | undefined;
  if (typeof b.adults === "number" && Number.isFinite(b.adults)) adults = Math.max(0, Math.min(20, Math.trunc(b.adults)));
  if (typeof b.children === "number" && Number.isFinite(b.children))
    children = Math.max(0, Math.min(20, Math.trunc(b.children)));

  if (name.length < 2) return { ok: false, error: "Please add your name." };
  if (source === "quote" && phone.replace(/\D/g, "").length < 10)
    return { ok: false, error: "Please add a valid 10-digit mobile number." };
  if (source === "package" && phone.replace(/\D/g, "").length < 10)
    return { ok: false, error: "Please add a valid phone number." };
  if (source === "cab" && phone.replace(/\D/g, "").length < 10)
    return { ok: false, error: "Please add a valid phone number." };
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: "That email address doesn't look right." };

  return {
    ok: true,
    lead: { source, name, phone, email: email || undefined, date: date || undefined, duration: duration || undefined, budget: budget || undefined, adults, children, packageSlug: packageSlug || undefined, packageTitle: packageTitle || undefined, page: page || undefined, vehicle: vehicle || undefined, tripType: tripType || undefined, pickup: pickup || undefined, dropoff: dropoff || undefined, startDate: startDate || undefined, endDate: endDate || undefined, time: time || undefined, language: language || undefined, comments: comments || undefined },
  };
}

/**
 * Every enquiry goes to the owner inbox, with a copy to the checker inbox.
 * Per-source overrides (LEAD_QUOTE_TO / LEAD_PACKAGE_TO) replace the owner
 * address for that source only — the checker still gets a copy.
 * The administrator gets no enquiry mail; access is granted separately
 * (Sanity project members, GitHub collaborators, hosting team).
 */
export function ownerRecipientsFor(source: LeadSource): string[] {
  const quoteTo = process.env.LEAD_QUOTE_TO?.trim();
  const packageTo = process.env.LEAD_PACKAGE_TO?.trim();
  const owner = process.env.LEAD_TO_EMAIL?.trim() ?? "";
  const checker = process.env.LEAD_CC_EMAIL?.trim() ?? "";
  const primary = source === "package" ? packageTo || owner : quoteTo || owner;
  return [...new Set([primary, checker].filter(Boolean))];
}

export function leadDescription(lead: LeadPayload): string {
  const lines = [
    `Source: ${lead.source}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : undefined,
    lead.date ? `Travel date: ${lead.date}` : undefined,
    lead.duration ? `Duration: ${lead.duration}` : undefined,
    typeof lead.adults === "number" ? `Adults: ${lead.adults}` : undefined,
    typeof lead.children === "number" ? `Children: ${lead.children}` : undefined,
    lead.budget ? `Budget: ${lead.budget}` : undefined,
    lead.packageTitle ? `Package: ${lead.packageTitle} (${lead.packageSlug ?? ""})` : undefined,
    lead.vehicle ? `Vehicle: ${lead.vehicle}` : undefined,
    lead.tripType ? `Trip: ${lead.tripType}` : undefined,
    lead.pickup ? `Pickup: ${lead.pickup}` : undefined,
    lead.dropoff ? `Drop-off: ${lead.dropoff}` : undefined,
    lead.startDate ? `Start: ${lead.startDate}` : undefined,
    lead.endDate ? `End: ${lead.endDate}` : undefined,
    lead.time ? `Time: ${lead.time}` : undefined,
    lead.language ? `Language: ${lead.language}` : undefined,
    lead.comments ? `Comments: ${lead.comments}` : undefined,
    lead.page ? `Page: ${lead.page}` : undefined,
  ].filter(Boolean);
  return lines.join("\n");
}

/** Map our lead to a Zoho CRM Lead record. Last_Name is mandatory in Zoho. */
export function toZohoLead(lead: LeadPayload) {
  const [first, ...rest] = lead.name.split(/\s+/);
  return {
    Last_Name: rest.length > 0 ? rest.join(" ") : first,
    First_Name: rest.length > 0 ? first : undefined,
    Mobile: lead.phone,
    Email: lead.email,
    Lead_Source: lead.source === "package" ? "Website - Package" : lead.source === "cab" ? "Website - Cab" : "Website - Quote",
    Description: leadDescription(lead),
  };
}
