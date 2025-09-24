import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OfferDeclineConfirmation = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleBackToRequests = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/seller/my-requests')
    }, 1000)
  }

  const handleViewAnalytics = () => {
    navigate('/seller/analytics')
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-[#faf8fb] overflow-x-hidden">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <span className="material-symbols-outlined text-5xl text-green-500">
            check
          </span>
        </div>

        {/* Title and Description */}
        <h2 className="text-[#140e1b] text-3xl font-bold leading-tight tracking-tight text-center mb-2">
          Counter Offer Sent!
        </h2>
        <p className="text-[#55515b] text-base font-normal leading-normal text-center max-w-xs">
          The buyer has been notified and will review your offer.
        </p>

        {/* Offer Details Card */}
        <div className="w-full max-w-sm bg-white rounded-lg p-4 mt-8 shadow-sm">
          <h3 className="text-lg font-semibold text-[#140e1b] mb-4">Offer Details</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-[#55515b]">Offer ID:</span>
              <span className="font-medium text-[#140e1b]">#OF-2024-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55515b]">Product:</span>
              <span className="font-medium text-[#140e1b]">Industrial Equipment</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55515b]">Your Price:</span>
              <span className="font-medium text-[#140e1b]">$12,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55515b]">Original Price:</span>
              <span className="font-medium text-[#140e1b]">$15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55515b]">Status:</span>
              <span className="font-medium text-green-600">Counter Offer Sent</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mt-6">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Awaiting Buyer Response
        </div>

        {/* Next Steps */}
        <div className="w-full max-w-sm bg-blue-50 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">What's Next?</h4>
          <p className="text-sm text-blue-700">
            The buyer will review your counter offer and respond within 24 hours. You'll receive a notification when they reply.
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="p-4 space-y-3 sticky bottom-0 bg-[#faf8fb] border-t border-gray-200">
        <button 
          onClick={handleBackToRequests}
          disabled={isLoading}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#a35ee8] text-[#faf8fb] text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#8b4dd1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a35ee8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading...
            </div>
          ) : (
            <span className="truncate">Back to My Requests</span>
          )}
        </button>
        
        <button 
          onClick={handleViewAnalytics}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#ede8f3] text-[#140e1b] text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#e0d5e8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a35ee8] transition-colors"
        >
          <span className="truncate">View Analytics</span>
        </button>
      </div>
    </div>
  )
}

export default OfferDeclineConfirmation
