import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <main className="flex-grow">
          {children || <Outlet />}
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}

export default Layout
