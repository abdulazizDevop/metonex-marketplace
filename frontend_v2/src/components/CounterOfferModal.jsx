import React, { useState, useEffect } from 'react'

const CounterOfferModal = ({ isOpen, onClose, offer, onSubmit }) => {
  const [formData, setFormData] = useState({
    pricePerUnit: '',
    volume: '',
    deliveryDate: '',
    comment: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen && offer) {
      // Pre-fill form with current offer data
      setFormData({
        pricePerUnit: offer.pricePerUnit?.toString() || '',
        volume: offer.volume?.toString() || '',
        deliveryDate: offer.deliveryDate || '',
        comment: ''
      })
      setErrors({})
    }
  }, [isOpen, offer])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Birlik narxi 0 dan katta bo\'lishi kerak'
    }

    if (!formData.volume || parseFloat(formData.volume) <= 0) {
      newErrors.volume = 'Miqdor 0 dan katta bo\'lishi kerak'
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Yetkazib berish sanasi majburiy'
    } else {
      const selectedDate = new Date(formData.deliveryDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.deliveryDate = 'Yetkazib berish sanasi bugundan keyin bo\'lishi kerak'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const counterOfferData = {
        originalOfferId: offer.id,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        volume: parseFloat(formData.volume),
        deliveryDate: formData.deliveryDate,
        comment: formData.comment
      }

      await onSubmit(counterOfferData)
      onClose()
    } catch (error) {
      console.error('Counter offer submission error:', error)
      alert('Qarshi taklif yuborishda xatolik yuz berdi!')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalAmount = () => {
    const price = parseFloat(formData.pricePerUnit) || 0
    const volume = parseFloat(formData.volume) || 0
    return (price * volume).toLocaleString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Qarshi taklif</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {offer?.supplier?.name} ga qarshi taklif yuborish
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Current Offer Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Joriy taklif</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Narx:</span> ${offer?.pricePerUnit}/{offer?.unit}
              </div>
              <div>
                <span className="font-medium">Miqdor:</span> {offer?.volume} {offer?.unit}
              </div>
              <div>
                <span className="font-medium">Jami:</span> ${offer?.totalAmount?.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Yetkazib berish:</span> {offer?.deliveryDate}
              </div>
            </div>
          </div>

          {/* Price Per Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birlik narxi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerUnit}
                onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pricePerUnit ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.pricePerUnit && (
              <p className="text-xs text-red-500 mt-1">{errors.pricePerUnit}</p>
            )}
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miqdor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.volume ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {offer?.unit}
              </span>
            </div>
            {errors.volume && (
              <p className="text-xs text-red-500 mt-1">{errors.volume}</p>
            )}
          </div>

          {/* Total Amount Preview */}
          {formData.pricePerUnit && formData.volume && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Jami summa:</span>
                <span className="text-lg font-bold text-blue-600">${calculateTotalAmount()}</span>
              </div>
            </div>
          )}

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yetkazib berish sanasi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deliveryDate && (
              <p className="text-xs text-red-500 mt-1">{errors.deliveryDate}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Izoh
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Qarshi taklif haqida qo'shimcha ma'lumot..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Yuborilmoqda...' : 'Qarshi taklif yuborish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CounterOfferModal
