import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";

// Read language from cookie (default: en)
const savedLang = Cookies.get("lang") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: "en",

    resources: {},

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["cookie"],
      lookupCookie: "lang",
      caches: ["cookie"],
    },

    
    returnNull: false,
    returnEmptyString: false,
  });

export default i18n;
