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

// ==================== GENERAL API FUNCTIONS ====================

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
export const getProduct = (id) => api.get(`/showProduct/${id}`);

// GET /showProducts/sales
export const getSalesProducts = () => api.get("/showProducts/sales");

// GET /showProducts/arrivals
export const getArrivalsProducts = () => api.get("/showProducts/arrival");

// ==================== QUESTIONS & SUBSCRIBE DETAILS ====================

// GET /showQuestions
export const getQuestions = () => api.get("/showQuestions");

// GET /showSubscribesDetails
export const getSubscribeDetails = () => api.get("/showSubscribesDetails");

// ==================== CUSTOMER AUTH ====================

// POST /login
export const loginCustomer = (email, password) =>
  api.post("/login", { email, password });

// POST /register - UPDATED with phone field
export const registerCustomer = (name, email, password, phone) =>
  api.post("/register", { name, email, password, phone });

// POST /logout
export const logoutCustomer = () => api.post("/logout");

// ==================== COMPANY AUTH ====================

// POST /company/login
export const loginCompany = (email, password) =>
  api.post("/company/login", { email, password });

// POST /company/register - UPDATED without categories
export const registerCompany = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
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

// ==================== COMPANY DASHBOARD - EDIT ====================

// PUT /edit_company_post/{companyId}
export const editCompanyPost = (companyId, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  
  return api.put(`/edit_company_post/${companyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ==================== PRODUCT MANAGEMENT ====================

// PUT /edit_product/{companyId}/{productId}
export const editProduct = (companyId, productId, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Handle arrays (like albums[], special_mark[])
        value.forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return api.put(`/edit_product/${companyId}/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// POST /add_product/{companyId}
export const addProduct = (companyId, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Handle arrays (like albums[], special_mark[])
        value.forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return api.post(`/add_product/${companyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// POST /add_sales_product/{productId}
export const addSalesProduct = (productId, data) =>
  api.post(`/add_sales_product/${productId}`, data);

// ==================== BARCODE ====================

// GET /print_barcode/{companyId}
export const getBarcode = (companyId) => api.get(`/print_barcode/${companyId}`);

// ==================== ANALYTICS ====================

// POST /Anylasies
export const getAnalytics = (companyId, filter) =>
  api.post("/Anylasies", { company_id: companyId, filter });

// ==================== CONVERSATIONS & MESSAGING ====================

// GET /conversations
export const getConversations = () => api.get("/conversations");

// POST /conversations - Create new conversation or group
export const createConversation = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Handle arrays (like participant_ids[])
        value.forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return api.post("/conversations", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// GET /conversations/{conversationId}
export const getConversation = (conversationId) =>
  api.get(`/conversations/${conversationId}`);

// POST /conversations/{conversationId}/messages - Send message
export const sendMessage = (conversationId, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Handle arrays (like attachments[])
        value.forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return api.post(`/conversations/${conversationId}/messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// POST /conversations/{conversationId}/typing - Typing indicator
export const sendTypingIndicator = (conversationId, data) =>
  api.post(`/conversations/${conversationId}/typing`, data);

// POST /conversations/{conversationId}/read - Mark as read
export const markAsRead = (conversationId) =>
  api.post(`/conversations/${conversationId}/read`);

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

// ==================== EXPORT ALL FUNCTIONS ====================
export default {
  // General
  changeLanguage,
  getSettings,
  getFixedWords,
  getGoogleMap,
  
  // Categories
  getCategories,
  getCategory,
  
  // Companies
  getCompanies,
  getCompany,
  
  // Products
  getProducts,
  getProduct,
  getSalesProducts,
  getArrivalsProducts,
  
  // Questions & Subscriptions
  getQuestions,
  getSubscribeDetails,
  
  // Customer Auth
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  
  // Company Auth
  loginCompany,
  registerCompany,
  logoutCompany,
  
  // Company Dashboard
  editCompanyPost,
  editProduct,
  addProduct,
  addSalesProduct,
  getBarcode,
  getAnalytics,
  
  // Conversations
  getConversations,
  createConversation,
  getConversation,
  sendMessage,
  sendTypingIndicator,
  markAsRead,
  
  // Utility
  updateApiInstance,
  fetchCsrfToken,
  api, // Export the api instance for direct use if needed
};