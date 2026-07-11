export type LeadSource = "Main Website Contact Form" | "QR Contact Form";

export type ContactSubmission = {
  source: LeadSource;
  name: string;
  restaurant: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  interest?: string;
  message?: string;
  language: string;
  pageUrl: string;
  submittedAt: string;
};

export const EMAIL_RECIPIENT = "sales@cangujet.com";

export function text(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatValue(value?: string) {
  return value ? value : "Not provided";
}

function detailRows(submission: ContactSubmission) {
  const rows = [
    ["Lead source", submission.source],
    ["Name", submission.name],
    ["Restaurant / company", submission.restaurant],
    ["Email", submission.email],
    ["Telephone", submission.phone],
    ["Country", submission.country],
    ["City", submission.city],
    ["Requested product/service", submission.interest],
    ["Message", submission.message],
    ["Selected website language", submission.language],
    ["Page URL", submission.pageUrl],
    ["Submission date and time", submission.submittedAt],
  ];

  return rows.map(([label, value]) => ({ label: label ?? "", value: formatValue(value) }));
}

export function buildContactEmail(submission: ContactSubmission) {
  const isQr = submission.source === "QR Contact Form";
  const subject = isQr ? "[Cangujet QR Lead] New QR contact request" : "[Cangujet Website Lead] New contact request";
  const label = isQr ? "QR Lead" : "Website Lead";
  const accent = isQr ? "#172537" : "#4b744d";
  const rows = detailRows(submission);
  const htmlRows = rows
    .map(
      ({ label: rowLabel, value }) =>
        `<tr><td style="width:220px;padding:12px;border-bottom:1px solid #dce9dc;color:#667268;vertical-align:top">${escapeHtml(rowLabel)}</td><td style="padding:12px;border-bottom:1px solid #dce9dc;color:#172537">${linkify(rowLabel, value)}</td></tr>`,
    )
    .join("");
  const textRows = rows.map(({ label: rowLabel, value }) => `${rowLabel}: ${value}`).join("\n");

  return {
    subject,
    text: `${subject}\n\n${textRows}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#172537">
      <p style="display:inline-block;margin:0 0 16px;padding:7px 10px;border-radius:999px;background:${isQr ? "#eef3f8" : "#edf4ed"};color:${accent};font-size:12px;font-weight:700">${label}</p>
      <h1 style="margin:0 0 18px;font-size:24px;line-height:1.2">Cangujet contact request</h1>
      <table style="width:100%;border-collapse:collapse;border:1px solid #dce9dc;border-radius:12px;overflow:hidden">${htmlRows}</table>
    </div>`,
  };
}

function linkify(label: string, value: string) {
  const safeValue = escapeHtml(value);
  if (value === "Not provided") return safeValue;
  if (label === "Email") return `<a href="mailto:${safeValue}" style="color:#4b744d">${safeValue}</a>`;
  if (label === "Telephone") return `<a href="tel:${safeValue.replace(/\s/g, "")}" style="color:#4b744d">${safeValue}</a>`;
  if (label === "Page URL") return `<a href="${safeValue}" style="color:#4b744d">${safeValue}</a>`;
  return safeValue;
}

export async function sendContactEmail(submission: ContactSubmission) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || EMAIL_RECIPIENT;
  const from = process.env.CONTACT_FROM_EMAIL || "Cangujet Website <website@cangujet.com>";

  if (!apiKey) {
    console.error("Contact email configuration is missing.", { provider: "resend", missingEnvironmentVariables: ["RESEND_API_KEY"] });
    return { ok: false, status: 503, error: "Email delivery is not configured." };
  }

  const email = buildContactEmail(submission);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: submission.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!response.ok) {
    console.error("Resend contact delivery failed.", {
      status: response.status,
      statusText: response.statusText,
      providerError: await response.text(),
      source: submission.source,
    });
    return { ok: false, status: 502, error: "The email could not be sent." };
  }

  return { ok: true, status: 200, error: "" };
}
