import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { getMyRequests, closeRequest, cancelRequest } from '../../utils/api.js'

export default function BuyerRequests() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'open', 'closed', 'cancelled', 'expired'
  const [items, setItems] = useState([])
  const [allRequests, setAllRequests] = useState([]) // Tab count'lari uchun
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    region: '',
    sort: '-created_at'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadRequests()
    loadAllRequests() // Tab count'lari uchun
  }, [filters, currentPage, activeTab])

  async function loadRequests() {
    try {
      setLoading(true)
      
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
      
      params.append('page', currentPage)
      params.append('page_size', 10)
      
      const data = await getMyRequests(params)
      setItems(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [])
      
      // Pagination ma'lumotlari
      if (data?.count && data?.page_size) {
        setTotalPages(Math.ceil(data.count / data.page_size))
      }
    } catch (error) {
      console.error('So\'rovlarni yuklashda xato:', error)
    } finally {
      setLoading(false)
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
      
      const data = await getMyRequests(params)
      setAllRequests(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Barcha so\'rovlarni yuklashda xato:', error)
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

  async function handleCancelRequest(id) {
    const reason = prompt('Bekor qilish sababini kiriting (ixtiyoriy):')
    if (reason === null) return // User cancel bosgan
    
    try {
      await cancelRequest(id, reason || '')
      // So'rovlarni qayta yuklash
      loadRequests()
      loadAllRequests()
    } catch (error) {
      console.error('So\'rovni bekor qilishda xato:', error)
      alert('So\'rovni bekor qilishda xato yuz berdi')
    }
  }

  function handlePageChange(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerHeader showFilters={false} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mening so'rovlarim</h1>
          <Link
            to="/buyer/requests/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Yangi so'rov yaratish
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-700 bg-white">
            <nav className="-mb-px border-gray-700 flex space-x-4 bg-white overflow-x-auto">
              {[
                { id: 'all', name: 'Barchasi', count: allRequests.length },
                { id: 'open', name: 'Ochiq', count: allRequests.filter(r => r.status === 'ochiq').length },
                { id: 'closed', name: 'Yopilgan', count: allRequests.filter(r => r.status === 'yopilgan').length },
                { id: 'cancelled', name: 'Bekor qilingan', count: allRequests.filter(r => r.status === 'bekor_qilindi').length },
                { id: 'expired', name: 'Muddati tugagan', count: allRequests.filter(r => r.status === 'muddati_tugadi').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-2 border-b-2 font-medium text-xs bg-white whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({length: 5}).map((_,i) => (
                <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : items.length ? (
            <>
              <div className="divide-y divide-gray-200">
                {items.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.category_name || 'Kategoriya yo\'q'}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {request.description || 'Tavsif yo\'q'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Miqdor:</span>
                            <span className="ml-1 font-medium">
                              {request.quantity ? `${new Intl.NumberFormat('uz-UZ').format(request.quantity)} ${request.unit || 'dona'}` : '-'}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Narx:</span>
                            <span className="ml-1 font-medium">
                              {request.budget_from && request.budget_to 
                                ? `${formatPrice(request.budget_from)} - ${formatPrice(request.budget_to)}`
                                : '-'}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Viloyat:</span>
                            <span className="ml-1 font-medium">{request.region || '-'}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Muddat:</span>
                            <span className="ml-1 font-medium">{formatDate(request.deadline_date)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-400">
                          Yaratilgan: {formatDate(request.created_at)} • 
                          To'lov turi: {request.payment_type === 'naqd_pul' ? 'Naqd pul' : 
                                      request.payment_type === 'bank' ? 'Bank' :
                                      request.payment_type === 'kredit' ? 'Kredit' : 'Boshqa'}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col gap-2">
                        <Link
                          to={`/buyer/requests/${request.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                        >
                          Ko'rish
                        </Link>
                        {request.status === 'ochiq' && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                          >
                            Bekor qilish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Oldingi
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Keyingi
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">So'rovlar topilmadi</h3>
              <p className="mt-1 text-sm text-gray-500">Hozircha yaratilgan so'rovlar yo'q</p>
              <div className="mt-4">
                <Link
                  to="/buyer/requests/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Birinchi so'rovni yaratish
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}