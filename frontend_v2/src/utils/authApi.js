// Authentication API service
import { api, endpoints } from './api.js';

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  // Get stored token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  // Get stored refresh token
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  // Set tokens
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  
  // Clear tokens
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  }
};

// Auth API service
export const authApi = {
  // Send SMS code
  sendSMS: async (phone) => {
    try {
      const response = await api.post('/auth/send-sms/', { phone });
      return response;
    } catch (error) {
      console.error('SMS yuborishda xatolik:', error);
      throw error;
    }
  },

  // Verify SMS code
  verifySMS: async (phone, code) => {
    try {
      const response = await api.post('/auth/verify-sms/', { phone, code });
      return response;
    } catch (error) {
      console.error('SMS tasdiqlashda xatolik:', error);
      throw error;
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      
      // Save tokens if provided
      if (response.access && response.refresh) {
        tokenManager.setTokens(response.access, response.refresh);
      }
      
      return response;
    } catch (error) {
      console.error('Ro\'yxatdan o\'tishda xatolik:', error);
      throw error;
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      
      // Save tokens
      if (response.access && response.refresh) {
        tokenManager.setTokens(response.access, response.refresh);
      }
      
      return response;
    } catch (error) {
      console.error('Kirishda xatolik:', error);
      throw error;
    }
  },

  // User logout
  logout: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Chiqishda xatolik:', error);
    } finally {
      // Clear tokens regardless of API call success
      tokenManager.clearTokens();
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await api.post('/auth/token/refresh/', { 
        refresh: refreshToken 
      });
      
      if (response.access) {
        tokenManager.setTokens(response.access, refreshToken);
        return response.access;
      }
      
      throw new Error('No access token in response');
    } catch (error) {
      console.error('Token yangilashda xatolik:', error);
      tokenManager.clearTokens();
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile/');
      return response;
    } catch (error) {
      console.error('Profil olishda xatolik:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile/', profileData);
      return response;
    } catch (error) {
      console.error('Profil yangilashda xatolik:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password/', passwordData);
      return response;
    } catch (error) {
      console.error('Parol o\'zgartirishda xatolik:', error);
      throw error;
    }
  },

  // Send password change code
  sendPasswordChangeCode: async (phone) => {
    try {
      const response = await api.post('/auth/send-password-change-code/', { phone });
      return response;
    } catch (error) {
      console.error('Parol o\'zgartirish kodi yuborishda xatolik:', error);
      throw error;
    }
  },

  // Verify phone
  verifyPhone: async (phone, code) => {
    try {
      const response = await api.post('/auth/verify-phone/', { phone, code });
      return response;
    } catch (error) {
      console.error('Telefon tasdiqlashda xatolik:', error);
      throw error;
    }
  }
};

// API interceptor for automatic token refresh
export const setupApiInterceptor = () => {
  // Override the original apiRequest function to include token
  const originalApiRequest = window.apiRequest;
  
  window.apiRequest = async (endpoint, options = {}) => {
    const token = tokenManager.getToken();
    
    // Add authorization header if token exists
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    try {
      return await originalApiRequest(endpoint, options);
    } catch (error) {
      // If 401 error, try to refresh token
      if (error.status === 401 && token) {
        try {
          await authApi.refreshToken();
          // Retry the original request with new token
          const newToken = tokenManager.getToken();
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          };
          return await originalApiRequest(endpoint, options);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/login';
          throw refreshError;
        }
      }
      throw error;
    }
  };
};

export default authApi;
