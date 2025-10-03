import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userApi from '../../utils/userApi';

const BuyerOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab from URL params or localStorage, default to 'requests'
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const tabFromStorage = localStorage.getItem('buyerOrdersActiveTab');
    return tabFromUrl || tabFromStorage || 'requests';
  };

  const [activeMainTab, setActiveMainTab] = useState(getInitialTab); // 'requests', 'offers', 'orders'
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'active', 'pending', 'completed', 'cancelled'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'steel', 'concrete', 'electro'
  const [searchQuery, setSearchQuery] = useState('')
  const [flowData, setFlowData] = useState({
    fromConfirmation: false,
    flowStep: null
  })

  // Dynamic data from backend
  const [requestsData, setRequestsData] = useState([])
  const [offersData, setOffersData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [loading, setLoading] = useState(false)

  // Dynamic metadata from backend
  const [categories, setCategories] = useState([])
  const [orderStatuses, setOrderStatuses] = useState([])
  const [rfqStatuses, setRFQStatuses] = useState([])
  const [offerStatuses, setOfferStatuses] = useState([])

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        fromConfirmation: location.state.fromConfirmation || false,
        flowStep: location.state.flowStep || null
      });
    }
  }, [location.state]);
  
  // Load metadata from backend
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
        setRFQStatuses(rfqStatusesRes.value)
      }

      if (offerStatusesRes.status === 'fulfilled') {
        setOfferStatuses(offerStatusesRes.value)
      }
    } catch (error) {
      console.error('Metadata yuklashda xatolik:', error)
    }
  }

  // Load data from backend
  const loadData = async () => {
    setLoading(true)
    try {
      // Load data based on active tab
      if (activeMainTab === 'requests') {
        const response = await userApi.getRFQs()
        setRequestsData(response.results || response || [])
      } else if (activeMainTab === 'offers') {
        const response = await userApi.getOffers()
        setOffersData(response.results || response || [])
      } else if (activeMainTab === 'orders') {
        const response = await userApi.getOrders()
        setOrdersData(response.results || response || [])
      }
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load metadata on component mount
  useEffect(() => {
    loadMetadata()
  }, [])

  // Load data when tab changes
  useEffect(() => {
    loadData()
  }, [activeMainTab])



  // Sub-tabs for each main tab (dynamic from backend)
  const getSubTabs = () => {
    const allTab = { id: 'all', name: 'Barchasi' }
    
    switch (activeMainTab) {
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
        return [allTab]
    }
  }

  // Filter data based on current selections
  const getFilteredData = () => {
    let data = []
    
    switch (activeMainTab) {
      case 'requests':
        data = requestsData
        break
      case 'offers':
        data = offersData
        break
      case 'orders':
        data = ordersData
        break
      default:
        data = []
    }

    // Filter by sub-tab (status)
    if (activeSubTab !== 'all') {
      data = data.filter(item => item.status === activeSubTab)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      data = data.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      data = data.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requestTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return data
  }

  const filteredData = getFilteredData()

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('buyerOrdersActiveTab', activeMainTab);
  }, [activeMainTab]);

  // Reset sub-tab when main tab changes
  useEffect(() => {
    setActiveSubTab('all')
  }, [activeMainTab])

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
  }

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
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Buyurtmalar</h1>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20">
        {/* Main Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'requests', name: 'So\'rovlar', icon: 'request_quote' },
              { id: 'offers', name: 'Takliflar', icon: 'local_offer' },
              { id: 'orders', name: 'Buyurtmalar', icon: 'shopping_bag' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeMainTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Categories */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          {/* Search */}
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#6C4FFF]/10 text-[#6C4FFF]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {getSubTabs().map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSubTab === subTab.id
                    ? 'text-[#6C4FFF] border-b-2 border-[#6C4FFF]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {subTab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4FFF] mx-auto mb-4"></div>
              <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inbox</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hech narsa topilmadi</h3>
              <p className="text-gray-500">Qidiruv shartlaringizga mos ma'lumot yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  {activeMainTab === 'requests' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-xs text-gray-500 mb-2">{item.specifications}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{item.quantity}</span>
                            <span>•</span>
                            <span>{item.lowestPrice}</span>
                            <span>•</span>
                            <span>{item.fastestDelivery}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                            {getStatusDisplayName(item.status)}
                          </span>
                          {item.hasNewOffers && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.offersCount} taklif</span>
                          <span>•</span>
                          <span>Muddat: {item.deadline}</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/buyer/rfq/${item.id}`, { 
                            state: { 
                              returnTab: 'requests',
                              flowStep: 'rfq-detail',
                              returnPath: '/buyer/orders?tab=requests'
                            } 
                          })}
                          className="text-[#6C4FFF] text-xs font-medium hover:text-[#5A3FE6]"
                        >
                          Ko'rish
                        </button>
                      </div>
                    </div>
                  )}

                  {activeMainTab === 'offers' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.requestTitle}</h3>
                          <p className="text-xs text-gray-500 mb-2">{item.supplier}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{item.price}</span>
                            <span>•</span>
                            <span>Jami: {item.totalAmount}</span>
                            <span>•</span>
                            <span>Yetkazib berish: {item.deliveryDate}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                          {getStatusDisplayName(item.status)}
                        </span>
                      </div>
                      {item.message && (
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{item.message}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">{item.createdDate}</span>
                        <div className="flex gap-2">
                          {item.status === 'pending' && (
                            <>
                              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                                Qabul qilish
                              </button>
                              <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                                Rad etish
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => navigate(`/buyer/offer/${item.id}`, { 
                              state: { 
                                returnTab: 'offers',
                                flowStep: 'offer-detail',
                                returnPath: '/buyer/orders?tab=offers'
                              } 
                            })}
                            className="text-[#6C4FFF] text-xs font-medium hover:text-[#5A3FE6]"
                          >
                            Ko'rish
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeMainTab === 'orders' && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.requestTitle}</h3>
                          <p className="text-xs text-gray-500 mb-2">{item.supplier}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Jami: {item.totalAmount}</span>
                            <span>•</span>
                            <span>Buyurtma: {item.orderDate}</span>
                            <span>•</span>
                            <span>Yetkazib berish: {item.deliveryDate}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                            {getStatusDisplayName(item.status)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.paymentStatus === 'paid' ? 'To\'langan' : 'To\'lov kutilmoqda'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Kuzatish: {item.trackingNumber}</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/buyer/order/${item.id}`, { 
                            state: { 
                              returnTab: 'orders',
                              flowStep: 'order-detail',
                              returnPath: '/buyer/orders?tab=orders'
                            } 
                          })}
                          className="text-[#6C4FFF] text-xs font-medium hover:text-[#5A3FE6]"
                        >
                          Batafsil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerOrders