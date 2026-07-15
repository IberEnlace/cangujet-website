"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { useLanguage } from "./LanguageProvider";
import { localeNames, locales, Locale } from "@/lib/i18n";
import { CALCULATOR_URL, RESERVA_URL } from "@/lib/links";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const labels = t("nav").split("|");
  const links = [[labels[0], "#solution"], [labels[1], "#features"], [labels[2], "#integrations"], [labels[3], "#pricing"], ["Reserva", RESERVA_URL]];
  useEffect(() => { const close = () => setOpen(false); window.addEventListener("resize", close); return () => window.removeEventListener("resize", close); }, []);
  const switcher = <label className="language-switcher"><span className="sr-only">{labels[6]}</span><select value={locale} onChange={(e) => setLocale(e.target.value as Locale)} aria-label={labels[6]}>{locales.map((code) => <option value={code} key={code}>{localeNames[code]}</option>)}</select></label>;
  return <header className="site-header"><div className="container nav-inner"><BrandMark/><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav><div className="desktop-language">{switcher}</div><a href={CALCULATOR_URL} className="button button-sm button-calculator desktop-cta">Calculator</a><a href="#contact" className="button button-sm desktop-cta">{labels[4]}</a><button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={labels[5]}><span/><span/><span/></button></div><nav id="mobile-menu" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Mobile navigation">{links.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}<div className="mobile-language">{switcher}</div><a href={CALCULATOR_URL} className="button button-calculator" onClick={() => setOpen(false)}>Calculator</a><a href="#contact" className="button" onClick={() => setOpen(false)}>{labels[4]}</a></nav></header>;
}
