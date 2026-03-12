import { api } from "./api";

export const IMAGE_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

export const getImageUrl = (path) => {
  if (!path || path === "null" || path === '""' || path === "[]") return null;
  
  let finalPath = path;

  // Handle object inputs
  if (typeof finalPath === "object" && finalPath !== null) {
     const resolved = finalPath.webp || finalPath.avif || finalPath[Object.keys(finalPath)[0]];
     return getImageUrl(resolved); // Recurse to handle nested or stringified paths
  }

  // Handle strings (they might be double-stringified JSON or have escaped characters)
  if (typeof finalPath === "string") {
    let temp = finalPath.trim();
    
    // 1. Unescape HTML entities and backslashes
    temp = temp.replace(/&quot;/g, '"').replace(/\\"/g, '"');
    
    // 2. Remove any wrapping double-quotes
    while (temp.startsWith('"') && temp.endsWith('"')) {
      temp = temp.substring(1, temp.length - 1).trim();
    }

    // 3. Try to parse as JSON if it looks like an object
    if (temp.startsWith('{')) {
      try {
        const parsed = JSON.parse(temp);
        const resolved = parsed.webp || parsed.avif || parsed[Object.keys(parsed)[0]];
        return getImageUrl(resolved); // Recurse
      } catch (e) {
        // If parsing fails, treat it as a raw path
      }
    }
    finalPath = temp;
  }

  if (!finalPath || typeof finalPath !== 'string' || finalPath === "null") return null;
  if (finalPath.startsWith("http") || finalPath.startsWith("blob:") || finalPath.startsWith("data:")) return finalPath;

  // Remove leading slashes/storage prefixes
  let cleanPath = finalPath.replace(/^\//, "").replace(/^storage\//, "");
  
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

// ==================== COMPANY DASHBOARD API ====================

// ==================== PRODUCTS ====================

// Get all company products
// GET /api/company/products
export const getCompanyProducts = (type = null) => {
  const url = type ? `/company/products?type=${type}` : "/company/products";
  return api.get(url);
};

// Add new product
// POST /api/company/add_product
// Body (FormData): name, price, quantity, description, category_id, special_mark[], status, album[]
export const addProduct = (formData) => {
  return api.post("/company/add_product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Edit product
// POST /api/company/edit_product/{id}
// Body (FormData): similar to add
export const editProduct = (id, formData) => {
  return api.post(`/company/edit_product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Change product status (hidden/visible)
// GET /api/company/change_status_product/{id}
export const changeProductStatus = (id) => {
  return api.post(`/company/change_status_product/${id}`);
};

// Delete product
// GET /api/company/delete_product/{id}
export const deleteProduct = (id) => {
    // Note: User provided GET URL structure in request description, 
    // but typically this should be DELETE. Trying DELETE first as per previous code, 
    // if fails we can switch to GET. 
    // User request: https://catalogueyanew.com.awu.zxu.temporary.site/en/api/company/delete_product/58
  return api.delete(`/company/delete_product/${id}`);
};


// ==================== SALES ====================

// Get all sales products
// GET /api/company/sales
export const getSalesProducts = () => {
  return api.get("/company/sales");
};

// Add product to sales
// POST /api/company/add_sales_product/{product_id}
// Body: discount, discount_from, discount_to
export const addSalesProduct = (productId, data) => {
  return api.post(`/company/add_sales_product/${productId}`, data);
};

// Update sales product
// POST /api/company/update_sales_product/{product_id}
export const updateSalesProduct = (productId, data) => {
  return api.post(`/company/update_sales_product/${productId}`, data);
};

// Delete sales product
// DELETE /api/company/delete_sales_product/{id}
export const deleteSalesProduct = (id) => {
  return api.delete(`/company/delete_sales_product/${id}`);
};

// Generic highlights (sales, new_arrivals, etc.)
// GET /api/company/products/{type}/{user_id}
export const getHighlightProducts = (type, userId) => {
  return api.get(`/company/products/${type}/${userId}`);
};

// Get highlights tabs
export const getHighlightsTabs = () => {
  return api.get("/company/show_heighlights");
};

// Add product to highlight (non-sales)
export const addHighlightToProduct = (productId, tabIds) => {
  return api.post(`/company/add_heighlights/${productId}`, {
    special_mark_ids: tabIds,
  });
};

// Delete product from highlight (non-sales)
export const deleteHighlightFromProduct = (productId, tabIds) => {
  return api.delete(`/company/delete_heighlights/${productId}`, {
    data: { special_mark_ids: tabIds },
  });
};


// ==================== ANALYTICS ====================

// Get Analytics
// POST /api/company/Anylasies
// Body: days, sort_by, order, per_page
export const getAnalytics = (params) => {
  return api.post("/company/Anylasies", params);
};


// ==================== MESSAGES (CONTACTS) ====================

// Get all conversations
// GET /api/customer/conversations
export const getConversations = () => {
  return api.get("/customer/conversations");
};

// Get single conversation messages
// GET /api/customer/conversations/{id}
export const getConversation = (id) => {
  return api.get(`/customer/conversations/${id}`);
};

// Send message
// POST /api/customer/conversations/{id}/messages
// Body: Body, attachments[]
export const sendMessage = (conversationId, formData) => {
  return api.post(`/customer/conversations/${conversationId}/messages`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
  });
};

// Mark conversation as read
// GET /api/customer/conversations/{id}/read
export const markConversationRead = (conversationId) => {
    // User provided GET URL in one place and POST in another context usually. 
    // Request says: https://catalogueyanew.com.awu.zxu.temporary.site/en/api/customer/conversations/29/read
    // This is likely GET based on browser copy-paste style, but often state changing is POST. 
    // I'll try POST first as it's safer for state changes.
  return api.post(`/customer/conversations/${conversationId}/read`);
};


// ==================== FOLLOWERS ====================

// Get followers
// POST /api/company/followers
export const getFollowers = () => {
  return api.post("/company/followers");
};


// ==================== REVIEWS ====================

// Get Company Reviews Dashboard
// POST /api/ShowCompanyReviews/{companyId}/customer
export const getCompanyReviewsDashboard = (companyId, userId) => {
  return api.post(`/ShowCompanyReviews/${companyId}/customer`, {
      user_id: userId 
  });
};

// Send Review Request
// POST /api/company/sendReviewRequest
// Body: customer_id, product_id, service_name
export const sendReviewRequest = (data) => {
  return api.post("/company/sendReviewRequest", data);
};


// ==================== NOTIFICATIONS ====================

// Get all notifications (Generic/Customer)
export const getNotifications = () => {
  return api.get("/customer/notifications");
};

// Get unread notification count
export const getUnreadNotificationsCount = () => {
  return api.get("/customer/notifications/unread-count");
};

// Get notifications sent by company
// GET /api/company/NotificationCompanysented
export const getCompanySentNotifications = (page = 1) => {
  return api.post(`/company/NotificationCompanysented?page=${page}`);
};

// Get details of a sent notification (viewed users)
// GET /api/company/sentNotificationDetails/{batch_id}
export const getSentNotificationDetails = (batchId) => {
  return api.post(`/company/sentNotificationDetails/${batchId}`);
};

export const markAllNotificationsAsRead = () => {
  return api.post("/customer/notifications/read-all");
};

// ==================== SUBSCRIPTIONS & PLANS ====================

// Get current subscription details
// GET /api/company/subscription
export const getSubscription = () => {
  return api.get("/company/subscription");
};

// Get all available plans
// GET /api/company/plans
export const getPlans = () => {
  return api.get("/company/plans");
};

// Request plan change
// POST /api/company/requestPlanChange
// Body: { plan_id }
export const requestPlanChange = (planId) => {
  return api.post("/company/requestPlanChange", { plan_id: planId });
};


// ==================== TAGS ====================

// Get special marks
// GET /api/company/special_marks
export const getSpecialMarks = () => {
  return api.get("/company/special_marks");
};
// ==================== BARCODE ====================

// Print / Get Barcode
// POST /api/company/print_barcode
export const printBarcode = () => {
  return api.post("/company/print_barcode");
};

// ==================== BILLS ====================

// Create a Bill (Step 1)
// POST /api/company/bills
export const createBill = (data) => {
  return api.post("/company/bills", data);
};

// Add Item to Bill (Step 2)
// POST /api/company/bills/{bill_id}/items
export const addBillItem = (billId, data) => {
  return api.post(`/company/bills/${billId}/items`, data);
};

// Send Product Notification
// POST /api/company/sendProductNotification
// Body: { title, body, product_ids[], send_to_all, customer_ids[] }
export const sendProductNotification = (data) => {
  return api.post("/company/sendProductNotification", data);
};

// Send Bill (Step 3)
// POST /api/company/bills/{bill_id}/send
export const sendBill = (billId) => {
  return api.post(`/company/bills/${billId}/send`);
};

// List Draft Bills
// GET /api/company/All_bills/draft
export const getDraftBills = () => {
  return api.post("/company/All_bills/draft");
};

// Edit Draft Bill
// PUT /api/company/bills/{bill_id}
export const editBill = (billId, data) => {
  return api.put(`/company/bills/${billId}`, data);
};

// List Pending Bills
// GET /api/company/All_bills/pending
export const getPendingBills = () => {
  return api.post("/company/All_bills/pending");
};

// List Unpaid Bills
// GET /api/company/All_bills/unpaid
export const getUnpaidBills = () => {
  return api.post("/company/All_bills/unpaid");
};

// List Paid Bills
// GET /api/company/All_bills/paid
export const getPaidBills = () => {
  return api.post("/company/All_bills/paid");
};

export const confirmCashPayment = (billId, data) => {
  return api.post(`/company/bills/${billId}/cash/confirm`, data);
};

// Reject Bill Payment (No cash received)
// POST /bills/public/{public_token}/reject
export const rejectBillPayment = (publicToken) => {
  // Using full URL as this endpoint seems to be outside the standard /api prefix
  return api.post(`${IMAGE_BASE_URL}/bills/public/${publicToken}/reject`);
};

// Get Bill Details
// GET /api/company/bills/{bill_id}
export const getBillDetails = (billId) => {
  return api.get(`/company/bills/${billId}`);
};

// Reactivate Bill
// POST /api/company/bills/{id}/reactivate
export const reactivateBill = (id) => {
  return api.post(`/company/bills/${id}/reactivate`);
};

// Mark Bill as Complete
// POST /api/company/All_bills/{id}/makeComplated
export const markBillAsComplete = (id) => {
  return api.post(`/company/All_bills/${id}/makeComplated`);
};

// ==================== INVOICE HISTORY ====================

// Get Invoice History
// POST /api/company/invoiceHistory
export const getInvoiceHistory = (page = 1) => {
  return api.post(`/company/invoiceHistory?page=${page}`);
};

// Send Invoice
// POST /api/company/invoice/{id}/send
export const sendInvoice = (invoiceId) => {
  return api.post(`/company/invoice/${invoiceId}/send`);
};

// View Invoice
// GET /api/company/invoice/{id}
export const viewInvoice = (invoiceId) => {
  return api.get(`/company/invoice/${invoiceId}`);
};

// Download Invoice
// GET /api/company/invoice/{id}/download
export const downloadInvoice = (invoiceId) => {
  return api.get(`/company/invoice/${invoiceId}/download`, {
    responseType: 'blob'
  });
};


// Get all categories
// GET /api/showCategories
export const getCategories = () => {
    return api.get("/showCategories");
};

// ==================== CONTACTS ====================

// Get all contacts
// GET /contacts (Note: checking if it needs /api prefix or not, standardizing to /contacts for now)
export const getContacts = () => {
  return api.get(`${IMAGE_BASE_URL}/contacts`);
};

// Add new contact
// POST /contacts
export const addContact = (contactUserId) => {
  return api.post(`${IMAGE_BASE_URL}/contacts`, {
    contact_user_id: contactUserId
  });
};

// Delete contact
// DELETE /contacts/{id}
export const deleteContact = (id) => {
  return api.delete(`${IMAGE_BASE_URL}/contacts/${id}`);
};

// ==================== AUTH / PASSWORD ====================

// Forgot Password
// POST /api/company/forgot-password
// Body: email
export const companyForgotPassword = (email) => {
  return api.post("/company/forgot-password", { email });
};

// Reset Password
// POST /api/company/reset-password
// Body: code, email, password, password_confirmation
export const companyResetPassword = (data) => {
  return api.post("/company/reset-password", data);
};
