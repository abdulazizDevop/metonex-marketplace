import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import RoleGuard from '../../components/RoleGuard.jsx'
import CompanyProfileModal from '../../components/CompanyProfileModal.jsx'
import { getRequests, getRequestOffers, createOffer, myStatus, getMyOffers } from '../../utils/api.js'
import { useToast } from '../../hooks/useToast.js'
import { Toast } from '../../components/Modal.jsx'

export default function SellerRequests() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'open', 'accepted', 'rejected', 'cancelled'
  const [requests, setRequests] = useState([])
  const [allRequests, setAllRequests] = useState([]) // Tab count'lari uchun
  const [offers, setOffers] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    region: '',
    sort: '-created_at'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [offerData, setOfferData] = useState({ 
    price: '', 
    eta_days: '', 
    delivery_included: false,
    warranty_period: 0,
    special_conditions: '',
    comment: ''
  })
  const [userRole, setUserRole] = useState(null)
  const { toasts, hideToast, success, error } = useToast()

  useEffect(() => {
    loadRequests()
    loadOffers()
    loadUserRole()
    loadAllRequests() // Tab count'lari uchun
  }, [filters, currentPage, activeTab])

  async function loadUserRole() {
    try {
      const role = await myStatus()
      setUserRole(role)
    } catch (err) {
      console.error('User role yuklashda xato:', err)
    }
  }

  async function loadRequests() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.region) params.append('region', filters.region)
      if (filters.sort) params.append('ordering', filters.sort)
      
      // Tab bo'yicha status filterlash
      if (activeTab === 'open') {
        params.append('status', 'ochiq')
      } else if (activeTab === 'closed') {
        params.append('status', 'yopilgan')
      } else if (activeTab === 'cancelled') {
        params.append('status', 'bekor_qilindi')
      } else if (activeTab === 'expired') {
        params.append('status', 'muddati_tugadi')
      }
      // 'all' va offer tab'lari uchun status filter qo'shmaslik
      
      params.append('page', currentPage)
      params.append('page_size', 10)
      
      const data = await getRequests(params)
      setRequests(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [])
      
      // Pagination ma'lumotlari
      if (data?.count && data?.page_size) {
        setTotalPages(Math.ceil(data.count / data.page_size))
      }
    } catch (err) {
      console.error('So\'rovlarni yuklashda xato:', err)
      error('So\'rovlarni yuklashda xato yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  async function loadOffers() {
    try {
      // Seller uchun barcha takliflarni olish uchun my offers endpoint'ini ishlatamiz
      const data = await getMyOffers()
      setOffers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Takliflarni yuklashda xato:', err)
    }
  }

  async function loadAllRequests() {
    try {
      // Tab count'lari uchun barcha requestlarni yuklaymiz
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.region) params.append('region', filters.region)
      if (filters.sort) params.append('ordering', filters.sort)
      params.append('page_size', 1000) // Ko'p sonli requestlarni olish uchun
      
      const data = await getRequests(params)
      setAllRequests(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Barcha so\'rovlarni yuklashda xato:', err)
    }
  }

  function onFilterChange(key, value) {
    setFilters(f => ({ ...f, [key]: value }))
    setCurrentPage(1)
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

  function openCompanyModal(company) {
    setSelectedCompany(company)
    setShowCompanyModal(true)
  }

  function openOfferForm(request) {
    setSelectedRequest(request)
    setOfferData({ 
      price: '', 
      eta_days: '', 
      delivery_included: false,
      payment_terms: '',
      custom_payment_terms: '',
      comment: ''
    })
    setShowOfferForm(true)
  }

  async function handleSubmitOffer() {
    if (!selectedRequest || !userRole?.company_id) return
    
    if (!offerData.price || !offerData.eta_days) {
      error('Barcha maydonlarni to\'ldiring')
      return
    }

    try {
      const formData = new FormData()
      formData.append('request', selectedRequest.id)
      formData.append('supplier_company', userRole.company_id)
      formData.append('price', parseInt(offerData.price))
      formData.append('eta_days', parseInt(offerData.eta_days))
      formData.append('delivery_included', offerData.delivery_included || false)
      formData.append('warranty_period', parseInt(offerData.warranty_period) || 0)
      if (offerData.special_conditions) {
        formData.append('special_conditions', offerData.special_conditions)
      }
      formData.append('comment', offerData.comment || '')
      
      await createOffer(formData)
      success('Taklif muvaffaqiyatli yuborildi!')
      setShowOfferForm(false)
      loadRequests()
      loadOffers()
    } catch (err) {
      console.error('Taklif yuborishda xato:', err)
      error(err.response?.data?.detail || 'Taklif yuborishda xato yuz berdi')
    }
  }

  function canSendOffer(request) {
    // Faqat ochiq va rad etilgan takliflarga taklif yuborish mumkin
    return request.status === 'ochiq' || request.status === 'rad_etildi'
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

  function getFilteredRequests() {
    let filtered = requests

    // Offer tab'lari uchun maxsus logika
    if (activeTab.startsWith('pending_offers') || activeTab.startsWith('accepted_offers') || 
        activeTab.startsWith('rejected_offers') || activeTab.startsWith('cancelled_offers') || 
        activeTab.startsWith('expired_offers')) {
      
      // Offer tab'lari uchun barcha requestlarni yuklaymiz va filterlaymiz
      filtered = allRequests
      
      if (activeTab === 'pending_offers') {
        // Kutilayotgan takliflar - bu requestlarga kutilayotgan takliflar bor
        const pendingRequestIds = offers
          .filter(offer => offer.status === 'kutilmoqda')
          .map(offer => offer.request)
        filtered = filtered.filter(req => pendingRequestIds.includes(req.id))
      } else if (activeTab === 'accepted_offers') {
        // Qabul qilingan takliflar - offer qabul qilingan requestlar
        const acceptedRequestIds = offers
          .filter(offer => offer.status === 'qabul_qilindi')
          .map(offer => offer.request)
        filtered = filtered.filter(req => acceptedRequestIds.includes(req.id))
      } else if (activeTab === 'rejected_offers') {
        // Rad etilgan takliflar - offer rad etilgan requestlar
        const rejectedRequestIds = offers
          .filter(offer => offer.status === 'rad_etildi')
          .map(offer => offer.request)
        filtered = filtered.filter(req => rejectedRequestIds.includes(req.id))
      } else if (activeTab === 'cancelled_offers') {
        // Bekor qilingan takliflar
        const cancelledRequestIds = offers
          .filter(offer => offer.status === 'bekor_qilindi')
          .map(offer => offer.request)
        filtered = filtered.filter(req => cancelledRequestIds.includes(req.id))
      } else if (activeTab === 'expired_offers') {
        // Muddati tugagan takliflar
        const expiredRequestIds = offers
          .filter(offer => offer.status === 'muddati_tugadi')
          .map(offer => offer.request)
        filtered = filtered.filter(req => expiredRequestIds.includes(req.id))
      }
    }

    return filtered
  }

  const filteredRequests = getFilteredRequests()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">So'rovlar yuklanmoqda...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <RoleGuard allowedRoles={['seller']}>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      So'rovlar
                    </h1>
                    <p className="mt-2 text-slate-600">
                      Barcha so'rovlar va taklif yuborish
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
                <nav className="flex space-x-1 p-2 overflow-x-auto">
                  {[
                    { id: 'all', name: 'Barchasi', count: allRequests.length },
                    { id: 'open', name: 'Ochiq', count: allRequests.filter(r => r.status === 'ochiq').length },
                    { id: 'closed', name: 'Yopilgan', count: allRequests.filter(r => r.status === 'yopilgan').length },
                    { id: 'cancelled', name: 'Bekor qilingan', count: allRequests.filter(r => r.status === 'bekor_qilindi').length },
                    { id: 'expired', name: 'Muddati tugagan', count: allRequests.filter(r => r.status === 'muddati_tugadi').length },
                    { id: 'pending_offers', name: 'Kutilayotgan takliflar', count: offers.filter(o => o.status === 'kutilmoqda').length },
                    { id: 'accepted_offers', name: 'Qabul qilingan takliflar', count: offers.filter(o => o.status === 'qabul_qilindi').length },
                    { id: 'rejected_offers', name: 'Rad etilgan takliflar', count: offers.filter(o => o.status === 'rad_etildi').length },
                    { id: 'cancelled_offers', name: 'Bekor qilingan takliflar', count: offers.filter(o => o.status === 'bekor_qilindi').length },
                    { id: 'expired_offers', name: 'Muddati tugagan takliflar', count: offers.filter(o => o.status === 'muddati_tugadi').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-4 font-medium text-sm whitespace-nowrap rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-slate-600 bg-white border-2 border-blue-200 hover:text-slate-800 hover:bg-white/50'
                      }`}
                    >
                      {tab.name}
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-semibold ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={filters.search}
                  onChange={(e) => onFilterChange('search', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              
              <select
                value={filters.sort}
                onChange={(e) => onFilterChange('sort', e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value="-created_at">Yangi</option>
                <option value="created_at">Eski</option>
                <option value="-budget">Yuqori byudjet</option>
                <option value="budget">Past byudjet</option>
              </select>
              </div>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">So'rovlar yo'q</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.search ? 'Qidiruv natijasi topilmadi' : 'Hozircha so\'rovlar mavjud emas'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredRequests.map((request) => {
                  const requestOffers = offers.filter(offer => offer.request === request.id)
                  const myOffer = requestOffers.find(offer => offer.supplier_company === userRole?.company_id)
                  
                  return (
                    <div key={request.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 p-6 hover:shadow-lg hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.category?.name || 'Kategoriya yo\'q'}
                          </h3>
                          {getStatusBadge(request.status)}
                          {myOffer && getOfferStatusBadge(myOffer.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Byudjet</span>
                            <p className="font-semibold text-gray-900">{formatPrice(request.budget)}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Buyer</span>
                            <button
                              onClick={() => openCompanyModal(request.buyer_company)}
                              className="font-medium bg-white border-2 border-blue-600 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              {request.buyer_company?.name || 'Noma\'lum'}
                            </button>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Viloyat</span>
                            <p className="font-medium text-gray-900">{request.region}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Muddat</span>
                            <p className="font-medium text-gray-900">{formatDate(request.deadline_date)}</p>
                          </div>
                        </div>

                        {request.description && (
                          <div className="mb-4">
                            <span className="text-sm text-gray-500">Tavsif</span>
                            <p className="text-gray-800 mt-1 line-clamp-2">
                              {request.description}
                            </p>
                          </div>
                        )}

                        {request.cancellation_reason && (
                          <div className="mb-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <span className="text-orange-600 block mb-2 font-medium">Bekor qilish sababi:</span>
                            <p className="text-orange-800">{request.cancellation_reason}</p>
                          </div>
                        )}

                        {myOffer?.rejection_reason && (
                          <div className="mb-4 bg-red-50 p-4 rounded-lg border border-red-200">
                            <span className="text-red-600 block mb-2 font-medium">Rad etish sababi:</span>
                            <p className="text-red-800">{myOffer.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex flex-col gap-2">
                        <Link
                          to={`/requests/${request.id}`}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ko'rish
                        </Link>
                        
                        {canSendOffer(request) && (!myOffer || myOffer.status === 'rad_etildi') && (
                          <button
                            onClick={() => openOfferForm(request)}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Taklif yuborish
                          </button>
                        )}
                      </div>
                    </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Oldingi
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Offer Form Modal */}
          {showOfferForm && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Taklif yuborish: {selectedRequest.category?.name}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Narx (so'm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={offerData.price}
                      onChange={(e) => setOfferData({...offerData, price: e.target.value})}
                      placeholder="Narxni kiriting (so'm)"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yetkazib berish muddati (kun) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={offerData.eta_days}
                      onChange={(e) => setOfferData({...offerData, eta_days: e.target.value})}
                      placeholder="Yetkazib berish muddati (kun)"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yetkazib berish narxiga kiritilgan
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={offerData.delivery_included || false}
                        onChange={(e) => setOfferData({...offerData, delivery_included: e.target.checked})}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-3 text-sm text-gray-700">
                        Ha, yetkazib berish narxiga kiritilgan
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kafolat muddati (oy)
                    </label>
                    <input
                      type="number"
                      value={offerData.warranty_period}
                      onChange={(e) => setOfferData({...offerData, warranty_period: e.target.value})}
                      placeholder="Kafolat muddati (oy)"
                      min="0"
                      max="120"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maxsus shartlar (ixtiyoriy)
                    </label>
                    <textarea
                      value={offerData.special_conditions}
                      onChange={(e) => setOfferData({...offerData, special_conditions: e.target.value})}
                      placeholder="Maxsus shartlar va talablar..."
                      rows={3}
                      maxLength="1000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qo'shimcha izoh
                    </label>
                    <textarea
                      value={offerData.comment || ''}
                      onChange={(e) => setOfferData({...offerData, comment: e.target.value})}
                      placeholder="Qo'shimcha ma'lumot va shartlar..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-colors duration-200"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowOfferForm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSubmitOffer}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Yuborish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Company Profile Modal */}
          {selectedCompany && (
            <CompanyProfileModal
              isOpen={showCompanyModal}
              onClose={() => setShowCompanyModal(false)}
              companyId={selectedCompany.id}
              companyName={selectedCompany.name}
            />
          )}

          {/* Toast Notifications */}
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              isVisible={toast.isVisible}
              onClose={() => hideToast(toast.id)}
            />
          ))}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
