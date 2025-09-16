import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RoleGuard from '../../components/RoleGuard.jsx'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { createRequest, getCategories, myStatus } from '../../utils/api.js'

export default function BuyerCart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [companyId, setCompanyId] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestForms, setRequestForms] = useState([])
  const [categories, setCategories] = useState([])
  const [isFormValid, setIsFormValid] = useState(false)

  // Savatni localStorage'dan yuklash
  useEffect(() => {
    const savedCart = localStorage.getItem('buyer_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Company ID ni yuklash
  useEffect(() => {
    async function loadCompanyId() {
      try {
        const status = await myStatus()
        setCompanyId(status?.company_id)
      } catch (error) {
        console.error('Company ID yuklashda xato:', error)
      }
    }
    loadCompanyId()
  }, [])

  // Kategoriyalarni yuklash
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Kategoriyalarni yuklashda xato:', error)
      }
    }
    loadCategories()
  }, [])

  function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  // Modal oynani ochish va formlarni tayyorlash
  function openRequestModal() {
    if (cart.length === 0) {
      setError('Savat bo\'sh')
      return
    }
    if (!companyId) {
      setError('Kompaniya ma\'lumotlari topilmadi')
      return
    }

    // Har bir mahsulot uchun alohida form yaratish
    const forms = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit || 'dona',
      category_name: item.category_name,
      company_name: item.company_name,
      images_urls: item.images_urls || [],
      // Form ma'lumotlari
      description: '',
      payment_type: '',
      budget_from: '',
      budget_to: '',
      region: '',
      delivery_address: '',
      deadline_date: ''
    }))

    setRequestForms(forms)
    setShowRequestModal(true)
    setError('')
    setOk('')
    setIsFormValid(false)
  }

  function removeFromCart(itemId) {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  // Form ma'lumotlarini yangilash
  function updateFormData(itemId, field, value) {
    setRequestForms(prev => prev.map(form => 
      form.id === itemId ? { ...form, [field]: value } : form
    ))
  }

  // Form validation
  function validateForms() {
    if (requestForms.length === 0) return false
    
    return requestForms.every(form => 
      form.description.trim() !== '' &&
      form.payment_type !== '' &&
      form.budget_from !== '' &&
      form.budget_to !== '' &&
      parseInt(form.budget_from) > 0 &&
      parseInt(form.budget_to) > 0 &&
      parseInt(form.budget_to) >= parseInt(form.budget_from) &&
      form.region.trim() !== '' &&
      form.delivery_address.trim() !== '' &&
      form.deadline_date !== ''
    )
  }

  // Form validation ni tekshirish
  useEffect(() => {
    setIsFormValid(validateForms())
  }, [requestForms])

  function updateCartQuantity(itemId, quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  function clearCart() {
    setCart([])
  }

  // Savatni localStorage'ga saqlash
  useEffect(() => {
    localStorage.setItem('buyer_cart', JSON.stringify(cart))
  }, [cart])

  function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Modal orqali request yaratish
  async function createRequestsFromModal() {
    if (requestForms.length === 0) {
      setError('So\'rov formlari mavjud emas')
      return
    }

    setLoading(true)
    setError('')
    setOk('')

    try {
      const categoryMap = {}
      categories.forEach(cat => {
        categoryMap[cat.name] = cat.id
      })

      const requests = []
      for (const form of requestForms) {
        const categoryId = categoryMap[form.category_name]
        if (!categoryId) {
          console.warn(`Kategoriya topilmadi: ${form.category_name}`)
          continue
        }

        const requestData = {
          buyer_company: companyId,
          category: categoryId,
          description: form.description,
          quantity: form.quantity,
          unit: form.unit,
          payment_type: form.payment_type,
          budget_from: form.budget_from,
          budget_to: form.budget_to,
          region: form.region,
          delivery_address: form.delivery_address,
          deadline_date: form.deadline_date
        }

        const request = await createRequest(requestData)
        requests.push(request)
      }

      setOk(`${requests.length} ta so'rov yaratildi!`)
      setCart([])
      localStorage.removeItem('buyer_cart')
      setShowRequestModal(false)
      setRequestForms([])
      
      setTimeout(() => {
        navigate('/buyer/requests')
      }, 2000)

    } catch (err) {
      setError(err.message || err?.response?.data?.detail || 'So\'rov yaratishda xato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard requiredRole="BUYER" requireCompany={true}>
      <div className="min-h-screen bg-white">
        <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Savat</h1>
            <p className="mt-2 text-gray-600">
              {cart.length > 0 
                ? `${getCartItemCount()} ta mahsulot savatda` 
                : 'Savat bo\'sh'
              }
            </p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {ok && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{ok}</p>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Savat bo'sh</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Hali savatga hech qanday mahsulot qo'shilmagan. 
                Katalogdan mahsulot tanlab savatga qo'shing.
              </p>
              <div className="space-y-4">
                <Link
                  to="/buyer/catalog"
                  className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Katalogga o'tish
                </Link>
                <div className="text-sm text-gray-500">
                  yoki
                </div>
                <Link
                  to="/buyer"
                  className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  Asosiy sahifaga qaytish
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Mahsulotlar</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                          {item.images_urls && item.images_urls.length > 0 ? (
                            <img
                              src={item.images_urls[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/buyer/item/${item.id}`}
                            className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors block mb-2"
                          >
                            {item.name}
                          </Link>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {item.category_name}
                              {item.subcategory_name && ` • ${item.subcategory_name}`}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {item.company_name}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8" />
                              </svg>
                              {item.unit}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-green-600 mt-3">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center space-y-4">
                          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
                            >
                              <span className="text-lg font-bold text-gray-600">-</span>
                            </button>
                            <span className="w-8 text-center text-lg font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
                            >
                              <span className="text-lg font-bold text-gray-600">+</span>
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-white hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg border border-red-200 hover:border-red-300 shadow-sm"
                            title="Mahsulotni o'chirish"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">

                  <h3 className="text-xl font-semibold text-gray-900">Buyurtma xulosasi</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Mahsulotlar soni:
                    </span>
                    <span className="font-semibold text-gray-900">{getCartItemCount()} ta</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Yetkazib berish:
                    </span>
                    <span className="font-semibold text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Bepul
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Jami:</span>
                      <span className="text-2xl font-bold text-green-600">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <button
                    onClick={openRequestModal}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        So'rov yaratilmoqda...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        So'rov yaratish
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-white hover:bg-red-50 text-red-600 font-medium py-3 px-6 rounded-lg border-2 border-red-200 hover:border-red-300 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Savatni tozalash
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">So'rov yaratish</h2>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Har bir mahsulot uchun alohida so'rov yaratiladi</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
                <div className="space-y-6">
                  {requestForms.map((form, index) => (
                    <div key={form.id} className="border border-gray-200 rounded-xl p-6 bg-white">
                      <div className="flex items-start space-x-4 mb-4">
                        {form.images_urls && form.images_urls.length > 0 && (
                          <img
                            src={form.images_urls[0]}
                            alt={form.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{form.name}</h3>
                          <p className="text-sm text-gray-600">{form.category_name}</p>
                          <p className="text-sm text-gray-600">Miqdor: {form.quantity} {form.unit}</p>
                          <p className="text-sm text-gray-600">Narx: {formatPrice(form.price * form.quantity)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tavsif
                          </label>
                          <textarea
                            value={form.description}
                            onChange={(e) => updateFormData(form.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            rows={3}
                            placeholder="Mahsulot haqida batafsil ma'lumot kiriting..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            To'lov turi
                          </label>
                          <select
                            value={form.payment_type}
                            onChange={(e) => updateFormData(form.id, 'payment_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                          >
                            <option value="">To'lov turini tanlang</option>
                            <option value="naqd_pul">Naqd pul</option>
                            <option value="bank">Bank orqali</option>
                            <option value="kredit">Kredit</option>
                            <option value="boshqa">Boshqa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimal narx (so'm)
                          </label>
                          <input
                            type="number"
                            value={form.budget_from}
                            onChange={(e) => updateFormData(form.id, 'budget_from', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            placeholder="Minimal narxni kiriting"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maksimal narx (so'm)
                          </label>
                          <input
                            type="number"
                            value={form.budget_to}
                            onChange={(e) => updateFormData(form.id, 'budget_to', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            placeholder="Maksimal narxni kiriting"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Viloyat
                          </label>
                          <input
                            type="text"
                            value={form.region}
                            onChange={(e) => updateFormData(form.id, 'region', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            placeholder="Viloyat nomini kiriting"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yetkazib berish manzili
                          </label>
                          <input
                            type="text"
                            value={form.delivery_address}
                            onChange={(e) => updateFormData(form.id, 'delivery_address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            placeholder="Yetkazib berish manzilini kiriting"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Muddati
                          </label>
                          <input
                            type="date"
                            value={form.deadline_date}
                            onChange={(e) => updateFormData(form.id, 'deadline_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Bekor qilish
                  </button>
                  
                  {!isFormValid ? (
                    <button
                      disabled
                      className="w-full sm:w-auto bg-gray-300 text-gray-500 font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Barcha maydonlarni to'ldiring
                    </button>
                  ) : (
                    <button
                      onClick={createRequestsFromModal}
                      disabled={loading}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          So'rovlar yaratilmoqda...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Yakunlash va so'rov yaratish
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
