"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLabel } from "@/lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-lang");
    if (stored === "en" || stored === "id") {
      setLang(stored);
    }
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === "en" ? "id" : "en";
      window.localStorage.setItem("portfolio-lang", next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      lang,
      toggleLanguage,
      t: (path) => getLabel(lang, path),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
