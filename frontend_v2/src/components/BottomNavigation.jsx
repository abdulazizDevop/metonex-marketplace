import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BottomNavigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/seller/dashboard', icon: 'home', label: 'Bosh sahifa' },
    { path: '/seller/analytics', icon: 'analytics', label: 'Analitika' },
    { path: '/seller/orders', icon: 'list_alt', label: 'Buyurtmalar' },
    { path: '/seller/products', icon: 'grid_view', label: 'Mahsulotlar' },
    { path: '/seller/profile', icon: 'person', label: 'Profil' }
  ]

  return (
    <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <nav className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive 
                  ? 'text-[#6C4FFF]' 
                  : 'text-gray-500 hover:text-[#6C4FFF]'
              }`}
            >
              <span className="material-symbols-outlined">
                {item.icon}
              </span>
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}

export default BottomNavigation
