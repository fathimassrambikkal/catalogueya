import { api } from "./api";

// Fetch all conversations for the company
// GET /api/customer/conversations
export const getCompanyConversations = () => {
  return api.get("/customer/conversations");
};

// Fetch messages for a specific conversation
// GET /api/customer/conversations/{conversationId}
export const getCompanyConversationMessages = (conversationId) => {
  return api.get(`/customer/conversations/${conversationId}`);
};

// Send a message in a conversation
// POST /api/customer/conversations/{conversationId}/messages
// Body: { body, attachments[] }
export const sendCompanyMessage = (conversationId, data) => {
  const formData = new FormData();
  
  // Append text body
  if (data.body) {
    formData.append("body", data.body);
  }

  // Append attachments
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });
  }

  return api.post(`/customer/conversations/${conversationId}/messages`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Mark conversation as read
// POST /api/customer/conversations/{conversationId}/read
export const markCompanyConversationRead = (conversationId) => {
  return api.post(`/customer/conversations/${conversationId}/read`);
};

// Fetch company dashboard reviews
// GET /api/company/dashboardCompanyReviews
export const getCompanyDashboardReviews = () => {
  return api.post("/company/dashboardCompanyReviews");
};

// ==================== COMPANY SETTINGS ====================

// Edit company profile
// POST /api/company/edit_company_post
export const editCompanyPost = (data) => {
  return api.post("/company/edit_company_post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Change company password
// POST /api/company/change_password
// Body: { customerId, old_password, new_password, new_password_confirmation }
export const changeCompanyPassword = (data) => {
  return api.post("/company/change_password", data);
};

// ==================== PRODUCT MANAGEMENT ====================

// Add product
// POST /api/company/add_product
export const addCompanyProduct = (data) => {
  return api.post("/company/add_product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Edit product
// POST /api/company/edit_product/{id}
export const editCompanyProduct = (id, data) => {
  return api.post(`/company/edit_product/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==================== SALES ====================

// Add product to sales
// POST /api/company/add_sales_product/{productId}
export const addSalesProduct = (productId, data) => {
  return api.post(`/company/add_sales_product/${productId}`, data);
};

// GET /api/company/sales
export const getCompanySales = () => {
  return api.get("/company/sales");
};

// ==================== ANALYTICS ====================

// POST /api/company/Anylasies
// Body: { company_id, filter }
export const getCompanyAnalytics = (data) => {
  return api.post("/company/Anylasies", data);
};

// ==================== REVIEWS ====================

// Send review request to customer
// POST /api/company/sendReviewRequest
// Body: { company_id, customer_id, product_id, service_name }
export const sendReviewRequest = (data) => {
  return api.post("/company/sendReviewRequest", data);
};

// ==================== BARCODE ====================

// Get company QR barcode
// POST /api/company/print_barcode
export const getCompanyBarcode = () => {
  return api.post("/company/print_barcode");
};

// ==================== SPECIAL MARKS / TAGS ====================

// Get all special marks (Tags)
// GET /api/company/special_marks
export const getSpecialMarks = () => {
  return api.get("/company/special_marks");
};
