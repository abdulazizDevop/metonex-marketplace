import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://*.pythonanywhere.com/api/v1'

function authHeaders() {
  const access = localStorage.getItem('access')
  return access ? { Authorization: `Bearer ${access}` } : {}
}

// Token refresh funksiyasi
export async function refreshToken() {
  try {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) {
      throw new Error('Refresh token yo\'q')
    }

    const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
      refresh: refresh
    })

    if (response.data.access) {
      localStorage.setItem('access', response.data.access)
      if (response.data.refresh) {
        localStorage.setItem('refresh', response.data.refresh)
      }
      return response.data.access
    }
    throw new Error('Token refresh muvaffaqiyatsiz')
  } catch (error) {
    // Refresh token ham tugagan bo'lsa, barcha tokenlarni o'chirib, login sahifasiga yo'naltiramiz
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user_role')
    localStorage.removeItem('has_company')
    throw error
  }
}

// Token yaroqliligini tekshirish
export function isTokenValid() {
  const access = localStorage.getItem('access')
  const refresh = localStorage.getItem('refresh')
  
  if (!access || !refresh) {
    return false
  }

  try {
    // JWT token'ni decode qilib, expire vaqtini tekshiramiz
    const payload = JSON.parse(atob(access.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    
    // Access token hali yaroqli bo'lsa
    if (payload.exp > now) {
      return true
    }
    
    // Access token tugagan, lekin refresh token hali yaroqli bo'lsa
    const refreshPayload = JSON.parse(atob(refresh.split('.')[1]))
    return refreshPayload.exp > now
  } catch (error) {
    return false
  }
}

export const api = axios.create({ baseURL: API_URL })

// 401 interceptor va oddiy toast
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // Avval token refresh qilib ko'ramiz
      try {
        await refreshToken()
        // Token refresh muvaffaqiyatli bo'lsa, asl so'rovni qayta yuboramiz
        const originalRequest = error.config
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('access')}`
        return api(originalRequest)
      } catch (refreshError) {
        // Token refresh muvaffaqiyatsiz bo'lsa, login sahifasiga yo'naltiramiz
        try { window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: 'Sessiya tugagan. Qayta kiring.' } })) } catch {}
        localStorage.removeItem('access'); localStorage.removeItem('refresh')
        localStorage.removeItem('user_role'); localStorage.removeItem('has_company')
        if (location.pathname !== '/login') location.href = '/login'
      }
    } else if (status >= 500) {
      try { window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: 'Server xatosi. Keyinroq urinib ko\'ring.' } })) } catch {}
    }
    return Promise.reject(error)
  }
)


// User status'ni tekshirish va redirect qilish
export async function checkUserStatusAndRedirect() {
  try {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    
    if (!access || !refresh) {
      return { shouldRedirect: true, target: '/login' }
    }

    // Token yaroqliligini tekshiramiz
    if (!isTokenValid()) {
      return { shouldRedirect: true, target: '/login' }
    }

    // Token refresh qilib ko'ramiz
    try {
      await refreshToken()
    } catch (error) {
      // Refresh token ham tugagan bo'lsa, login sahifasiga yo'naltiramiz
      return { shouldRedirect: true, target: '/login' }
    }

    // User rolini tekshiramiz
    try {
      const { data } = await axios.get(`${API_URL}/companies/my_status/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      // Cache ga saqlaymiz
      localStorage.setItem('user_role', String(data?.user_role || ''))
      localStorage.setItem('has_company', data?.has_company ? '1' : '0')

      let target = '/'
      if (data?.has_company === false) {
        target = '/company-setup'
      } else {
        // Role ga qarab redirect qilamiz
        const role = String(data?.user_role || '').toLowerCase()
        if (role === 'sotib_oluvchi') {
          target = '/buyer'
        } else if (role === 'sotuvchi') {
          target = '/seller-dashboard'
        } else {
          // default buyer
          target = '/buyer'
        }
      }

      return { shouldRedirect: true, target }

    } catch (error) {
      console.error('User status tekshirishda xato:', error)
      return { shouldRedirect: true, target: '/login' }
    }

  } catch (error) {
    console.error('Auth tekshirishda xato:', error)
    return { shouldRedirect: true, target: '/login' }
  }
}

