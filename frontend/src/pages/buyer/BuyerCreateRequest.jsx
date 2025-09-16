import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { createRequest, getCategories, myStatus } from '../../utils/api.js'

export default function BuyerCreateRequest() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [categories, setCategories] = useState([])
  const [companyId, setCompanyId] = useState(null)
  const [form, setForm] = useState({
    category: '',
    description: '',
    quantity: '',
    unit: 'dona',
    payment_type: 'naqd_pul',
    budget_from: '',
    budget_to: '',
    region: '',
    delivery_address: '',
    deadline_date: ''
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    try {
      // Kategoriyalarni yuklash
      const categoriesData = await getCategories()
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])

      // Kompaniya ID ni olish
      const status = await myStatus()
      setCompanyId(status?.company_id)
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xato:', error)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)

    try {
      // Form ma'lumotlarini tekshirish
      if (!form.category) {
        throw new Error('Kategoriya tanlash majburiy')
      }
      if (!form.description.trim()) {
        throw new Error('Tavsif majburiy')
      }
      if (!form.quantity || form.quantity <= 0) {
        throw new Error('Miqdor majburiy va 0 dan katta bo\'lishi kerak')
      }
      if (!form.budget_from || form.budget_from <= 0) {
        throw new Error('Minimal narx majburiy')
      }
      if (!form.budget_to || form.budget_to <= 0) {
        throw new Error('Maksimal narx majburiy')
      }
      if (parseInt(form.budget_from) >= parseInt(form.budget_to)) {
        throw new Error('Minimal narx maksimal narxdan kichik bo\'lishi kerak')
      }
      if (!form.region.trim()) {
        throw new Error('Viloyat majburiy')
      }
      if (!form.delivery_address.trim()) {
        throw new Error('Yetkazib berish manzili majburiy')
      }
      if (!form.deadline_date) {
        throw new Error('Muddat majburiy')
      }

      // Muddat tekshirish
      const deadline = new Date(form.deadline_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadline <= today) {
        throw new Error('Muddat bugungi kundan keyin bo\'lishi kerak')
      }

      const requestData = {
        buyer_company: companyId,
        category: form.category,
        description: form.description.trim(),
        quantity: parseInt(form.quantity),
        unit: form.unit,
        payment_type: form.payment_type,
        budget_from: parseInt(form.budget_from),
        budget_to: parseInt(form.budget_to),
        region: form.region.trim(),
        delivery_address: form.delivery_address.trim(),
        deadline_date: form.deadline_date
      }

      await createRequest(requestData)
      setOk('So\'rov muvaffaqiyatli yaratildi!')
      
      setTimeout(() => {
        navigate('/buyer/requests')
      }, 1500)

    } catch (err) {
      setError(err.message || err?.response?.data?.detail || 'So\'rov yaratishda xato')
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(price) {
    if (!price) return ''
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  function handlePriceChange(e) {
    const { name, value } = e.target
    const numericValue = value.replace(/\D/g, '') // Faqat raqamlar
    setForm(prev => ({ ...prev, [name]: numericValue }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerHeader showFilters={false} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Yangi so'rov yaratish</h1>
          <button
            onClick={() => navigate('/buyer/requests')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Orqaga qaytish
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {ok && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{ok}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            {/* Kategoriya */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Kategoriyani tanlang</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tavsif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tavsif <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Mahsulot haqida batafsil ma'lumot bering..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Miqdor va birlik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miqdor <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Miqdor"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birlik
                </label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="dona">Dona</option>
                  <option value="kg">Kilogramm</option>
                  <option value="tonna">Tonna</option>
                  <option value="m2">Kvadrat metr</option>
                  <option value="m3">Kub metr</option>
                  <option value="litr">Litr</option>
                  <option value="metr">Metr</option>
                  <option value="paket">Paket</option>
                  <option value="quti">Quti</option>
                </select>
              </div>
            </div>

            {/* To'lov turi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'lov turi
              </label>
              <select
                name="payment_type"
                value={form.payment_type}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="naqd_pul">Naqd pul</option>
                <option value="bank">Bank orqali</option>
                <option value="kredit">Kredit</option>
                <option value="boshqa">Boshqa</option>
              </select>
            </div>

            {/* Narx diapazoni */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimal narx (so'm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="budget_from"
                  value={formatPrice(form.budget_from)}
                  onChange={handlePriceChange}
                  required
                  placeholder="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimal narx (so'm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="budget_to"
                  value={formatPrice(form.budget_to)}
                  onChange={handlePriceChange}
                  required
                  placeholder="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Viloyat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Viloyat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                required
                placeholder="Viloyat nomi"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Yetkazib berish manzili */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yetkazib berish manzili <span className="text-red-500">*</span>
              </label>
              <textarea
                name="delivery_address"
                value={form.delivery_address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="To'liq manzil..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Muddat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yetkazib berish muddati <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline_date"
                value={form.deadline_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/buyer/requests')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{loading ? 'Yaratilmoqda...' : 'So\'rov yaratish'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}