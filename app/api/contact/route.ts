import { NextResponse } from "next/server";
import { ContactSubmission, isValidEmail, sendContactEmail, text } from "@/lib/contact-email";

export const runtime = "nodejs";

type ContactPayload = {
  source?: unknown;
  name?: unknown;
  restaurant?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  city?: unknown;
  interest?: unknown;
  message?: unknown;
  language?: unknown;
  pageUrl?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (text(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const source = text(body.source) === "QR Contact Form" ? "QR Contact Form" : "Main Website Contact Form";
    const submission: ContactSubmission = {
      source,
      name: text(body.name),
      restaurant: text(body.restaurant),
      email: text(body.email),
      phone: text(body.phone),
      country: text(body.country),
      city: text(body.city),
      interest: text(body.interest),
      message: text(body.message, 2000),
      language: text(body.language, 50) || "pt-PT",
      pageUrl: text(body.pageUrl, 1000) || "Not provided",
      submittedAt: new Date().toISOString(),
    };

    if (!submission.name || !submission.restaurant || !submission.email) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (source === "QR Contact Form" && (!submission.phone || !submission.interest)) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!isValidEmail(submission.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const result = await sendContactEmail(submission);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form submission failed.", error);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}
