import React from 'react'
import { Outlet } from 'react-router-dom'
import BuyerBottomNavigation from './BuyerBottomNavigation'

const BuyerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <main className="flex-grow">
          {children || <Outlet />}
        </main>
        <BuyerBottomNavigation />
      </div>
    </div>
  )
}

export default BuyerLayout
