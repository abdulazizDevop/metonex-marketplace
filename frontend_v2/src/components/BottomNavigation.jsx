import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BottomNavigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/seller', icon: 'home', label: 'Home' },
    { path: '/seller/my-requests', icon: 'article', label: 'Requests' },
    { path: '/seller/add-product', icon: 'inventory_2', label: 'Products' },
    { path: '/seller/profile-1', icon: 'person', label: 'Profile' }
  ]

  return (
    <nav className="bg-white">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
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

export default BottomNavigation
