import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getItemMeta, getMyNotifications } from '../utils/api.js'
import { useEffect } from 'react'

export default function BuyerHeader({ 
  search, 
  setSearch, 
  category, 
  setCategory, 
  status, 
  setStatus, 
  unit, 
  setUnit, 
  subcategory, 
  setSubcategory, 
  showFilters = false,
  cartCount = 0
}) {
  const navigate = useNavigate()
  const [meta, setMeta] = useState({ 
    categories: [], 
    subcategories: [], 
    units: [], 
    statuses: [],
    companies: [], 
    regions: [] 
  })
  const [notificationCount, setNotificationCount] = useState(0)
  
  useEffect(() => {
    getItemMeta().then(setMeta)
  }, [])
  
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getMyNotifications()
        setNotificationCount(data.unread || 0)
      } catch (error) {
        console.error('Notification yuklashda xato:', error)
      }
    }
    
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000) // 30 soniyada bir marta yangilash
    
    return () => clearInterval(interval)
  }, [])
  async function doLogout() {
    try {
      const api = (import.meta.env.VITE_API_URL || 'https://metonex.pythonanywhere.com/api/v1')
      const refresh = localStorage.getItem('refresh')
      const access = localStorage.getItem('access')
      await fetch(api + '/auth/logout/', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${access}` 
        }, 
        body: JSON.stringify({ refresh }) 
      })
    } catch (error) {
      console.error('Logout xatosi:', error)
    } finally {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('user_role')
      localStorage.removeItem('has_company')
      navigate('/')
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row - Logo, Search, Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/buyer" className="text-2xl font-bold text-black">
              MetOneX
            </Link>
          </div>

          {/* Search */}
          {showFilters && (
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/buyer" className="text-gray-700 hover:text-green-600 font-medium">
              Mahsulotlar
            </Link>
            <Link to="/buyer/catalog" className="text-gray-700 hover:text-green-600 font-medium">
              Katalog
            </Link>
            <Link to="/buyer/requests" className="text-gray-700 hover:text-green-600 font-medium">
              Zayavkalar
            </Link>
            <Link to="/buyer/orders" className="text-gray-700 hover:text-green-600 font-medium">
              Buyurtmalar
            </Link>
            <Link to="/buyer/cart" className="text-gray-700 hover:text-green-600 font-medium flex items-center relative px-2 py-1 rounded-md hover:bg-green-50 transition-colors">

              Savat
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow-sm border border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link to="/buyer/profile" className="text-gray-700 hover:text-green-600 font-medium">
              Profil
            </Link>
            <Link to="/buyer/notifications" className="relative px-3 py-2 rounded border border-green-300 rounded-md bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-400 transition">
                🔔
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
            </Link>
            <button 
              onClick={doLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-green-300 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              Chiqish
            </button>
          </nav>
        </div>

        {/* Bottom Row - Filters */}
        {showFilters && (
          <div className="py-4 border-t border-green-100">
            {/* Birinchi qator - Asosiy filterlar */}
            <div className="flex items-center space-x-6 mb-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Kategoriya:</label>
                <select
                  className="border border-green-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Barcha kategoriyalar</option>
                  {meta.categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Subkategoriya:</label>
                <select
                  className="border border-green-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                >
                  <option value="">Barcha subkategoriyalar</option>
                  {meta.subcategories
                    .filter(sub => !category || sub.category_id === category)
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
              </div>
            </div>
            
            {/* Ikkinchi qator - Qo'shimcha filterlar */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Holat:</label>
                <select
                  className="border border-green-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Barcha holatlar</option>
                  {meta.statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">O'lchov:</label>
                <select
                  className="border border-green-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="">Barcha o'lchovlar</option>
                  {meta.units.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
