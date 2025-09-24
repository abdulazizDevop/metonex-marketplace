import React from 'react'
import { useNavigate } from 'react-router-dom'

const PayoutInProgress = () => {
  const navigate = useNavigate()

  const handleNavigation = (page) => {
    navigate(`/${page}`)
  }

  return (
    <div className="flex flex-col h-screen justify-between bg-gray-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="bg-white p-4">
        <h1 className="text-xl font-bold text-center">Payment Status</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center p-6 space-y-12">
        {/* Progress Steps */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-medium text-gray-500 w-1/3 text-center">
              Escrow Release
            </div>
            <div className="text-xs font-bold text-purple-600 w-1/3 text-center">
              Bank Transfer
            </div>
            <div className="text-xs font-medium text-gray-500 w-1/3 text-center">
              Supplier Account
            </div>
          </div>
          <div className="relative w-full h-1.5 bg-gray-200 rounded-full">
            <div className="absolute h-1.5 bg-purple-600 rounded-full" style={{width: '66%'}}></div>
            <div className="absolute h-3.5 w-3.5 bg-white border-2 border-gray-200 rounded-full -top-1" style={{left: '0%'}}></div>
            <div className="absolute h-3.5 w-3.5 bg-white border-2 border-purple-600 rounded-full -top-1" style={{left: 'calc(33% - 8px)'}}></div>
            <div className="absolute h-3.5 w-3.5 bg-white border-2 border-purple-600 rounded-full -top-1" style={{left: 'calc(66% - 8px)'}}></div>
            <div className="absolute h-3.5 w-3.5 bg-white border-2 border-gray-200 rounded-full -top-1" style={{right: '0%'}}></div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-gray-900">
            Funds are being transferred.
          </p>
          <p className="text-sm text-gray-500">Expected arrival: 24 hours</p>
        </div>

        {/* Secure Transfer Icon */}
        <div className="flex flex-col items-center space-y-2">
          <span className="material-symbols-outlined text-purple-600 text-4xl animate-pulse">
            lock
          </span>
          <p className="text-xs text-gray-500 font-medium">Secure Transfer</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <nav className="flex justify-around p-2">
          <button
            onClick={() => handleNavigation('buyer/home')}
            className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/orders')}
            className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">credit_card</span>
            <span className="text-xs font-bold">Payments</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/profile')}
            className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </nav>
        <div className="h-5 bg-white"></div>
      </footer>
    </div>
  )
}

export default PayoutInProgress
