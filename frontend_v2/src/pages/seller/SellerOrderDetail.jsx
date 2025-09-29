import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'orders';

  // Mock data for order detail
  const [orderData] = useState({
    id: id,
    requestId: 2,
    requestTitle: 'Concrete Mix C25, 50 m³',
    status: 'in_preparation',
    totalAmount: '$4,250',
    orderDate: '2024-01-15',
    deliveryDate: '2024-07-29',
    paymentStatus: 'paid',
    trackingNumber: 'TRK001234',
    buyer: {
      name: 'BuildCorp Ltd',
      company: 'BuildCorp Construction',
      rating: 4.9,
      completedOrders: 89,
      location: 'Samarqand, Uzbekistan',
      contact: '+998 91 234 56 78'
    },
    orderDetails: {
      quantity: '50 m³',
      unitPrice: '$85/m³',
      totalPrice: '$4,250',
      deliveryAddress: 'Samarqand shahar, Registon ko\'chasi, 15-uy',
      specialInstructions: 'Concrete must be delivered before 10 AM',
      paymentMethod: 'Bank transfer'
    },
    timeline: [
      {
        date: '2024-01-15',
        status: 'ordered',
        description: 'Buyurtma qabul qilindi'
      },
      {
        date: '2024-01-16',
        status: 'confirmed',
        description: 'Buyurtma tasdiqlandi'
      },
      {
        date: '2024-01-17',
        status: 'preparation',
        description: 'Tayyorlash boshlandi'
      }
    ],
    documents: [
      {
        id: 1,
        type: 'contract',
        name: 'Shartnoma.pdf',
        status: 'uploaded',
        uploadedAt: '2024-01-16'
      },
      {
        id: 2,
        type: 'invoice',
        name: 'Hisob-faktura.pdf',
        status: 'pending',
        uploadedAt: null
      }
    ]
  });

  const handleBack = () => {
    navigate(`/seller/orders?tab=${returnTab}`);
  };

  const handleUpdateStatus = () => {
    navigate(`/seller/update-order-status/${id}`, {
      state: { returnTab, orderData }
    });
  };

  const handleUploadDocument = (type) => {
    navigate(`/seller/upload-document/${id}`, {
      state: { returnTab, orderData, documentType: type }
    });
  };

  const handleViewDocument = (documentId) => {
    console.log(`Viewing document ${documentId}`);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'in_preparation':
        return 'bg-orange-100 text-orange-800'
      case 'in_transit':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'in_preparation':
        return 'Tayyorlanmoqda'
      case 'in_transit':
        return 'Yo\'lda'
      case 'delivered':
        return 'Yetkazib berilgan'
      case 'cancelled':
        return 'Bekor qilingan'
      default:
        return status
    }
  };

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
  };

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'ordered':
        return 'shopping_cart'
      case 'confirmed':
        return 'check_circle'
      case 'preparation':
        return 'build'
      case 'transit':
        return 'local_shipping'
      case 'delivered':
        return 'done_all'
      default:
        return 'circle'
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'contract':
        return 'Shartnoma'
      case 'invoice':
        return 'Hisob-faktura'
      case 'ttn':
        return 'TTN'
      default:
        return type
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-gray-50">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Buyurtma tafsilotlari</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(orderData.status)}`}>
                  {getStatusDisplayName(orderData.status)}
                </span>
                <h2 className="mt-2 text-xl font-bold text-gray-900">{orderData.requestTitle}</h2>
                <p className="text-sm text-gray-600 mt-1">Buyurtma raqami: #{orderData.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Jami summa:</span>
                <p className="text-gray-900 text-lg font-semibold">{orderData.totalAmount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">To'lov holati:</span>
                <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                  {orderData.paymentStatus}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Buyurtma sanasi:</span>
                <p className="text-gray-900">{orderData.orderDate}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Yetkazib berish:</span>
                <p className="text-gray-900">{orderData.deliveryDate}</p>
              </div>
            </div>

            {orderData.trackingNumber && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Tracking raqami:</span> {orderData.trackingNumber}
                </p>
              </div>
            )}
          </div>

          {/* Buyer Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer ma'lumotlari</h3>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#6C4FFF]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6C4FFF]">person</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{orderData.buyer.name}</h4>
                <p className="text-sm text-gray-600">{orderData.buyer.company}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                    {orderData.buyer.rating}
                  </span>
                  <span>{orderData.buyer.completedOrders} buyurtma</span>
                  <span>{orderData.buyer.location}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Tel: {orderData.buyer.contact}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyurtma tafsilotlari</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Miqdor:</span>
                  <p className="text-gray-900">{orderData.orderDetails.quantity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Birlik narxi:</span>
                  <p className="text-gray-900">{orderData.orderDetails.unitPrice}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Jami narx:</span>
                  <p className="text-gray-900 font-semibold">{orderData.orderDetails.totalPrice}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">To'lov usuli:</span>
                  <p className="text-gray-900">{orderData.orderDetails.paymentMethod}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <span className="font-medium text-gray-600 text-sm">Yetkazib berish manzili:</span>
                <p className="text-gray-900 mt-1">{orderData.orderDetails.deliveryAddress}</p>
              </div>
              
              {orderData.orderDetails.specialInstructions && (
                <div className="mt-4">
                  <span className="font-medium text-gray-600 text-sm">Maxsus ko'rsatmalar:</span>
                  <p className="text-gray-900 mt-1">{orderData.orderDetails.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Jarayon</h3>
            <div className="space-y-3">
              {orderData.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#6C4FFF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#6C4FFF] text-sm">
                      {getTimelineIcon(item.status)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hujjatlar</h3>
            <div className="space-y-3">
              {orderData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6C4FFF]/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#6C4FFF]">description</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getDocumentTypeLabel(doc.type)}</p>
                      <p className="text-sm text-gray-600">{doc.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getDocumentStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    {doc.status === 'uploaded' ? (
                      <button
                        onClick={() => handleViewDocument(doc.id)}
                        className="text-[#6C4FFF] hover:text-[#5A3FE6] transition-colors"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUploadDocument(doc.type)}
                        className="text-[#6C4FFF] hover:text-[#5A3FE6] transition-colors"
                      >
                        <span className="material-symbols-outlined">upload</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Action Button */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleUpdateStatus}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Status yangilash
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerOrderDetail;
