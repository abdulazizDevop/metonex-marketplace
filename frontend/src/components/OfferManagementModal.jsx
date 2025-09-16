import { useState } from 'react'
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal.jsx'
import { acceptOffer, rejectOffer, cancelOffer } from '../utils/api.js'

export default function OfferManagementModal({ 
  isOpen, 
  onClose, 
  offer, 
  onSuccess 
}) {
  const [action, setAction] = useState(null) // 'accept' or 'reject'
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  if (!offer) return null

  // Agar offer status'i kutilmoqda emas bo'lsa, modal'ni yopamiz
  if (offer.status !== 'kutilmoqda') {
    console.log('Offer status is not kutilmoqda:', offer.status, 'closing modal')
    onClose()
    return null
  }

  const handleAccept = async () => {
    setLoading(true)
    try {
      await acceptOffer(offer.id)
      onSuccess?.('accept', offer)
      onClose() // Modal yopish
    } catch (error) {
      console.error('Taklifni qabul qilishda xato:', error)
      onSuccess?.('error', offer, error.message)
      onClose() // Xato bo'lganda ham modal yopish
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Rad etish sababini kiriting')
      return
    }
    
    setLoading(true)
    try {
      await rejectOffer(offer.id, { reason })
      onSuccess?.('reject', offer, reason)
      onClose() // Modal yopish
    } catch (error) {
      console.error('Taklifni rad etishda xato:', error)
      onSuccess?.('error', offer, error.message)
      onClose() // Xato bo'lganda ham modal yopish
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setLoading(true)
    try {
      await cancelOffer(offer.id, { reason })
      onSuccess?.('cancel', offer, reason)
    } catch (error) {
      console.error('Taklifni bekor qilishda xato:', error)
      onSuccess?.('error', offer, error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  const formatDate = (iso) => {
    if (!iso) return '-'
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('uz-UZ')
    } catch {
      return '-'
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'kutilmoqda': { color: 'bg-yellow-100 text-yellow-700', text: 'Kutilmoqda' },
      'qabul_qilindi': { color: 'bg-green-100 text-green-700', text: 'Qabul qilindi' },
      'rad_etildi': { color: 'bg-red-100 text-red-700', text: 'Rad etildi' }
    }
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-700', text: status }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <h2 className="text-2xl font-bold text-gray-900">Taklif boshqaruvi</h2>
        <p className="text-gray-600 mt-2">
          Taklif: {offer.request_category_name || 'Kategoriya yo\'q'} • 
          Kompaniya: {offer.supplier_company_name || 'Noma\'lum'}
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Offer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Taklif ma'lumotlari
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm font-medium text-green-600">Taklif narxi</span>
                </div>
                <span className="text-xl font-bold text-green-800">
                  {formatPrice(offer.price)}
                </span>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4  text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-600">Yetkazib berish muddati</span>
                </div>
                <span className="text-lg  font-semibold text-blue-800">
                  {offer.eta_days} kun
                </span>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-600">To'lov shartlari</span>
                </div>
                <span className="text-base font-semibold text-purple-800">
                  {offer.payment_terms || 'Belgilanmagan'}
                </span>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-orange-600">Status</span>
                </div>
                <div className="mt-1">
                  {getStatusBadge(offer.status)}
                </div>
              </div>
            </div>
            
            {offer.comment && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-500 block mb-2">Taklif tavsifi:</span>
                <p className="text-gray-800 leading-relaxed">{offer.comment}</p>
              </div>
            )}
            
            {offer.rejection_reason && (
              <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
                <span className="text-red-600 block mb-2 font-medium">Rad etish sababi:</span>
                <p className="text-red-800 leading-relaxed">{offer.rejection_reason}</p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Yaratilgan: {formatDate(offer.created_at)}
              </span>
            </div>
          </div>

          {/* Action Selection */}
          {offer.status === 'kutilmoqda' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Harakat tanlash
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setAction('accept')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                      action === 'accept' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      action === 'accept' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {action === 'accept' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-green-600">Qabul qilish</div>
                      <div className="text-sm text-gray-600">Taklifni qabul qilib, order yaratish</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setAction('reject')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                      action === 'reject' 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      action === 'reject' ? 'border-red-500 bg-red-500' : 'border-gray-300'
                    }`}>
                      {action === 'reject' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-red-600">Rad etish</div>
                      <div className="text-sm text-gray-600">Taklifni rad etish</div>
                    </div>
                  </button>
                </div>
                
                {action === 'reject' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rad etish sababi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Taklifni rad etish sababini kiriting..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Bekor qilish
          </button>
          
          {offer.status === 'kutilmoqda' && action && (
            <button
              onClick={action === 'accept' ? handleAccept : handleReject}
              disabled={loading || (action === 'reject' && !reason.trim())}
              className={`w-full sm:w-auto ${
                action === 'accept' 
                  ? 'bg-white hover:bg-green-50 text-green-600 border border-green-600 hover:border-green-700' 
                  : 'bg-white hover:bg-red-50 text-red-600 border border-red-600 hover:border-red-700'
              } disabled:opacity-50 font-semibold py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105`}
            >
              {loading ? (
                <>
                  <svg className={`animate-spin -ml-1 mr-2 h-4 w-4 ${action === 'accept' ? 'text-green-600' : 'text-red-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {action === 'accept' ? 'Qabul qilinmoqda...' : 'Rad etilmoqda...'}
                </>
              ) : (
                <>
                  {action === 'accept' ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Qabul qilish
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rad etish
                    </>
                  )}
                </>
              )}
            </button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  )
}
