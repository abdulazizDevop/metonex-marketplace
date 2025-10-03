import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../utils/userApi';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('category');

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoToOffers = () => {
    navigate('/buyer/orders?tab=offers');
  };

  const handleGoToNotifications = () => {
    navigate('/buyer/notifications');
  };

  const handleViewOffer = (offerId) => {
    navigate(`/buyer/offer/${offerId}`);
  };

  // State for dynamic data
  const [pendingOffers, setPendingOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load data in parallel
      const [offersRes, ordersRes, categoriesRes] = await Promise.allSettled([
        userApi.getOffers({ status: 'pending' }),
        userApi.getOrders({ limit: 5 }),
        userApi.getCategories()
      ]);

      if (offersRes.status === 'fulfilled') {
        setPendingOffers(offersRes.value || []);
      }

      if (ordersRes.status === 'fulfilled') {
        setRecentOrders(ordersRes.value || []);
      }

      if (categoriesRes.status === 'fulfilled') {
        const categoriesData = categoriesRes.value.results || categoriesRes.value || [];
        setCategories(categoriesData);
      }

      // Mock notifications for now (until notification API is ready)
      setNotifications([
        {
          id: 1,
          type: 'offer',
          title: 'Yangi taklif',
          message: 'Sizning so\'rovingizga yangi taklif keldi',
          time: '2 soat oldin',
          read: false
        }
      ]);

    } catch (error) {
      console.error('Dashboard ma\'lumotlarini yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-20 border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold text-center text-gray-900">
                Dashboard
              </h1>
            </div>
            <button
              onClick={handleGoToNotifications}
              className="relative p-2 text-gray-600 hover:text-gray-800"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold text-center">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4FFF] mx-auto mb-4"></div>
            <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
          </div>
        )}
        
        {/* Chart Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Xarajat tahlili</h2>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setViewMode('category')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'category' 
                    ? 'bg-[#6C4FFF] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Kategoriya
              </button>
              <button 
                onClick={() => setViewMode('supplier')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'supplier' 
                    ? 'bg-[#6C4FFF] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sotuvchi
              </button>
            </div>
            
            {viewMode === 'category' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
                  <div className="flex gap-2">
                    {categories.slice(0, 3).map((category, index) => {
                      const colors = ['bg-gray-400', 'bg-purple-500', 'bg-blue-500'];
                      return (
                        <div key={category.id} className="flex items-center gap-1 text-sm">
                          <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-400'}`}></div>
                          <span className="text-gray-600">{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { month: 'Jan', metal: 60, cement: 75, concrete: 90 },
                    { month: 'Feb', metal: 75, cement: 80, concrete: 85 },
                    { month: 'Mar', metal: 90, cement: 85, concrete: 80 },
                    { month: 'Apr', metal: 55, cement: 70, concrete: 75 },
                    { month: 'May', metal: 80, cement: 90, concrete: 85 },
                    { month: 'Jun', metal: 40, cement: 60, concrete: 70 },
                    { month: 'Jul', metal: 70, cement: 75, concrete: 80 }
                  ].map((month, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{month.month}</span>
                        <span className="text-sm text-gray-500">${month.metal + month.cement + month.concrete}</span>
                      </div>
                      <div className="flex h-6 rounded-lg overflow-hidden">
                        <div 
                          className="bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${month.metal}%` }}
                        >
                          {month.metal > 15 && `${month.metal}%`}
                        </div>
                        <div 
                          className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${month.cement}%` }}
                        >
                          {month.cement > 15 && `${month.cement}%`}
                        </div>
                        <div 
                          className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${month.concrete}%` }}
                        >
                          {month.concrete > 15 && `${month.concrete}%`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Spending by Supplier</h3>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-gray-600">ID 14ad</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <span className="text-gray-600">ID 25fg</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">ID 39hj</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { month: 'Jan', suppliers: { '14ad': 60, '25fg': 75, '39hj': 90, others: 20 } },
                    { month: 'Feb', suppliers: { '14ad': 75, '25fg': 80, '39hj': 85, others: 25 } },
                    { month: 'Mar', suppliers: { '14ad': 90, '25fg': 85, '39hj': 80, others: 15 } },
                    { month: 'Apr', suppliers: { '14ad': 95, '25fg': 70, '39hj': 75, others: 10 } },
                    { month: 'May', suppliers: { '14ad': 70, '25fg': 90, '39hj': 85, others: 40 } },
                    { month: 'Jun', suppliers: { '14ad': 80, '25fg': 60, '39hj': 70, others: 30 } }
                  ].map((month, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{month.month}</span>
                        <span className="text-sm text-gray-500">
                          ${Object.values(month.suppliers).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                      <div className="flex h-6 rounded-lg overflow-hidden">
                        {Object.entries(month.suppliers).map(([supplierId, value]) => {
                          const colors = { '14ad': '#64B5F6', '25fg': '#9575CD', '39hj': '#78909C', others: '#E0E0E0' };
                          return (
                            <div 
                              key={supplierId}
                              className="flex items-center justify-center text-xs text-white font-medium"
                              style={{ 
                                width: `${value}%`,
                                backgroundColor: colors[supplierId] || '#E0E0E0'
                              }}
                            >
                              {value > 15 && `${value}%`}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pending Offers */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Kutilayotgan takliflar</h2>
            <button 
              onClick={handleGoToOffers}
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
            >
              Barchasini ko'rish
            </button>
          </div>
          
          <div className="mt-4 space-y-3">
            {pendingOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{offer.title}</p>
                    <p className="text-sm text-gray-500">{offer.supplier}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {offer.offersCount} taklif
                      </span>
                      <span className="text-xs text-gray-500">Deadline: {offer.deadline}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">${offer.amount.toLocaleString()}</p>
                    <button 
                      onClick={() => handleViewOffer(offer.id)}
                      className="text-sm text-[#6C4FFF] hover:text-[#5A3FE6] transition-colors"
                    >
                      Ko'rish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Bildirishnomalar</h2>
            <button 
              onClick={handleGoToNotifications}
              className="text-sm font-medium text-gray-600 hover:text-[#6C4FFF] transition-colors"
            >
              Barchasini ko'rish
            </button>
          </div>
          
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex size-8 items-center justify-center rounded-full ${
                    notification.type === 'order' ? 'bg-[#6C4FFF]/10 text-[#6C4FFF]' :
                    notification.type === 'offer' ? 'bg-[#6C4FFF]/10 text-[#6C4FFF]' :
                    'bg-[#6C4FFF]/10 text-[#6C4FFF]'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {notification.type === 'order' ? 'shopping_cart' :
                       notification.type === 'offer' ? 'local_offer' : 'payment'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BuyerDashboard;
