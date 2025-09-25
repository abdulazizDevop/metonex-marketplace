import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BuyerBottomNavigation from './BuyerBottomNavigation'

const BuyerLayout = ({ children }) => {
  const location = useLocation()
  
  // Sahifalar ro'yxati, ularning tagida navigation ko'rsatilmasligi kerak
  const hideNavigationPaths = [
    '/buyer/registration'
  ]
  
  const shouldHideNavigation = hideNavigationPaths.includes(location.pathname)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <main className="flex-grow pb-20">
          {children || <Outlet />}
        </main>
        {!shouldHideNavigation && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
            <BuyerBottomNavigation />
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyerLayout
