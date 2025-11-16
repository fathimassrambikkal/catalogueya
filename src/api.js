import axios from "axios";
import Cookies from "js-cookie";

// ==================== Helpers ====================

// Get current language from cookie, default to 'en'
const getLang = () => Cookies.get("lang") || "en";

// Create Axios instance with dynamic language in baseURL
const createApiInstance = () => {
  const lang = getLang();
  return axios.create({
    baseURL: `https://catalogueyanew.com.awu.zxu.temporary.site/${lang}/api`,
    headers: { "Content-Type": "application/json" },
  });
};

// Axios instance
export let api = createApiInstance();

// Change language dynamically
export const changeLanguage = (lang) => {
  Cookies.set("lang", lang);
  api = createApiInstance(); // recreate axios instance with new lang
  return api.post("/change_lang", { lang });
};

// ==================== General APIs ====================

export const getSettings = () => api.get("/settings");
export const getFixedWords = () => api.get("/fixed_words");
export const getGoogleMap = () => api.get("/googlemap");

// ==================== Category APIs ====================

export const getCategories = () => api.get("/showCategories");
export const getCategory = (id) => api.get(`/showCategory/${id}`);

// ==================== Company APIs ====================

export const getCompanies = () => api.get("/showCompanies");
export const getCompany = (id) => api.get(`/showCompany/${id}`);

// ==================== Product APIs ====================

export const getProducts = () => api.get("/showProducts");
export const getProduct = (id) => api.get(`/showproduct/${id}`);
export const getSalesProducts = () => api.get("/showProducts/sales");
export const getArrivalsProducts = () => api.get("/showProducts/arrivals");

// ==================== Questions & Subscriptions ====================

export const getQuestions = () => axios.get("http://127.0.0.1:8000/api/showQuestions");
export const getSubscribeDetails = () => axios.get("http://127.0.0.1:8000/api/showSubscribesDetails");

// ==================== Customer Authentication ====================

export const loginCustomer = (email, password) =>
  api.post("/login", { email, password });
export const registerCustomer = (name, email, password) =>
  api.post("/register", { name, email, password });
export const logoutCustomer = () => api.post("/logout");

// ==================== Company Authentication ====================

export const loginCompany = (email, password) =>
  api.post("/company/login", { email, password });
export const registerCompany = (data) =>
  api.post("/company/register", data);
export const logoutCompany = () => api.post("/company/logout");
