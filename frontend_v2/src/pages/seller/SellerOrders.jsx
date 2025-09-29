import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'offers', 'orders'
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'active', 'pending', 'completed', 'cancelled'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'steel', 'concrete', 'electro'
  const [searchQuery, setSearchQuery] = useState('')

  // Handle URL parameters for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['requests', 'offers', 'orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Sample data for different tabs
  const [requestsData] = useState([
    {
      id: 1,
      title: 'Rebar Ø12, 20 tons',
      status: 'active',
      offersCount: 3,
      lowestPrice: '$710/t',
      fastestDelivery: '2 days',
      hasNewOffers: true,
      deadline: '2024-07-25',
      category: 'steel',
      quantity: '20 tons',
      specifications: 'Grade 60, ASTM A615',
      createdDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Concrete Mix C25, 50 m³',
      status: 'pending',
      offersCount: 1,
      lowestPrice: '$85/m³',
      fastestDelivery: '1 day',
      hasNewOffers: false,
      deadline: '2024-07-30',
      category: 'concrete',
      quantity: '50 m³',
      specifications: 'C25/30, 28-day strength',
      createdDate: '2024-01-12'
    }
  ]);

  const [offersData] = useState([
    {
      id: 1,
      requestId: 1,
      requestTitle: 'Rebar Ø12, 20 tons',
      buyer: 'Apex Construction',
      price: '$710/t',
      totalAmount: '$14,200',
      status: 'pending',
      category: 'steel',
      deliveryDate: '2024-07-27',
      message: 'We can deliver within 2 days',
      createdDate: '2024-01-11'
    },
    {
      id: 2,
      requestId: 2,
      requestTitle: 'Concrete Mix C25, 50 m³',
      buyer: 'BuildCorp Ltd',
      price: '$85/m³',
      totalAmount: '$4,250',
      status: 'accepted',
      category: 'concrete',
      deliveryDate: '2024-07-29',
      message: 'Best quality concrete available',
      createdDate: '2024-01-13'
    }
  ]);

  const [ordersData] = useState([
    {
      id: 1,
      requestId: 2,
      requestTitle: 'Concrete Mix C25, 50 m³',
      buyer: 'BuildCorp Ltd',
      totalAmount: '$4,250',
      status: 'in_preparation',
      category: 'concrete',
      orderDate: '2024-01-15',
      deliveryDate: '2024-07-29',
      paymentStatus: 'paid',
      trackingNumber: 'TRK001234'
    },
    {
      id: 2,
      requestId: 3,
      requestTitle: 'Steel Beams I-200, 10 pieces',
      buyer: 'SteelCorp Ltd',
      totalAmount: '$15,000',
      status: 'delivered',
      category: 'steel',
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-20',
      paymentStatus: 'paid',
      trackingNumber: 'TRK001235'
    }
  ]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'Barchasi', icon: 'apps' },
    { id: 'steel', name: 'Steel', icon: 'build' },
    { id: 'concrete', name: 'Concrete', icon: 'foundation' },
    { id: 'electro', name: 'Electro', icon: 'electrical_services' }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleRespondToRequest = (requestId) => {
    console.log(`Responding to request ${requestId}`);
    navigate(`/seller/respond-request/${requestId}`);
  };

  const handleViewRequest = (requestId) => {
    console.log(`Viewing request ${requestId}`);
    navigate(`/seller/request-details/${requestId}`, {
      state: { returnTab: activeTab }
    });
  };

  const handleViewOffer = (offerId) => {
    console.log(`Viewing offer ${offerId}`);
    navigate(`/seller/offer-details/${offerId}`, {
      state: { returnTab: activeTab }
    });
  };

  const handleViewOrder = (orderId) => {
    console.log(`Viewing order ${orderId}`);
    navigate(`/seller/order-details/${orderId}`, {
      state: { returnTab: activeTab }
    });
  };

  // Get filtered data based on active tab and filters
  const getFilteredData = () => {
    let data = [];
    
    switch (activeTab) {
      case 'requests':
        data = requestsData;
        break;
      case 'offers':
        data = offersData;
        break;
      case 'orders':
        data = ordersData;
        break;
      default:
        data = [];
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      data = data.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      data = data.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requestTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  };

  // Get sub-tabs based on active main tab
  const getSubTabs = () => {
    switch (activeTab) {
      case 'requests':
        return [
          { id: 'all', name: 'Barchasi' },
          { id: 'active', name: 'Faol' },
          { id: 'pending', name: 'Kutilmoqda' },
          { id: 'completed', name: 'Yakunlangan' }
        ];
      case 'offers':
        return [
          { id: 'all', name: 'Barchasi' },
          { id: 'pending', name: 'Kutilmoqda' },
          { id: 'accepted', name: 'Qabul qilingan' },
          { id: 'rejected', name: 'Rad etilgan' }
        ];
      case 'orders':
        return [
          { id: 'all', name: 'Barchasi' },
          { id: 'in_preparation', name: 'Tayyorlanmoqda' },
          { id: 'in_transit', name: 'Yo\'lda' },
          { id: 'delivered', name: 'Yetkazib berilgan' }
        ];
      default:
        return [];
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'in_preparation':
        return 'bg-orange-100 text-orange-800'
      case 'in_transit':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  // Get status display name
  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'active':
        return 'Faol'
      case 'pending':
        return 'Kutilmoqda'
      case 'accepted':
        return 'Qabul qilingan'
      case 'rejected':
        return 'Rad etilgan'
      case 'in_preparation':
        return 'Tayyorlanmoqda'
      case 'in_transit':
        return 'Yo\'lda'
      case 'delivered':
        return 'Yetkazib berilgan'
      case 'completed':
        return 'Yakunlangan'
      case 'cancelled':
        return 'Bekor qilingan'
      default:
        return status
    }
  };

  // Render requests tab
  const renderRequests = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="space-y-4">
        {filteredData.map((request) => (
          <div key={request.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(request.status)}`}>
                    {getStatusDisplayName(request.status)}
                  </span>
                  {request.hasNewOffers && (
                    <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-[#6C4FFF] text-white">
                      Yangi taklif
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{request.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{request.specifications}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Miqdor:</span> {request.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Muddat:</span> {request.deadline}
                  </div>
                  <div>
                    <span className="font-medium">Eng past narx:</span> {request.lowestPrice}
                  </div>
                  <div>
                    <span className="font-medium">Eng tez yetkazib berish:</span> {request.fastestDelivery}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span>{request.offersCount} ta taklif</span>
                  <span>{request.createdDate}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleRespondToRequest(request.id)}
                className="flex-1 bg-[#6C4FFF] text-white py-2 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm font-medium"
              >
                Javob berish
              </button>
              <button
                onClick={() => handleViewRequest(request.id)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Batafsil
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOffers = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="space-y-4">
        {filteredData.map((offer) => (
          <div key={offer.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(offer.status)}`}>
                  {getStatusDisplayName(offer.status)}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{offer.requestTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">Buyer: {offer.buyer}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Narx:</span> {offer.price}
                  </div>
                  <div>
                    <span className="font-medium">Jami summa:</span> {offer.totalAmount}
                  </div>
                  <div>
                    <span className="font-medium">Yetkazib berish:</span> {offer.deliveryDate}
                  </div>
                  <div>
                    <span className="font-medium">Yuborilgan:</span> {offer.createdDate}
                  </div>
                </div>
                
                {offer.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{offer.message}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleViewOffer(offer.id)}
                className="flex-1 bg-[#6C4FFF] text-white py-2 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm font-medium"
              >
                Batafsil
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOrders = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="space-y-4">
        {filteredData.map((order) => (
          <div key={order.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                  {getStatusDisplayName(order.status)}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{order.requestTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">Buyer: {order.buyer}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Jami summa:</span> {order.totalAmount}
                  </div>
                  <div>
                    <span className="font-medium">To'lov holati:</span> {order.paymentStatus}
                  </div>
                  <div>
                    <span className="font-medium">Buyurtma sanasi:</span> {order.orderDate}
                  </div>
                  <div>
                    <span className="font-medium">Yetkazib berish:</span> {order.deliveryDate}
                  </div>
                </div>
                
                {order.trackingNumber && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Tracking raqami:</span> {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleViewOrder(order.id)}
                className="flex-1 bg-[#6C4FFF] text-white py-2 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm font-medium"
              >
                Batafsil
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">So'rovlar</h2>
              <span className="text-sm text-gray-500">
                {requestsData.filter(r => r.hasNewOffers).length} yangi taklif
              </span>
            </div>
            {renderRequests()}
          </div>
        );
      case 'offers':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Takliflar</h2>
              <span className="text-sm text-gray-500">
                {offersData.filter(o => o.status === 'pending').length} kutilmoqda
              </span>
            </div>
            {renderOffers()}
          </div>
        );
      case 'orders':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Buyurtmalar</h2>
              <span className="text-sm text-gray-500">
                {ordersData.length} jami buyurtma
              </span>
            </div>
            {renderOrders()}
          </div>
        );
      default:
        return renderRequests();
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
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Buyurtmalar</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'requests', label: 'So\'rovlar', icon: 'assignment' },
            { id: 'offers', label: 'Takliflar', icon: 'local_offer' },
            { id: 'orders', label: 'Buyurtmalar', icon: 'list_alt' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#6C4FFF] text-[#6C4FFF]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                search
              </span>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#6C4FFF] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {renderTabContent()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerOrders;
