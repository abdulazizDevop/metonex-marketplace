import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'requests';

  // Mock data for request detail
  const [requestData] = useState({
    id: id,
    title: 'Rebar Ø12, 20 tons',
    status: 'active',
    category: 'steel',
    quantity: '20 tons',
    specifications: 'Grade 60, ASTM A615',
    deadline: '2024-07-25',
    createdDate: '2024-01-10',
    buyer: {
      name: 'Apex Construction',
      company: 'Apex Construction Ltd',
      rating: 4.8,
      completedOrders: 156,
      location: 'Toshkent, Uzbekistan'
    },
    requirements: [
      'Grade 60 steel rebar',
      'ASTM A615 specification',
      'Minimum 20 tons quantity',
      'Delivery within 15 days',
      'Quality certificates required'
    ],
    offers: [
      {
        id: 1,
        supplier: 'SteelCorp Ltd',
        price: '$710/t',
        totalAmount: '$14,200',
        deliveryTime: '10 days',
        rating: 4.9,
        message: 'We can provide Grade 60 rebar with full certification',
        submittedAt: '2024-01-11'
      },
      {
        id: 2,
        supplier: 'MetalWorks Inc',
        price: '$720/t',
        totalAmount: '$14,400',
        deliveryTime: '12 days',
        rating: 4.7,
        message: 'Premium quality steel with fast delivery',
        submittedAt: '2024-01-12'
      }
    ],
    lowestPrice: '$710/t',
    fastestDelivery: '10 days',
    offersCount: 2
  });

  const [flowData, setFlowData] = useState({
    flowStep: null,
    returnPath: null
  });

  // Initialize flow data from location state
  React.useEffect(() => {
    if (location.state) {
      setFlowData({
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || `/seller/orders?tab=${returnTab}`
      });
    }
  }, [location.state, returnTab]);

  const handleBack = () => {
    if (flowData.returnPath) {
      navigate(flowData.returnPath);
    } else {
      navigate(`/seller/orders?tab=${returnTab}`);
    }
  };

  const handleRespondToRequest = () => {
    // Navigate to offer creation page (we'll create this)
    navigate(`/seller/offer-details/new`, {
      state: { 
        returnTab, 
        requestData,
        flowStep: 'offer-creation',
        returnPath: `/seller/request-details/${id}`
      }
    });
  };

  const handleViewOffer = (offerId) => {
    navigate(`/seller/offer-details/${offerId}`, {
      state: { 
        returnTab, 
        requestData,
        flowStep: 'offer-detail',
        returnPath: `/seller/request-details/${id}`
      }
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'active':
        return 'Faol'
      case 'pending':
        return 'Kutilmoqda'
      case 'completed':
        return 'Yakunlangan'
      case 'cancelled':
        return 'Bekor qilingan'
      default:
        return status
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
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">So'rov tafsilotlari</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Request Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(requestData.status)}`}>
                  {getStatusDisplayName(requestData.status)}
                </span>
                <h2 className="mt-2 text-xl font-bold text-gray-900">{requestData.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{requestData.specifications}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Miqdor:</span>
                <p className="text-gray-900">{requestData.quantity}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Muddat:</span>
                <p className="text-gray-900">{requestData.deadline}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Eng past narx:</span>
                <p className="text-gray-900">{requestData.lowestPrice}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Eng tez yetkazib berish:</span>
                <p className="text-gray-900">{requestData.fastestDelivery}</p>
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
                <h4 className="font-semibold text-gray-900">{requestData.buyer.name}</h4>
                <p className="text-sm text-gray-600">{requestData.buyer.company}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                    {requestData.buyer.rating}
                  </span>
                  <span>{requestData.buyer.completedOrders} buyurtma</span>
                  <span>{requestData.buyer.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Talablar</h3>
            <ul className="space-y-2">
              {requestData.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="material-symbols-outlined text-[#6C4FFF] text-sm mt-0.5">check_circle</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Takliflar ({requestData.offersCount})</h3>
              <span className="text-sm text-gray-500">Eng yaxshi takliflar</span>
            </div>
            
            <div className="space-y-3">
              {requestData.offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{offer.supplier}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                          {offer.rating}
                        </span>
                        <span>{offer.deliveryTime} kun</span>
                        <span className="font-semibold text-[#6C4FFF]">{offer.price}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{offer.message}</p>
                    </div>
                    <button
                      onClick={() => handleViewOffer(offer.id)}
                      className="ml-3 px-3 py-1 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm"
                    >
                      Ko'rish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Action Button */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleRespondToRequest}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Javob berish
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerRequestDetail;
