import React, { useState } from 'react'

const CounterOffer = () => {
  const [counterOffer, setCounterOffer] = useState({
    price: '',
    quantity: '',
    deliveryDate: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle counter offer submission
    console.log('Counter offer submitted:', counterOffer)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCounterOffer(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Qarshi taklif yuborish
            </h1>
            <p className="text-gray-600">
              Sotuvchiga o'z shartlaringiz bilan qarshi taklif yuboring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Taklif qilingan narx (so'm)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={counterOffer.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Narxni kiriting"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Miqdor
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={counterOffer.quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Miqdorni kiriting"
                required
              />
            </div>

            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Yetkazib berish sanasi
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={counterOffer.deliveryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Qo'shimcha izohlar
              </label>
              <textarea
                id="notes"
                name="notes"
                value={counterOffer.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Qo'shimcha shartlar yoki izohlar..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Qarshi taklif yuborish
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Diqqat:</h3>
            <ul className="text-yellow-800 space-y-1 text-sm">
              <li>• Qarshi taklif yuborilgandan so'ng, sotuvchi uni ko'rib chiqadi</li>
              <li>• Sotuvchi qarshi taklifni qabul qilishi yoki rad etishi mumkin</li>
              <li>• Qarshi taklif 24 soat ichida javob beriladi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CounterOffer
