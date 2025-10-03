// User API service
import { api } from './api.js';

export const userApi = {
  // Get user profile
  getProfile: async () => {
    try {
      console.log('Getting user profile...');
      const response = await api.get('/auth/profile/');
      console.log('Profile response:', response);
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

  // Register seller
  registerSeller: async (registrationData) => {
    try {
      console.log('Registering seller...', registrationData);
      const response = await api.post('/auth/register/', registrationData);
      console.log('Seller registration response:', response);
      return response;
    } catch (error) {
      console.error('Seller ro\'yxatdan o\'tishda xatolik:', error);
      throw error;
    }
  },

  // Get user company
  getCompany: async () => {
    try {
      console.log('Getting company data...');
      const response = await api.get('/companies/my-company/');
      console.log('Company response:', response);
      return response;
    } catch (error) {
      console.error('Company ma\'lumotlarini olishda xatolik:', error);
      throw error;
    }
  },

  // Update user company
  updateCompany: async (companyData) => {
    try {
      const response = await api.put('/companies/profile/', companyData);
      return response;
    } catch (error) {
      console.error('Company yangilashda xatolik:', error);
      throw error;
    }
  },

  // Get user orders
  getOrders: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = queryParams ? `/orders/my_orders/?${queryParams}` : '/orders/my_orders/';
      console.log('Getting orders from:', endpoint);
      const response = await api.get(endpoint);
      console.log('Orders response:', response);
      return response;
    } catch (error) {
      console.error('Buyurtmalarni olishda xatolik:', error);
      throw error;
    }
  },

  // Get user metrics/analytics
  getMetrics: async () => {
    try {
      const response = await api.get('/users/metrics/');
      return response;
    } catch (error) {
      console.error('Metrikalarni olishda xatolik:', error);
      throw error;
    }
  },

  // Get user analytics (financial data) - using profile endpoint
  getAnalytics: async () => {
    try {
      // Get user profile data
      const response = await api.get('/auth/profile/');
      const userData = response;
      
      // Calculate analytics from available data
      const analytics = {
        total_spent: userData.total_spent || 0,
        pending_payments: userData.pending_payments || 0,
        avg_order_value: userData.avg_order_value || 0,
        total_orders: userData.total_orders || 0,
        spending_by_category: userData.spending_by_category || {},
        spending_by_supplier: userData.spending_by_supplier || {},
        top_supplier: userData.top_supplier || null,
        last_purchase: userData.last_purchase || null
      };
      
      return analytics;
    } catch (error) {
      console.error('Analitika ma\'lumotlarini olishda xatolik:', error);
      // Return default analytics if error
      return {
        total_spent: 0,
        pending_payments: 0,
        avg_order_value: 0,
        total_orders: 0,
        spending_by_category: {},
        spending_by_supplier: {},
        top_supplier: null,
        last_purchase: null
      };
    }
  },

  // Get user team members - from members endpoint
  getTeamMembers: async () => {
    try {
      const response = await api.get('/company-members/my_company_members/');
      return response.members || [];
    } catch (error) {
      console.error('Jamoa a\'zolarini olishda xatolik:', error);
      return [];
    }
  },

  // Add team member - using company-members endpoint
  addTeamMember: async (memberData) => {
    try {
      const response = await api.post('/company-members/add-member/', memberData);
      return response;
    } catch (error) {
      console.error('Jamoa a\'zosini qo\'shishda xatolik:', error);
      throw error;
    }
  },

  // Update team member - using company-members endpoint
  updateTeamMember: async (memberId, memberData) => {
    try {
      const response = await api.put(`/company-members/${memberId}/update-member/`, memberData);
      return response;
    } catch (error) {
      console.error('Jamoa a\'zosini yangilashda xatolik:', error);
      throw error;
    }
  },

  // Delete team member - using company-members endpoint
  deleteTeamMember: async (memberId) => {
    try {
      const response = await api.delete(`/company-members/${memberId}/remove-member/`);
      return response;
    } catch (error) {
      console.error('Jamoa a\'zosini o\'chirishda xatolik:', error);
      throw error;
    }
  },

  // Company Documents API
  getCompanyDocuments: async () => {
    try {
      const response = await api.get('/companies/documents/');
      return response;
    } catch (error) {
      console.error('Kompaniya hujjatlarini olishda xatolik:', error);
      throw error;
    }
  },

  uploadCompanyDocument: async (formData) => {
    try {
      const response = await api.post('/companies/documents/', formData);
      return response;
    } catch (error) {
      console.error('Hujjat yuklashda xatolik:', error);
      throw error;
    }
  },

  updateCompanyDocument: async (documentId, formData) => {
    try {
      // The backend expects the ID in the form data for PUT, not in the URL
      formData.append('id', documentId); 
      const response = await api.put('/companies/documents/', formData);
      return response;
    } catch (error) {
      console.error('Hujjat yangilashda xatolik:', error);
      throw error;
    }
  },

  deleteCompanyDocument: async (documentId) => {
    try {
      const response = await api.delete('/companies/documents/', {
        data: { id: documentId } // Send ID in request body for DELETE
      });
      return response;
    } catch (error) {
      console.error('Hujjat o\'chirishda xatolik:', error);
      throw error;
    }
  },

  // ==================== ORDER API ====================
  
  // Get user's orders (buyer orders)
  getOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/orders/my_orders/?${queryString}` : '/orders/my_orders/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Buyurtmalarni olishda xatolik:', error);
      throw error;
    }
  },

  // Get specific order details
  getOrderDetail: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/`);
      return response;
    } catch (error) {
      console.error('Buyurtma tafsilotlarini olishda xatolik:', error);
      throw error;
    }
  },

  // Get user's RFQs (requests for quotation)
  getRFQs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/rfqs/my_rfqs/?${queryString}` : '/rfqs/my_rfqs/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('RFQ larni olishda xatolik:', error);
      throw error;
    }
  },

  // Get offers for user's RFQs
  getOffers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/offers/my_offers/?${queryString}` : '/offers/my_offers/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Takliflarni olishda xatolik:', error);
      throw error;
    }
  },

  // Accept an offer (creates an order)
  acceptOffer: async (offerId, orderData) => {
    try {
      const response = await api.post(`/offers/${offerId}/accept/`, orderData);
      return response;
    } catch (error) {
      console.error('Taklifni qabul qilishda xatolik:', error);
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel/`, { reason });
      return response;
    } catch (error) {
      console.error('Buyurtmani bekor qilishda xatolik:', error);
      throw error;
    }
  },

  // Get order documents
  getOrderDocuments: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/documents/`);
      return response;
    } catch (error) {
      console.error('Buyurtma hujjatlarini olishda xatolik:', error);
      throw error;
    }
  },

  // Upload order document
  uploadOrderDocument: async (orderId, formData) => {
    try {
      const response = await api.upload(`/orders/${orderId}/documents/`, formData);
      return response;
    } catch (error) {
      console.error('Buyurtma hujjatini yuklashda xatolik:', error);
      throw error;
    }
  },

  // Delete order document
  deleteOrderDocument: async (orderId, documentId) => {
    try {
      const response = await api.delete(`/orders/${orderId}/documents/`, {
        data: { id: documentId }
      });
      return response;
    } catch (error) {
      console.error('Buyurtma hujjatini o\'chirishda xatolik:', error);
      throw error;
    }
  },

  // ==================== CATEGORIES & METADATA API ====================
  
  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get('/catalog/categories/');
      return response;
    } catch (error) {
      console.error('Kategoriyalarni olishda xatolik:', error);
      throw error;
    }
  },

  // Get products
  getProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/products/?${queryString}` : '/products/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Mahsulotlarni olishda xatolik:', error);
      throw error;
    }
  },

  // ==================== SELLER REGISTRATION API ====================
  
  // Complete seller registration
  registerSeller: async (registrationData) => {
    try {
      const response = await api.post('/auth/register/', registrationData);
      return response;
    } catch (error) {
      console.error('Seller registratsiyasida xatolik:', error);
      throw error;
    }
  },

  // Save dealer factory information
  saveDealerFactories: async (factories) => {
    try {
      const response = await api.post('/companies/dealer-factories/', { factories });
      return response;
    } catch (error) {
      console.error('Dealer zavodlarini saqlashda xatolik:', error);
      throw error;
    }
  },

  // ==================== SELLER DASHBOARD API ====================
  // Get seller statistics
  getSellerStats: async () => {
    try {
      const response = await api.get('/users/stats/');
      return response;
    } catch (error) {
      console.error('Seller statistikasini olishda xatolik:', error);
      // Return default stats for error cases
      if (error.status === 404 || error.status === 403) {
        console.warn('Stats topilmadi, standart ma\'lumotlar qaytarilmoqda');
        return {
          user_id: null,
          role: 'buyer',
          total_products: 0,
          total_rfqs: 0,
          total_offers: 0,
          total_orders_as_supplier: 0,
          profile_completion: 0,
          company_info: {}
        };
      }
      throw error;
    }
  },

  // Get seller products
  getSellerProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/products/my_products/?${queryString}` : '/products/my_products/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Seller mahsulotlarini olishda xatolik:', error);
      // Return empty array for seller products if error
      if (error.status === 403) {
        console.warn('Foydalanuvchi seller emas yoki ruxsat yo\'q');
        return { results: [] };
      }
      throw error;
    }
  },

  // Get seller orders (as supplier)
  getSellerOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/orders/my_supplier_orders/?${queryString}` : '/orders/my_supplier_orders/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Seller buyurtmalarini olishda xatolik:', error);
      // Return empty array for seller orders if error
      if (error.status === 404 || error.status === 403) {
        console.warn('Seller buyurtmalari topilmadi yoki ruxsat yo\'q');
        return { results: [] };
      }
      throw error;
    }
  },

  // Get seller offers
  getSellerOffers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/offers/my_offers/?${queryString}` : '/offers/my_offers/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Seller takliflarini olishda xatolik:', error);
      throw error;
    }
  },

  // Get available RFQ for seller (all active RFQs)
  getAvailableRFQs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/rfqs/active/?${queryString}` : '/rfqs/active/';
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Available RFQ-larni olishda xatolik:', error);
      // Return empty array for RFQs if error
      if (error.status === 404 || error.status === 403) {
        console.warn('Available RFQ-lar topilmadi yoki ruxsat yo\'q');
        return [];
      }
      throw error;
    }
  },

  // Get order statuses
  getOrderStatuses: async () => {
    try {
      const response = await api.get('/orders/statuses/');
      return response;
    } catch (error) {
      console.error('Order statuslarini olishda xatolik:', error);
      throw error;
    }
  },

  // Get RFQ statuses  
  getRFQStatuses: async () => {
    try {
      const response = await api.get('/rfqs/statuses/');
      return response;
    } catch (error) {
      console.error('RFQ statuslarini olishda xatolik:', error);
      throw error;
    }
  },

  // Get offer statuses
  getOfferStatuses: async () => {
    try {
      const response = await api.get('/offers/statuses/');
      return response;
    } catch (error) {
      console.error('Offer statuslarini olishda xatolik:', error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      // Prepare FormData for file uploads
      const formData = new FormData();
      
      // Add basic fields
      Object.keys(productData).forEach(key => {
        if (key === 'photos' || key === 'certificates') {
          // Handle file arrays
          if (productData[key] && productData[key].length > 0) {
            productData[key].forEach((file, index) => {
              if (file) {
                formData.append(`${key}[${index}]`, file);
              }
            });
          }
        } else if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      console.log('Creating product with data:', productData);
      console.log('FormData entries:', Array.from(formData.entries()));

      const response = await api.post('/products/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Mahsulot yaratishda xatolik:', error);
      throw error;
    }
  },

  // Get units list - category based
  getUnits: async (categoryId = null) => {
    try {
      let url = '/catalog/units/';
      
      if (categoryId) {
        // Kategoriya asosida mavjud units olish
        url = `/catalog/categories/${categoryId}/available_units/`;
      }
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error('Birliklarni olishda xatolik:', error);
      // Return default units if error
      return [
        { id: 1, name: 'Kilogram', symbol: 'kg', unit_type: 'weight' },
        { id: 2, name: 'Ton', symbol: 'ton', unit_type: 'weight' },
        { id: 3, name: 'Piece', symbol: 'pcs', unit_type: 'piece' },
        { id: 4, name: 'Meter', symbol: 'm', unit_type: 'length' },
        { id: 5, name: 'Liter', symbol: 'L', unit_type: 'volume' }
      ];
    }
  },

  // Get factories list for current supplier
  getFactories: async () => {
    try {
      const response = await api.get('/companies/factories/');
      return response;
    } catch (error) {
      console.error('Zavodlarni olishda xatolik:', error);
      return [];
    }
  },
};

export default userApi;
