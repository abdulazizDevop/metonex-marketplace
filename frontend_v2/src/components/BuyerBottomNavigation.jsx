import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BuyerBottomNavigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/buyer', icon: 'home', label: 'Home' },
    { path: '/buyer/offers', icon: 'list_alt', label: 'Requests' },
    { path: '/buyer/dashboard-1', icon: 'bar_chart', label: 'Dashboard' },
    { path: '/buyer/registration', icon: 'person', label: 'Profile' }
  ]

  return (
    <nav className="border-t border-gray-200 bg-white">
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
