import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AssessmentAnswer = { question: string; answer: string };
type LeadPayload = {
  name?: unknown;
  restaurant?: unknown;
  phone?: unknown;
  email?: unknown;
  language?: unknown;
  answers?: unknown;
};

const RECIPIENT = "sales@cangujet.com";
const SUBJECT = "New Restaurant Growth Assessment Lead";

function text(value: unknown, maxLength = 300) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function parseAnswers(value: unknown): AssessmentAnswer[] {
  if (!Array.isArray(value) || value.length !== 6) return [];
  return value.map((item) => ({
    question: text((item as AssessmentAnswer)?.question, 500),
    answer: text((item as AssessmentAnswer)?.answer, 300),
  })).filter((item) => item.question && item.answer);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;
    const name = text(body.name);
    const restaurant = text(body.restaurant);
    const phone = text(body.phone);
    const email = text(body.email);
    const language = text(body.language, 20);
    const answers = parseAnswers(body.answers);

    if (!name || !restaurant || !phone || !email || answers.length !== 6) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.ASSESSMENT_EMAIL_FROM;
    if (!apiKey || !from) {
      const missingEnvironmentVariables = [
        !apiKey ? "RESEND_API_KEY" : "",
        !from ? "ASSESSMENT_EMAIL_FROM" : "",
      ].filter(Boolean);
      console.error("Assessment email configuration is missing.", {
        provider: "resend",
        missingEnvironmentVariables,
      });
      return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
    }

    const answerRows = answers.map((item, index) => `<tr><td style="padding:12px;border-bottom:1px solid #e5ece5;color:#667268;vertical-align:top">${index + 1}</td><td style="padding:12px;border-bottom:1px solid #e5ece5"><strong>${escapeHtml(item.question)}</strong><br><span style="color:#4b744d">${escapeHtml(item.answer)}</span></td></tr>`).join("");
    const plainAnswers = answers.map((item, index) => `${index + 1}. ${item.question}\n   ${item.answer}`).join("\n\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [RECIPIENT],
        reply_to: email,
        subject: SUBJECT,
        text: `${SUBJECT}\n\nFull name: ${name}\nRestaurant: ${restaurant}\nPhone / WhatsApp: ${phone}\nEmail: ${email}\nLanguage: ${language}\n\nAssessment answers\n\n${plainAnswers}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172537"><h1 style="font-size:24px">${SUBJECT}</h1><div style="padding:20px;background:#f3f8f3;border:1px solid #dce9dc;border-radius:10px"><p><strong>Full name:</strong> ${escapeHtml(name)}</p><p><strong>Restaurant:</strong> ${escapeHtml(restaurant)}</p><p><strong>Phone / WhatsApp:</strong> ${escapeHtml(phone)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p><strong>Language:</strong> ${escapeHtml(language)}</p></div><h2 style="margin-top:28px;font-size:18px">Assessment answers</h2><table style="width:100%;border-collapse:collapse">${answerRows}</table></div>`,
      }),
    });

    if (!response.ok) {
      const providerError = await response.text();
      console.error("Resend delivery failed.", {
        status: response.status,
        statusText: response.statusText,
        providerError,
      });
      return NextResponse.json({ error: "The email could not be sent." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Assessment lead submission failed", error);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}
