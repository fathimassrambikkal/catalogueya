import axios from "axios";

// Base URL
const BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site/api";

// Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== General APIs ====================

// Language
export const changeLanguage = (lang) => api.post("/change_lang", { lang });

// Settings
export const getSettings = () => api.get("/settings");

// Fixed words
export const getFixedWords = () => api.get("/fixed_words");

// ==================== Category APIs ====================

// All categories with companies
export const getCategories = () => api.get("/showCategories");

// Single category by id
export const getCategory = (id) => api.get(`/showCategory/${id}`);

// ==================== Company APIs ====================

// All companies
export const getCompanies = () => api.get("/showCompanies");

// Single company by id
export const getCompany = (id) => api.get(`/showCompany/${id}`);

// ==================== Product APIs ====================

// All products
export const getProducts = () => api.get("/showProducts");

// Single product by id
export const getProduct = (id) => api.get(`/showproduct/${id}`);

// ==================== Customer Authentication ====================

// Login customer
export const loginCustomer = (email, password) =>
  api.post("/login", { email, password });

// Register customer
export const registerCustomer = (name, email, password) =>
  api.post("/register", { name, email, password });

// Logout customer
export const logoutCustomer = () => api.post("/logout");

// ==================== Company Authentication ====================

// Login company
export const loginCompany = (email, password) =>
  api.post("/company/login", { email, password });

// Register company
export const registerCompany = (data) =>
  api.post("/company/register", data);

// Logout company
export const logoutCompany = () => api.post("/company/logout");
