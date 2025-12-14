// ==================== Imports ====================
import axios from "axios";
import Cookies from "js-cookie";

// ==================== Language Helper ====================

// Get current language from cookie → default is "en"
const getLang = () => Cookies.get("lang") || "en";

// Base API URL generator
// https://catalogueyanew.com.awu.zxu.temporary.site/en/api/add_product/{companyId}

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
  
  // Append all fields as per backend documentation
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

  // Log for debugging
  console.log('📤 Sending company update for ID:', companyId);
  console.log('Fields being sent:', fields.filter(f => data[f]));
  
  // Debug: Show what's in formData
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File (${value.name}, ${value.type})` : value);
  }
  
  return api.put(`/edit_company_post/${companyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: false,
  }).catch(async (error) => {
    console.warn('FormData PUT failed:', error.message);
    
    // Check if it's a 404 (route doesn't exist)
    if (error.response?.status === 404) {
      console.error('❌ ENDPOINT NOT FOUND!');
      console.error('The route /edit_company_post does not exist on server.');
      console.error('Ask backend developer to create this route.');
      throw new Error('Endpoint not found. Contact backend developer.');
    }
    
    // FALLBACK 1: Try JSON without files
    const jsonData = {};
    fields.forEach(field => {
      if (data[field] !== null && data[field] !== undefined && !(data[field] instanceof File)) {
        jsonData[field] = data[field];
      }
    });
    
    console.log('🔄 Trying JSON fallback (no files):', jsonData);
    
    try {
      return await api.put(`/edit_company_post/${companyId}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (jsonError) {
      console.warn('JSON PUT failed:', jsonError.message);
      
      // FALLBACK 2: Try POST instead of PUT
      try {
        console.log('🔄 Trying POST method instead of PUT...');
        return await api.post(`/edit_company_post/${companyId}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (postError) {
        console.warn('POST also failed:', postError.message);
        
        // FALLBACK 3: Try with fetch API
        try {
          console.log('🔄 Trying fetch API...');
          const response = await fetch(`https://catalogueyanew.com.awu.zxu.temporary.site/en/api/edit_company_post/${companyId}`, {
            method: 'PUT',
            body: JSON.stringify(jsonData), // ✅ FIXED: Added JSON.stringify
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
          console.error('All methods failed. The endpoint likely does not exist.');
          console.error('Contact backend developer to create:');
          console.error(`PUT /en/api/edit_company_post/{companyId}`);
          
          // Throw a helpful error
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

// POST /company/add_product/{companyId}
export const addProduct = (companyId, formData) => {
  console.log("📤 Add Product API - Company ID:", companyId);
  
  // Debug FormData
  console.log("📤 FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File (${value.name})` : value);
  }

  return api.post(
    `/company/add_product/${companyId}`,  // ✅ CORRECT ENDPOINT (not yadd_product)
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    }
  ).catch(error => {
    console.error("❌ Add Product API Error:", error);
    console.error("URL attempted:", error.config?.url);
    console.error("Response:", error.response?.data);
    throw error;
  });
};

// PUT /company/edit_product/{companyId}/{productId}
export const editProduct = (companyId, productId, formData) => {
  console.log("📤 Edit Product API - Company ID:", companyId, "Product ID:", productId);

  // Debug FormData
  console.log("📤 FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File (${value.name})` : value);
  }

  return api.put(
    `/company/edit_product/${companyId}/${productId}`,  // ✅ CORRECT ENDPOINT
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    }
  ).catch(error => {
    console.error("❌ Edit Product API Error:", error);
    console.error("URL attempted:", error.config?.url);
    console.error("Response:", error.response?.data);
    throw error;
  });
};

// ✅ ADD THIS FUNCTION: DELETE /company/delete_product/{companyId}/{productId}
export const deleteProduct = (companyId, productId) => {
  console.log("🗑️ Delete Product API - Company ID:", companyId, "Product ID:", productId);

  return api.delete(
    `/company/delete_product/${companyId}/${productId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  ).catch(error => {
    console.error("❌ Delete Product API Error:", error);
    console.error("URL attempted:", error.config?.url);
    console.error("Response:", error.response?.data);
    
    // If endpoint doesn't exist, try alternative
    if (error.response?.status === 404) {
      console.log("⚠️ Delete endpoint not found, trying alternative...");
      
      // Try alternative endpoint: DELETE /company/product/{companyId}/{productId}
      return api.delete(
        `/company/product/${companyId}/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      ).catch(altError => {
        console.error("❌ Alternative delete also failed:", altError);
        throw error; // Throw original error
      });
    }
    
    throw error;
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
  deleteProduct, 
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