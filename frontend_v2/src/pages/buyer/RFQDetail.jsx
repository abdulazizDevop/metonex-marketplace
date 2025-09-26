import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

const RFQDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [rfq, setRfq] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch RFQ details
    const fetchRFQDetails = async () => {
      try {
        // Mock data - in real app, this would be an API call
        const mockRFQ = {
          id: parseInt(id),
          title: 'Rebar Ø12, 20 tons',
          status: 'active',
          category: 'Steel',
          subcategory: 'Rebar',
          brand: 'Grade 60',
          grade: 'ASTM A615',
          volume: 20,
          unit: 'tons',
          deliveryLocation: 'Tashkent',
          deliveryDate: '2024-01-25',
          paymentMethod: 'bank',
          expiresAt: '2024-01-20T23:59:59Z',
          createdDate: '2024-01-10',
          specifications: {
            diameter: '12mm',
            length: '12m',
            grade: 'Grade 60',
            standard: 'ASTM A615'
          },
          message: 'High quality rebar needed for construction project',
          specialRequirements: 'Must be corrosion resistant'
        }

        const mockOffers = [
          {
            id: 1,
            supplier: 'SteelCorp Ltd',
            supplierRating: 4.8,
            pricePerUnit: 710,
            totalAmount: 14200,
            deliveryDate: '2024-01-23',
            deliveryTerms: 'FOB Tashkent',
            message: 'High quality Grade 60 steel bars available',
            status: 'pending',
            createdDate: '2024-01-15',
            product: {
              brand: 'SteelCorp',
              grade: 'Grade 60',
              specifications: 'ASTM A615 compliant'
            }
          },
          {
            id: 2,
            supplier: 'MetalWorks Inc',
            supplierRating: 4.5,
            pricePerUnit: 720,
            totalAmount: 14400,
            deliveryDate: '2024-01-25',
            deliveryTerms: 'CIF Tashkent',
            message: 'Best price with fast delivery',
            status: 'pending',
            createdDate: '2024-01-16',
            product: {
              brand: 'MetalWorks',
              grade: 'Grade 60',
              specifications: 'Premium quality steel'
            }
          },
          {
            id: 3,
            supplier: 'SteelMaster Ltd',
            supplierRating: 4.2,
            pricePerUnit: 750,
            totalAmount: 15000,
            deliveryDate: '2024-01-27',
            deliveryTerms: 'EXW Factory',
            message: 'Higher quality steel available',
            status: 'rejected',
            createdDate: '2024-01-17',
            product: {
              brand: 'SteelMaster',
              grade: 'Grade 60+',
              specifications: 'Enhanced corrosion resistance'
            }
          }
        ]

        setRfq(mockRFQ)
        setOffers(mockOffers)
      } catch (error) {
        console.error('Error fetching RFQ details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRFQDetails()
  }, [id])

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'active':
        return 'Faol'
      case 'completed':
        return 'Yakunlangan'
      case 'cancelled':
        return 'Bekor qilingan'
      case 'expired':
        return 'Muddati tugagan'
      default:
        return status
    }
  }

  const getOfferStatusColor = (status) => {
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

  const getOfferStatusName = (status) => {
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

  const handleAcceptOffer = (offerId) => {
    console.log('Accepting offer:', offerId)
    // In real app, this would make an API call
    alert('Taklif qabul qilindi!')
  }

  const handleRejectOffer = (offerId) => {
    console.log('Rejecting offer:', offerId)
    // In real app, this would make an API call
    alert('Taklif rad etildi!')
  }

  const handleCounterOffer = (offerId) => {
    console.log('Making counter offer:', offerId)
    // In real app, this would open a counter offer modal
    alert('Qarshi taklif yuboriladi!')
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

  if (!rfq) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">So'rov topilmadi</h3>
          <p className="text-gray-500 mb-4">Bunday ID bilan so'rov mavjud emas</p>
          <button
            onClick={() => {
              const returnTab = new URLSearchParams(location.search).get('returnTab') || 'requests'
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
                  const returnTab = new URLSearchParams(location.search).get('returnTab') || 'requests'
                  navigate(`/buyer/orders?tab=${returnTab}`)
                }}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-gray-900">So'rov #{rfq.id}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(rfq.status)}`}>
                {getStatusDisplayName(rfq.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {/* RFQ Details */}
        <div className="bg-white p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{rfq.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">Kategoriya</label>
              <p className="text-sm font-medium text-gray-900">{rfq.category}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sub-kategoriya</label>
              <p className="text-sm font-medium text-gray-900">{rfq.subcategory}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Brend</label>
              <p className="text-sm font-medium text-gray-900">{rfq.brand}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sifat</label>
              <p className="text-sm font-medium text-gray-900">{rfq.grade}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Miqdor</label>
              <p className="text-sm font-medium text-gray-900">{rfq.volume} {rfq.unit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Yetkazib berish joyi</label>
              <p className="text-sm font-medium text-gray-900">{rfq.deliveryLocation}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Yetkazib berish sanasi</label>
              <p className="text-sm font-medium text-gray-900">{rfq.deliveryDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">To'lov usuli</label>
              <p className="text-sm font-medium text-gray-900">
                {rfq.paymentMethod === 'bank' ? 'Bank orqali' : 'Naqd pul'}
              </p>
            </div>
          </div>

          {rfq.message && (
            <div className="mb-4">
              <label className="text-sm text-gray-500">Xabar</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{rfq.message}</p>
            </div>
          )}

          {rfq.specialRequirements && (
            <div className="mb-4">
              <label className="text-sm text-gray-500">Maxsus talablar</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{rfq.specialRequirements}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Yaratilgan: {rfq.createdDate}
            </div>
            <div className="text-xs text-gray-500">
              Muddati: {new Date(rfq.expiresAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Offers Section */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Takliflar ({offers.length})</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Sotuvchilarni eslatish
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
              <p className="text-gray-500">Hali takliflar yo'q</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{offer.supplier}</h4>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                          <span className="text-xs text-gray-600">{offer.supplierRating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{offer.product.brand} - {offer.product.grade}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOfferStatusColor(offer.status)}`}>
                      {getOfferStatusName(offer.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-gray-500">Birlik narxi</label>
                      <p className="text-sm font-semibold text-gray-900">${offer.pricePerUnit}/{rfq.unit}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Jami summa</label>
                      <p className="text-sm font-semibold text-gray-900">${offer.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Yetkazib berish</label>
                      <p className="text-xs text-gray-900">{offer.deliveryDate}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Shartlar</label>
                      <p className="text-xs text-gray-900">{offer.deliveryTerms}</p>
                    </div>
                  </div>

                  {offer.message && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{offer.message}</p>
                    </div>
                  )}

                  {offer.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Qabul qilish
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Rad etish
                      </button>
                      <button
                        onClick={() => handleCounterOffer(offer.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Qarshi taklif
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    {offer.createdDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RFQDetail
