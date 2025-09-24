import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DigitalTtnModal = () => {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [ttnGenerated, setTtnGenerated] = useState(false)
  const [ttnNumber, setTtnNumber] = useState('')

  const orderDetails = {
    orderId: 'ORD-2024-001',
    supplier: 'Metro Construction Supplies',
    buyer: 'Tashkent Builders LLC',
    product: 'Concrete Mix M300',
    quantity: '100 bags',
    weight: '5,000 kg',
    deliveryAddress: 'Tashkent, Chilonzor district, Bunyodkor avenue, 12',
    deliveryDate: '2024-01-15',
    totalAmount: '$2,500.00'
  }

  const handleGenerateTTN = async () => {
    setIsGenerating(true)
    
    // Simulate TTN generation process
    setTimeout(() => {
      const generatedTtn = `TTN-${Date.now().toString().slice(-8)}`
      setTtnNumber(generatedTtn)
      setTtnGenerated(true)
      setIsGenerating(false)
    }, 3000)
  }

  const handleDownloadTTN = () => {
    console.log('Downloading TTN document...')
    // In real app, this would download the PDF
  }

  const handleShareTTN = () => {
    console.log('Sharing TTN document...')
    // In real app, this would share the document
  }

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">receipt_long</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Digital TTN</h2>
                <p className="text-sm text-gray-500">Transportation Waybill</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-600 text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!ttnGenerated ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-purple-600 text-4xl">receipt_long</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate Digital TTN</h3>
              <p className="text-gray-600 mb-8">
                Create a digital transportation waybill for your order. This document will be used for delivery tracking and legal compliance.
              </p>
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
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
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{orderDetails.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-purple-600">{orderDetails.totalAmount}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerateTTN}
                disabled={isGenerating}
                className={`w-full h-14 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isGenerating 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating TTN...</span>
                  </div>
                ) : (
                  'Generate Digital TTN'
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">TTN Generated Successfully!</h3>
              <p className="text-gray-600 mb-6">Your digital transportation waybill has been created.</p>
              
              {/* TTN Details */}
              <div className="bg-green-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="material-symbols-outlined text-green-600">receipt_long</span>
                  <span className="text-lg font-bold text-green-800">TTN Number</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{ttnNumber}</div>
                <p className="text-sm text-green-700">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              {/* TTN Information */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">TTN Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{orderDetails.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{orderDetails.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Address:</span>
                    <span className="font-medium text-right max-w-xs">{orderDetails.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Date:</span>
                    <span className="font-medium">{orderDetails.deliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleDownloadTTN}
                  className="w-full h-14 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="material-symbols-outlined">download</span>
                    <span>Download TTN</span>
                  </div>
                </button>
                <button 
                  onClick={handleShareTTN}
                  className="w-full h-14 bg-gray-100 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="material-symbols-outlined">share</span>
                    <span>Share TTN</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DigitalTtnModal
