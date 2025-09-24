import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FollowingPaymentsSuccess = () => {
  const navigate = useNavigate()
  const [paymentProgress, setPaymentProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  const paymentDetails = {
    orderId: 'ORD-2024-001',
    supplier: 'Metro Construction Supplies',
    buyer: 'Tashkent Builders LLC',
    totalAmount: '$2,500.00',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-2024-001234',
    processingTime: '2-3 business days'
  }

  const paymentSteps = [
    { id: 1, title: 'Payment Initiated', description: 'Payment request submitted', completed: true },
    { id: 2, title: 'Bank Processing', description: 'Transfer being processed by bank', completed: true },
    { id: 3, title: 'Verification', description: 'Payment details being verified', completed: paymentProgress >= 50 },
    { id: 4, title: 'Transfer', description: 'Funds being transferred to supplier', completed: paymentProgress >= 75 },
    { id: 5, title: 'Completed', description: 'Payment successfully completed', completed: paymentProgress >= 100 }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setPaymentProgress(prev => {
        if (prev >= 100) {
          setIsProcessing(false)
          clearInterval(timer)
          return 100
        }
        return prev + 10
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleViewOrder = () => {
    navigate('/full-order-details')
  }

  const handleViewTransactions = () => {
    navigate('/buyer/dashboard-1')
  }

  const handleContactSupport = () => {
    console.log('Contacting support...')
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Payment Processing</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-800">Payment Initiated Successfully!</h2>
              <p className="text-green-700">Your payment is being processed and will be completed within 2-3 business days.</p>
            </div>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Progress</h2>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing Payment</span>
              <span>{paymentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${paymentProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Payment Steps */}
          <div className="space-y-4">
            {paymentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500' 
                    : paymentProgress >= (index * 20) 
                      ? 'bg-purple-600' 
                      : 'bg-gray-200'
                }`}>
                  {step.completed ? (
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  ) : paymentProgress >= (index * 20) ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-gray-500 text-sm">{step.id}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    step.completed ? 'text-green-800' : paymentProgress >= (index * 20) ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{paymentDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{paymentDetails.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-purple-600">{paymentDetails.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{paymentDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Time:</span>
              <span className="font-medium">{paymentDetails.processingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium">{paymentDetails.supplier}</span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">Important Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• You will receive an email confirmation once payment is completed</p>
            <p>• Payment processing may take 2-3 business days</p>
            <p>• You can track payment status in your dashboard</p>
            <p>• Contact support if you have any questions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewOrder}
            className="w-full h-14 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30"
          >
            View Order Details
          </button>
          <button
            onClick={handleViewTransactions}
            className="w-full h-14 bg-gray-100 text-gray-800 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors"
          >
            View All Transactions
          </button>
          <button
            onClick={handleContactSupport}
            className="w-full h-14 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg hover:border-gray-300 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-yellow-800 font-medium">Payment is being processed...</p>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {!isProcessing && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <p className="text-green-800 font-medium">Payment processing completed! You will receive confirmation shortly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowingPaymentsSuccess
