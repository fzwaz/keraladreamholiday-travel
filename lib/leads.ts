export type LeadSource = "quote" | "package";

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
  const source: LeadSource = sourceRaw.includes("pack") || sourceRaw.includes("promo") ? "package" : "quote";

  const name = String(b.name ?? b.fullName ?? "").trim().slice(0, 120);
  const phone = String(b.phone ?? b.mobile ?? "").trim().slice(0, 30);
  const email = String(b.email ?? "").trim().slice(0, 160);
  const date = String(b.date ?? b.travelDate ?? "").trim().slice(0, 40);
  const duration = String(b.duration ?? "").trim().slice(0, 120);
  const budget = String(b.budget ?? "").trim().slice(0, 120);
  const packageSlug = String(b.packageSlug ?? "").trim().slice(0, 120);
  const packageTitle = String(b.packageTitle ?? "").trim().slice(0, 160);
  const page = String(b.page ?? "").trim().slice(0, 300);

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
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: "That email address doesn't look right." };

  return {
    ok: true,
    lead: { source, name, phone, email: email || undefined, date: date || undefined, duration: duration || undefined, budget: budget || undefined, adults, children, packageSlug: packageSlug || undefined, packageTitle: packageTitle || undefined, page: page || undefined },
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
    Lead_Source: lead.source === "package" ? "Website - Package" : "Website - Quote",
    Description: leadDescription(lead),
  };
}
