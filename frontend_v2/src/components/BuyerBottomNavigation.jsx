import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BuyerBottomNavigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/buyer/home', icon: 'home', label: 'Home' },
    { path: '/buyer/dashboard', icon: 'bar_chart', label: 'Dashboard' },
    { path: '/buyer/orders', icon: 'list_alt', label: 'Orders' },
    { path: '/buyer/company', icon: 'business', label: 'Company' },
    { path: '/buyer/profile', icon: 'person', label: 'Profile' }
  ]

  return (
    <nav className="bg-white">
      <div className="flex justify-around items-center h-20 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <span 
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BuyerBottomNavigation
