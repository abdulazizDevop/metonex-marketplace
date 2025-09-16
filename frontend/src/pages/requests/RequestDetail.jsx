import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import CompanyProfileModal from '../../components/CompanyProfileModal.jsx'
import OfferManagementModal from '../../components/OfferManagementModal.jsx'
import { getRequest, getRequestOffers, createOffer, acceptOffer, rejectOffer, myStatus } from '../../utils/api.js'

export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [offersLoading, setOffersLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [request, setRequest] = useState(null)
  const [offers, setOffers] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerForm, setOfferForm] = useState({
    price: '',
    eta_days: '',
    delivery_included: false,
    payment_terms: '',
    comment: ''
  })

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    try {
      setLoading(true)
      
      // Request ma'lumotlarini yuklash
      const requestData = await getRequest(id)
      setRequest(requestData)
      
      // User rolini aniqlash
      const status = await myStatus()
      setUserRole(status?.role)
      
      // Agar buyer bo'lsa, takliflarni yuklash
      if (status?.role === 'BUYER') {
        await loadOffers()
      }
      
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xato:', error)
      setError('Ma\'lumotlarni yuklashda xato')
    } finally {
      setLoading(false)
    }
  }

  async function loadOffers() {
    try {
      setOffersLoading(true)
      const offersData = await getRequestOffers(id)
      setOffers(Array.isArray(offersData) ? offersData : [])
    } catch (error) {
      console.error('Takliflarni yuklashda xato:', error)
    } finally {
      setOffersLoading(false)
    }
  }

  function handleOfferChange(e) {
    const { name, value, type, checked } = e.target
    setOfferForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function submitOffer(e) {
    e.preventDefault()
    setError('')
    setOk('')
    
    try {
      if (!offerForm.price || offerForm.price <= 0) {
        throw new Error('Narx majburiy va 0 dan katta bo\'lishi kerak')
      }
      if (!offerForm.eta_days || offerForm.eta_days <= 0) {
        throw new Error('Yetkazib berish muddati majburiy')
      }

      const formData = new FormData()
      formData.append('request', id)
      formData.append('price', offerForm.price)
      formData.append('eta_days', offerForm.eta_days)
      formData.append('delivery_included', offerForm.delivery_included)
      formData.append('payment_terms', offerForm.payment_terms || '')
      formData.append('comment', offerForm.comment || '')

      await createOffer(formData)
      setOk('Taklif muvaffaqiyatli yuborildi!')
      setShowOfferForm(false)
      setOfferForm({
        price: '',
        eta_days: '',
        delivery_included: false,
        payment_terms: '',
        comment: ''
      })
      
      // Takliflarni qayta yuklash
      await loadOffers()
      
    } catch (err) {
      setError(err.message || err?.response?.data?.detail || 'Taklif yuborishda xato')
    }
  }

  async function handleAcceptOffer(offerId) {
    if (!confirm('Bu taklifni qabul qilishni xohlaysizmi?')) return
    
    try {
      await acceptOffer(offerId)
      setOk('Taklif qabul qilindi! Order yaratildi.')
      await loadOffers()
    } catch (error) {
      console.error('Taklifni qabul qilishda xato:', error)
      setError('Taklifni qabul qilishda xato')
    }
  }

  async function handleRejectOffer(offerId) {
    if (!confirm('Bu taklifni rad etishni xohlaysizmi?')) return
    
    try {
      await rejectOffer(offerId)
      setOk('Taklif rad etildi.')
      await loadOffers()
    } catch (error) {
      console.error('Taklifni rad etishda xato:', error)
      setError('Taklifni rad etishda xato')
    }
  }

  function openCompanyModal(company) {
    setSelectedCompany(company)
    setShowCompanyModal(true)
  }

  function openOfferModal(offer) {
    setSelectedOffer(offer)
    setShowOfferModal(true)
  }

  function handleOfferSuccess(action, offer, reason) {
    console.log('handleOfferSuccess chaqirildi:', { action, offer: offer?.id, reason })
    if (action === 'accept') {
      setOk('Taklif qabul qilindi! Order yaratildi.')
      setTimeout(() => {
        navigate('/buyer/orders')
      }, 2000)
    } else if (action === 'reject') {
      setOk('Taklif rad etildi.')
    } else if (action === 'error') {
      setError('Taklif bilan ishlashda xato yuz berdi')
    }
    loadOffers()
  }

  function handleOfferError() {
    setError('Taklif bilan ishlashda xato yuz berdi')
    loadOffers()
  }

  function formatPrice(price) {
    if (!price && price !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  function formatDate(iso) {
    if (!iso) return '-'
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('uz-UZ')
    } catch {
      return '-'
    }
  }

  function getStatusBadge(status) {
    const statusMap = {
      'ochiq': { color: 'bg-green-100 text-green-700', text: 'Ochiq' },
      'yopilgan': { color: 'bg-gray-100 text-gray-700', text: 'Yopilgan' },
      'bekor_qilindi': { color: 'bg-orange-100 text-orange-700', text: 'Bekor qilindi' },
      'muddati_tugadi': { color: 'bg-red-100 text-red-700', text: 'Muddati tugadi' }
    }
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-700', text: status }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    )
  }

  function getOfferStatusBadge(status) {
    const statusMap = {
      'kutilmoqda': { color: 'bg-yellow-100 text-yellow-700', text: 'Kutilmoqda' },
      'qabul_qilindi': { color: 'bg-green-100 text-green-700', text: 'Qabul qilindi' },
      'rad_etildi': { color: 'bg-red-100 text-red-700', text: 'Rad etildi' },
      'bekor_qilindi': { color: 'bg-orange-100 text-orange-700', text: 'Bekor qilindi' },
      'muddati_tugadi': { color: 'bg-gray-100 text-gray-700', text: 'Muddati tugadi' }
    }
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-700', text: status }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">So'rov topilmadi</h2>
          <p className="text-gray-600 mb-4">Bunday so'rov mavjud emas yoki sizga ruxsat yo'q</p>
          <Link
            to="/requests"
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
          >
            Orqaga qaytish
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">So'rov batafsil</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
        >
          ← Orqaga qaytish
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {ok && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{ok}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request ma'lumotlari */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-semibold">
                  {request.category_name || 'Kategoriya yo\'q'}
                </div>
                {getStatusBadge(request.status)}
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tavsif
                </h4>
                <p className="text-gray-800 text-base leading-relaxed">{request.description || 'Tavsif yo\'q'}</p>
              </div>
            </div>
            
            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h4 className="text-sm font-medium text-gray-600">Miqdor</h4>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {request.quantity ? `${new Intl.NumberFormat('uz-UZ').format(request.quantity)} ${request.unit || 'dona'}` : 'Belgilanmagan'}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h4 className="text-sm font-medium text-green-600">Narx diapazoni</h4>
                </div>
                <p className="text-lg font-semibold text-green-800">
                  {request.budget_from && request.budget_to 
                    ? `${formatPrice(request.budget_from)} - ${formatPrice(request.budget_to)}`
                    : 'Belgilanmagan'}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="text-sm font-medium text-purple-600">Viloyat</h4>
                </div>
                <p className="text-lg font-semibold text-purple-800">{request.region || 'Belgilanmagan'}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h4 className="text-sm font-medium text-orange-600">Muddat</h4>
                </div>
                <p className="text-lg font-semibold text-orange-800">{formatDate(request.deadline_date)}</p>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {request.delivery_address && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h4 className="text-sm font-medium text-teal-600">Yetkazib berish manzili</h4>
                  </div>
                  <p className="text-base font-semibold text-teal-800">{request.delivery_address}</p>
                </div>
              )}
              
              {request.payment_type && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h4 className="text-sm font-medium text-yellow-600">To'lov turi</h4>
                  </div>
                  <p className="text-base font-semibold text-yellow-800">
                    {request.payment_type === 'naqd_pul' ? 'Naqd pul' : 
                     request.payment_type === 'bank' ? 'Bank orqali' :
                     request.payment_type === 'kredit' ? 'Kredit' : request.payment_type}
                  </p>
                </div>
              )}
            </div>
            
            {/* Company Info */}
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h4 className="text-sm font-medium text-indigo-600">Buyer kompaniya</h4>
              </div>
              <button 
                onClick={() => openCompanyModal(request.buyer_company)}
                className="text-lg font-semibold text-indigo-800 hover:text-indigo-900 hover:underline"
              >
                {request.buyer_company_name || 'Noma\'lum'}
              </button>
            </div>
            
            {/* Footer Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Yaratilgan: {formatDate(request.created_at)}
                  </span>
                  {request.expires_at && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Muddati: {formatDate(request.expires_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Taklif berish / Takliflar */}
        <div className="lg:col-span-1">
          {userRole === 'SELLER' && request.status === 'ochiq' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Taklif berish</h3>
              </div>
              
              {!showOfferForm ? (
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Taklif yuborish
                </button>
              ) : (
                <form onSubmit={submitOffer} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Narx (so'm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={offerForm.price}
                      onChange={handleOfferChange}
                      required
                      min="1"
                      placeholder="Narxni kiriting"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block bg-gray-50 text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Yetkazib berish muddati (kun) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="eta_days"
                      value={offerForm.eta_days}
                      onChange={handleOfferChange}
                      required
                      min="1"
                      placeholder="Kunlar sonini kiriting"
                      className="block bg-gray-50 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center bg-gray-50">
                      <input
                        type="checkbox"
                        name="delivery_included"
                        checked={offerForm.delivery_included}
                        onChange={handleOfferChange}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-3 bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Yetkazib berish narxiga kiritilgan
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      To'lov shartlari
                    </label>
                    <textarea
                      name="payment_terms"
                      value={offerForm.payment_terms}
                      onChange={handleOfferChange}
                      rows={3}
                      placeholder="To'lov shartlari va usullari..."
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Qo'shimcha izoh
                    </label>
                    <textarea
                      name="comment"
                      value={offerForm.comment}
                      onChange={handleOfferChange}
                      rows={3}
                      placeholder="Qo'shimcha ma'lumot va shartlar..."
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Taklif yuborish
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : userRole === 'BUYER' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Takliflar</h3>
              </div>
              
              {offersLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : offers.length ? (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-lg font-bold">
                          {formatPrice(offer.price)}
                        </div>
                        {getOfferStatusBadge(offer.status)}
                      </div>
                      
                      {/* Main Info */}
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-blue-600">Yetkazib berish</span>
                          </div>
                          <span className="text-base font-semibold text-blue-800">{offer.eta_days} kun</span>
                        </div>
                        
                        {offer.delivery_included && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm font-medium text-green-600">Yetkazib berish narxiga kiritilgan</span>
                            </div>
                          </div>
                        )}
                        
                        {offer.payment_terms && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              <span className="text-sm font-medium text-purple-600">To'lov shartlari</span>
                            </div>
                            <span className="text-base font-semibold text-purple-800">{offer.payment_terms}</span>
                          </div>
                        )}
                        
                        {offer.comment && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Izoh</span>
                            </div>
                            <span className="text-base text-gray-800">{offer.comment}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Company Info */}
                      <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm font-medium text-indigo-600">Supplier kompaniya</span>
                        </div>
                        <span className="text-base font-semibold text-indigo-800">{offer.supplier_company_name || 'Noma\'lum'}</span>
                      </div>
                      
                      {/* Footer */}
                      <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Yuborilgan: {formatDate(offer.created_at)}
                      </div>
                      
                      {/* Action Buttons */}
                      {offer.status === 'kutilmoqda' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => openOfferModal(offer)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Boshqarish
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 text-lg">Hozircha takliflar yo'q</p>
                  <p className="text-gray-400 text-sm mt-1">Supplier kompaniyalar taklif yuborishni kutmoqda</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <CompanyProfileModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        company={selectedCompany}
      />

      <OfferManagementModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        offer={selectedOffer}
        onSuccess={handleOfferSuccess}
        onError={handleOfferError}
      />
    </DashboardLayout>
  )
}
