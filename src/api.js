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


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


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


// ==================== CATEGORY SEARCH ====================


export const searchCategories = (query) => {
  return api.get("/search/categories", {
    params: { q: query },
  });
};



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


export const getSalesProducts = (page = 1) =>
  api.get(`/showProducts/sales?page=${page}`);



export const getArrivalsProducts = (page = 1) =>
  api.get(`/showProducts?page=${page}`);


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




// ==================== PRODUCT REVIEWS (PUBLIC) ====================

// ✅ Get all reviews for a product (public – no token required)
// GET /{lang}/api/products/{productId}/reviews
export const getProductReviews = (productId) => {
  return api.get(`/products/${productId}/reviews`);
};



// ==================== SUBSCRIBE USER ====================

// Create subscribe user (email only)
// POST /{lang}/api/create_subscribe_user
export const createSubscribeUser = (email) => {
  return api.post("/create_subscribe_user", {
    email: email?.trim(),
  });
};



// ==================== CUSTOMER AUTH ====================



export const loginCustomer = (email, password) => {
  return api.post("/customer/login", {
    email: email.trim(),
    password: password.trim(),
  });
};


export const registerCustomer = ({
  first_name,
  last_name,
  phone,
  email,
  password,
  password_confirmation,
}) => {
  return api.post("/customer/register", {
    first_name: first_name?.trim(),
    last_name: last_name?.trim(),   //  FIXED
    phone: phone?.trim(),
    email: email?.trim(),
    password: password?.trim(),
    password_confirmation: password_confirmation?.trim(),
  });
};



// Customer Logout
export const logoutCustomer = () => {
  return api.post("/customer/logout");
};

// ==================== CUSTOMER PROFILE ====================
// PUT /{lang}/api/customer/settings
export const updateCustomerSettings = (data) => {
  return api.put("/customer/settings", data, {
    
  });
};


// ==================== CUSTOMER PASSWORD ====================
export const changeCustomerPassword = (data) => {
  return api.post("/customer/change_password", data, {
    
  });
};


// ==================== CUSTOMER FAVOURITES ====================

//  Get all favourite groups + products
// POST /{lang}/api/customer/favourites
// Token required
export const getCustomerFavourites = () => {
  return api.post("/customer/favourites");
};

//  Get only favourite groups
// POST /{lang}/api/customer/favoriteGroups
// Token required
export const getFavoriteGroups = () => {
  return api.post("/customer/favoriteGroups");
};

//  Add product to a favourite group
// POST /{lang}/api/customer/addProductToFavorite/{productId}
// Body: { group_id }
//  Token required
export const addProductToFavorite = (productId, groupId) => {
  return api.post(
    `/customer/addProductToFavorite/${productId}`,
    { group_id: groupId }
  );
};

// 🗂 Create new favourite group
// POST /{lang}/api/customer/createFavoriteGroup
// Body: { name }
//  Token required
export const createFavoriteGroup = (name) => {
  return api.post("/customer/createFavoriteGroup", { name });
};

// ✏️ Edit favourite group name
// POST /{lang}/api/customer/editFavoriteGroup/{groupId}
// Body: { name }
//  Token required
export const editFavoriteGroup = (groupId, name) => {
  return api.post(
    `/customer/editFavoriteGroup/${groupId}`,
    { name }
  );
};

// 🗑 Delete favourite group (and all products inside)
// DELETE /{lang}/api/customer/deleteFavoriteGroup/{groupId}
// Token required
export const deleteFavoriteGroup = (groupId) => {
  return api.delete(
    `/customer/deleteFavoriteGroup/${groupId}`
  );
};

// ❌ Remove product from favourites (normal favourite)
// DELETE /{lang}/api/customer/removeFromFavorite/{productId}
// Token required
export const removeFromFavorite = (productId) => {
  return api.delete(
    `/customer/removeFromFavorite/${productId}`
  );
};



// ==================== CUSTOMER FOLLOW UPS ====================

//  Get all companies followed by logged-in customer
// POST /{lang}/api/customer/follow_ups
//  Uses token (NO customerId needed)
export const getCustomerFollowUps = () => {
  return api.post("/customer/follow_ups");
};


//  Follow a company
// POST /{lang}/api/customer/addfollowCompany/{companyId}
//  Uses token
export const addFollowCompany = (companyId) => {
  return api.post(`/customer/addfollowCompany/${companyId}`);
};


//  Unfollow a company
// POST /{lang}/api/customer/unfollowCompany/{companyId}
//  Uses token
export const unfollowCompany = (companyId) => {
  return api.post(`/customer/unfollowCompany/${companyId}`);
};


