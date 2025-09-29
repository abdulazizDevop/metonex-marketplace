import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('category');
  
  const [profileData] = useState({
    companyName: 'O\'zbekiston Qurilish MChJ',
    buyerId: '123456',
    rating: 4.8,
    rank: 8,
    totalBuyers: 150,
    totalReviews: 95,
    profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj41-PwDLpMDAVf0vzGk89KRvxCUknfTyrhRvmtMkNK29xe4ngs3qUssLoayhPwAPuseJ84dl4TTlO08AqaWnQv0SwBd-5IJCxShTODuYldLnvXjMN3CQz-qUKnPRuonOTqO0zq6JFolj-oGctqKvT4CvxMJg6wBjgG6YxWYe4ZoNFYzIzAIv9RNp9agkGsbGcyyXpuZ3ZxU52YS_6KQDSKXw2zipAFfkEschcYc8183tWUl4w_G6Ni_wrkTSpRkOzPieIq_Zkh6o',

    metrics: [
      { name: 'On-time Payments', value: '95%', icon: 'payment', trend: 'up', color: 'text-green-500' },
      { name: 'Avg. Order Value', value: '$5,200', icon: 'paid', trend: 'up', color: 'text-green-500' },
      { name: 'Order Frequency', value: '2.1/month', icon: 'schedule', trend: 'up', color: 'text-green-500' },
      { name: 'Supplier Rating', value: '4.8', icon: 'star', trend: 'up', color: 'text-green-500' },
      { name: 'Response Time', value: '1.5 hrs', icon: 'schedule', trend: 'down', color: 'text-red-500' },
      { name: 'Monthly Growth', value: '+15%', icon: 'trending_up', trend: 'up', color: 'text-green-500' }
    ],
    categories: ['Steel', 'Concrete', 'Electro'],
    certifications: [
      { name: 'ISO 9001', icon: 'verified' },
      { name: 'Quality Assurance', icon: 'shield' }
    ],
    recentOrders: [
      {
        id: 1,
        title: 'Steel Beams I-200',
        supplier: 'SteelCorp Ltd',
        amount: 12000,
        status: 'in_transit',
        date: '2024-01-20',
        trackingNumber: 'TRK001234'
      },
      {
        id: 2,
        title: 'Concrete Mix C25',
        supplier: 'ConcretePro',
        amount: 8500,
        status: 'delivered',
        date: '2024-01-18',
        trackingNumber: 'TRK001235'
      },
      {
        id: 3,
        title: 'Rebar Ø12',
        supplier: 'MetalWorks',
        amount: 6500,
        status: 'in_preparation',
        date: '2024-01-15',
        trackingNumber: 'TRK001236'
      }
    ],
    team: [
      { 
        name: 'John Doe', 
        position: 'Purchasing Manager',
        phone: '+998 90 123 45 67',
        email: 'john.doe@uzbekiston-qurilish.uz'
      },
      { 
        name: 'Sarah Wilson', 
        position: 'Accountant',
        phone: '+998 90 234 56 78',
        email: 'sarah.wilson@uzbekiston-qurilish.uz'
      }
    ]
  });

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
                        <p className="text-lg font-bold text-[#735095]">$3,200</p>
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
                        <p className="text-lg font-bold text-[#735095]">$12,450</p>
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Metal</span>
                      <span className="text-sm font-semibold text-[#140e1b]">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Cement</span>
                      <span className="text-sm font-semibold text-[#140e1b]">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Concrete</span>
                      <span className="text-sm font-semibold text-[#140e1b]">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">ID 14ad</span>
                      <span className="text-sm font-semibold text-[#140e1b]">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">ID 25fg</span>
                      <span className="text-sm font-semibold text-[#140e1b]">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">ID 39hj</span>
                      <span className="text-sm font-semibold text-[#140e1b]">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Top Supplier & Last Purchase */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Top Sotuvchi & Oxirgi xarajat</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Top Sotuvchi</p>
                      <p className="text-lg font-bold text-[#140e1b]">ID 14ad</p>
                      <p className="text-sm text-gray-500">Mostly purchased: Cement</p>
                    </div>
                    <button 
                      onClick={() => navigate('/buyer/products')}
                      className="px-4 py-2 bg-[#a35ee8] text-white rounded-lg hover:bg-[#8e4dd1] transition-colors text-sm"
                    >
                      Qayta buyurtma
                    </button>
                  </div>
                </div>
                
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Oxirgi xarajat</p>
                      <p className="text-lg font-bold text-[#140e1b]">Reinforced Steel Bars</p>
                      <p className="text-sm text-gray-500">10 tons • $2,500 • Jul 20</p>
                      <p className="text-xs text-gray-400">Next payment: Aug 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#735095]">$2,500</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferred Categories */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Preferred Categories</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profileData.categories.map((category, index) => (
                  <span key={index} className="rounded-full bg-[#ede8f3] px-3 py-1.5 text-sm font-medium text-[#735095]">
                    {category}
                  </span>
                ))}
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
                    <span className="text-sm font-semibold text-[#140e1b]">128</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Avg. Order Value</span>
                    <span className="text-sm font-semibold text-[#140e1b]">$4,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Top Category</span>
                    <span className="text-sm font-semibold text-[#140e1b]">Cement</span>
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
                {profileData.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#140e1b]">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCall(member.phone)}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">call</span>
                      </button>
                      <button 
                        onClick={() => handleEmail(member.email)}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">mail</span>
                      </button>
                    </div>
                  </div>
                ))}
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
              style={{ backgroundImage: `url("${profileData.profileImage}")` }}
            />
            <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 ring-2 ring-white">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Verified</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[22px] font-bold text-[#140e1b]">{profileData.companyName}</p>
            <p className="text-sm text-gray-500">Buyer ID: {profileData.buyerId}</p>
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="font-medium text-gray-600">Member since 2024</span>
                <span className="text-gray-400">·</span>
                <span className="font-medium text-gray-600">Rank #{profileData.rank} of {profileData.totalBuyers}</span>
              </div>
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
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
};

export default BuyerProfile;
