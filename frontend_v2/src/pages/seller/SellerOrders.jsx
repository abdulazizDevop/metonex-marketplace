import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';
import { userApi } from '../../utils/userApi';

const SellerOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'offers', 'orders'
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'active', 'pending', 'completed', 'cancelled'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'steel', 'concrete', 'electro'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'active', 'pending', 'accepted', 'rejected', etc.
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [flowData, setFlowData] = useState({
    fromDashboard: false,
    flowStep: null,
    returnPath: null
  });

  // Handle URL parameters for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['requests', 'offers', 'orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Reset status filter and reload data when tab changes
  useEffect(() => {
    setSelectedStatus('all');
    loadOrdersData();
  }, [activeTab]);

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        fromDashboard: location.state.fromDashboard || false,
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || null
      });
    }
  }, [location.state]);

  // Real data from API


  const [ordersData, setOrdersData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  
  // Dynamic metadata from backend
  const [categories, setCategories] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [rfqStatuses, setRfqStatuses] = useState([]);
  const [offerStatuses, setOfferStatuses] = useState([]);
  
  // Load metadata on component mount
  useEffect(() => {
    loadMetadata()
  }, [])

  // Load data when tab changes
  useEffect(() => {
    loadOrdersData()
  }, [activeTab])
  
  const loadMetadata = async () => {
    try {
      const [categoriesRes, orderStatusesRes, rfqStatusesRes, offerStatusesRes] = await Promise.allSettled([
        userApi.getCategories(),
        userApi.getOrderStatuses(),
        userApi.getRFQStatuses(), 
        userApi.getOfferStatuses()
      ])
      
      if (categoriesRes.status === 'fulfilled') {
        const categoriesData = categoriesRes.value.results || categoriesRes.value || []
        setCategories([
          { id: 'all', name: 'Barchasi', icon: 'apps' },
          ...categoriesData.map(cat => ({
            id: cat.slug || cat.id,
            name: cat.name,
            icon: cat.icon || 'category'
          }))
        ])
      } 

      if (orderStatusesRes.status === 'fulfilled') {
        setOrderStatuses(orderStatusesRes.value)
      }

      if (rfqStatusesRes.status === 'fulfilled') {
        setRfqStatuses(rfqStatusesRes.value)
      }

      if (offerStatusesRes.status === 'fulfilled') {
        setOfferStatuses(offerStatusesRes.value)
      }
    } catch (error) {
      console.error('Metadata yuklashda xatolik:', error)
    }
  }

  const loadOrdersData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'requests') {
        const rfqsResponse = await userApi.getAvailableRFQs();
        console.log('Available RFQs:', rfqsResponse);
        
        const transformedRequests = rfqsResponse.map(rfq => ({
          id: rfq.id,
          title: `${rfq.brand} ${rfq.grade}`,
          status: rfq.status,
          price: '-',
          totalAmount: '-',
          category: rfq.category?.name || 'Boshqa',
          quantity: `${rfq.volume} ${rfq.unit?.name || ''}`,
          buyer: rfq.buyer?.first_name || 'Anonim',
          deliveryDate: rfq.delivery_date?.split('T')[0] || '',
          deadline: rfq.deadline?.split('T')[0] || '',
          offersCount: rfq.offers_count || 0,
          specifications: rfq.specifications || '',
          deliveryLocation: rfq.delivery_location || '',
          createdAt: rfq.created_at?.split('T')[0] || ''
        }));
        
        setRequestsData(transformedRequests);
      } else if (activeTab === 'orders') {
        const ordersResponse = await userApi.getSellerOrders();
        console.log('Seller orders:', ordersResponse);
        
        const transformedOrders = ordersResponse.map(order => ({
          id: order.id,
          title: `Buyurtma #${order.id}`,
          status: order.status,
          totalAmount: order.total_amount,
          createdAt: order.created_at?.split('T')[0],
          buyer: order.buyer,
          items: order.items || []
        }));
        
        setOrdersData(transformedOrders);
      } else if (activeTab === 'offers') {
        const offersResponse = await userApi.getSellerOffers();
        console.log('Seller offers:', offersResponse);
        
        const transformedOffers = offersResponse.map(offer => ({
          id: offer.id,
          title: `Taklif #${offer.id}`,
          status: offer.status,
          amount: offer.total_amount,
          createdAt: offer.created_at?.split('T')[0],
          rfq: offer.rfq
        }));
        
        setOffersData(transformedOffers);
      }
    } catch (error) {
      console.error('Orders yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleBack = () => {
    navigate(-1);
  };

  const handleRespondToRequest = (requestId) => {
    console.log(`Responding to request ${requestId}`);
    navigate(`/seller/request-details/${requestId}`, {
      state: { 
        returnTab: activeTab,
        flowStep: 'request-response',
        returnPath: '/seller/orders?tab=requests'
      }
    });
  };

  const handleViewRequest = (requestId) => {
    console.log(`Viewing request ${requestId}`);
    navigate(`/seller/request-details/${requestId}`, {
      state: { 
        returnTab: activeTab,
        flowStep: 'request-detail',
        returnPath: '/seller/orders?tab=requests'
      }
    });
  };

  const handleViewOffer = (offerId) => {
    console.log(`Viewing offer ${offerId}`);
    navigate(`/seller/offer-details/${offerId}`, {
      state: { 
        returnTab: activeTab,
        flowStep: 'offer-detail',
        returnPath: '/seller/orders?tab=offers'
      }
    });
  };

  const handleViewOrder = (orderId) => {
    console.log(`Viewing order ${orderId}`);
    navigate(`/seller/order-details/${orderId}`, {
      state: { 
        returnTab: activeTab,
        flowStep: 'order-detail',
        returnPath: '/seller/orders?tab=orders'
      }
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

    // Filter by status
    if (selectedStatus !== 'all') {
      data = data.filter(item => item.status === selectedStatus);
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

  // Dynamic sub-tabs for each main tab (based on backend statuses)
  const getStatusFilters = () => {
    const allTab = { id: 'all', name: 'Barchasi' }
    
    switch (activeTab) {
      case 'requests':
        return [allTab, ...rfqStatuses.map(status => ({
          id: status.value || status.id,
          name: status.label || status.name
        }))]
      case 'offers':
        return [allTab, ...offerStatuses.map(status => ({
          id: status.value || status.id,
          name: status.label || status.name
        }))]
      case 'orders':
        return [allTab, ...orderStatuses.map(status => ({
          id: status.value || status.id,
          name: status.label || status.name
        }))]
      default:
        return [allTab];
    }
  };

  // Get status badge color (aligned with backend statuses)
  const getStatusBadgeColor = (status) => {
    switch (status) {
      // RFQ statuses
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      
      // Offer statuses
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'counter_offered':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      
      // Order statuses
      case 'created':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'contract_generated':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'awaiting_payment':
        return 'bg-yellow-100 text-yellow-800'
      case 'payment_received':
        return 'bg-green-100 text-green-800'
      case 'in_preparation':
        return 'bg-orange-100 text-orange-800'
      case 'in_transit':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'delivered':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  // Get status display name (aligned with backend statuses)
  const getStatusDisplayName = (status) => {
    switch (status) {
      // RFQ statuses
      case 'active':
        return 'Faol'
      case 'completed':
        return 'Yakunlangan'
      case 'cancelled':
        return 'Bekor qilingan'
      case 'expired':
        return 'Muddati tugagan'
      
      // Offer statuses
      case 'pending':
        return 'Kutilmoqda'
      case 'accepted':
        return 'Qabul qilingan'
      case 'rejected':
        return 'Rad etilgan'
      case 'counter_offered':
        return 'Qarshi taklif'
      
      // Order statuses
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
           <div className="flex gap-2 overflow-x-auto mb-3">
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

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {getStatusFilters().map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedStatus === status.id
                    ? 'bg-[#6C4FFF] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.name}
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
