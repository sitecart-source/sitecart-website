import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { Resend } from "resend";

const router: IRouter = Router();

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  business: z.string().trim().min(1).max(200),
  trade: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(254),
  interestedModel: z.enum(["Core", "Pro", "Custom"]),
  useCase: z.string().trim().max(2000).optional(),
});

type Lead = z.infer<typeof LeadSchema>;

const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000;
const recentEmails = new Map<string, number>();

function isDuplicate(email: string): boolean {
  const now = Date.now();
  for (const [key, ts] of recentEmails) {
    if (now - ts > RECENT_WINDOW_MS) recentEmails.delete(key);
  }
  const last = recentEmails.get(email);
  if (last && now - last < RECENT_WINDOW_MS) return true;
  recentEmails.set(email, now);
  return false;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildSubject(lead: Lead): string {
  return `[${lead.interestedModel}] Early access — ${lead.business}`;
}

function buildText(lead: Lead): string {
  const lines = [
    `New SITECART early-access lead`,
    ``,
    `Interested model: ${lead.interestedModel}`,
    `Name:             ${lead.name}`,
    `Business:         ${lead.business}`,
    `Trade:            ${lead.trade}`,
    `Site location:    ${lead.location}`,
    `Phone:            ${lead.phone}`,
    `Email:            ${lead.email}`,
  ];
  if (lead.useCase) {
    lines.push(``, `How they would use SITECART:`, lead.useCase);
  }
  lines.push(``, `Reply to this email to write back to ${lead.name} directly.`);
  return lines.join("\n");
}

function buildHtml(lead: Lead): string {
  const accent = "#a3e635";
  const useCaseBlock = lead.useCase
    ? `<tr><td style="padding:14px 18px;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;">How they would use SITECART</p><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.9);line-height:1.6;white-space:pre-wrap;">${escapeHtml(lead.useCase)}</p></td></tr>`
    : "";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 16px;"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.12);">
      <tr><td style="background:${accent};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:32px 32px 8px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:${accent};text-transform:uppercase;font-weight:700;">SITECART Early Access Lead</p>
        <p style="margin:0 0 24px;font-size:24px;font-weight:700;color:#fff;line-height:1.2;text-transform:uppercase;">New registration<br/>from the site</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.1);margin-bottom:16px;">
          <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;">From</p>
            <p style="margin:0;font-size:15px;color:#fff;font-weight:600;">${escapeHtml(lead.name)} — ${escapeHtml(lead.business)}</p>
            <p style="margin:2px 0 0;font-size:14px;"><a href="mailto:${escapeHtml(lead.email)}" style="color:${accent};text-decoration:none;">${escapeHtml(lead.email)}</a> · ${escapeHtml(lead.phone)}</p>
          </td></tr>
          <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Interested model</p>
            <p style="margin:0;font-size:15px;color:#fff;">${escapeHtml(lead.interestedModel)}</p>
          </td></tr>
          <tr><td style="padding:14px 18px;${lead.useCase ? "border-bottom:1px solid rgba(255,255,255,0.06);" : ""}">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Trade · Location</p>
            <p style="margin:0;font-size:15px;color:#fff;">${escapeHtml(lead.trade)} · ${escapeHtml(lead.location)}</p>
          </td></tr>
          ${useCaseBlock}
        </table>
        <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">Hit <strong style="color:#fff;">Reply</strong> to write back to ${escapeHtml(lead.name)} directly.</p>
      </td></tr>
      <tr><td style="padding:16px 32px 24px;border-top:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);">Sent automatically from sitecart.com.au</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

router.post("/sitecart-leads", async (req: Request, res: Response) => {
  const raw = (req.body ?? {}) as Record<string, unknown>;

  const honeypot = typeof raw.company === "string" ? raw.company.trim() : "";
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }
  const { company: _ignored, ...candidate } = raw;

  const parsed = LeadSchema.safeParse(candidate);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return res.status(400).json({ error: first?.message ?? "Invalid submission" });
  }

  const lead: Lead = { ...parsed.data, email: parsed.data.email.toLowerCase() };

  if (isDuplicate(lead.email)) {
    return res.status(200).json({ ok: true, duplicate: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SITECART_LEAD_TO_EMAIL;
  const from = process.env.SITECART_LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    req.log.error("[sitecart-leads] Missing env: RESEND_API_KEY / SITECART_LEAD_TO_EMAIL / SITECART_LEAD_FROM_EMAIL");
    return res.status(503).json({ error: "Email service is not configured" });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: buildSubject(lead),
      text: buildText(lead),
      html: buildHtml(lead),
    });
    if (error) {
      req.log.error({ error }, "[sitecart-leads] Resend error");
      return res.status(502).json({ error: "Failed to send registration" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "[sitecart-leads] Unexpected error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
