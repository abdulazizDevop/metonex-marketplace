import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const RFQForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    brand: '',
    grade: '',
    volume: '',
    unit: 'tons',
    deliveryLocation: 'Tashkent',
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'bank',
    message: '',
    specialRequirements: '',
    budget: '',
    description: ''
  })

  const product = location.state?.product
  const selectedCategories = location.state?.selectedCategories || []
  const [flowData, setFlowData] = useState({
    flowStep: null,
    returnPath: null
  })

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || null
      });
    }
  }, [location.state]);

  // Backend ma'lumotlariga mos kategoriyalar
  const categories = [
    { id: 1, name: 'Construction Materials', unit_type: 'weight' },
    { id: 2, name: 'Electrical Equipment', unit_type: 'piece' },
    { id: 3, name: 'Plumbing Supplies', unit_type: 'piece' },
    { id: 4, name: 'Tools & Hardware', unit_type: 'piece' },
    { id: 5, name: 'Safety Equipment', unit_type: 'piece' },
    { id: 6, name: 'Other', unit_type: 'piece' }
  ]

  // Backend ma'lumotlariga mos birliklar
  const units = {
    weight: [
      { id: 1, name: 'tons', symbol: 'ton' },
      { id: 2, name: 'kg', symbol: 'kg' },
      { id: 3, name: 'grams', symbol: 'g' }
    ],
    piece: [
      { id: 4, name: 'pieces', symbol: 'pcs' },
      { id: 5, name: 'sets', symbol: 'sets' },
      { id: 6, name: 'boxes', symbol: 'boxes' }
    ],
    length: [
      { id: 7, name: 'meters', symbol: 'm' },
      { id: 8, name: 'centimeters', symbol: 'cm' }
    ],
    volume: [
      { id: 9, name: 'liters', symbol: 'L' },
      { id: 10, name: 'cubic meters', symbol: 'm³' }
    ],
    area: [
      { id: 11, name: 'square meters', symbol: 'm²' }
    ]
  }

  useEffect(() => {
    if (!product) {
      navigate('/buyer/products')
      return
    }

    // Auto-fill form with product data
    setFormData(prev => ({
      ...prev,
      category: product.category || 'Construction Materials',
      brand: product.brand || product.name?.split(' ')[0] || '',
      grade: product.grade || product.name?.split(' ').slice(1).join(' ') || '',
      volume: product.min_order_quantity || product.minOrder || '',
      unit: product.unit || 'tons'
    }))
  }, [product, navigate])

  // Get available units for selected category
  const getAvailableUnits = () => {
    const selectedCategory = categories.find(cat => cat.name === formData.category)
    if (selectedCategory) {
      return units[selectedCategory.unit_type] || []
    }
    return units.weight // Default to weight units
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.category || !formData.brand || !formData.grade || !formData.volume || !formData.deliveryLocation || !formData.deliveryDate) {
      alert('Barcha majburiy maydonlarni to\'ldiring!')
      return
    }

    setLoading(true)

    try {
      // Get category and unit IDs
      const selectedCategory = categories.find(cat => cat.name === formData.category)
      const selectedUnit = getAvailableUnits().find(unit => unit.name === formData.unit)

      const rfqData = {
        // Backend RFQ modeliga mos ma'lumotlar
        category: selectedCategory?.id || 1,
        subcategory: null, // Optional subcategory
        brand: formData.brand,
        grade: formData.grade,
        sizes: [], // Empty array for now
        volume: parseFloat(formData.volume), // Convert to number
        unit: selectedUnit?.id || 1,
        delivery_location: formData.deliveryLocation,
        delivery_date: formData.deliveryDate,
        payment_method: formData.paymentMethod,
        message: formData.message || '',
        special_requirements: formData.specialRequirements || ''
      }

      // Send RFQ to backend
      const response = await fetch('/api/rfqs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock-token'}`
        },
        body: JSON.stringify(rfqData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('RFQ muvaffaqiyatli yuborildi:', result)

      // Show success message
      alert('So\'rov muvaffaqiyatli yuborildi!')
      
      // Navigate to request confirmation page with flow context
      navigate('/buyer/request-confirmed', { 
        state: { 
          rfqData: result,
          flowData,
          flowStep: 'request-confirmed',
          nextStep: '/buyer/orders?tab=requests'
        } 
      })

    } catch (error) {
      console.error('RFQ yuborishda xatolik:', error)
      
      // For development, simulate success if API is not available
      if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
        console.log('API mavjud emas, mock response qaytarilmoqda')
        alert('So\'rov muvaffaqiyatli yuborildi! (Mock)')
        navigate('/buyer/request-confirmed', { 
          state: { 
            rfqData: { id: 'mock-rfq-001', ...rfqData },
            flowData,
            flowStep: 'request-confirmed',
            nextStep: '/buyer/orders?tab=requests'
          } 
        })
        return
      }
      
      alert('So\'rov yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Mahsulot ma'lumotlari topilmadi</p>
          <button 
            onClick={() => navigate('/buyer/products')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Mahsulotlarga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (flowData.returnPath) {
                  navigate(flowData.returnPath);
                } else {
                  navigate(-1);
                }
              }}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">So'rov yuborish</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-4">
        {/* Product Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="flex gap-3">
            <div 
              className="h-16 w-16 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: `url("${product.image}")`}}
            ></div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{product.supplier}</p>
              <p className="text-sm font-bold text-gray-900">{product.price} / {product.unit}</p>
              <p className="text-xs text-gray-500">Minimal buyurtma: {product.minOrder} {product.unit}</p>
            </div>
          </div>
        </div>

        {/* RFQ Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Product Details</h2>
            <div className="space-y-4">
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brend <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sifat/Marka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder="Enter grade/specification"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miqdor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={product?.minOrder || 1}
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {product && (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimal: {product.minOrder} {product.unit}
                    </p>
                  )}
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birlik
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Avtomatik</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Budget & Timeline</h2>
            <div className="space-y-4">
              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Byudjet (USD)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Enter your budget"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish sanasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h2>
            <div className="space-y-4">
              {/* Delivery Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish joyi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.deliveryLocation}
                  onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Tashkent">Toshkent</option>
                  <option value="Samarkand">Samarqand</option>
                  <option value="Bukhara">Buxoro</option>
                  <option value="Namangan">Namangan</option>
                  <option value="Andijan">Andijon</option>
                  <option value="Fergana">Farg'ona</option>
                  <option value="Nukus">Nukus</option>
                  <option value="Termez">Termiz</option>
                  <option value="Jizzakh">Jizzax</option>
                  <option value="Navoi">Navoiy</option>
                  <option value="Karshi">Qarshi</option>
                  <option value="Kokand">Qo'qon</option>
                  <option value="Margilan">Marg'ilon</option>
                  <option value="Angren">Angren</option>
                  <option value="Chirchik">Chirchiq</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'lov usuli <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="bank">Bank orqali</option>
                  <option value="cash">Naqd pul</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xabar
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Sotuvchiga qo'shimcha xabar..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maxsus talablar
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Maxsus talablar yoki shartlar..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">Qanday ishlaydi</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Sotuvchi 24 soat ichida so'rovingizga taklif beradi</p>
              <p>• Agar taklifni qabul qilsangiz, bank tranzaksiyasini amalga oshirishingiz kerak</p>
              <p>• Bu uchun siz didox.uz platformasidan foydalaning</p>
              <p>• Sizga shartnoma va hisob faktura yuborilgan bo'ladi. To'lov qilib tasdiqlanishini kuting</p>
              <p>• Barcha tranzaksiyalar bizning platforma orqali xavfsiz amalga oshiriladi</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.category || !formData.brand || !formData.grade || !formData.volume || !formData.deliveryLocation || !formData.deliveryDate}
            className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${
              loading || !formData.category || !formData.brand || !formData.grade || !formData.volume || !formData.deliveryLocation || !formData.deliveryDate
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
            }`}
          >
            {loading ? 'Yuborilmoqda...' : 'So\'rov yuborish'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RFQForm
