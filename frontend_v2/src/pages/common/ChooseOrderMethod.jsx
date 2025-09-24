import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChooseOrderMethod = () => {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState(null)

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
      console.log(`Selected method: ${selectedMethod.type}`)
      if (selectedMethod.id === 'tender') {
        navigate('/buyer/manual-order-request-form')
      } else if (selectedMethod.id === 'quick-order') {
        navigate('/buyer/home')
      } else if (selectedMethod.id === 'upload-estimate') {
        navigate('/buyer/upload-estimate')
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Choose how to create your order
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 space-y-5">
        {orderMethods.map((method) => (
          <div 
            key={method.id}
            onClick={() => handleMethodSelect(method)}
            className={`bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-md transition-all duration-300 cursor-pointer border-2 ${
              selectedMethod?.id === method.id
                ? 'border-purple-600 shadow-lg shadow-purple-600/40'
                : 'border-transparent hover:border-purple-300'
            }`}
          >
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mb-5">
              <span 
                className="material-symbols-outlined text-white text-5xl"
                style={{fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48"}}
              >
                {method.icon}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{method.title}</h2>
            <p className="text-base text-gray-500 mt-1 px-4">
              {method.subtitle}
            </p>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="p-5 sticky bottom-0 bg-white">
        <button 
          onClick={handleNext}
          disabled={!selectedMethod}
          className={`w-full h-14 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-300 ${
            selectedMethod
              ? 'bg-purple-600 shadow-purple-500/30 hover:bg-opacity-90'
              : 'bg-gray-300 shadow-none cursor-not-allowed'
          }`}
        >
          {selectedMethod ? `Start with ${selectedMethod.type}` : 'Select an option'}
        </button>
      </footer>
    </div>
  )
}

export default ChooseOrderMethod
