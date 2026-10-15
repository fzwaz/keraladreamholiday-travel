import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { leadDescription, ownerRecipientsFor, toZohoLead, validateLead } from "@/lib/leads";

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function zohoConfigured() {
  return Boolean(
    process.env.ZOHO_CRM_REFRESH_TOKEN &&
      process.env.ZOHO_CRM_CLIENT_ID &&
      process.env.ZOHO_CRM_CLIENT_SECRET,
  );
}

// Cached access token (module-level). Access tokens live ~1h;
// the refresh token below mints a new one automatically.
let cachedZohoToken: { token: string; expiresAt: number } | null = null;

async function zohoAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedZohoToken && cachedZohoToken.expiresAt - 60_000 > now) return cachedZohoToken.token;
  const dc = (process.env.ZOHO_CRM_DC ?? "in").trim() || "in";
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.ZOHO_CRM_CLIENT_ID!,
    client_secret: process.env.ZOHO_CRM_CLIENT_SECRET!,
    refresh_token: process.env.ZOHO_CRM_REFRESH_TOKEN!,
  });
  const res = await fetch(`https://accounts.zoho.${dc}/oauth/v2/token?${params.toString()}`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Zoho token refresh failed: ${res.status}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!data.access_token) throw new Error(`Zoho token refresh: ${data.error ?? "no access_token"}`);
  cachedZohoToken = { token: data.access_token, expiresAt: now + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function pushToZoho(lead: ReturnType<typeof toZohoLead>, retry = true) {
  const dc = (process.env.ZOHO_CRM_DC ?? "in").trim() || "in";
  const token = await zohoAccessToken();
  const res = await fetch(`https://www.zohoapis.${dc}/crm/v7/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [lead] }),
    // Zoho tokens are short-lived; don't cache.
    cache: "no-store",
  });
  if (res.status === 401 && retry) {
    // Token went stale mid-flight — drop the cache and try once more.
    cachedZohoToken = null;
    return pushToZoho(lead, false);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Zoho CRM ${res.status}: ${text.slice(0, 300)}`);
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = validateLead(body);
  if (!parsed.ok) {
    // Honeypot hit — pretend success so bots learn nothing.
    if (parsed.error === "spam") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const lead = parsed.lead;

  const ownerTo = ownerRecipientsFor(lead.source);
  const canEmail = smtpConfigured() && ownerTo.length > 0;
  const canZoho = zohoConfigured();

  if (!canEmail && !canZoho) {
    console.error("[lead] No destination configured. Set LEAD_TO_EMAIL + SMTP_* or ZOHO_CRM_REFRESH_TOKEN set.");
    return NextResponse.json(
      { ok: false, error: "Enquiry service is not configured yet. Please WhatsApp us instead." },
      { status: 500 },
    );
  }

  const errors: string[] = [];

  // 1) Owner notification email — this is how you "choose which email leads go to".
  if (canEmail) {
    try {
      const transporter = getTransporter();
      const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!;
      const label = lead.source === "package" ? "Package enquiry" : lead.source === "cab" ? "Cab booking" : "Quote request";
      const subject = `[${label}] ${lead.name} — ${lead.phone}`;
      const text = `${label} from ${process.env.NEXT_PUBLIC_SITE_URL ?? "the website"}\n\n${leadDescription(lead)}\n\nReply to traveller: ${lead.phone}${lead.email ? ` / ${lead.email}` : ""}`;
      await transporter.sendMail({
        from,
        to: ownerTo,
        replyTo: lead.email || undefined,
        subject,
        text,
        html: `<h2>${escapeHtml(label)}</h2><pre style="font-family:monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
      });
    } catch (e) {
      console.error("[lead] SMTP owner mail failed:", e);
      errors.push("email");
    }
  }

  // 2) Traveller auto-reply (only if they gave an email).
  if (canEmail && lead.email) {
    try {
      const transporter = getTransporter();
      const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!;
      await transporter.sendMail({
        from,
        to: lead.email,
        subject: "We got your Kerala enquiry — we'll call within 30 minutes",
        text: `Hi ${lead.name},\n\nThanks for enquiring with Dreams Kerala Holiday. We received your ${lead.source === "package" ? "package enquiry" : lead.source === "cab" ? "cab booking" : "quote request"}${lead.duration ? ` (${lead.duration})` : ""}.\n\nWe'll call you on ${lead.phone} within 30 minutes (9am–9pm IST).\n\nWhatsApp us anytime if it's urgent.\n\n— Dreams Kerala Holiday, Kochi`,
      });
    } catch (e) {
      // Auto-reply failure shouldn't fail the lead.
      console.error("[lead] SMTP auto-reply failed:", e);
    }
  }

  // 3) Push into Zoho CRM if a token is configured (fail-soft).
  if (canZoho) {
    try {
      await pushToZoho(toZohoLead(lead));
    } catch (e) {
      console.error("[lead] Zoho push failed:", e);
      errors.push("zoho");
    }
  }

  // If owner email failed AND zoho failed, tell the user to try another channel.
  if (errors.includes("email") && (!canZoho || errors.includes("zoho"))) {
    return NextResponse.json(
      { ok: false, error: "Couldn't send your enquiry. Please WhatsApp us and we'll help right away." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, zoho: canZoho && !errors.includes("zoho") });
}
