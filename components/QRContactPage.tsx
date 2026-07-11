"use client";

import { BrandMark } from "./BrandMark";
import { ContactForm } from "./ContactForm";
import { useLanguage } from "./LanguageProvider";
import { Locale, localeNames, locales } from "@/lib/i18n";

export function QRContactPage() {
  const { locale, setLocale, t } = useLanguage();
  const page = t("qrPage").split("|");

  return (
    <main className="qr-page">
      <header className="qr-header container">
        <BrandMark />
        <label className="language-switcher">
          <span className="sr-only">{t("nav").split("|")[6]}</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label={t("nav").split("|")[6]}>
            {locales.map((code) => <option value={code} key={code}>{localeNames[code]}</option>)}
          </select>
        </label>
      </header>
      <section className="qr-section">
        <div className="container qr-grid">
          <div className="qr-copy">
            <div className="eyebrow">{page[0]}</div>
            <h1>{page[1]}</h1>
            <p>{page[2]}</p>
            <div className="qr-trust">
              <span>✓ {t("heroProof").split("|")[1]}</span>
              <span>✓ {t("formPrivacy")}</span>
            </div>
          </div>
          <ContactForm variant="qr" />
        </div>
      </section>
    </main>
  );
}
