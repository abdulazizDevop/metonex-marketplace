import React from 'react'
import { useNavigate } from 'react-router-dom'

const FirstOrderCongratulations = () => {
  const navigate = useNavigate()

  const handleTrackOrder = () => {
    console.log('Tracking order...')
    navigate('/buyer/orders')
  }

  const handleNavigation = (page) => {
    navigate(`/${page}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="bg-gradient-to-b from-purple-500 to-blue-500 text-white relative">
        <div className="absolute inset-0 z-0 opacity-20"></div>
        <div className="relative z-10 flex items-center justify-between p-4 pt-10">
          <h1 className="text-xl font-bold">MetOneX</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 -mt-16">
        <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-white shadow-lg">
          <span className="material-symbols-outlined text-purple-600 text-5xl">
            celebration
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations on Your First Order!</h2>
        <p className="text-gray-600 mb-6">You are client #247 in the MetOneX marketplace. Welcome to our trusted network.</p>
        <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-8">
          <span className="material-symbols-outlined text-lg mr-1.5">
            verified
          </span>
          Trusted Client
        </div>
        <button 
          onClick={handleTrackOrder}
          className="w-full max-w-sm bg-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-purple-700 transition-colors duration-300"
        >
          Track My Order
        </button>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <nav className="flex justify-around p-2">
          <button
            onClick={() => handleNavigation('buyer/home')}
            className="flex flex-col items-center text-purple-600 w-1/4"
          >
            <span className="material-symbols-outlined text-2xl">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/requests')}
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 w-1/4 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">list_alt</span>
            <span className="text-xs">Requests</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/dashboard')}
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 w-1/4 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">bar_chart</span>
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/profile')}
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 w-1/4 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="text-xs">Profile</span>
          </button>
        </nav>
        <div className="bg-white h-5"></div>
      </footer>
    </div>
  )
}

export default FirstOrderCongratulations
