import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import CounterOfferModal from '../../components/CounterOfferModal'

const OfferDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [offer, setOffer] = useState(null)
  const [rfq, setRfq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch offer details
    const fetchOfferDetails = async () => {
      try {
        // Mock data - in real app, this would be an API call
        const mockOffer = {
          id: parseInt(id),
          rfqId: 1,
          supplier: {
            id: 1,
            name: 'SteelCorp Ltd',
            rating: 4.8,
            totalOrders: 156,
            responseTime: '2 hours',
            location: 'Tashkent, Uzbekistan',
            verified: true
          },
          product: {
            brand: 'SteelCorp',
            grade: 'Grade 60',
            specifications: 'ASTM A615 compliant',
            photos: [
              'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Steel+Product+1',
              'https://via.placeholder.com/400x300/059669/FFFFFF?text=Steel+Product+2'
            ]
          },
          pricePerUnit: 710,
          totalAmount: 14200,
          currency: 'USD',
          deliveryDate: '2024-01-25',
          deliveryTerms: 'FOB Tashkent',
          deliveryLocation: 'Tashkent, Uzbekistan',
          status: 'pending',
          message: 'High quality Grade 60 steel bars available. We can deliver within 2 days of order confirmation.',
          specialConditions: 'Payment required before delivery',
          createdDate: '2024-01-15',
          validUntil: '2024-01-22'
        }

        const mockRFQ = {
          id: 1,
          title: 'Rebar Ø12, 20 tons',
          category: 'Steel',
          subcategory: 'Rebar',
          volume: 20,
          unit: 'tons',
          deliveryLocation: 'Tashkent',
          deliveryDate: '2024-01-25',
          paymentMethod: 'bank',
          specifications: {
            diameter: '12mm',
            length: '12m',
            grade: 'Grade 60',
            standard: 'ASTM A615'
          }
        }

        setOffer(mockOffer)
        setRfq(mockRFQ)
      } catch (error) {
        console.error('Error fetching offer details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOfferDetails()
  }, [id])

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'counter_offered':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'accepted':
        return 'Qabul qilingan'
      case 'rejected':
        return 'Rad etilgan'
      case 'counter_offered':
        return 'Qarshi taklif'
      default:
        return status
    }
  }

  const handleAcceptOffer = () => {
    console.log('Accepting offer:', offer.id)
    // In real app, this would make an API call
    alert('Taklif qabul qilindi! Buyurtma yaratiladi.')
    const returnTab = new URLSearchParams(location.search).get('returnTab') || 'offers'
    navigate(`/buyer/orders?tab=${returnTab}`)
  }

  const handleRejectOffer = () => {
    console.log('Rejecting offer:', offer.id)
    // In real app, this would make an API call
    alert('Taklif rad etildi!')
    const returnTab = new URLSearchParams(location.search).get('returnTab') || 'offers'
    navigate(`/buyer/orders?tab=${returnTab}`)
  }

  const handleCounterOffer = () => {
    setShowCounterOfferModal(true)
  }

  const handleCounterOfferSubmit = async (counterOfferData) => {
    try {
      console.log('Submitting counter offer:', counterOfferData)
      // In real app, this would make an API call
      alert('Qarshi taklif muvaffaqiyatli yuborildi!')
      setShowCounterOfferModal(false)
    } catch (error) {
      console.error('Counter offer submission error:', error)
      throw error
    }
  }

  const handleChatWithSupplier = () => {
    console.log('Opening chat with supplier:', offer.supplier.id)
    // In real app, this would open chat
    alert('Chat ochiladi!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Taklif topilmadi</h3>
          <p className="text-gray-500 mb-4">Bunday ID bilan taklif mavjud emas</p>
          <button
            onClick={() => {
              const returnTab = new URLSearchParams(location.search).get('returnTab') || 'offers'
              navigate(`/buyer/orders?tab=${returnTab}`)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const returnTab = new URLSearchParams(location.search).get('returnTab') || 'offers'
                  navigate(`/buyer/orders?tab=${returnTab}`)
                }}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-gray-900">Taklif #{offer.id}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(offer.status)}`}>
                {getStatusDisplayName(offer.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {/* Supplier Info */}
        <div className="bg-white p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900">{offer.supplier.name}</h2>
                {offer.supplier.verified && (
                  <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{offer.supplier.location}</p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                  <span>{offer.supplier.rating}</span>
                </div>
                <span>{offer.supplier.totalOrders} buyurtma</span>
                <span>{offer.supplier.responseTime} javob</span>
              </div>
            </div>
            <button
              onClick={handleChatWithSupplier}
              className="p-2 text-blue-600 hover:text-blue-800"
            >
              <span className="material-symbols-outlined text-xl">chat</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Mahsulot ma'lumotlari</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">Brend</label>
              <p className="text-sm font-medium text-gray-900">{offer.product.brand}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sifat</label>
              <p className="text-sm font-medium text-gray-900">{offer.product.grade}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-500">Spetsifikatsiyalar</label>
              <p className="text-sm text-gray-900">{offer.product.specifications}</p>
            </div>
          </div>

          {/* Product Photos */}
          {offer.product.photos && offer.product.photos.length > 0 && (
            <div className="mb-4">
              <label className="text-sm text-gray-500 mb-2 block">Mahsulot rasmlari</label>
              <div className="flex gap-2 overflow-x-auto">
                {offer.product.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Product ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Narx ma'lumotlari</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">Birlik narxi</label>
              <p className="text-lg font-semibold text-gray-900">${offer.pricePerUnit}/{rfq.unit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Jami summa</label>
              <p className="text-lg font-semibold text-green-600">${offer.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Valyuta</label>
              <p className="text-sm font-medium text-gray-900">{offer.currency}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Miqdor</label>
              <p className="text-sm font-medium text-gray-900">{rfq.volume} {rfq.unit}</p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib berish</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">Yetkazib berish sanasi</label>
              <p className="text-sm font-medium text-gray-900">{offer.deliveryDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Shartlar</label>
              <p className="text-sm font-medium text-gray-900">{offer.deliveryTerms}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-500">Manzil</label>
              <p className="text-sm font-medium text-gray-900">{offer.deliveryLocation}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {offer.message && (
          <div className="bg-white p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sotuvchi xabari</h3>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{offer.message}</p>
          </div>
        )}

        {/* Special Conditions */}
        {offer.specialConditions && (
          <div className="bg-white p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Maxsus shartlar</h3>
            <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{offer.specialConditions}</p>
          </div>
        )}

        {/* RFQ Reference */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">So'rov ma'lumotlari</h3>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">{rfq.title}</p>
            <p className="text-xs text-gray-600">RFQ #{rfq.id}</p>
          </div>
        </div>

        {/* Actions */}
        {offer.status === 'pending' && (
          <div className="bg-white p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Amallar</h3>
            <div className="space-y-3">
              <button
                onClick={handleAcceptOffer}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Taklifni qabul qilish
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCounterOffer}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Qarshi taklif
                </button>
                <button
                  onClick={handleRejectOffer}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Rad etish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Vaqt jadvali</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Taklif yuborildi</p>
                <p className="text-xs text-gray-500">{offer.createdDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Amal qilish muddati</p>
                <p className="text-xs text-gray-500">{offer.validUntil}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Offer Modal */}
      <CounterOfferModal
        isOpen={showCounterOfferModal}
        onClose={() => setShowCounterOfferModal(false)}
        offer={offer}
        onSubmit={handleCounterOfferSubmit}
      />
    </div>
  )
}

export default OfferDetail
