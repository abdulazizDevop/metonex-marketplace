// API utility functions
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API object with common methods
export const api = {
  // GET request
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  // POST request
  post: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // PUT request
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // DELETE request
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
  
  // PATCH request
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  // File upload request (FormData)
  upload: (endpoint, formData, options = {}) => {
    const uploadOptions = {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...options.headers,
      },
    };
    // Remove Content-Type header for FormData
    delete uploadOptions.headers['Content-Type'];
    
    return apiRequest(endpoint, uploadOptions);
  },
};

// Specific API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    logout: '/auth/logout/',
    refresh: '/auth/refresh/',
  },
  
  // User management
  users: {
    profile: '/users/profile/',
    updateProfile: '/users/profile/',
  },
  
  // RFQ (Request for Quotation)
  rfq: {
    list: '/rfq/',
    create: '/rfq/',
    detail: (id) => `/rfq/${id}/`,
    update: (id) => `/rfq/${id}/`,
    delete: (id) => `/rfq/${id}/`,
  },
  
  // Offers
  offers: {
    list: '/offers/',
    create: '/offers/',
    detail: (id) => `/offers/${id}/`,
    update: (id) => `/offers/${id}/`,
    delete: (id) => `/offers/${id}/`,
    accept: (id) => `/offers/${id}/accept/`,
    decline: (id) => `/offers/${id}/decline/`,
  },
  
  // Orders
  orders: {
    list: '/orders/',
    create: '/orders/',
    detail: (id) => `/orders/${id}/`,
    update: (id) => `/orders/${id}/`,
    delete: (id) => `/orders/${id}/`,
    confirm: (id) => `/orders/${id}/confirm/`,
    cancel: (id) => `/orders/${id}/cancel/`,
  },
  
  // Companies
  companies: {
    list: '/companies/',
    create: '/companies/',
    detail: (id) => `/companies/${id}/`,
    update: (id) => `/companies/${id}/`,
    delete: (id) => `/companies/${id}/`,
  },
  
  // Items/Products
  items: {
    list: '/items/',
    create: '/items/',
    detail: (id) => `/items/${id}/`,
    update: (id) => `/items/${id}/`,
    delete: (id) => `/items/${id}/`,
  },
  
  // Notifications
  notifications: {
    list: '/notifications/',
    markRead: (id) => `/notifications/${id}/mark-read/`,
    markAllRead: '/notifications/mark-all-read/',
  },
  
  // Ratings
  ratings: {
    list: '/ratings/',
    create: '/ratings/',
    detail: (id) => `/ratings/${id}/`,
    update: (id) => `/ratings/${id}/`,
    delete: (id) => `/ratings/${id}/`,
  },
  
  // Documents
  documents: {
    list: '/v1/documents/',
    create: '/v1/documents/',
    detail: (id) => `/v1/documents/${id}/`,
    update: (id) => `/v1/documents/${id}/`,
    delete: (id) => `/v1/documents/${id}/`,
    download: (id) => `/v1/documents/${id}/download/`,
    verify: (id) => `/v1/documents/${id}/verify/`,
    share: (id) => `/v1/documents/${id}/share/`,
    myDocuments: '/v1/documents/my-documents/',
    orderDocuments: (orderId) => `/v1/documents/order-documents/${orderId}/`,
    companyDocuments: (companyId) => `/v1/documents/company-documents/${companyId}/`,
    search: '/v1/documents/search/',
    sharedWithMe: '/v1/documents/shared-with-me/',
    sharedByMe: '/v1/documents/shared-by-me/',
  },
};

export default api;
