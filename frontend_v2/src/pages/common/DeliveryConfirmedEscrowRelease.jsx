import React from 'react'

const DeliveryConfirmedEscrowRelease = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Yetkazib berish tasdiqlandi - Escrow to'lovi
          </h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-center">
              Buyurtma muvaffaqiyatli yetkazib berildi. Escrow to'lovi jarayoni boshlandi.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Buyurtma raqami:</span>
              <span className="font-medium">#ORD-2024-001</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Yetkazib berish sanasi:</span>
              <span className="font-medium">15.01.2024</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">To'lov summasi:</span>
              <span className="font-medium text-green-600">2,500,000 so'm</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Status:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                To'lov jarayoni
              </span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Keyingi qadamlar:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• To'lov 1-3 ish kuni ichida amalga oshiriladi</li>
              <li>• To'lov holati haqida xabar beriladi</li>
              <li>• Hisobingizga to'lov tushganda bildirishnoma yuboriladi</li>
            </ul>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryConfirmedEscrowRelease
