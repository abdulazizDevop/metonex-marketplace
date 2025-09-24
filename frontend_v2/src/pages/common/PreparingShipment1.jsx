import React from 'react'
import { useNavigate } from 'react-router-dom'

const PreparingShipment1 = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewTTN = () => {
    console.log('Viewing TTN...')
  }

  const handleAboutOrder = () => {
    console.log('Viewing order details...')
    navigate('/buyer/order-details')
  }

  const handleContactSupport = () => {
    console.log('Contacting support...')
  }

  const handleNavigation = (page) => {
    navigate(`/${page}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="relative bg-gradient-to-b from-purple-600 to-blue-600 pt-16 pb-12 text-white">
        <div className="absolute top-4 left-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="mb-4">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/10">
              <span className="material-symbols-outlined text-6xl text-white opacity-90" style={{fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48"}}>
                local_shipping
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">In Delivery</h1>
          <p className="mt-2 text-base text-white/80">Your order is on its way to you.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6">
        <div className="relative pl-6">
          <div className="absolute left-[27px] top-5 bottom-5 w-px bg-gray-200"></div>
          
          {/* Order Confirmed */}
          <div className="relative flex items-start mb-8">
            <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-green-500">
              <span className="material-symbols-outlined text-white text-3xl">check</span>
            </div>
            <div className="ml-4 pt-3">
              <p className="font-semibold text-lg text-gray-800">Order Confirmed</p>
            </div>
          </div>
          
          {/* Preparing Shipment */}
          <div className="relative flex items-start mb-8">
            <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-green-500">
              <span className="material-symbols-outlined text-white text-3xl">check</span>
            </div>
            <div className="ml-4 pt-3">
              <p className="font-semibold text-lg text-gray-800">Preparing Shipment</p>
            </div>
          </div>
          
          {/* In Delivery */}
          <div className="relative flex items-start mb-8">
            <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-purple-600" style={{
              boxShadow: '0 0 15px 4px rgba(94, 92, 230, 0.4)',
              animation: 'glow-pulse 2s infinite ease-in-out'
            }}>
              <span className="material-symbols-outlined text-white text-3xl">local_shipping</span>
            </div>
            <div className="ml-4 pt-1 flex-1">
              <p className="font-semibold text-lg text-purple-600">In Delivery</p>
              <button 
                onClick={handleViewTTN}
                className="mt-2 px-4 py-1.5 rounded-full bg-white border border-gray-300 text-sm font-semibold text-purple-600 shadow-sm hover:bg-gray-50 transition-colors"
              >
                View TTN
              </button>
            </div>
          </div>
          
          {/* Delivered */}
          <div className="relative flex items-start">
            <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gray-200">
              <span className="material-symbols-outlined text-gray-500 text-3xl">task_alt</span>
            </div>
            <div className="ml-4 pt-3">
              <p className="font-semibold text-lg text-gray-500">Delivered</p>
            </div>
          </div>
        </div>

        {/* Order Card */}
        <div className="mt-8 bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Order ID #12345</p>
              <h2 className="text-xl font-bold text-gray-900 mt-1">Concrete Mix</h2>
              <p className="text-base text-gray-600 mt-1">Quantity: 100 bags</p>
              <p className="text-2xl font-bold text-purple-600 mt-3">$500.00</p>
            </div>
            <div className="w-24 h-24 ml-4 flex-shrink-0">
              <img 
                alt="Concrete Mix" 
                className="w-full h-full object-cover rounded-lg" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDICQME4K3tqpbsec2hFc6iWZGwttVSNo-i0s5VE8X5IveiOvfGMrlwuQ5e-FKH--LDFAdNCWkstx89kbUWUAsbjiduNs0sW4aVLupGnPKdc7otgz7ASCo02iZAnW1lo9pJVL3XeUeiok1W6yQhDuoDp_DssIkI5DGtxQ2C6BsMbykjRYM3A1zu0qQ9j8PgbS58M5ES4YvXpnTJbzDZt7vrm1lypaM6zkT3oltLk1MzsrV6THbBQDOgh2841POfA_2BBNJMWbvcZN8"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button 
            onClick={handleAboutOrder}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-md transition-transform active:scale-95 hover:shadow-lg"
          >
            About Order
          </button>
          <button 
            onClick={handleContactSupport}
            className="w-full h-14 rounded-2xl bg-gray-200 text-gray-800 font-bold text-lg transition-transform active:scale-95 hover:bg-gray-300"
          >
            Contact Support
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-100">
        <nav className="flex justify-around items-center h-20">
          <button
            onClick={() => handleNavigation('buyer/home')}
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/orders')}
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs">Orders</span>
          </button>
          <button className="flex flex-col items-center text-purple-600">
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-xs">Shipment</span>
          </button>
          <button
            onClick={() => handleNavigation('buyer/profile')}
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs">Profile</span>
          </button>
        </nav>
      </footer>
    </div>
  )
}

export default PreparingShipment1
