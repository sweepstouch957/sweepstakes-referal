import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./translates/es";
import en from "./translates/en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Default language when no cookie/localStorage value exists
    fallbackLng: "en",
    resources: {
      en,
      es,
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Only rely on stored preference; otherwise use fallbackLng (English)
      order: ["cookie", "localStorage"],
      caches: ["cookie", "localStorage"],
      cookieMinutes: 60 * 24 * 30, // 30 días
      cookieDomain:
        typeof window !== "undefined" ? window.location.hostname : "localhost",
    },
  });

export default i18n;
