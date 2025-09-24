import React from 'react'
import { useNavigate } from 'react-router-dom'

const WaitingForBuyerConfirmation = () => {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    console.log('Going back to home...')
    navigate('/seller/home')
  }

  return (
    <div className="flex flex-col h-screen justify-between bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-gray-500 text-5xl">
            package_2
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipment Delivered</h1>
        <p className="text-gray-500 mb-8">Waiting for buyer to confirm delivery.</p>
        <div className="bg-gray-50 rounded-lg p-4 text-left w-full max-w-sm">
          <p className="text-gray-700 text-sm">Once confirmed, payment release will begin automatically.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6">
        <button 
          onClick={handleBackToHome}
          className="w-full bg-purple-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Back to Home
        </button>
      </footer>
    </div>
  )
}

export default WaitingForBuyerConfirmation
