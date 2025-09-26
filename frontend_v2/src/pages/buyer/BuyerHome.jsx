import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BuyerHome = () => {
  const navigate = useNavigate()
  const [showOrderMethods, setShowOrderMethods] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  // Mock data - in real app this would come from API
  const [hasOrders] = useState(true) // Change to true to see screen 2
  const [activeOrdersCount] = useState(5)
  
  // Mock offers data
  const [newOffers] = useState([
    {
      id: 1,
      title: 'Rebar Ø12, 20 tons',
      status: '3 offers received',
      lowestPrice: '$710/t',
      fastestDelivery: '2 days',
      hasNewOffers: true
    },
    {
      id: 2,
      title: 'Concrete Mix C25, 50 tons',
      status: '2 offers received',
      lowestPrice: '$45/t',
      fastestDelivery: '1 day',
      hasNewOffers: true
    },
    {
      id: 3,
      title: 'Steel Beams I-200, 10 tons',
      status: '1 offer received',
      lowestPrice: '$850/t',
      fastestDelivery: '3 days',
      hasNewOffers: false
    }
  ])

  const handleGoToProducts = () => {
    navigate('/buyer/category-selection')
  }

  const handleCreateRequest = () => {
    setShowOrderMethods(true)
  }

  const handleUploadEstimate = () => {
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 4000)
  }

  const orderMethods = [
    {
      id: 'tender',
      type: 'Tender',
      icon: 'assignment',
      title: 'Tender',
      subtitle: 'Describe your need and receive offers from multiple suppliers'
    },
    {
      id: 'quick-order',
      type: 'Quick Order',
      icon: 'shopping_cart',
      title: 'Quick Order',
      subtitle: 'Find product, choose supplier, order instantly'
    },
    {
      id: 'upload-estimate',
      type: 'Upload Estimate',
      icon: 'cloud_upload',
      title: 'Upload Estimate',
      subtitle: 'Upload your cost estimate — system will match items to suppliers'
    }
  ]

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
  }

  const handleNext = () => {
    if (selectedMethod) {
      if (selectedMethod.id === 'quick-order') {
        navigate('/buyer/category-selection')
      } else {
        // Show temporary message for other methods
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          setShowOrderMethods(false)
          setSelectedMethod(null)
        }, 4000)
      }
    }
  }

  const handleBack = () => {
    setShowOrderMethods(false)
    setSelectedMethod(null)
  }

  const handleViewOffers = (offerId) => {
    navigate(`/buyer/orders?tab=offers&requestId=${offerId}`)
  }

  const handleRemindSuppliers = (offerId) => {
    console.log('Remind suppliers for offer:', offerId)
    // In real app, this would send reminder notifications
  }

  // Screen 1: No orders yet
  if (!hasOrders) {
    return (
      <div className="flex flex-col justify-between min-h-screen bg-white">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-orange-500 text-white px-8 py-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">info</span>
              <div>
                <p className="font-medium">Bu funktsiya vaqtinchalik ishlamayapti</p>
                <p className="text-sm opacity-90">Iltimos, keyinroq urinib ko'ring</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Methods Modal */}
        {showOrderMethods && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-900">Buyurtma usulini tanlang</h1>
                  <button 
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-gray-500">close</span>
                  </button>
                </div>
              </div>

              {/* Methods */}
              <div className="px-6 space-y-4">
                {orderMethods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    className={`bg-white rounded-xl p-4 flex items-center gap-4 border-2 transition-all duration-300 cursor-pointer ${
                      selectedMethod?.id === method.id
                        ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'border-gray-200 hover:border-blue-600/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">
                        {method.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{method.subtitle}</p>
                    </div>
                    {selectedMethod?.id === method.id && (
                      <span className="material-symbols-outlined text-blue-600">check_circle</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 pt-4">
                <button 
                  onClick={handleNext}
                  disabled={!selectedMethod}
                  className={`w-full h-12 text-white font-bold rounded-xl transition-all duration-300 ${
                    selectedMethod
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {selectedMethod ? `Davom etish` : 'Usulni tanlang'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="p-6 pb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">MetOneX</h1>
            <button className="text-gray-500">
              <span className="material-symbols-outlined text-3xl">notifications</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center items-center px-6 text-center pb-6">
          <div className="space-y-6">
            <img 
              alt="Construction materials" 
              className="w-48 h-48 mx-auto" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2PLJ1mxubGQnbAr6J7T8c06qoWCqCBsHooV2vc-ts_MFwIK0Rg--drd6ckudHyAgXR9gOhDKCVqlMEf0XonZo59nBdyAmOVuRuwINl4_LIs91JlIOMrBERNWBmwl_9aZPTSBxTPDZ2CasN1h01WKkM3a5sAE9v3ZGe-hR5w5iZE6hj0G8l1zE6C8QFhg4xuFSzjIFOqPdHppqHodVApXP1KlwRVYKMPBVg37WgqL8xnnpMAWvFsITL_9derqV4SYCajRBI2mBChw"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">You don't have any orders yet</h2>
            </div>
          </div>
          
          {/* Create Request Button */}
          <div className="mt-8 w-full">
            <button 
              onClick={handleCreateRequest}
              className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              Create New Request
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Screen 2: Has orders and offers
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-orange-500 text-white px-8 py-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">info</span>
            <div>
              <p className="font-medium">Bu funktsiya vaqtinchalik ishlamayapti</p>
              <p className="text-sm opacity-90">Iltimos, keyinroq urinib ko'ring</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Methods Modal */}
      {showOrderMethods && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Buyurtma usulini tanlang</h1>
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-500">close</span>
                </button>
              </div>
            </div>

            {/* Methods */}
            <div className="px-6 space-y-4">
              {orderMethods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => handleMethodSelect(method)}
                  className={`bg-white rounded-xl p-4 flex items-center gap-4 border-2 transition-all duration-300 cursor-pointer ${
                    selectedMethod?.id === method.id
                      ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                      : 'border-gray-200 hover:border-blue-600/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">
                      {method.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{method.subtitle}</p>
                  </div>
                  {selectedMethod?.id === method.id && (
                    <span className="material-symbols-outlined text-blue-600">check_circle</span>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 pt-4">
              <button 
                onClick={handleNext}
                disabled={!selectedMethod}
                className={`w-full h-12 text-white font-bold rounded-xl transition-all duration-300 ${
                  selectedMethod
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {selectedMethod ? `Davom etish` : 'Usulni tanlang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Hi, BuildCo 👋</h1>
              <p className="text-sm text-gray-600">You have <span className="font-semibold text-blue-600">{activeOrdersCount} active orders</span> today.</p>
            </div>
            <button className="relative">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold text-center">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 space-y-6">
        {/* Active Requests with Offers */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Requests</h2>
          <div className="space-y-4">
            {newOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                    {offer.hasNewOffers && (
                      <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full animate-pulse">
                        NEW OFFERS
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1">Status: <span className="font-medium text-gray-700">{offer.status}</span></p>
                  <p className="text-gray-500 mt-3 text-sm">
                    Lowest: <span className="font-semibold text-gray-800">{offer.lowestPrice}</span> · 
                    Fastest: <span className="font-semibold text-gray-800">{offer.fastestDelivery}</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => handleViewOffers(offer.id)}
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    View Offers
                  </button>
                  <button 
                    onClick={() => handleRemindSuppliers(offer.id)}
                    className="w-full mt-3 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Remind suppliers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={handleCreateRequest}
              className="w-full flex items-center justify-center py-4 px-5 bg-blue-600 text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
              <span className="text-lg font-semibold">New Request</span>
              <span className="material-symbols-outlined ml-2">add</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleUploadEstimate}
              className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-start gap-1 hover:bg-gray-50 transition-colors"
            >
              <span className="material-symbols-outlined text-blue-500">upload_file</span>
              <span className="text-sm font-semibold">Upload Estimate</span>
            </button>
              <button 
                onClick={() => navigate('/buyer/orders')}
                className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-start gap-1 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-green-500">local_shipping</span>
                <span className="text-sm font-semibold">Track Orders</span>
              </button>
            </div>
          </div>
        </section>

        {/* Completed Requests */}
        <section>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Completed Requests</h2>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </div>
          </div>
        </section>

        {/* History & Analytics */}
        <section>
          <h2 className="text-xl font-bold mb-3">History & Analytics</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Last Order</p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">Ready-Mix Concrete</p>
                <p className="text-sm text-gray-600">Supplier ID: S-482B • <span className="font-medium text-green-500">Delivered</span></p>
              </div>
              <button className="flex items-center gap-1.5 shrink-0 rounded-full bg-blue-500 text-white px-3 py-1.5 text-sm font-semibold hover:opacity-90">
                <span className="material-symbols-outlined text-base">replay</span>
                Reorder
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <p className="text-xl font-bold">128</p>
              <p className="text-xs text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <p className="text-xl font-bold">$4.2k</p>
              <p className="text-xs text-gray-600">Avg. Order</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
              <p className="text-xl font-bold truncate">Cement</p>
              <p className="text-xs text-gray-600">Top Product</p>
            </div>
          </div>
        </section>
        <div className="h-20"></div>
      </main>
    </div>
  )
}

export default BuyerHome