import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerOfferDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'offers';

  // Mock data for offer detail
  const [offerData] = useState({
    id: id,
    requestId: 1,
    requestTitle: 'Rebar Ø12, 20 tons',
    status: 'pending',
    price: '$710/t',
    totalAmount: '$14,200',
    deliveryDate: '2024-07-27',
    createdDate: '2024-01-11',
    message: 'We can deliver within 2 days with full quality certification. Our steel meets all ASTM A615 requirements.',
    buyer: {
      name: 'Apex Construction',
      company: 'Apex Construction Ltd',
      rating: 4.8,
      completedOrders: 156,
      location: 'Toshkent, Uzbekistan',
      contact: '+998 90 123 45 67'
    },
    offerDetails: {
      quantity: '20 tons',
      unitPrice: '$710/t',
      totalPrice: '$14,200',
      deliveryTime: '2 days',
      paymentTerms: '50% advance, 50% on delivery',
      warranty: '1 year',
      certifications: ['ASTM A615', 'ISO 9001', 'Quality Certificate']
    },
    timeline: [
      {
        date: '2024-01-11',
        status: 'submitted',
        description: 'Taklif yuborildi'
      },
      {
        date: '2024-01-12',
        status: 'viewed',
        description: 'Buyer tomonidan ko\'rildi'
      }
    ]
  });

  const handleBack = () => {
    navigate(`/seller/orders?tab=${returnTab}`);
  };

  const handleEditOffer = () => {
    navigate(`/seller/edit-offer/${id}`, {
      state: { returnTab, offerData }
    });
  };

  const handleViewRequest = () => {
    navigate(`/seller/request-details/${offerData.requestId}`, {
      state: { returnTab }
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'counter-offer':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'accepted':
        return 'Qabul qilingan'
      case 'rejected':
        return 'Rad etilgan'
      case 'counter-offer':
        return 'Qarshi taklif'
      default:
        return status
    }
  };

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'submitted':
        return 'send'
      case 'viewed':
        return 'visibility'
      case 'accepted':
        return 'check_circle'
      case 'rejected':
        return 'cancel'
      default:
        return 'circle'
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
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Taklif tafsilotlari</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Offer Status */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(offerData.status)}`}>
                  {getStatusDisplayName(offerData.status)}
                </span>
                <h2 className="mt-2 text-xl font-bold text-gray-900">{offerData.requestTitle}</h2>
                <p className="text-sm text-gray-600 mt-1">Taklif yuborilgan: {offerData.createdDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Narx:</span>
                <p className="text-gray-900 text-lg font-semibold">{offerData.price}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Jami summa:</span>
                <p className="text-gray-900 text-lg font-semibold">{offerData.totalAmount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Yetkazib berish:</span>
                <p className="text-gray-900">{offerData.deliveryDate}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Holat:</span>
                <p className="text-gray-900">{getStatusDisplayName(offerData.status)}</p>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer ma'lumotlari</h3>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#6C4FFF]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6C4FFF]">person</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{offerData.buyer.name}</h4>
                <p className="text-sm text-gray-600">{offerData.buyer.company}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                    {offerData.buyer.rating}
                  </span>
                  <span>{offerData.buyer.completedOrders} buyurtma</span>
                  <span>{offerData.buyer.location}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Tel: {offerData.buyer.contact}</p>
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Taklif tafsilotlari</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Miqdor:</span>
                  <p className="text-gray-900">{offerData.offerDetails.quantity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Birlik narxi:</span>
                  <p className="text-gray-900">{offerData.offerDetails.unitPrice}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Jami narx:</span>
                  <p className="text-gray-900 font-semibold">{offerData.offerDetails.totalPrice}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Yetkazib berish vaqti:</span>
                  <p className="text-gray-900">{offerData.offerDetails.deliveryTime}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">To'lov shartlari:</span>
                  <p className="text-gray-900">{offerData.offerDetails.paymentTerms}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Kafolat:</span>
                  <p className="text-gray-900">{offerData.offerDetails.warranty}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <span className="font-medium text-gray-600 text-sm">Sertifikatlar:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {offerData.offerDetails.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-[#6C4FFF]/10 text-[#6C4FFF] rounded-full text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Xabar</h3>
            <p className="text-gray-700 leading-relaxed">{offerData.message}</p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Jarayon</h3>
            <div className="space-y-3">
              {offerData.timeline.map((item, index) => (
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
        </main>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-200 space-y-2">
          <button
            onClick={handleEditOffer}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Tahrirlash
          </button>
          <button
            onClick={handleViewRequest}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            So'rovni ko'rish
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerOfferDetail;
