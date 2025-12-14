import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguages, changeLanguage as apiChangeLanguage } from "../api";
import Cookies from "js-cookie";

// Translation cache
const translationCache = {};

// Function to load translations from API
const loadTranslationsFromAPI = async (lang) => {
  try {
    // Check cache first
    if (translationCache[lang]) {
      return translationCache[lang];
    }

    // Get from API
    const response = await getLanguages(lang);
    const translations = response?.data || {};
    
    // Cache the translations
    translationCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error(`Failed to load ${lang} translations from API:`, error);
    return {};
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {},
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

// Export function to change language instantly
export const changeLanguage = async (lang) => {
  try {
    // 1. Load translations from API
    const translations = await loadTranslationsFromAPI(lang);
    
    // 2. Add to i18n resources
    i18n.addResourceBundle(lang, "translation", translations, true, true);
    
    // 3. Change the active language
    await i18n.changeLanguage(lang);
    
    // 4. Update HTML direction
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    
    // 5. Save to cookie
    Cookies.set("lang", lang, { expires: 30, path: "/", sameSite: "lax" });
    
    // 6. Notify backend (optional, don't wait for it)
    apiChangeLanguage().catch(err => {
      console.warn("Backend language update failed:", err);
    });
    
    return true;
  } catch (error) {
    console.error("Language switch failed:", error);
    return false;
  }
};

// Initialize on startup
(async () => {
  const savedLang = Cookies.get("lang") || "en";
  try {
    const translations = await loadTranslationsFromAPI(savedLang);
    i18n.addResourceBundle(savedLang, "translation", translations, true, true);
    await i18n.changeLanguage(savedLang);
    document.documentElement.setAttribute("dir", savedLang === "ar" ? "rtl" : "ltr");
  } catch (error) {
    console.error("Failed to initialize language:", error);
  }
})();

export default i18n;