// ==================== CUSTOMER REVIEWS ====================

// Get all reviews customer gave to companies
// POST /{lang}/api/customer/reviewsCompanies
// Body: { customerId }
export const getCustomerCompanyReviews = (customerId) => {
  return api.post("/customer/reviewsCompanies", {
    customerId,
  });
};

//  Get all reviews customer gave to products
// POST /{lang}/api/customer/reviewsProducts
// Body: { customerId }
export const getCustomerProductReviews = (customerId) => {
  return api.post("/customer/reviewsProducts", {
    customerId,
  });
};

//  Get customer pending review requests (Dashboard)
// POST /{lang}/api/customer/customerPendingReviews
// Body: { customerId }
export const getCustomerPendingReviews = (customerId) => {
  return api.post("/customer/customerPendingReviews", {
    customerId,
  });
};

//  Add review to a company
// POST /{lang}/api/customer/addReviewCompany/{companyId}
export const addCompanyReview = (
  companyId,
  rating,
  comment,
  service_name
) => {
  return api.post(`/customer/addReviewCompany/${companyId}`, {
    rating,
    comment,
    service_name,
  });
};





//  Add review to a product
// POST /{lang}/api/customer/addReviewProduct/{productId}
// Body: { rating, comment }
export const addProductReview = (productId, rating, comment) => {
  return api.post(`/customer/addReviewProduct/${productId}`, {
    rating,
    comment,
  });
};

//  Edit review (company or product)
// PUT /{lang}/api/customer/editreview/{reviewId}
// Body: { rating, comment }
export const editReview = (reviewId, rating, comment) => {
  return api.put(`/customer/editreview/${reviewId}`, {
    rating,
    comment,
  });
};

// 🗑 Delete review (company or product)
// DELETE /{lang}/api/customer/deletereview/{reviewId}
export const deleteReview = (reviewId) => {
  return api.delete(`/customer/deletereview/${reviewId}`);
};




// ==================== CUSTOMER CONVERSATIONS ====================

//  Get all conversations
// GET /{lang}/api/customer/conversations
export const getCustomerConversations = () => {
  return api.get("/customer/conversations");
};

// ➕ Create new conversation / group
// POST /{lang}/api/customer/conversations
export const createCustomerConversation = (data) => {
  return api.post("/customer/conversations", data);
};

//  Get single conversation messages
// GET /{lang}/api/customer/conversations/{conversationId}
export const getCustomerConversation = (conversationId) => {
  return api.get(`/customer/conversations/${conversationId}`);
};

//  Send message
export const sendCustomerMessage = (conversationId, formData) => {
  return api.post(
    `/customer/conversations/${conversationId}/messages`,
    formData,
    {
      headers: {
        Accept: "application/json",
        // ❌ DO NOT set Content-Type here
      },

      // 🔥 This is enough
      transformRequest: (data) => data,
    }
  );
};



//  Typing indicator
// POST /{lang}/api/customer/conversations/{conversationId}/typing
export const sendCustomerTyping = (conversationId, isTyping = true) => {
  return api.post(
    `/customer/conversations/${conversationId}/typing`,
    { is_typing: isTyping }
  );
};

//  Mark messages as read
// POST /{lang}/api/customer/conversations/{conversationId}/read
export const markCustomerConversationRead = (conversationId) => {
  return api.post(
    `/customer/conversations/${conversationId}/read`
  );
};



    

// ==================== CUSTOMER NOTIFICATIONS ====================

// Get all notifications for logged-in customer
// GET /{lang}/api/customer/notifications
// Token required (handled by interceptor)
export const getCustomerNotifications = (page = 1) => {
  return api.get(`/customer/notifications?page=${page}`);
};






// ==================== COMPANY REVIEWS (PUBLIC) ====================

// ✅ Get all reviews for a company (public – no token required)
// POST /{lang}/api/ShowCompanyReviews/{companyId}/customer
export const getCompanyReviewsPublic = (companyId) => {
  return api.post(`/ShowCompanyReviews/${companyId}/customer`);
};





// ==================== COMPANY AUTH ====================

export const loginCompany = (email, password) =>
  api.post("/company/login", { email, password });

export const registerCompany = (data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject(new Error("Unauthorized: Token required"));
  }

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  return api.post("/company/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // 🔒 FORCE TOKEN
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
          
          );
        }
      }
    }
  });
};

// ==================== company PRODUCT MANAGEMENT ====================

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