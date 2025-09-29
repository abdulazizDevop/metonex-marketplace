import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { documentApi, documentValidation, documentTypes } from '../../utils/documentApi'
import DocumentTestPanel from '../../components/DocumentTestPanel'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Document upload states
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('contract') // contract, invoice, ttn
  const [uploadForm, setUploadForm] = useState({
    title: '',
    file: null
  })
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState([])
  const [userRole, setUserRole] = useState('buyer') // buyer or supplier

  useEffect(() => {
    // Check user role from localStorage
    const storedRole = localStorage.getItem('userRole') || 'buyer'
    setUserRole(storedRole)

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
        
        // Load order documents from API
        await loadOrderDocuments(parseInt(id))
        
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id])

  // Load order documents
  const loadOrderDocuments = async (orderId) => {
    try {
      const response = await documentApi.getOrderDocuments(orderId)
      setDocuments(response.data || response)
    } catch (error) {
      console.error('Error loading order documents:', error)
      // Keep mock data on error for development
      setDocuments([
        {
          id: 1,
          title: 'Asosiy shartnoma',
          type: 'contract',
          file_name: 'contract_ord_001.pdf',
          human_readable_size: '2.3 MB',
          created_at: '2024-01-18',
          user_info: { role: 'supplier' },
          status: 'verified'
        },
        {
          id: 2,
          title: 'Hisob-faktura #001',
          type: 'invoice',
          file_name: 'invoice_001.pdf',
          human_readable_size: '1.8 MB',
          created_at: '2024-01-19',
          user_info: { role: 'supplier' },
          status: 'pending'
        }
      ])
    }
  }

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

  // Document upload handlers
  const handleUploadDocument = (type) => {
    setUploadType(type)
    const typeLabels = {
      'contract': 'Shartnoma',
      'invoice': 'Hisob-faktura', 
      'ttn': 'TTN (Transport hujjati)'
    }
    setUploadForm({
      title: typeLabels[type],
      file: null
    })
    setShowUploadModal(true)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file
      const validation = documentValidation.validateFile(file)
      if (!validation.isValid) {
        alert(`Fayl validatsiya xatosi:\n${validation.errors.join('\n')}`)
        return
      }
      setUploadForm(prev => ({ ...prev, file }))
    }
  }

  const handleUploadSubmit = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      alert('Iltimos, barcha maydonlarni to\'ldiring')
      return
    }

    setUploading(true)
    
    try {
      const documentData = {
        title: uploadForm.title,
        type: uploadType,
        orderId: parseInt(id),
        description: `${documentTypes.getLabel(uploadType)} for order ${order?.orderNumber}`
      }

      const response = await documentApi.uploadDocument(documentData, uploadForm.file)
      
      // Reload documents list
      await loadOrderDocuments(parseInt(id))
      
      setShowUploadModal(false)
      setUploadForm({ title: '', file: null })
      alert('Hujjat muvaffaqiyatli yuklandi!')
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Hujjat yuklashda xatolik yuz berdi: ' + (error.message || 'Noma\'lum xatolik'))
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadDocument = async (doc) => {
    try {
      await documentApi.downloadDocument(doc.id)
    } catch (error) {
      console.error('Download error:', error)
      alert('Hujjat yuklab olishda xatolik yuz berdi')
    }
  }

  const handleDeleteDocument = async (docId) => {
    if (confirm('Hujjatni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await documentApi.deleteDocument(docId)
        await loadOrderDocuments(parseInt(id))
        alert('Hujjat o\'chirildi')
      } catch (error) {
        console.error('Delete error:', error)
        alert('Hujjat o\'chirishda xatolik yuz berdi')
      }
    }
  }

  const getDocumentTypeLabel = (type) => {
    return documentTypes.getLabel(type)
  }

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentStatusText = (status) => {
    const statuses = {
      'verified': 'Tasdiqlangan',
      'pending': 'Kutilmoqda',
      'rejected': 'Rad etilgan'
    }
    return statuses[status] || status
  }

  const canUploadDocument = (type) => {
    // Check if user has permission to upload this document type
    if (userRole === 'supplier') {
      return true // Suppliers can upload all document types
    } else if (userRole === 'buyer') {
      return false // Buyers typically can't upload order documents
    }
    return false
  }

  const canDeleteDocument = (doc) => {
    // User can delete their own uploaded documents that are not verified
    const uploadedByCurrentUser = doc.uploadedBy === userRole || 
                                  (doc.user_info && doc.user_info.role === userRole)
    return uploadedByCurrentUser && doc.status !== 'verified'
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Hujjatlar</h3>
            {userRole === 'supplier' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUploadDocument('contract')}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  Shartnoma
                </button>
                <button
                  onClick={() => handleUploadDocument('invoice')}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  Hisob-faktura
                </button>
                <button
                  onClick={() => handleUploadDocument('ttn')}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  TTN
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-gray-400">description</span>
                </div>
                <p className="text-gray-500 text-sm">Hech qanday hujjat yuklanmagan</p>
                {userRole === 'supplier' && (
                  <p className="text-gray-400 text-xs mt-1">Hujjat yuklash uchun yuqoridagi tugmalardan foydalaning</p>
                )}
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 text-lg">
                        {documentTypes.getIcon(doc.document_type || doc.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                      <p className="text-xs text-gray-500">
                        {getDocumentTypeLabel(doc.document_type || doc.type)} • {doc.human_readable_size || doc.fileSize}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusBadge(doc.status)}`}>
                          {getDocumentStatusText(doc.status)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {(doc.user_info?.role || doc.uploadedBy) === 'supplier' ? 'Sotuvchi' : 'Xaridor'} • 
                          {doc.created_at?.split('T')[0] || doc.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Yuklab olish"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                    {canDeleteDocument(doc) && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="O'chirish"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
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

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {getDocumentTypeLabel(uploadType)} yuklash
              </h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadForm({ title: '', file: null })
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hujjat nomi
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Hujjat nomini kiriting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Order Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Buyurtma: {order?.orderNumber}</p>
                <p className="text-xs text-gray-500">{order?.rfqTitle}</p>
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fayl
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    id="file-upload-order"
                  />
                  <label htmlFor="file-upload-order" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-gray-400">cloud_upload</span>
                      <span className="text-sm text-gray-600">
                        {uploadForm.file ? uploadForm.file.name : 'Faylni tanlang yoki sudrab tashlang'}
                      </span>
                      <span className="text-xs text-gray-500">PDF, JPG, PNG, DOC (max 10MB)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadForm({ title: '', file: null })
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={uploading}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!uploadForm.title || !uploadForm.file || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Yuklanmoqda...
                  </div>
                ) : (
                  'Yuklash'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Panel - Development only */}
      {import.meta.env?.DEV && (
        <DocumentTestPanel orderId={parseInt(id)} />
      )}
    </div>
  )
}

export default OrderDetail
