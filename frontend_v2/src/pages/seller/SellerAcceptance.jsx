import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SupplierAcceptance = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [requestDetails, setRequestDetails] = useState({
    id: '123456789',
    buyerName: 'ABC Company',
    productName: 'Industrial Equipment',
    quantity: 50,
    budget: '$15,000',
    deliveryDate: '2024-02-15',
    status: 'accepted'
  })

  const handleDone = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      navigate('/seller/dashboard')
    }, 1000)
  }

  const handleClose = () => {
    navigate('/seller/dashboard')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="w-8"></div>
        <h1 className="text-base font-semibold text-gray-900">MetOneX</h1>
        <button 
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-gray-700 text-xl">
            close
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-8 pb-16">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-green-500" style={{fontSize: '64px'}}>
              check_circle
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          You accepted the request
        </h2>
        <p className="text-lg text-gray-600 max-w-xs mb-8">
          Waiting for buyer's acceptance
        </p>

        {/* Request Details Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Request ID:</span>
              <span className="font-medium text-gray-900">{requestDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buyer:</span>
              <span className="font-medium text-gray-900">{requestDetails.buyerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium text-gray-900">{requestDetails.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium text-gray-900">{requestDetails.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium text-gray-900">{requestDetails.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery:</span>
              <span className="font-medium text-gray-900">{requestDetails.deliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Request Accepted
        </div>

        {/* Next Steps */}
        <div className="w-full max-w-sm bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">What's Next?</h4>
          <p className="text-sm text-blue-700">
            The buyer will review your acceptance and confirm the order. You'll receive a notification once they respond.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-white sticky bottom-0 border-t border-gray-200">
        <button 
          onClick={handleDone}
          disabled={isLoading}
          className="w-full h-12 px-5 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading...
            </div>
          ) : (
            'Done'
          )}
        </button>
      </footer>
    </div>
  )
}

export default SupplierAcceptance