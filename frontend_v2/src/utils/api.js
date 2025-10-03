// API utility functions
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api/v1';

// Token management
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    console.log('Token found and added to headers:', token.substring(0, 20) + '...');
  } else {
    console.log('No token found in localStorage');
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Remove Content-Type for FormData to let browser set it automatically
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    console.log('API Request:', { url, config });
    console.log('Request headers:', config.headers);
    console.log('Request body type:', typeof config.body);
    if (config.body instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of config.body.entries()) {
        console.log(`  ${key}:`, value);
      }
    } else {
      console.log('Request body:', config.body);
    }
    const response = await fetch(url, config);
    console.log('API Response:', { status: response.status, ok: response.ok });
    
    if (!response.ok) {
      // If 401 error, try to refresh token
      if (response.status === 401 && token) {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken })
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem('auth_token', refreshData.access);
              
              // Retry the original request with new token
              const newConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  'Authorization': `Bearer ${refreshData.access}`
                }
              };
              
              const retryResponse = await fetch(url, newConfig);
              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
          }
          
          // Refresh failed, redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
      
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }
    
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
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
  post: (endpoint, data, options = {}) => {
    const requestOptions = {
      ...options,
      method: 'POST',
    };
    
    // If data is FormData, don't stringify it
    if (data instanceof FormData) {
      requestOptions.body = data;
      // Remove Content-Type header for FormData
      if (requestOptions.headers) {
        delete requestOptions.headers['Content-Type'];
      }
    } else {
      requestOptions.body = JSON.stringify(data);
    }
    
    return apiRequest(endpoint, requestOptions);
  },
  
  // PUT request
  put: (endpoint, data, options = {}) => {
    const requestOptions = {
      ...options,
      method: 'PUT',
    };
    
    // If data is FormData, don't stringify it
    if (data instanceof FormData) {
      requestOptions.body = data;
      // Remove Content-Type header for FormData
      if (requestOptions.headers) {
        delete requestOptions.headers['Content-Type'];
      }
    } else {
      requestOptions.body = JSON.stringify(data);
    }
    
    return apiRequest(endpoint, requestOptions);
  },
  
  // DELETE request
  delete: (endpoint, options = {}) => {
    const requestOptions = { ...options, method: 'DELETE' };
    
    // If data is provided, add it to the body
    if (options.data) {
      requestOptions.body = JSON.stringify(options.data);
    }
    
    return apiRequest(endpoint, requestOptions);
  },
  
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
    list: '/documents/',
    create: '/documents/',
    detail: (id) => `/documents/${id}/`,
    update: (id) => `/documents/${id}/`,
    delete: (id) => `/documents/${id}/`,
    download: (id) => `/documents/${id}/download/`,
    verify: (id) => `/documents/${id}/verify/`,
    share: (id) => `/documents/${id}/share/`,
    myDocuments: '/documents/my-documents/',
    orderDocuments: (orderId) => `/documents/order-documents/${orderId}/`,
    companyDocuments: (companyId) => `/documents/company-documents/${companyId}/`,
    search: '/documents/search/',
    sharedWithMe: '/documents/shared-with-me/',
    sharedByMe: '/documents/shared-by-me/',
  },
};

export default api;
