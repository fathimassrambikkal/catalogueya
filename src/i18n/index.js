import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";

// Correct paths (because locales folder is inside src/)
import en from "../locales/en/translation.json";
import ar from "../locales/ar/translation.json";

// Read the API language cookie OR default to English
const savedLang = Cookies.get("lang") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },

    lng: savedLang,
    fallbackLng: "en",

    interpolation: { 
      escapeValue: false 
    },

    detection: {
      order: ["cookie"],
      caches: ["cookie"],
      lookupCookie: "lang",  // cookie name
    },
  });

export default i18n;
