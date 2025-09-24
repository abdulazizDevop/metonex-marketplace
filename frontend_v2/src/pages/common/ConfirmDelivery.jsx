import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ConfirmDelivery = () => {
  const navigate = useNavigate()
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const orderDetails = {
    orderId: 'ORD-2024-001',
    product: 'Concrete Mix M300',
    quantity: '100 bags',
    supplier: 'Metro Construction Supplies',
    deliveryDate: '2024-01-15',
    deliveryTime: '14:30',
    deliveryAddress: 'Tashkent, Chilonzor district, Bunyodkor avenue, 12',
    driverName: 'Akmal Karimov',
    driverPhone: '+998 90 123 45 67',
    vehicleNumber: '01 A 123 BC'
  }

  const handleConfirmDelivery = async () => {
    setIsConfirming(true)
    
    // Simulate confirmation process
    setTimeout(() => {
      setDeliveryConfirmed(true)
      setIsConfirming(false)
    }, 2000)
  }

  const handleReportIssue = () => {
    console.log('Reporting delivery issue...')
    navigate('/delivery-feedback')
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewOrder = () => {
    navigate('/full-order-details')
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
          <h1 className="text-xl font-bold text-gray-900">Confirm Delivery</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!deliveryConfirmed ? (
          <>
            {/* Delivery Status */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">local_shipping</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-green-800">Delivery Arrived!</h2>
                  <p className="text-green-700">Your order has been delivered. Please confirm receipt.</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{orderDetails.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{orderDetails.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="font-medium">{orderDetails.supplier}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">{orderDetails.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">{orderDetails.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right max-w-xs">{orderDetails.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">{orderDetails.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver Phone:</span>
                  <span className="font-medium">{orderDetails.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{orderDetails.vehicleNumber}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Checklist */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Please verify the following:</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5"></div>
                  <p className="text-gray-700">Product quantity matches the order</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5"></div>
                  <p className="text-gray-700">Product quality is satisfactory</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5"></div>
                  <p className="text-gray-700">All items are undamaged</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5"></div>
                  <p className="text-gray-700">Delivery documentation is complete</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirmDelivery}
                disabled={isConfirming}
                className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  isConfirming
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/30'
                }`}
              >
                {isConfirming ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming...</span>
                  </div>
                ) : (
                  'Confirm Delivery'
                )}
              </button>
              <button
                onClick={handleReportIssue}
                className="w-full h-14 bg-red-100 text-red-800 rounded-2xl font-bold text-lg hover:bg-red-200 transition-colors"
              >
                Report Issue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-green-800">Delivery Confirmed!</h2>
                  <p className="text-green-700">Thank you for confirming your delivery. Your order is now complete.</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600 text-sm">rate_review</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rate Your Experience</p>
                    <p className="text-sm text-gray-600">Help other buyers by rating the supplier</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600 text-sm">receipt_long</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download Receipt</p>
                    <p className="text-sm text-gray-600">Get your order receipt and invoice</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600 text-sm">shopping_cart</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Place New Order</p>
                    <p className="text-sm text-gray-600">Continue shopping for more products</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/delivery-feedback')}
                className="w-full h-14 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30"
              >
                Rate & Review
              </button>
              <button
                onClick={handleViewOrder}
                className="w-full h-14 bg-gray-100 text-gray-800 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                View Order Details
              </button>
              <button
                onClick={() => navigate('/buyer/home')}
                className="w-full h-14 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg hover:border-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ConfirmDelivery