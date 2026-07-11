"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale, MessageKey, locales, translations } from "@/lib/i18n";

type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: MessageKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // SSR and the browser's first render must be identical. The saved preference
  // is deliberately unavailable until the component has mounted.
  const [mounted, setMounted] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("pt-PT");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cangujet-language");
      if (saved && locales.includes(saved as Locale)) {
        setLocaleState(saved as Locale);
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem("cangujet-language", locale);
    } catch {
      // The language still works for this session when storage is unavailable.
    }
  }, [locale, mounted]);

  useEffect(() => {
    if (mounted) document.documentElement.lang = locale;
  }, [locale, mounted]);

  const activeLocale: Locale = mounted ? locale : "pt-PT";
  const setLocale = (next: Locale) => setLocaleState(next);

  const value = useMemo(
    () => ({ locale: activeLocale, setLocale, t: (key: MessageKey) => translations[activeLocale][key] }),
    [activeLocale],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
