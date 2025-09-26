import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrderDetails = async () => {
      try {
        // Mock data - in real app, this would be an API call
        const mockOrder = {
          id: parseInt(id),
          orderNumber: 'ORD-2024-001',
          rfqId: 3,
          rfqTitle: 'Steel Beams I-200, 10 pieces',
          supplier: {
            id: 1,
            name: 'SteelCorp Ltd',
            phone: '+998901234567',
            email: 'info@steelcorp.uz',
            location: 'Tashkent, Uzbekistan',
            rating: 4.8
          },
          product: {
            brand: 'SteelCorp',
            grade: 'I-200, Grade S235',
            specifications: 'Steel beams for construction',
            quantity: 10,
            unit: 'pieces'
          },
          totalAmount: 12000,
          currency: 'USD',
          status: 'in_transit',
          paymentStatus: 'paid',
          paymentMethod: 'bank',
          orderDate: '2024-01-18',
          deliveryDate: '2024-01-20',
          estimatedDeliveryDate: '2024-01-22',
          actualDeliveryDate: null,
          trackingNumber: 'TRK001234',
          deliveryAddress: '123 Main Street, Tashkent, Uzbekistan',
          deliveryContact: {
            name: 'John Doe',
            phone: '+998901234567'
          },
          contractUrl: 'https://example.com/contract.pdf',
          invoiceUrl: 'https://example.com/invoice.pdf',
          paymentReference: 'PAY-2024-001',
          statusHistory: [
            {
              status: 'created',
              statusText: 'Yaratilgan',
              date: '2024-01-18T10:00:00Z',
              comment: 'Buyurtma yaratildi'
            },
            {
              status: 'contract_generated',
              statusText: 'Shartnoma yaratilgan',
              date: '2024-01-18T11:00:00Z',
              comment: 'Shartnoma tayyorlandi'
            },
            {
              status: 'awaiting_payment',
              statusText: 'To\'lov kutilmoqda',
              date: '2024-01-18T12:00:00Z',
              comment: 'To\'lov kutilmoqda'
            },
            {
              status: 'payment_received',
              statusText: 'To\'lov qabul qilingan',
              date: '2024-01-18T14:00:00Z',
              comment: 'To\'lov tasdiqlandi'
            },
            {
              status: 'in_preparation',
              statusText: 'Tayyorlanmoqda',
              date: '2024-01-19T09:00:00Z',
              comment: 'Mahsulot tayyorlanmoqda'
            },
            {
              status: 'in_transit',
              statusText: 'Yo\'lda',
              date: '2024-01-20T08:00:00Z',
              comment: 'Yetkazib berish yo\'lida'
            }
          ]
        }

        setOrder(mockOrder)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id])

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800'
      case 'contract_generated':
        return 'bg-indigo-100 text-indigo-800'
      case 'awaiting_payment':
        return 'bg-yellow-100 text-yellow-800'
      case 'payment_received':
        return 'bg-green-100 text-green-800'
      case 'in_preparation':
        return 'bg-orange-100 text-orange-800'
      case 'in_transit':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'created':
        return 'Yaratilgan'
      case 'contract_generated':
        return 'Shartnoma yaratilgan'
      case 'awaiting_payment':
        return 'To\'lov kutilmoqda'
      case 'payment_received':
        return 'To\'lov qabul qilingan'
      case 'in_preparation':
        return 'Tayyorlanmoqda'
      case 'in_transit':
        return 'Yo\'lda'
      case 'delivered':
        return 'Yetkazib berilgan'
      case 'confirmed':
        return 'Tasdiqlangan'
      case 'completed':
        return 'Yakunlangan'
      case 'cancelled':
        return 'Bekor qilingan'
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusName = (status) => {
    switch (status) {
      case 'paid':
        return 'To\'langan'
      case 'pending':
        return 'To\'lov kutilmoqda'
      case 'failed':
        return 'To\'lov amalga oshmadi'
      default:
        return status
    }
  }

  const handleDownloadContract = () => {
    console.log('Downloading contract:', order.contractUrl)
    // In real app, this would download the file
    alert('Shartnoma yuklab olinmoqda...')
  }

  const handleDownloadInvoice = () => {
    console.log('Downloading invoice:', order.invoiceUrl)
    // In real app, this would download the file
    alert('Hisob-faktura yuklab olinmoqda...')
  }

  const handleTrackOrder = () => {
    console.log('Tracking order:', order.trackingNumber)
    // In real app, this would open tracking page
    alert('Kuzatish sahifasi ochiladi...')
  }

  const handleContactSupplier = () => {
    console.log('Contacting supplier:', order.supplier.id)
    // In real app, this would open contact form or chat
    alert('Sotuvchi bilan aloqa...')
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Buyurtma topilmadi</h3>
          <p className="text-gray-500 mb-4">Bunday ID bilan buyurtma mavjud emas</p>
          <button
            onClick={() => {
              const returnTab = new URLSearchParams(location.search).get('returnTab') || 'orders'
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
                  const returnTab = new URLSearchParams(location.search).get('returnTab') || 'orders'
                  navigate(`/buyer/orders?tab=${returnTab}`)
                }}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-gray-900">{order.orderNumber}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                {getStatusDisplayName(order.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {/* Order Summary */}
        <div className="bg-white p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{order.rfqTitle}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">Buyurtma raqami</label>
              <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Buyurtma sanasi</label>
              <p className="text-sm font-medium text-gray-900">{order.orderDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Jami summa</label>
              <p className="text-lg font-semibold text-green-600">${order.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">To'lov holati</label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {getPaymentStatusName(order.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Sotuvchi ma'lumotlari</h3>
          
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">{order.supplier.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{order.supplier.location}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                <span className="text-xs text-gray-600">{order.supplier.rating}</span>
              </div>
              <div className="text-xs text-gray-500">
                <p>Tel: {order.supplier.phone}</p>
                <p>Email: {order.supplier.email}</p>
              </div>
            </div>
            <button
              onClick={handleContactSupplier}
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
              <p className="text-sm font-medium text-gray-900">{order.product.brand}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sifat</label>
              <p className="text-sm font-medium text-gray-900">{order.product.grade}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Miqdor</label>
              <p className="text-sm font-medium text-gray-900">{order.product.quantity} {order.product.unit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Valyuta</label>
              <p className="text-sm font-medium text-gray-900">{order.currency}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-500">Spetsifikatsiyalar</label>
              <p className="text-sm text-gray-900">{order.product.specifications}</p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib berish</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">Yetkazib berish sanasi</label>
              <p className="text-sm font-medium text-gray-900">{order.deliveryDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Taxminiy yetkazib berish</label>
              <p className="text-sm font-medium text-gray-900">{order.estimatedDeliveryDate}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-gray-500">Manzil</label>
              <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Kontakt shaxs</label>
              <p className="text-sm font-medium text-gray-900">{order.deliveryContact.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Telefon</label>
              <p className="text-sm font-medium text-gray-900">{order.deliveryContact.phone}</p>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-500">Kuzatish raqami</label>
                  <p className="text-sm font-medium text-gray-900">{order.trackingNumber}</p>
                </div>
                <button
                  onClick={handleTrackOrder}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Kuzatish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov ma'lumotlari</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500">To'lov usuli</label>
              <p className="text-sm font-medium text-gray-900">
                {order.paymentMethod === 'bank' ? 'Bank orqali' : 'Naqd pul'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">To'lov havolasi</label>
              <p className="text-sm font-medium text-gray-900">{order.paymentReference}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Hujjatlar</h3>
          
          <div className="space-y-3">
            {order.contractUrl && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-600">description</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shartnoma</p>
                    <p className="text-xs text-gray-500">PDF hujjat</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadContract}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Yuklab olish
                </button>
              </div>
            )}

            {order.invoiceUrl && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-600">receipt</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hisob-faktura</p>
                    <p className="text-xs text-gray-500">PDF hujjat</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadInvoice}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Yuklab olish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Holat tarixi</h3>
          
          <div className="space-y-4">
            {order.statusHistory.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  index === order.statusHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{item.statusText}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                    </p>
                  </div>
                  {item.comment && (
                    <p className="text-xs text-gray-500">{item.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
