import { useState } from 'react'
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal.jsx'
import { updateOrderStatus, completeOrder } from '../utils/api.js'

export default function OrderManagementModal({ 
  isOpen, 
  onClose, 
  order, 
  onSuccess 
}) {
  const [newStatus, setNewStatus] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  if (!order) return null

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      alert('Status tanlang')
      return
    }
    
    if (newStatus === 'bekor_qilindi' && !reason.trim()) {
      alert('Bekor qilish sababini kiriting')
      return
    }
    
    setLoading(true)
    try {
      if (newStatus === 'yakunlandi') {
        await completeOrder(order.id)
      } else {
        await updateOrderStatus(order.id, newStatus, reason)
      }
      onSuccess?.(newStatus, order, reason)
      onClose()
    } catch (error) {
      console.error('Status yangilashda xato:', error)
      // Error handling will be done by parent component
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
      'ochilgan': { color: 'bg-blue-100 text-blue-700', text: 'Ochilgan' },
      'to_lov_kutilmoqda': { color: 'bg-yellow-100 text-yellow-700', text: 'To\'lov kutilmoqda' },
      'to_lov_qilindi': { color: 'bg-green-100 text-green-700', text: 'To\'lov qilindi' },
      'yeg_ilmoqda': { color: 'bg-purple-100 text-purple-700', text: 'Yeg\'ilmoqda' },
      'yo_lda': { color: 'bg-orange-100 text-orange-700', text: 'Yo\'lda' },
      'yetib_bordi': { color: 'bg-indigo-100 text-indigo-700', text: 'Yetib bordi' },
      'yakunlandi': { color: 'bg-green-100 text-green-700', text: 'Yakunlandi' },
      'bekor_qilindi': { color: 'bg-red-100 text-red-700', text: 'Bekor qilingan' }
    }
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-700', text: status }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    )
  }

  const getAvailableStatuses = (currentStatus) => {
    const transitions = {
      'ochilgan': [
        { value: 'to_lov_kutilmoqda', label: 'To\'lov kutilmoqda', color: 'text-yellow-600' }
      ],
      'to_lov_kutilmoqda': [
        { value: 'to_lov_qilindi', label: 'To\'lov qilindi', color: 'text-green-600' },
        { value: 'bekor_qilindi', label: 'Bekor qilish', color: 'text-red-600' }
      ],
      'to_lov_qilindi': [
        { value: 'yeg_ilmoqda', label: 'Yeg\'ilmoqda', color: 'text-purple-600' },
        { value: 'bekor_qilindi', label: 'Bekor qilish', color: 'text-red-600' }
      ],
      'yeg_ilmoqda': [
        { value: 'yo_lda', label: 'Yo\'lda', color: 'text-orange-600' },
        { value: 'bekor_qilindi', label: 'Bekor qilish', color: 'text-red-600' }
      ],
      'yo_lda': [
        { value: 'yetib_bordi', label: 'Yetib bordi', color: 'text-indigo-600' },
        { value: 'bekor_qilindi', label: 'Bekor qilish', color: 'text-red-600' }
      ],
      'yetib_bordi': [
        { value: 'yakunlandi', label: 'Yakunlash', color: 'text-green-600' }
      ],
      'yakunlandi': [],
      'bekor_qilindi': []
    }
    return transitions[currentStatus] || []
  }

  const availableStatuses = getAvailableStatuses(order.status)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <h2 className="text-2xl font-bold text-gray-900">Buyurtma boshqaruvi</h2>
        <p className="text-gray-600 mt-2">
          Buyurtma ID: {order.id} • 
          Status: {getStatusBadge(order.status)}
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Buyurtma ma'lumotlari
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm font-medium text-green-600">Jami summa</span>
                </div>
                <span className="text-xl font-bold text-green-800">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-600">Yaratilgan sana</span>
                </div>
                <span className="text-lg font-semibold text-blue-800">
                  {formatDate(order.created_at)}
                </span>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-purple-600">Buyer kompaniya</span>
                </div>
                <span className="text-base font-semibold text-purple-800">
                  {order.buyer_company_name || order.buyer_company?.name || 'Noma\'lum'}
                </span>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-orange-600">Supplier kompaniya</span>
                </div>
                <span className="text-base font-semibold text-orange-800">
                  {order.supplier_company_name || order.supplier_company?.name || 'Noma\'lum'}
                </span>
              </div>
            </div>
            
            {(order.request_description || order.request?.description) && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-500 block mb-2">So'rov tavsifi:</span>
                <p className="text-gray-800 leading-relaxed">{order.request_description || order.request?.description}</p>
              </div>
            )}
            
            {order.cancellation_reason && (
              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <span className="text-red-500 block mb-2">Bekor qilish sababi:</span>
                <p className="text-red-800 leading-relaxed">{order.cancellation_reason}</p>
              </div>
            )}
          </div>

          {/* Status Update */}
          {availableStatuses.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Status yangilash
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableStatuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setNewStatus(status.value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        newStatus === status.value 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          newStatus === status.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {newStatus === status.value && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className={`font-semibold ${status.color}`}>{status.label}</div>
                          <div className="text-sm text-gray-600">
                            {status.value === 'to_lov_kutilmoqda' && 'To\'lov kutilish holatiga o\'tkazish'}
                            {status.value === 'to_lov_qilindi' && 'To\'lov qilingan deb belgilash'}
                            {status.value === 'yeg_ilmoqda' && 'Yeg\'ilmoqda holatiga o\'tkazish'}
                            {status.value === 'yo_lda' && 'Yo\'lda holatiga o\'tkazish'}
                            {status.value === 'yetib_bordi' && 'Yetib borgan deb belgilash'}
                            {status.value === 'yakunlandi' && 'Buyurtmani yakunlash'}
                            {status.value === 'bekor_qilindi' && 'Buyurtmani bekor qilish'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {newStatus === 'bekor_qilindi' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bekor qilish sababi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Buyurtmani bekor qilish sababini kiriting..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Bekor qilish
          </button>
          
          {availableStatuses.length > 0 && newStatus && (
            <button
              onClick={handleStatusUpdate}
              disabled={loading || (newStatus === 'bekor_qilindi' && !reason.trim())}
              className={`w-full sm:w-auto ${
                newStatus === 'yakunlandi' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : newStatus === 'bekor_qilindi'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yangilanmoqda...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Status yangilash
                </>
              )}
            </button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  )
}
