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

export let api = axios.create({
  baseURL: API_BASE(),
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ==================== GENERAL API FUNCTIONS ====================

export const changeLanguage = () => api.get("/change_lang");

export const getSettings = () => api.get("/settings");

export const getFixedWords = () => {
  const lang = getLang();
  return axios.get(
    `https://catalogueyanew.com.awu.zxu.temporary.site/${lang}/api/fixed_words`
  );
};

export const getGoogleMap = () => api.get("/googlemap");

// ==================== SUBSCRIBE NOW ====================

export const getSubscribeNow = () => {
  const lang = getLang();
  return axios.get(
    `https://catalogueyanew.com.awu.zxu.temporary.site/${lang}/api/subscribe_now`
  );
};

// ==================== CATEGORIES ====================

export const getCategories = () => api.get("/showCategories");

export const getCategory = (id) => api.get(`/showCategory/${id}`);

// ==================== COMPANIES ====================

export const getCompanies = () => api.get("/showCompanies");

export const getCompany = (id, payload = {}) => {
  return api.post(`/showCompany/${id}`, payload);
};

// ==================== PRODUCTS ====================

export const getProducts = () => api.get("/showProducts");

export const getProduct = (id, payload = {}) => {
  return api.post(`/showProduct/${id}`, payload);
};

export const getSalesProducts = () => api.get("/showProducts/sales");

export const getArrivalsProducts = () => api.get("/showProducts");

// ==================== QUESTIONS & SUBSCRIBE DETAILS ====================

export const getQuestions = () => api.get("/showQuestions");

export const getSubscribeDetails = () => api.get("/subscribes_details");

// ==================== CONTACT US ====================

export const submitContact = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  
  return api.post("/contact", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const submitContactJson = (data) => {
  return api.post("/contact", data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ==================== CUSTOMER AUTH ====================

export const loginCustomer = (email, password) =>
  api.post("/login", { email, password });

export const registerCustomer = (name, email, password, phone) =>
  api.post("/register", { name, email, password, phone });

export const logoutCustomer = () => api.post("/logout");

// ==================== COMPANY AUTH ====================

export const loginCompany = (email, password) =>
  api.post("/company/login", { email, password });

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

export const logoutCompany = () => api.post("/company/logout");

// ==================== COMPANY DASHBOARD - EDIT ====================

export const editCompanyPost = (companyId, data) => {
  const formData = new FormData();
  
  const fields = [
    'logo', 'cover_photo', 'name', 'address', 'phone', 'description',
    'whatsapp', 'snapchat', 'pinterest', 'instagram', 'tweeter',
    'facebook', 'youtube', 'google', 'linkedin'
  ];
  
  fields.forEach(field => {
    if (data[field] !== null && data[field] !== undefined) {
      formData.append(field, data[field]);
    }
  });
  
  return api.put(`/edit_company_post/${companyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: false,
  }).catch(async (error) => {
    if (error.response?.status === 404) {
      throw new Error('Endpoint not found. Contact backend developer.');
    }
    
    const jsonData = {};
    fields.forEach(field => {
      if (data[field] !== null && data[field] !== undefined && !(data[field] instanceof File)) {
        jsonData[field] = data[field];
      }
    });
    
    try {
      return await api.put(`/edit_company_post/${companyId}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (jsonError) {
      try {
        return await api.post(`/edit_company_post/${companyId}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (postError) {
        try {
          const response = await fetch(`https://catalogueyanew.com.awu.zxu.temporary.site/en/api/edit_company_post/${companyId}`, {
            method: 'PUT',
            body: JSON.stringify(jsonData),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const responseData = await response.json();
          return { data: responseData };
        } catch (fetchError) {
          throw new Error(
            `Cannot update company settings. The endpoint /edit_company_post does not exist.\n\n` +
            `Please ask backend developer to:\n` +
            `1. Create route: Route::put('/edit_company_post/{companyId}', [CompanyController::class, 'update'])\n` +
            `2. Or check if endpoint name is different`
          );
        }
      }
    }
  });
};

// ==================== PRODUCT MANAGEMENT ====================

export const addProduct = (companyId, formData) => {
  return api.post(
    `/company/add_product/${companyId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    }
  );
};

export const editProduct = (companyId, productId, formData) => {
  return api.put(
    `/company/edit_product/${companyId}/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    }
  );
};

export const deleteProduct = (companyId, productId) => {
  return api.delete(
    `/company/delete_product/${companyId}/${productId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  ).catch(error => {
    if (error.response?.status === 404) {
      return api.delete(
        `/company/product/${companyId}/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );
    }
    throw error;
  });
};

export const addSalesProduct = (productId, data) =>
  api.post(`/add_sales_product/${productId}`, data);

// ==================== BARCODE ====================

export const getBarcode = (companyId) => api.get(`/print_barcode/${companyId}`);

// ==================== ANALYTICS ====================

export const getAnalytics = (companyId, filter) =>
  api.post("/Anylasies", { company_id: companyId, filter });

// ==================== CONVERSATIONS & MESSAGING ====================

export const getConversations = () => api.get("/conversations");

export const createConversation = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
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

export const getConversation = (conversationId) =>
  api.get(`/conversations/${conversationId}`);

export const sendMessage = (conversationId, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
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

export const sendTypingIndicator = (conversationId, data) =>
  api.post(`/conversations/${conversationId}/typing`, data);

export const markAsRead = (conversationId) =>
  api.post(`/conversations/${conversationId}/read`);

// ==================== UPDATE API INSTANCE ON LANGUAGE CHANGE ====================

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

export const fetchCsrfToken = async () => {
  return false;
};

// ==================== EXPORT ALL FUNCTIONS ====================

export default {
  changeLanguage,
  getSettings,
  getFixedWords,
  getGoogleMap,
  getSubscribeNow,
  getCategories,
  getCategory,
  getCompanies,
  getCompany,
  getProducts,
  getProduct,
  getSalesProducts,
  getArrivalsProducts,
  getQuestions,
  getSubscribeDetails,
  submitContact,
  submitContactJson,
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  loginCompany,
  registerCompany,
  logoutCompany,
  editCompanyPost,
  editProduct,
  addProduct,
  deleteProduct,
  addSalesProduct,
  getBarcode,
  getAnalytics,
  getConversations,
  createConversation,
  getConversation,
  sendMessage,
  sendTypingIndicator,
  markAsRead,
  updateApiInstance,
  fetchCsrfToken,
  api,
};