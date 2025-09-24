import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FirstPaymentSuccess = () => {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Mock payment data
  const paymentData = {
    id: 'PAY-2024-001234',
    amount: '$15,000.00',
    currency: 'USD',
    product: 'Heavy Duty Excavator',
    supplier: 'Industrial Solutions Ltd.',
    buyer: 'Construction Corp.',
    paymentDate: '2024-01-21',
    paymentTime: '10:30 AM',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF-789456123',
    status: 'completed',
    nextPaymentDate: '2024-02-21',
    remainingAmount: '$30,000.00',
    totalAmount: '$45,000.00'
  }

  useEffect(() => {
    setIsAnimating(true)
    setShowConfetti(true)
    
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 3000)
    
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(confettiTimer)
    }
  }, [])

  const handleViewOrder = () => {
    navigate('/buyer/order-details')
  }

  const handleViewDashboard = () => {
    navigate('/buyer/dashboard')
  }

  const handleDownloadReceipt = () => {
    // Simulate download
    console.log('Downloading receipt...')
  }

  const handleScheduleNextPayment = () => {
    navigate('/buyer/payment-schedule')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-0 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-0 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm relative z-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-mono text-sm text-gray-900">{paymentData.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-20">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className={`relative inline-block ${isAnimating ? 'animate-bounce' : ''}`}>
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
            </div>
            {/* Ripple effect */}
            <div className={`absolute inset-0 rounded-full border-4 border-green-300 ${isAnimating ? 'animate-ping' : ''}`}></div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
            First Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your initial payment has been processed successfully
          </p>
        </div>

        {/* Payment Amount Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">First Payment Amount</p>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {paymentData.amount}
            </div>
            <p className="text-sm text-gray-500">
              Remaining: <span className="font-semibold">{paymentData.remainingAmount}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="material-symbols-outlined text-green-500">account_balance</span>
            <span>Payment processed successfully</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium text-gray-900">{paymentData.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium text-gray-900">{paymentData.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Date:</span>
              <span className="font-medium text-gray-900">{paymentData.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Time:</span>
              <span className="font-medium text-gray-900">{paymentData.paymentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900">{paymentData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reference Number:</span>
              <span className="font-mono text-sm text-gray-900">{paymentData.referenceNumber}</span>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Schedule</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">check</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">First Payment</p>
                  <p className="text-sm text-gray-600">{paymentData.paymentDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{paymentData.amount}</p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">schedule</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Second Payment</p>
                  <p className="text-sm text-gray-600">{paymentData.nextPaymentDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">{paymentData.remainingAmount}</p>
                <p className="text-xs text-blue-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>33% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: '33%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{paymentData.amount}</p>
              <p className="text-sm text-gray-600">Paid</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{paymentData.remainingAmount}</p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{paymentData.totalAmount}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleDownloadReceipt}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Download Receipt
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleViewOrder}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">receipt</span>
              View Order
            </button>
            <button
              onClick={handleScheduleNextPayment}
              className="bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">schedule</span>
              Schedule Next
            </button>
          </div>
          
          <button
            onClick={handleViewDashboard}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Go to Dashboard
          </button>
        </div>

        {/* Success Message */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-green-500 mt-0.5">celebration</span>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Congratulations!</h4>
              <p className="text-sm text-green-700">
                Your first payment has been successfully processed. You're now one step closer to completing your purchase. 
                The next payment is scheduled for {paymentData.nextPaymentDate}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstPaymentSuccess
