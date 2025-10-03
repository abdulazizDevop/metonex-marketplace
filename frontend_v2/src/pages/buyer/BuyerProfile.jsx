import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../utils/userApi';

const BuyerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('category');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    companyName: '',
    buyerId: '',
    rating: 0,
    rank: 0,
    totalBuyers: 0,
    totalReviews: 0,
    profileImage: '',

    // User ma'lumotlari
    userPhone: '',
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    userRole: 'buyer',
    lastLoginAt: null,
    userCreatedAt: null,

    metrics: [],
    categories: [],
    certifications: [],
    recentOrders: [],
    team: [],
    
    // Financial data
    totalSpent: 0,
    pendingPayments: 0,
    avgOrderValue: 0,
    totalOrders: 0,
    
    // Spending analysis
    spendingByCategory: {},
    spendingBySupplier: {},
    topSupplier: null,
    lastPurchase: null
  });

  // Load profile data from API
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Load user profile and company data
        const [userProfile, companyData, ordersData, analyticsData] = await Promise.all([
          userApi.getProfile(),
          userApi.getCompany(),
          userApi.getOrders({ limit: 3 }), // Get recent 3 orders
          userApi.getAnalytics() // Get financial analytics
        ]);

        // Process orders data
        const recentOrders = (ordersData.results || ordersData || []).map(order => ({
          id: order.id,
          title: order.items?.[0]?.name || 'Order',
          supplier: order.supplier?.company_name || 'Supplier',
          amount: order.total_amount || 0,
          status: order.status,
          date: order.created_at,
          trackingNumber: order.tracking_number || `ORD-${order.id}`
        }));

        // Process team data - get from company-members endpoint
        let team = [];
        try {
          const teamResponse = await userApi.getTeamMembers();
          team = teamResponse.map(member => ({
            name: member.name || 'Team Member',
            position: member.role_display || member.role || 'Employee',
            phone: member.phone || '',
            email: member.email || '',
            telegram: member.telegram_username || '',
            role: member.role || 'employee',
            isActive: member.is_active || true
          }));
          
        } catch (teamError) {
          console.error('Team members olishda xatolik:', teamError);
          team = [];
        }

        // Process financial data
        const totalSpent = analyticsData.total_spent || 0;
        const pendingPayments = analyticsData.pending_payments || 0;
        const avgOrderValue = analyticsData.avg_order_value || 0;
        const totalOrders = analyticsData.total_orders || 0;

        // Process spending analysis
        const spendingByCategory = analyticsData.spending_by_category || {};
        const spendingBySupplier = analyticsData.spending_by_supplier || {};
        const topSupplier = analyticsData.top_supplier || null;
        const lastPurchase = analyticsData.last_purchase || null;

        // Update profile data with API response
        setProfileData(prev => ({
          ...prev,
          companyName: companyData.name || userProfile.company?.name || 'Company Name',
          buyerId: userProfile.id || 'N/A',
          rating: userProfile.rating || 0,
          rank: userProfile.rank || 0,
          totalBuyers: userProfile.total_buyers || 0,
          totalReviews: userProfile.total_reviews || 0,
          profileImage: userProfile.avatar || '',
          
          // User ma'lumotlari
          userPhone: userProfile.phone || '',
          userEmail: userProfile.email || '',
          userFirstName: userProfile.first_name || '',
          userLastName: userProfile.last_name || '',
          userRole: userProfile.role || 'buyer',
          lastLoginAt: userProfile.last_login_at || null,
          userCreatedAt: userProfile.created_at || null,
          
          recentOrders,
          team,
          
          // Financial data
          totalSpent,
          pendingPayments,
          avgOrderValue,
          totalOrders,
          
          // Spending analysis
          spendingByCategory,
          spendingBySupplier,
          topSupplier,
          lastPurchase,
          
          // Categories from company data
          categories: companyData.categories || [],
          certifications: companyData.certifications || []
        }));

      } catch (err) {
        console.error('Profil ma\'lumotlarini yuklashda xatolik:', err);
        setError('Profil ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate('/buyer/edit-profile');
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/buyer/order/${orderId}?returnTab=orders`);
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'arrow_upward' : 'arrow_downward';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_preparation':
        return 'bg-orange-100 text-orange-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'in_transit':
        return 'Yo\'lda'
      case 'delivered':
        return 'Yetkazib berilgan'
      case 'in_preparation':
        return 'Tayyorlanmoqda'
      case 'pending':
        return 'Kutilmoqda'
      default:
        return status
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">

            {/* Financial Overview */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Financial Overview</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                      <span className="material-symbols-outlined">payment</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#140e1b]">To'lanadigan</p>
                      <div className="flex items-center gap-1">
                        <p className="text-lg font-bold text-[#735095]">
                          ${new Intl.NumberFormat().format(profileData.pendingPayments)}
                        </p>
                        <span className="material-symbols-outlined text-sm text-green-500">arrow_upward</span>
                      </div>
                      <p className="text-xs text-green-500">+12% o'tgan oydan</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                      <span className="material-symbols-outlined">paid</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#140e1b]">Jami xarajat</p>
                      <div className="flex items-center gap-1">
                        <p className="text-lg font-bold text-[#735095]">
                          ${new Intl.NumberFormat().format(profileData.totalSpent)}
                        </p>
                        <span className="material-symbols-outlined text-sm text-green-500">arrow_upward</span>
                      </div>
                      <p className="text-xs text-green-500">+8% o'tgan oydan</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Spending Analysis */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Xarajat tahlili</h2>
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setViewMode('category')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'category' 
                        ? 'bg-[#a35ee8] text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Kategoriya
                  </button>
                  <button 
                    onClick={() => setViewMode('supplier')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'supplier' 
                        ? 'bg-[#a35ee8] text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Sotuvchi
                  </button>
                </div>
                
                {viewMode === 'category' ? (
                  <div className="space-y-3">
                    {Object.entries(profileData.spendingByCategory).length > 0 ? (
                      Object.entries(profileData.spendingByCategory).map(([category, percentage], index) => (
                        <div key={category}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{category}</span>
                            <span className="text-sm font-semibold text-[#140e1b]">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-gray-400' : 
                                index === 1 ? 'bg-purple-500' : 
                                'bg-blue-500'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Hozircha kategoriya bo'yicha xarajat ma'lumotlari yo'q</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(profileData.spendingBySupplier).length > 0 ? (
                      Object.entries(profileData.spendingBySupplier).map(([supplier, percentage], index) => (
                        <div key={supplier}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{supplier}</span>
                            <span className="text-sm font-semibold text-[#140e1b]">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-blue-400' : 
                                index === 1 ? 'bg-purple-400' : 
                                'bg-gray-400'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Hozircha sotuvchi bo'yicha xarajat ma'lumotlari yo'q</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Top Supplier & Last Purchase */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Top Sotuvchi & Oxirgi xarajat</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {profileData.topSupplier ? (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Top Sotuvchi</p>
                        <p className="text-lg font-bold text-[#140e1b]">{profileData.topSupplier.name}</p>
                        <p className="text-sm text-gray-500">Mostly purchased: {profileData.topSupplier.top_category}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/buyer/products')}
                        className="px-4 py-2 bg-[#a35ee8] text-white rounded-lg hover:bg-[#8e4dd1] transition-colors text-sm"
                      >
                        Qayta buyurtma
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Hozircha top sotuvchi ma'lumotlari yo'q</p>
                    </div>
                  </div>
                )}
                
                {profileData.lastPurchase ? (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Oxirgi xarajat</p>
                        <p className="text-lg font-bold text-[#140e1b]">{profileData.lastPurchase.title}</p>
                        <p className="text-sm text-gray-500">
                          {profileData.lastPurchase.quantity} • ${new Intl.NumberFormat().format(profileData.lastPurchase.amount)} • {new Date(profileData.lastPurchase.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">Next payment: {new Date(profileData.lastPurchase.next_payment).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#735095]">${new Intl.NumberFormat().format(profileData.lastPurchase.amount)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Hozircha oxirgi xarajat ma'lumotlari yo'q</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Preferred Categories */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Preferred Categories</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profileData.categories.length > 0 ? (
                  profileData.categories.map((category, index) => (
                    <span key={index} className="rounded-full bg-[#ede8f3] px-3 py-1.5 text-sm font-medium text-[#735095]">
                      {category}
                    </span>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Hozircha kategoriya ma'lumotlari yo'q</p>
                  </div>
                )}
              </div>
            </section>


            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Quick Actions</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/buyer/products')}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#140e1b]">Browse Products</p>
                    <p className="text-xs text-gray-500">Find materials</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/buyer/orders')}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#140e1b]">My Orders</p>
                    <p className="text-xs text-gray-500">Track purchases</p>
                  </div>
                </button>
              </div>
            </section>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Dashboard Quick Info */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#140e1b]">Dashboard</h2>
                <button 
                  onClick={() => navigate('/buyer/dashboard')}
                  className="px-3 py-1.5 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm"
                >
                  View Details
                </button>
              </div>
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Orders</span>
                    <span className="text-sm font-semibold text-[#140e1b]">{profileData.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Avg. Order Value</span>
                    <span className="text-sm font-semibold text-[#140e1b]">${new Intl.NumberFormat().format(profileData.avgOrderValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Top Category</span>
                    <span className="text-sm font-semibold text-[#140e1b]">
                      {Object.keys(profileData.spendingByCategory)[0] || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Pending Offers</span>
                    <span className="text-sm font-semibold text-[#140e1b]">5</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Dashboard Actions</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/buyer/dashboard')}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                    <span className="material-symbols-outlined">analytics</span>
              </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#140e1b]">Full Dashboard</p>
                    <p className="text-xs text-gray-500">View analytics</p>
              </div>
                </button>
                
                <button 
                  onClick={() => navigate('/buyer/orders?tab=offers')}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                    <span className="material-symbols-outlined">local_offer</span>
                    </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#140e1b]">Pending Offers</p>
                    <p className="text-xs text-gray-500">5 new offers</p>
                    </div>
                      </button>
              </div>
            </section>
          </div>
        );


      case 'team':
        return (
          <div className="space-y-6">
            {/* Team Members */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Team</h2>
              <div className="mt-3 space-y-3">
                {profileData.team.length > 0 ? (
                  profileData.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#140e1b]">{member.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            member.role === 'owner' 
                              ? 'bg-purple-100 text-purple-800' 
                              : member.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : member.role === 'manager'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.role === 'owner' && '👑'}
                            {member.role === 'admin' && '⚡'}
                            {member.role === 'manager' && '📋'}
                            {member.role === 'employee' && '👤'}
                            {member.role === 'accountant' && '💰'}
                            <span className="ml-1">{member.position}</span>
                          </span>
                        </div>
                        {member.phone && (
                          <p className="text-sm text-gray-500 mt-1">{member.phone}</p>
                        )}
                        {member.telegram && (
                          <p className="text-xs text-gray-400">@{member.telegram}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {member.phone && (
                          <button 
                            onClick={() => handleCall(member.phone)}
                            className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            title="Qo'ng'iroq qilish"
                          >
                            <span className="material-symbols-outlined text-xl">call</span>
                          </button>
                        )}
                        {member.email && (
                          <button 
                            onClick={() => handleEmail(member.email)}
                            className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            title="Email yuborish"
                          >
                            <span className="material-symbols-outlined text-xl">mail</span>
                          </button>
                        )}
                        {member.telegram && (
                          <button 
                            onClick={() => window.open(`https://t.me/${member.telegram}`, '_blank')}
                            className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            title="Telegram"
                          >
                            <span className="material-symbols-outlined text-xl">send</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">group</span>
                    <p className="text-sm">Hozircha jamoa a'zolari yo'q</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-white">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Buyer Profile</h1>
          <button 
            onClick={handleEditProfile}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </header>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 p-4 pb-6 bg-white">
          <div className="relative">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28" 
              style={{ 
                backgroundImage: profileData.profileImage 
                  ? `url("http://localhost:8000${profileData.profileImage}")` 
                  : 'linear-gradient(135deg, #6C4FFF 0%, #8B5CF6 100%)'
              }}
            >
              {!profileData.profileImage && (
                <div className="flex items-center justify-center h-full">
                  <span className="material-symbols-outlined text-white text-4xl">business</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 ring-2 ring-white">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Verified</span>
            </div>
          </div>
          
          <div className="text-center">
            {/* User to'liq ismi */}
            <p className="text-[22px] font-bold text-[#140e1b]">
              {profileData.userFirstName} {profileData.userLastName}
            </p>
            <p className="text-sm text-gray-500">Buyer ID: {profileData.buyerId}</p>
            
            {/* User aloqa ma'lumotlari */}
            <div className="mt-3 space-y-1">
              <p className="text-sm text-gray-500">{profileData.userPhone}</p>
              {profileData.userEmail && (
                <p className="text-sm text-gray-500">{profileData.userEmail}</p>
              )}
            </div>
            
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="font-medium text-gray-600">
                  Account ochilgan: {profileData.userCreatedAt ? new Date(profileData.userCreatedAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
                </span>
                <span className="text-gray-400">·</span>
                <span className="font-medium text-gray-600">
                  Oxirgi kirish: {profileData.lastLoginAt ? new Date(profileData.lastLoginAt).toLocaleDateString('uz-UZ') : 'Hozircha yo\'q'}
                </span>
              </div>
              {profileData.lastLoginAt && (
                <div className="text-xs text-gray-400">
                  Oxirgi kirish vaqti: {new Date(profileData.lastLoginAt).toLocaleString('uz-UZ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'team', label: 'Team', icon: 'group' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#a35ee8] text-[#a35ee8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#6C4FFF] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Profil ma'lumotlari yuklanmoqda...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors"
                >
                  Qayta urinish
                </button>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>

    </div>
  );
};

export default BuyerProfile;
