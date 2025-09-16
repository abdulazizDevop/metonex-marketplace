import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import OfferManagementModal from '../../components/OfferManagementModal.jsx'
import { Toast } from '../../components/Modal.jsx'
import { useToast } from '../../hooks/useToast.js'
import { getRequest, getRequestOffers, acceptOffer, rejectOffer, myStatus } from '../../utils/api.js'

export default function BuyerRequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [offersLoading, setOffersLoading] = useState(false)
  const [request, setRequest] = useState(null)
  const [offers, setOffers] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  // E'tibor bering: siz hook'dan universal nomni oling!
  const { toasts, hideToast, showToast, success, error } = useToast()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [id])

  async function loadData() {
    try {
      setLoading(true)

      const requestData = await getRequest(id)
      setRequest(requestData)

      const status = await myStatus()
      setUserRole(status?.role)

      await loadOffers()
    } catch (err) {
      console.error('Ma\'lumotlarni yuklashda xato:', err)
      show('Ma\'lumotlarni yuklashda xato', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loadOffers() {
    try {
      setOffersLoading(true)
      const offersData = await getRequestOffers(id)
      setOffers(Array.isArray(offersData) ? offersData : [])
    } catch (err) {
      console.error('Takliflarni yuklashda xato:', err)
    } finally {
      setOffersLoading(false)
    }
  }

  function openOfferModal(offer) {
    setSelectedOffer(offer)
    setShowOfferModal(true)
  }

  function handleOfferSuccess(action, offer, reason) {
    if (action === 'accept') {
      success('Taklif qabul qilindi! Order yaratildi.')
      setTimeout(() => {
        navigate('/buyer/orders')
      }, 2000)
    } else if (action === 'reject') {
      success('Taklif rad etildi.')
    } else if (action === 'error') {
      error('Taklif bilan ishlashda xato yuz berdi')
    }
    loadOffers()
  }

  function handleOfferError() {
    error('Taklif bilan ishlashda xato yuz berdi')
    loadOffers() // Xato bo'lganda ham offer'larni qayta yuklaymiz
  }

  function formatPrice(price) {
    if (!price && price !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm"
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
      <div className="min-h-screen bg-gray-50">
        <BuyerHeader showFilters={false} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerHeader showFilters={false} />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">So'rov topilmadi</h2>
          <p className="text-gray-600 mb-4">Bunday so'rov mavjud emas yoki sizga ruxsat yo'q</p>
          <Link
            to="/buyer/requests"
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
          >
            Orqaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">So'rov batafsil</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
          >
            ← Orqaga qaytish
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request ma'lumotlari */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {request.category_name || "Kategoriya yo'q"}
                </h3>
                {getStatusBadge(request.status)}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Tavsif</h4>
                  <p className="text-gray-900">{request.description || "Tavsif yo'q"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Miqdor</h4>
                    <p className="text-gray-900">
                      {request.quantity
                        ? `${new Intl.NumberFormat('uz-UZ').format(request.quantity)} ${request.unit || 'dona'}`
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Narx diapazoni</h4>
                    <p className="text-gray-900">
                      {request.budget_from && request.budget_to
                        ? `${formatPrice(request.budget_from)} - ${formatPrice(request.budget_to)}`
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Viloyat</h4>
                    <p className="text-gray-900">{request.region || '-'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Muddat</h4>
                    <p className="text-gray-900">{formatDate(request.deadline_date)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Yetkazib berish manzili</h4>
                  <p className="text-gray-900">{request.delivery_address || '-'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">To'lov turi</h4>
                  <p className="text-gray-900">
                    {request.payment_type === 'naqd_pul'
                      ? "Naqd pul"
                      : request.payment_type === 'bank'
                        ? "Bank orqali"
                        : request.payment_type === 'kredit'
                          ? "Kredit"
                          : "Boshqa"}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Yaratilgan: {formatDate(request.created_at)} •
                    Kompaniya: {request.buyer_company_name || "Noma'lum"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Takliflar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Takliflar</h3>

              {offersLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : offers.length ? (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {formatPrice(offer.price)}
                        </span>
                        {getOfferStatusBadge(offer.status)}
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Yetkazib berish: {offer.eta_days} kun</p>
                        {offer.delivery_included && (
                          <p className="text-green-600">Yetkazib berish narxiga kiritilgan</p>
                        )}
                        {offer.payment_terms && (
                          <p>To'lov: {offer.payment_terms}</p>
                        )}
                        {offer.comment && (
                          <p>Izoh: {offer.comment}</p>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        {formatDate(offer.created_at)} • {offer.supplier_company_name || "Noma'lum"}
                      </div>

                      {offer.status === 'kutilmoqda' && (
                        <div className="mt-3">
                          <button
                            onClick={() => openOfferModal(offer)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Taklifni boshqarish
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Hozircha takliflar yo'q</p>
              )}
            </div>
          </div>
        </div>

        <>
          <OfferManagementModal
            isOpen={showOfferModal}
            onClose={() => setShowOfferModal(false)}
            offer={selectedOffer}
            onSuccess={handleOfferSuccess}
            onError={handleOfferError}
          />

          {toasts.map(toast => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              isVisible={toast.isVisible}
              onClose={() => hideToast(toast.id)}
            />
          ))}
        </>
      </div>
    </div>
  )
}
