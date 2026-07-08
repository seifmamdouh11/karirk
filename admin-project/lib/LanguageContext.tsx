"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/locales/en.json";
import arTranslations from "@/locales/ar.json";

type Locale = "en" | "ar";

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("karirak-locale") as Locale;
    if (saved === "en" || saved === "ar") {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("karirak-locale", newLocale);
  };

  // Sync HTML attributes
  useEffect(() => {
    if (!mounted) return;
    const html = document.querySelector("html");
    if (html) {
      html.setAttribute("lang", locale);
      html.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    }
  }, [locale, mounted]);

  const translations: Record<Locale, any> = {
    en: enTranslations,
    ar: arTranslations,
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current = translations[locale];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to en translations if not found in ar
        let fallback = translations["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // return key as fallback
          }
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