// Token'ni tekshirish va avtomatik redirect qilish (sahifa yuklanganda)
export async function checkAuthOnPageLoad() {
  try {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    
    if (!access || !refresh) {
      return { shouldRedirect: false }
    }

    // Token yaroqliligini tekshiramiz
    if (!isTokenValid()) {
      return { shouldRedirect: false }
    }

    // Token refresh qilib ko'ramiz
    try {
      await refreshToken()
    } catch (error) {
      // Refresh token ham tugagan bo'lsa, hech narsa qilmaymiz
      return { shouldRedirect: false }
    }

    // User rolini tekshiramiz va mos sahifaga yo'naltiramiz
    try {
      const { data } = await axios.get(`${API_URL}/companies/my_status/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      // Cache ga saqlaymiz
      localStorage.setItem('user_role', String(data?.user_role || ''))
      localStorage.setItem('has_company', data?.has_company ? '1' : '0')

      let target = '/'
      if (data?.has_company === false) {
        target = '/company-setup'
      } else {
        // Role ga qarab redirect qilamiz
        const role = String(data?.user_role || '').toLowerCase()
        if (role === 'sotib_oluvchi') {
          target = '/buyer'
        } else if (role === 'sotuvchi') {
          target = '/seller-dashboard'
        } else {
          // default buyer
          target = '/buyer'
        }
      }

      return { shouldRedirect: true, target }

    } catch (error) {
      console.error('User status tekshirishda xato:', error)
      return { shouldRedirect: false }
    }

  } catch (error) {
    console.error('Auth tekshirishda xato:', error)
    return { shouldRedirect: false }
  }
}

// Token'ni tekshirish va avtomatik redirect qilish (sahifa yuklanganda) - CompanySetup uchun
export async function checkAuthOnPageLoadForCompanySetup() {
  try {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    
    if (!access || !refresh) {
      return { shouldRedirect: false }
    }

    // Token yaroqliligini tekshiramiz
    if (!isTokenValid()) {
      return { shouldRedirect: false }
    }

    // Token refresh qilib ko'ramiz
    try {
      await refreshToken()
    } catch (error) {
      // Refresh token ham tugagan bo'lsa, hech narsa qilmaymiz
      return { shouldRedirect: false }
    }

    // User rolini tekshiramiz va mos sahifaga yo'naltiramiz
    try {
      const { data } = await axios.get(`${API_URL}/companies/my_status/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      // Cache ga saqlaymiz
      localStorage.setItem('user_role', String(data?.user_role || ''))
      localStorage.setItem('has_company', data?.has_company ? '1' : '0')

      // Agar kompaniyasi bo'lsa, mos sahifaga yo'naltiramiz
      if (data?.has_company === true) {
        let target = '/'
        const role = String(data?.user_role || '').toLowerCase()
        if (role === 'sotib_oluvchi') {
          target = '/buyer'
        } else if (role === 'sotuvchi') {
          target = '/seller-dashboard'
        } else {
          // default buyer
          target = '/buyer'
        }

        return { shouldRedirect: true, target }
      } else {
        // Kompaniyasi yo'q bo'lsa, bu sahifada qoladi
        return { shouldRedirect: false }
      }

    } catch (error) {
      console.error('User status tekshirishda xato:', error)
      return { shouldRedirect: false }
    }

  } catch (error) {
    console.error('Auth tekshirishda xato:', error)
    return { shouldRedirect: false }
  }
}

export async function getItems(params = {}) {
  const { data } = await api.get('/items/', { params, headers: authHeaders() })
  return data
}

export async function getItem(id) {
  const { data } = await api.get(`/items/${id}/`, { headers: authHeaders() })
  return data
}

export async function createItem(formData) {
  const { data } = await api.post('/items/', formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
  return data
}

export async function updateItem(id, formData) {
  const { data } = await api.patch(`/items/${id}/`, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
  return data
}
export async function deleteItem(id, deletionReason = {}){
  const { data } = await api.delete(`/items/${id}/`, { 
    headers: authHeaders(),
    data: deletionReason
  })
  return data
}

export async function getItemImages(id){
  const { data } = await api.get(`/items/${id}/images/`, { headers: authHeaders() })
  return data
}
export async function addItemImages(id, files){
  const fd = new FormData()
  ;[].forEach.call(files, f=> fd.append('images', f))
  const { data } = await api.post(`/items/${id}/images/`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
  return data
}
export async function deleteItemImage(id, imageId){
  const { data } = await api.delete(`/items/${id}/images/`, { data: { image_id: imageId }, headers: authHeaders() })
  return data
}

// Meta ma'lumotlar: kategoriyalar, birliklar
export async function getItemMeta() {
  try {
    const { data } = await api.get('/items/meta/', { headers: authHeaders() })
    return data
  } catch {
    const [cats, subs, units] = await Promise.allSettled([
      api.get('/items/categories/', { headers: authHeaders() }),
      api.get('/items/subcategories/', { headers: authHeaders() }),
      api.get('/items/units/', { headers: authHeaders() })
    ])
    return {
      categories: cats.status === 'fulfilled' ? (cats.value?.data || []) : [],
      subcategories: subs.status === 'fulfilled' ? (subs.value?.data || []) : [],
      units: units.status === 'fulfilled' ? (units.value?.data || []) : []
    }
  }
}

// Kategoriyalarni olish
export async function getCategories() {
  try {
    const { data } = await api.get('/items/categories/', { headers: authHeaders() })
    return data
  } catch (error) {
    console.error('Kategoriyalarni yuklashda xato:', error)
    return []
  }
}


export async function getIncomingRequests(companyId, params = {}) {
  if (!companyId) throw new Error('companyId required')
  const { data } = await api.get(`/companies/${companyId}/incoming_requests/`, { params, headers: authHeaders() })
  return data
}


export async function myStatus() {
  const { data } = await api.get('/companies/my_status/', { headers: authHeaders() })
  return data
}

// Company helpers
export async function getCompany(id){
  const { data } = await api.get(`/companies/${id}/`, { headers: authHeaders() })
  return data
}

export async function getCompanyProfile(id){
  const { data } = await api.get(`/companies/${id}/`, { headers: authHeaders() })
  return data
}
export async function getCompanyMetrics(id){
  const { data } = await api.get(`/companies/${id}/metrics/`, { headers: authHeaders() })
  return data
}
export async function updateCompanyProfile(id, payload){
  const form = new FormData()
  Object.entries(payload).forEach(([k,v])=>{
    if (v!==undefined && v!==null && v!=="") form.append(k, v)
  })
  const { data } = await api.patch(`/companies/${id}/update_profile/`, form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
  return data
}
export async function deleteCompanyLogo(id){
  const { data } = await api.post(`/companies/${id}/delete_logo/`, {}, { headers: authHeaders() })
  return data
}
export async function getCertificates(id){
  const { data } = await api.get(`/companies/${id}/certificates/`, { headers: authHeaders() })
  return data
}
export async function addCertificates(id, files){
  const fd = new FormData()
  ;[].forEach.call(files, f=> fd.append('sertificate', f))
  const { data } = await api.post(`/companies/${id}/certificates/`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
  return data
}
export async function deleteCertificate(id, certificate_id){
  const { data } = await api.delete(`/companies/${id}/certificates/`, { data: { certificate_id }, headers: authHeaders() })
  return data
}
export async function getCompanyMembers(id){
  const { data } = await api.get(`/companies/${id}/members/`, { headers: authHeaders() })
  return data
}
export async function addCompanyMember(id, { user_id, phone }){
  const { data } = await api.post(`/companies/${id}/add_member/`, { user_id, phone }, { headers: authHeaders() })
  return data
}
export async function removeCompanyMember(id, user_id){
  const { data } = await api.post(`/companies/${id}/remove_member/`, { user_id }, { headers: authHeaders() })
  return data
}

// User profile helpers (companies/my_profile/ bilan)
export async function getMyProfile(){
  const { data } = await api.get('/companies/my_profile/', { headers: authHeaders() })
  return data
}
export async function updateMyProfile(payload){
  const fd = new FormData()
  Object.entries(payload).forEach(([k,v])=>{
    if (v!==undefined && v!==null && v!=='') fd.append(k, v)
  })
  const { data } = await api.patch('/companies/my_profile/', fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
  return data
}
export async function changeMyPassword({ old_password, new_password }){
  const { data } = await api.post('/companies/change_password/', { old_password, new_password }, { headers: authHeaders() })
  return data
}

export async function sendPasswordChangeSMS({ old_password, new_password }){
  const { data } = await api.post('/companies/send_password_change_sms/', { old_password, new_password }, { headers: authHeaders() })
  return data
}

export async function verifyPasswordChangeSMS({ code, old_password, new_password }){
  const { data } = await api.post('/companies/verify_password_change_sms/', { code, old_password, new_password }, { headers: authHeaders() })
  return data
}

// Notifications
export async function getMyNotifications(){
  const { data } = await api.get('/companies/my_notifications/', { headers: authHeaders() })
  return data
}
export async function markAllNotificationsRead(){
  const { data } = await api.post('/companies/mark_all_read/', {}, { headers: authHeaders() })
  return data
}
export async function markNotificationRead(id){
  const { data } = await api.post('/companies/mark_read/', { id }, { headers: authHeaders() })
  return data
}

// Requests
export async function getRequests(params = {}){
  const { data } = await api.get('/requests/', { params, headers: authHeaders() })
  return data
}
export async function getMyRequests(params = {}){
  const { data } = await api.get('/requests/my/', { params, headers: authHeaders() })
  return data
}
export async function getRequest(id){
  const { data } = await api.get(`/requests/${id}/`, { headers: authHeaders() })
  return data
}
export async function createRequest(requestData){
  const { data } = await api.post('/requests/', requestData, { headers: authHeaders() })
  return data
}
export async function closeRequest(id){
  const { data } = await api.post(`/requests/${id}/close/`, {}, { headers: authHeaders() })
  return data
}

export async function cancelRequest(id, reason = ''){
  const { data } = await api.put(`/requests/${id}/cancel/`, { reason }, { headers: authHeaders() })
  return data
}


// Offers API functions
export async function createOffer(formData) {
  const { data } = await api.post('/offers/', formData, { headers: authHeaders() })
  return data
}

export async function getRequestOffers(requestId) {
  const { data } = await api.get(`/offers/request/${requestId}/`, { headers: authHeaders() })
  return data
}

export async function getMyOffers(params = '') {
  const { data } = await api.get(`/offers/my/?${params}`, { headers: authHeaders() })
  return data
}

export async function acceptOffer(id) {
  const { data } = await api.put(`/offers/${id}/accept/`, {}, { headers: authHeaders() })
  return data
}

export async function rejectOffer(id, data = {}) {
  const { data: response } = await api.put(`/offers/${id}/reject/`, data, { headers: authHeaders() })
  return response
}

export async function cancelOffer(id, data = {}) {
  const { data: response } = await api.put(`/offers/${id}/cancel/`, data, { headers: authHeaders() })
  return response
}

// Orders API functions



// Ratings API functions
export async function createRating(ratingData) {
  const { data } = await api.post('/ratings/', ratingData, { headers: authHeaders() })
  return data
}

export async function getCompanyRatings(companyId) {
  const { data } = await api.get(`/ratings/company/${companyId}/`, { headers: authHeaders() })
  return data
}

export async function getOrderRating(orderId) {
  const { data } = await api.get(`/ratings/order/${orderId}/`, { headers: authHeaders() })
  return data
}


export async function getBuyerOrders(params = {}) {
  const response = await api.get('/orders/buyer/', { 
    headers: authHeaders(),
    params 
  })
  return response.data
}

export async function getSellerOrders(params = {}) {
  const response = await api.get('/orders/seller/', { 
    headers: authHeaders(),
    params 
  })
  return response.data
}


// Order functions
export async function updateOrderStatus(id, status, reason = '') {
  const payload = { status }
  if (reason) payload.cancellation_reason = reason
  const { data } = await api.patch(`/orders/${id}/`, payload, { headers: authHeaders() })
  return data
}

export async function completeOrder(id) {
  const { data } = await api.post(`/orders/${id}/confirm_delivery/`, {}, { headers: authHeaders() })
  return data
}

export async function getOrder(id) {
  const { data } = await api.get(`/orders/${id}/`, { 
    headers: authHeaders()
  })
  return data
}

export async function confirmPayment(id, formData) {
  const { data } = await api.post(`/orders/${id}/confirm_payment/`, formData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function startProduction(id) {
  const { data } = await api.post(`/orders/${id}/start_production/`, {}, {
    headers: authHeaders()
  })
  return data
}

export async function shipOrder(id, formData) {
  const { data } = await api.post(`/orders/${id}/ship_order/`, formData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function markDelivered(id) {
  const { data } = await api.post(`/orders/${id}/mark_delivered/`, {}, {
    headers: authHeaders()
  })
  return data
}

export async function confirmDelivery(id, formData) {
  const { data } = await api.post(`/orders/${id}/confirm_delivery/`, formData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function confirmCashPayment(id) {
  const { data } = await api.post(`/orders/${id}/confirm_cash_payment/`, {}, {
    headers: authHeaders()
  })
  return data
}

// // Company ratings
// export async function getCompanyRatings(companyId) {
//   const { data } = await api.get(`/companies/${companyId}/ratings/`, {
//     headers: authHeaders()
//   })
//   return data
// }

// Cache busting comment - updated at 2025-09-11 14:47
// Force reload - getCategories function is available
