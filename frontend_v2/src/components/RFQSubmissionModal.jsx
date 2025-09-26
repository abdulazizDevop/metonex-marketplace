import React, { useState, useEffect } from 'react'

const RFQSubmissionModal = ({ isOpen, onClose, groupedItems, onSubmit }) => {
  const [rfqForms, setRfqForms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && groupedItems) {
      // Initialize forms for each group
      const initialForms = groupedItems.map((group, index) => ({
        id: index,
        supplier: group.supplier,
        productName: group.productName,
        totalQuantity: group.items.reduce((sum, item) => sum + item.quantity, 0),
        // Auto-filled fields (read-only) - Backend ID'lar
        categoryId: 1, // Steel category ID
        categoryName: 'Steel',
        unitId: 1, // Tons unit ID
        unitName: 'tons',
        // User input fields
        brand: group.productName.split(' ')[0] || '',
        grade: group.productName.split(' ').slice(1).join(' ') || '',
        deliveryLocation: 'Tashkent',
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'bank',
        message: '',
        specialRequirements: ''
      }))
      setRfqForms(initialForms)
    }
  }, [isOpen, groupedItems])

  const handleInputChange = (formId, field, value) => {
    setRfqForms(prev => prev.map(form => 
      form.id === formId ? { ...form, [field]: value } : form
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate all forms
      const hasErrors = rfqForms.some(form => 
        !form.brand || !form.grade || !form.deliveryLocation || !form.deliveryDate
      )

      if (hasErrors) {
        alert('Barcha majburiy maydonlarni to\'ldiring!')
        setLoading(false)
        return
      }

      // Submit all RFQs
      await onSubmit(rfqForms)
      onClose()
    } catch (error) {
      console.error('RFQ yuborishda xatolik:', error)
      alert('So\'rov yuborishda xatolik yuz berdi!')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">So'rov yuborish</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {groupedItems?.length} ta guruh uchun so'rov yuboriladi
          </p>
        </div>

        {/* Forms */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {rfqForms.map((form, index) => (
            <div key={form.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {form.supplier} - {form.productName}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Auto-filled fields (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoriya
                  </label>
                  <input
                    type="text"
                    value={form.categoryName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birlik
                  </label>
                  <input
                    type="text"
                    value={form.unitName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jami miqdor
                  </label>
                  <input
                    type="text"
                    value={`${form.totalQuantity} ${form.unitName}`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* User input fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brend <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => handleInputChange(form.id, 'brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sifat/Marka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(e) => handleInputChange(form.id, 'grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yetkazib berish joyi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.deliveryLocation}
                    onChange={(e) => handleInputChange(form.id, 'deliveryLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yetkazib berish sanasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.deliveryDate}
                    onChange={(e) => handleInputChange(form.id, 'deliveryDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To'lov usuli <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => handleInputChange(form.id, 'paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="bank">Bank orqali</option>
                    <option value="cash">Naqd pul</option>
                  </select>
                </div>
              </div>

              {/* Message and special requirements */}
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xabar
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleInputChange(form.id, 'message', e.target.value)}
                    placeholder="Sotuvchiga qo'shimcha xabar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maxsus talablar
                  </label>
                  <textarea
                    value={form.specialRequirements}
                    onChange={(e) => handleInputChange(form.id, 'specialRequirements', e.target.value)}
                    placeholder="Maxsus talablar yoki shartlar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Submit buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
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
              {loading ? 'Yuborilmoqda...' : 'So\'rov yuborish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RFQSubmissionModal
