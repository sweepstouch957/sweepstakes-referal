"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import i18n from "../i18n";

type Lang = "es" | "en";

interface LanguageContextProps {
  language: Lang;
  changeLanguage: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Lang>("en");

  useEffect(() => {    
    const cookieLang = Cookies.get("lang") as Lang | undefined;
    if (cookieLang && (cookieLang === "es" || cookieLang === "en")) {
      setLanguage(cookieLang);
      i18n.changeLanguage(cookieLang);
    } else {
      // Default language on first visit
      Cookies.set("lang", "en");
      setLanguage("en");
      i18n.changeLanguage("en");
    }
  }, []);

  const changeLanguage = (lang: Lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    Cookies.set("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
