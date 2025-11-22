// ==================== Imports ====================
import axios from "axios";
import Cookies from "js-cookie";

// ==================== Language Helper ====================

// Get current language from cookie → default is "en"
const getLang = () => Cookies.get("lang") || "en";

// Base API URL generator
const API_BASE = () =>
  `https://catalogueyanew.com.awu.zxu.temporary.site/${getLang()}/api`;

// ==================== Axios Instance ====================

// Create axios instance - SIMPLIFIED without CSRF for now
export let api = axios.create({
  baseURL: API_BASE(),
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ==================== API Functions ====================

// Change language dynamically
export const changeLanguage = () => api.get("/change_lang");

// GET /settings
export const getSettings = () => api.get("/settings");

// GET /fixed_words
export const getFixedWords = () => {
  const lang = getLang();
  return axios.get(
    `https://catalogueyanew.com.awu.zxu.temporary.site/${lang}/api/fixed_words`
  );
};

// GET /googlemap
export const getGoogleMap = () => api.get("/googlemap");

// ==================== CATEGORIES ====================

// GET /showCategories
export const getCategories = () => api.get("/showCategories");

// GET /showCategory/{id}
export const getCategory = (id) => api.get(`/showCategory/${id}`);

// ==================== COMPANIES ====================

// GET /showCompanies
export const getCompanies = () => api.get("/showCompanies");

// GET /showCompany/{id}
export const getCompany = (id) => api.get(`/showCompany/${id}`);

// ==================== PRODUCTS ====================

// GET /showProducts
export const getProducts = () => api.get("/showProducts");

// GET /showproduct/{id}
export const getProduct = (id) => api.get(`/showproduct/${id}`);

// GET /showProducts/sales
export const getSalesProducts = () => api.get("/showProducts/sales");

// GET /showProducts/arrivals
export const getArrivalsProducts = () => api.get("/showProducts/arrivals");

// ==================== QUESTIONS & SUBSCRIBE DETAILS ====================

// GET /showQuestions
export const getQuestions = () => api.get("/showQuestions");

// GET /showSubscribesDetails
export const getSubscribeDetails = () => api.get("/showSubscribesDetails");

// ==================== CUSTOMER AUTH ====================

// POST /login
export const loginCustomer = (email, password) =>
  api.post("/login", { email, password });

// POST /register
export const registerCustomer = (name, email, password) =>
  api.post("/register", { name, email, password });

// POST /logout
export const logoutCustomer = () => api.post("/logout");

// ==================== COMPANY AUTH ====================

// POST /company/login
export const loginCompany = (email, password) =>
  api.post("/company/login", { email, password });

// POST /company/register
export const registerCompany = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "categories") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  
  return api.post("/company/register", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// POST /company/logout
export const logoutCompany = () => api.post("/company/logout");

// ==================== UPDATE API INSTANCE ON LANGUAGE CHANGE ====================

// Function to update API instance when language changes
export const updateApiInstance = (newLang) => {
  Cookies.set("lang", newLang);
  api = axios.create({
    baseURL: `https://catalogueyanew.com.awu.zxu.temporary.site/${newLang}/api`,
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
  return changeLanguage();
};

// Remove CSRF token function since endpoint doesn't exist
export const fetchCsrfToken = async () => {
  console.log('⚠️ CSRF endpoint not available, skipping CSRF token');
  return false; // Return false to indicate no CSRF
};