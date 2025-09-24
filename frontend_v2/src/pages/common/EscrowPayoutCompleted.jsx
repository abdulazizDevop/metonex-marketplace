import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EscrowPayoutCompleted = () => {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Mock transaction data
  const transactionData = {
    id: 'TXN-2024-001234',
    amount: '$45,000.00',
    currency: 'USD',
    supplier: 'Industrial Solutions Ltd.',
    buyer: 'Construction Corp.',
    product: 'Heavy Duty Excavator',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    payoutDate: '2024-01-21',
    status: 'completed',
    fees: '$450.00',
    netAmount: '$44,550.00',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF-789456123'
  }

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleViewTransaction = () => {
    navigate('/seller/transactions')
  }

  const handleDownloadReceipt = () => {
    // Simulate download
    console.log('Downloading receipt...')
  }

  const handleNewOrder = () => {
    navigate('/seller/my-requests')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
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
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm text-gray-900">{transactionData.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
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
            Payout Completed!
          </h1>
          <p className="text-lg text-gray-600">
            Your escrow payment has been successfully processed
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Total Payout Amount</p>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {transactionData.amount}
            </div>
            <p className="text-sm text-gray-500">
              Net amount after fees: <span className="font-semibold">{transactionData.netAmount}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="material-symbols-outlined text-green-500">account_balance</span>
            <span>Transferred to your bank account</span>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Transaction Summary</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>{showDetails ? 'Hide' : 'Show'} Details</span>
              <span className="material-symbols-outlined text-sm">
                {showDetails ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Product</span>
              <span className="font-medium text-gray-900">{transactionData.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buyer</span>
              <span className="font-medium text-gray-900">{transactionData.buyer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date</span>
              <span className="font-medium text-gray-900">{transactionData.orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Date</span>
              <span className="font-medium text-gray-900">{transactionData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payout Date</span>
              <span className="font-medium text-gray-900">{transactionData.payoutDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">{transactionData.paymentMethod}</span>
            </div>
          </div>

          {showDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Amount</span>
                <span className="font-medium text-gray-900">{transactionData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fees</span>
                <span className="font-medium text-red-600">-{transactionData.fees}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                <span className="text-gray-900">Net Amount</span>
                <span className="text-green-600">{transactionData.netAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference Number</span>
                <span className="font-mono text-sm text-gray-900">{transactionData.referenceNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Timeline</h3>
          <div className="space-y-4">
            {[
              { status: 'completed', title: 'Order Placed', date: 'Jan 15, 2024', time: '10:30 AM' },
              { status: 'completed', title: 'Payment Secured', date: 'Jan 15, 2024', time: '11:45 AM' },
              { status: 'completed', title: 'Product Delivered', date: 'Jan 20, 2024', time: '2:15 PM' },
              { status: 'completed', title: 'Delivery Confirmed', date: 'Jan 20, 2024', time: '4:30 PM' },
              { status: 'completed', title: 'Payout Processed', date: 'Jan 21, 2024', time: '9:00 AM' }
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <span className="material-symbols-outlined text-white text-sm">
                    {step.status === 'completed' ? 'check' : 'schedule'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.date} at {step.time}</p>
                </div>
              </div>
            ))}
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
              onClick={handleViewTransaction}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">receipt</span>
              View Transaction
            </button>
            <button
              onClick={handleNewOrder}
              className="bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Order
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-green-500 mt-0.5">celebration</span>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Congratulations!</h4>
              <p className="text-sm text-green-700">
                Your payment has been successfully processed and transferred to your account. 
                You should see the funds within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EscrowPayoutCompleted
