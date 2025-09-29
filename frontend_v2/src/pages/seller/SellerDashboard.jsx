import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BottomNavigation from '../../components/BottomNavigation'

const SellerDashboard = () => {
  const [hasProducts, setHasProducts] = useState(false); // This would come from API/state
  const [hasOrders, setHasOrders] = useState(false); // This would come from API/state
  const [userData, setUserData] = useState(null)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    // Registration ma'lumotlarini localStorage'dan olish
    const registrationData = localStorage.getItem('sellerRegistrationData')
    if (registrationData) {
      const data = JSON.parse(registrationData)
      setUserData(data)
      
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
  }, [])

  // If no products, show welcome screen
  if (!hasProducts) {
    const companyName = userData?.company?.name || 'Sotuvchi'
    const supplierType = userData?.user?.supplier_type || 'manufacturer'
    
    return (
      <div className="relative flex size-full min-h-screen flex-col justify-between">
        <header className="p-6">
          <h1 className="text-xl font-semibold text-center text-gray-900">
            {isNewUser ? `Xush kelibsiz, ${companyName}!` : `Salom, ${companyName}`}
          </h1>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="w-48 h-48 mb-8">
            <svg className="w-full h-full text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M3.27 6.96L12 12.01l8.73-5.05" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M12 22.08V12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          
          {isNewUser ? (
            <>
              <h2 className="text-xl font-bold text-gray-900">Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!</h2>
              <p className="mt-2 text-gray-500">
                {supplierType === 'dealer' 
                  ? "Endi mahsulotlaringizni qo'shing va sotishni boshlang."
                  : "Endi mahsulotlaringizni qo'shing va ishlab chiqarishni boshlang."
                }
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900">Sizda hali mahsulotlar yo'q.</h2>
              <p className="mt-2 text-gray-500">Birinchi mahsulotingizni qo'shing.</p>
            </>
          )}
        </main>

        <footer className="p-6 pb-8">
          <Link 
            to="/seller/products"
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg font-medium text-center block hover:bg-[#5A3FE6] transition-colors"
          >
            Mahsulot qo'shish
          </Link>
          <button 
            onClick={() => setHasProducts(true)} // Test uchun
            className="mt-4 w-full text-gray-500 font-medium"
          >
            Hozircha o'tkazib yuborish
          </button>
        </footer>
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
              {userData?.company?.name ? `Xush kelibsiz, ${userData.company.name}` : 'Xush kelibsiz, Sotuvchi'}
            </p>
            <p className="mt-1 text-base text-white/80">Bugungi biznes ko'rsatkichlaringiz.</p>
          </div>
        </header>

        <main className="p-4 pb-24 animate-layered-in bg-gray-50">
          <section className="mt-4 mb-6 opacity-0" style={{ animationDelay: '0.3s', transform: 'translateY(-20px)' }}>
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Sotuvchi reytingi</h3>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <p className="text-xl font-bold text-gray-900">4.7<span className="text-base font-medium text-gray-500">/5</span></p>
                    <p className="text-sm text-gray-600">128 Bajarilgan buyurtma</p>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Eng yaxshi sotuvchi
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.5s', transform: 'translateY(-20px)' }}>
            <h2 className="px-2 text-xl font-bold text-gray-800">Faol buyurtmalar</h2>
            <div className="mt-4 space-y-4">
              <div className="animate-bounce-light overflow-hidden rounded-2xl bg-white p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6C4FFF]"></span>
                  <p className="font-semibold text-[#6C4FFF]">Yangi so'rov</p>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">Premium beton aralashmasi</p>
                <p className="text-sm text-gray-500">Miqdor: 50 ton, Narx: $2,500</p>
                <p className="text-sm text-gray-500">Muddat: 2024-07-25</p>
                <div className="mt-4">
                  <div className="relative h-1.5 w-full rounded-full bg-gray-200">
                    <div className="absolute h-1.5 w-0 rounded-full bg-[#6C4FFF]"></div>
                    <div className="absolute -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#6C4FFF] shadow" style={{ left: '5%' }}></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400">
                    <span>So'rov qabul qilindi</span>
                    <span>Taklif yuborildi</span>
                    <span>Buyurtma tasdiqlandi</span>
                    <span>Yetkazib berildi</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 opacity-0" style={{ animationDelay: '0.7s', transform: 'translateY(-20px)' }}>
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-800">Sotuvchi KPI</h2>
              <Link 
                to="/seller/analytics"
                className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300 active:bg-gray-400"
              >
                <span className="material-symbols-outlined text-base">bar_chart</span>
                Batafsil ko'rish
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Bugungi buyurtmalar</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '8' }}></p>
                <p className="text-xs text-green-600">+12% kechagiga nisbatan</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Daromad</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '12500' }}></p>
                <p className="text-xs text-green-600">+8% kechagiga nisbatan</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">Kutilmoqda</p>
                <p className="animate-count-up my-1 text-3xl font-bold text-gray-900" style={{ '--num-target': '3' }}></p>
                <p className="text-xs text-orange-600">2 shoshilinch</p>
              </div>
            </div>
          </section>

          <section className="opacity-0" style={{ animationDelay: '0.9s', transform: 'translateY(-20px)' }}>
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
