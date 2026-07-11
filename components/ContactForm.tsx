"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type ContactFormProps = {
  variant?: "main" | "qr";
};

type FormState = {
  name: string;
  restaurant: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  interest: string;
  message: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  restaurant: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  interest: "",
  message: "",
  website: "",
};

export function ContactForm({ variant = "main" }: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);
  const { locale, t } = useLanguage();
  const labels = t(variant === "qr" ? "qrFormLabels" : "formLabels").split("|");
  const extraLabels = t("formExtraLabels").split("|");
  const options = t(variant === "qr" ? "qrFormOptions" : "formOptions").split("|");
  const actions = t(variant === "qr" ? "qrFormActions" : "formActions").split("|");
  const submitStates = t("formSubmitStates").split("|");

  const requiredComplete = Boolean(form.name.trim() && form.restaurant.trim() && form.email.trim() && (variant === "main" || (form.phone.trim() && form.interest.trim())));

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    if (!requiredComplete) {
      setError(submitStates[2]);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError(submitStates[3]);
      return;
    }

    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          language: locale,
          pageUrl: window.location.href,
          source: variant === "qr" ? "QR Contact Form" : "Main Website Contact Form",
        }),
      });

      if (!response.ok) {
        setError(response.status === 400 ? submitStates[2] : submitStates[1]);
        return;
      }

      setSent(true);
      setForm(initialForm);
    } catch (submissionError) {
      console.error(submissionError);
      setError(submitStates[1]);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <span className="success-icon">✓</span>
        <h3>{variant === "qr" ? actions[1] : actions[2]}</h3>
        <p>{variant === "qr" ? actions[2] : actions[3]}</p>
        {variant === "qr" && <a className="button" href="/">{t("qrPage").split("|")[3]}</a>}
        <button className="text-button" type="button" onClick={() => setSent(false)}>{variant === "qr" ? actions[3] : actions[4]}</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>{labels[0]}<input name="name" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} required /></label>
        <label>{labels[1]}<input name="restaurant" autoComplete="organization" value={form.restaurant} onChange={(event) => update("restaurant", event.target.value)} required /></label>
      </div>
      <div className="form-row">
        <label>{variant === "qr" ? labels[3] : labels[2]}<input name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} required /></label>
        <label>{variant === "qr" ? labels[2] : labels[3]}<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} required={variant === "qr"} /></label>
      </div>
      {variant === "main" ? (
        <div className="form-row">
          <label>{extraLabels[0]}<input name="country" autoComplete="country-name" value={form.country} onChange={(event) => update("country", event.target.value)} /></label>
          <label>{labels[4]}<select name="interest" value={form.interest} onChange={(event) => update("interest", event.target.value)}><option value="">{labels[5]}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
      ) : (
        <div className="form-row">
          <label>{labels[4]}<input name="city" autoComplete="address-level2" value={form.city} onChange={(event) => update("city", event.target.value)} /></label>
          <label>{labels[5]}<select name="interest" value={form.interest} onChange={(event) => update("interest", event.target.value)} required><option value="">{labels[6]}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
      )}
      <label>{variant === "qr" ? labels[7] : labels[6]} {variant === "main" && <span>({labels[7]})</span>}<textarea name="message" rows={variant === "qr" ? 3 : 4} placeholder={variant === "qr" ? labels[8] : labels[8]} value={form.message} onChange={(event) => update("message", event.target.value)} /></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></label>
      <button className="button button-full" type="submit" disabled={sending || !requiredComplete}>{sending ? submitStates[0] : actions[0]} <span aria-hidden="true">→</span></button>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="form-note">{variant === "main" ? actions[1] : t("formPrivacy")}</p>
      {variant === "main" && <p className="form-note">{t("formPrivacy")}</p>}
    </form>
  );
}
