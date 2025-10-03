import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '../../components/BottomNavigation'
import userApi from '../../utils/userApi'

const SellerDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasProducts, setHasProducts] = useState(false)
  const [hasOrders, setHasOrders] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    products: [],
    orders: [],
    offers: [],
    rfqs: []
  })
  const [flowData, setFlowData] = useState({
    fromRegistration: false,
    flowStep: null,
    nextStep: null
  })

  // Helper function for profile status
  const getProfileStatus = (completion) => {
    if (completion >= 85) return 'Profil toʻliq toʻldirilgan'
    if (completion >= 60) return 'Profil deyarli tayyor'
    if (completion >= 30) return 'Profil yarim toʻldirilgan'
    return 'Profils kam maʼlumotlar'
  }

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [profileRes, statsRes, productsRes, ordersRes, offersRes, rfqsRes] = await Promise.allSettled([
        userApi.getProfile(),
        userApi.getSellerStats(),
        userApi.getSellerProducts({ limit: 5 }),
        userApi.getSellerOrders({ limit: 5 }),
        userApi.getSellerOffers({ limit: 3 }),
        userApi.getAvailableRFQs({ limit: 5 })
      ])

      // Check user role and redirect if not supplier
      if (profileRes.status === 'fulfilled' && profileRes.value.role !== 'supplier') {
        console.warn('Foydalanuvchi seller emas, omborga yo\'naltirilmoqda')
        navigate('/buyer/dashboard')
        return
      }

      // User profile
      if (profileRes.status === 'fulfilled') {
        setUserData(profileRes.value)
      }

      // Statistics
      if (statsRes.status === 'fulfilled') {
        setDashboardData(prev => ({ ...prev, stats: statsRes.value }))
      }

      // Products
      if (productsRes.status === 'fulfilled') {
        const products = productsRes.value.results || productsRes.value || []
        setDashboardData(prev => ({ ...prev, products }))
        setHasProducts(products.length > 0)
      }

      // Orders
      if (ordersRes.status === 'fulfilled') {
        const orders = ordersRes.value.results || ordersRes.value || []
        setDashboardData(prev => ({ ...prev, orders }))
        setHasOrders(orders.length > 0)
      }

      // Offers
      if (offersRes.status === 'fulfilled') {
        const offers = offersRes.value.results || offersRes.value || []
        setDashboardData(prev => ({ ...prev, offers }))
      }

      // RFQ Requests
      if (rfqsRes.status === 'fulfilled') {
        const rfqs = rfqsRes.value || []
        setDashboardData(prev => ({ ...prev, rfqs }))
      }

    } catch (error) {
      console.error('Dashboard ma\'lumotlarini yuklashda xatolik:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Registration ma'lumotlarini localStorage'dan olish
    const registrationData = localStorage.getItem('sellerRegistrationData')
    if (registrationData) {
      const data = JSON.parse(registrationData)
      
      // Agar yangi ro'yxatdan o'tgan bo'lsa
      if (data.completedAt) {
        const completedDate = new Date(data.completedAt)
        const now = new Date()
        const diffInHours = (now - completedDate) / (1000 * 60 * 60)
        
        // 24 soat ichida ro'yxatdan o'tgan bo'lsa yangi foydalanuvchi
        if (diffInHours < 24) {
          setIsNewUser(true)
        }
      }
    }

    // Initialize flow data from location state
    if (location.state) {
      setFlowData({
        fromRegistration: location.state.fromRegistration || false,
        flowStep: location.state.flowStep || null,
        nextStep: location.state.nextStep || null
      });
    }

    // Load dashboard data
    loadDashboardData()
  }, [location.state])

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4FFF] mb-4"></div>
        <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
      </div>
    )
  }

  // If no products, show onboarding screen
  if (!hasProducts) {
    const companyName = userData?.company?.name || userData?.first_name || 'Sotuvchi'
    const supplierType = userData?.supplier_type || 'manufacturer'
    
    return (
      <div className="relative flex size-full min-h-screen flex-col justify-between">
        <header className="p-6">
          <h1 className="text-xl font-semibold text-center text-gray-900">
            {isNewUser ? `Xush kelibsiz, ${companyName}!` : `Salom, ${companyName}`}
          </h1>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center mb-32">
          <div className="w-40 h-40 mb-6">
            <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M3.27 6.96L12 12.01l8.73-5.05" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M12 22.08V12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <text x="12" y="16" textAnchor="middle" className="fill-gray-300 text-xs">📦</text>
            </svg>
          </div>
          
          {isNewUser ? (
            <>
              <h2 className="text-xl font-bold text-gray-900">Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! 🎉</h2>
              <p className="mt-2 text-gray-500">
                {supplierType === 'dealer' 
                  ? "Endi mahsulotlaringizni qo'shing va sotishni boshlang."
                  : "Endi mahsulotlaringizni qo'shing va ishlab chiqarishni boshlang."
                }
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900">Sizda hali mahsulotlar yo'q 📦</h2>
              <p className="mt-2 text-gray-500">Birinchi mahsulotingizni qo'shing va biznesingizni rivojlantiring.</p>
            </>
          )}
        </main>

        <div className="fixed bottom-20 left-0 right-0 z-[60]">
          <div className="px-6 pb-4">
            <button 
              onClick={() => navigate('/seller/products', {
                state: {
                  fromDashboard: true,
                  flowStep: 'product-setup',
                  returnPath: '/seller/dashboard'
                }
              })}
              className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg font-medium text-center block hover:bg-[#5A3FE6] transition-colors shadow-lg"
            >
              {isNewUser ? 'Birinchi mahsulotni qo\'shish' : 'Mahsulot qo\'shish'}
            </button>
            
            {isNewUser && (
              <button 
                onClick={() => setHasProducts(true)} // Skip onboarding
                className="mt-3 w-full text-gray-500 font-medium hover:text-gray-700"
              >
                Hozircha dashboardga o'tish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If has products, show dashboard
  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden">
      <div className="flex-grow">
        <header className="bg-gradient-to-br from-[#6C4FFF] to-[#5A3FE6] px-6 pt-16 pb-8 text-white shadow-lg animate-layered-in">
          <div className="opacity-0" style={{ animationDelay: '0.1s', transform: 'translateY(-20px)' }}>
            <p className="text-3xl font-bold leading-tight">
              {userData?.company?.name ? `Xush kelibsiz, ${userData.company.name}` : 
               userData?.first_name ? `Xush kelibsiz, ${userData.first_name}` : 
               'Xush kelibsiz, Sotuvchi'}
            </p>
            <p className="mt-1 text-base text-white/80">Bugungi biznes ko'rsatkichlaringiz.</p>
          </div>
        </header>

        <main className="p-4 pb-24 animate-layered-in bg-gray-50">
          <section className="mt-4 mb-6 opacity-0" style={{ animationDelay: '0.3s', transform: 'translateY(-20px)' }}>
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Profil ma'lumotlari</h3>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👤</span>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {dashboardData.stats?.profile_completion || 0}%
                      <span className="text-base font-medium text-gray-500">to'ldirildi</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {getProfileStatus(dashboardData.stats?.profile_completion)}
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {dashboardData.stats?.role === 'supplier' ? 'Sotuvchi' : 'Foydalanuvchi'}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.5s', transform: 'translateY(-20px)' }}>
            <h2 className="px-2 text-xl font-bold text-gray-800">Olgan takliflar</h2>
            <div className="mt-4 space-y-4">
              {dashboardData.offers.length > 0 ? (
                dashboardData.offers.slice(0, 3).map((offer, index) => (
                  <div key={offer.id || index} className="animate-bounce-light overflow-hidden rounded-2xl bg-white p-4 shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#6C4FFF]"></span>
                      <p className="font-semibold text-[#6C4FFF]">
                        {offer.status === 'pending' ? "Kutilmoqda" : 
                         offer.status === 'accepted' ? "Qabul qilindi" : 
                         offer.status === 'rejected' ? "Rad etildi" : offer.status}
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {offer.product_name || offer.rfq_title || 'Taklif'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Miqdor: {offer.quantity || 'N/A'}, Narx: ${offer.price || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sana: {offer.created_at ? new Date(offer.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-white p-6 text-center shadow-md">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-500">Hozircha takliflar yo'q</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Mahsulotlaringizni qo'qing va birinchi taklifni oling!
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.7s', transform: 'translateY(-20px)' }}>
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-800">Sotuvchi KPI</h2>
              <button 
                onClick={() => navigate('/seller/analytics', {
                  state: {
                    fromDashboard: true,
                    flowStep: 'analytics-view',
                    returnPath: '/seller/dashboard'
                  }
                })}
                className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300 active:bg-gray-400"
              >
                <span className="material-symbols-outlined text-base">bar_chart</span>
                Batafsil ko'rish
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Jami mahsulotlar</p>
                <p className="my-1 text-3xl font-bold text-gray-900">
                  {dashboardData.stats?.total_products || dashboardData.stats?.products_count || 0}
                </p>
                <p className="text-xs text-blue-600">
                  {dashboardData.stats?.active_products_count || 0} faol
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Yangi so'rovlar</p>
                <p className="my-1 text-3xl font-bold text-gray-900">
                  {dashboardData.rfqs?.length || 0}
                </p>
                <p className="text-xs text-blue-600">
                  {dashboardData.rfqs?.filter(rfq => rfq.status === 'active').length || 0} faol
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Buyurtmalar</p>
                <p className="my-1 text-3xl font-bold text-gray-900">
                  {dashboardData.stats?.total_orders_as_supplier || dashboardData.stats?.orders_count || 0}
                </p>
                <p className="text-xs text-purple-600">
                  {dashboardData.stats?.completed_orders_count || 0} yakunlandi
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.7s', transform: 'translateY(-20px)' }}>
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-800">Yangi so'rovlar</h2>
              <Link 
                to="/seller/orders?tab=requests"
                state={{
                  flowStep: 'requests-view-partial',
                  returnPath: '/seller/dashboard'
                }}
                className="flex items-center gap-2 rounded-full bg-[#6C4FFF]/10 px-3 py-1.5 text-[#6C4FFF] text-xs font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base">assignment</span>
                Barchasini ko'rish
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {dashboardData.rfqs && dashboardData.rfqs.length > 0 ? (
                dashboardData.rfqs.slice(0, 3).map((rfq) => (
                  <div key={rfq.id} className="rounded-2xl bg-white p-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{rfq.brand} {rfq.grade}</h3>
                        <p className="text-xs text-gray-600 mt-1">{rfq.category?.name || 'Boshqa'} • {rfq.volume} {rfq.unit?.name || ''}</p>
                        <p className="text-xs text-gray-500 mt-1">{rfq.buyer?.first_name || 'Anonim'} mijoz</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${rfq.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {rfq.status === 'active' ? 'Faol' : 'Kutilmoqda'}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">{rfq.deadline?.split('T')[0] || rfq.created_at?.split('T')[0]}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => navigate(`/seller/request-details/${rfq.id}`)}
                        className="flex-1 bg-[#6C4FFF] text-white py-1.5 px-3 rounded-lg hover:bg-[#5A3FE6] transition-colors text-xs font-medium"
                      >
                        Javob berish
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-gray-100 p-6 text-center shadow-sm">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">assignment</span>
                  <p className="mt-2 text-xs text-gray-600">Hozircha yangi so'rovlar yo'q</p>
                  <p className="text-xs text-gray-500">Mahsulotlaringizni ko'rsating va mijozlar taklif keltiradi</p>
                </div>
              )}
            </div>
          </section>

          <section className="opacity-0" style={{ animationDelay: '0.8s', transform: 'translateY(-20px)' }}>
            <h2 className="px-2 text-xl font-bold text-gray-800">Tezkor amallar</h2>
            <div className="actions-grid mt-4 grid grid-cols-3 gap-3">
              <Link 
                to="/seller/products"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-200 py-4 text-sm font-bold text-[#6C4FFF] shadow-sm transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">add</span>
                Mahsulot
              </Link>
              <Link 
                to="/seller/orders"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#6C4FFF] py-4 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">inbox</span>
                Buyurtmalar
              </Link>
              <button className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-200 py-4 text-sm font-bold text-gray-800 shadow-sm transition-transform active:scale-95">
                <span className="material-symbols-outlined text-3xl text-[#6C4FFF]">support_agent</span>
                Yordam
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerDashboard;
