import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import RoleGuard from '../../components/RoleGuard.jsx'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { getItem } from '../../utils/api.js'

export default function BuyerItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('buyer_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    loadItem()
  }, [id])

  useEffect(() => {
    localStorage.setItem('buyer_cart', JSON.stringify(cart))
  }, [cart])

  async function loadItem() {
    try {
      setLoading(true)
      const data = await getItem(id)
      setItem(data)
    } catch (error) {
      console.error('Mahsulotni yuklashda xato:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  function addToCart() {
    if (!item) return
    
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id)
    
    if (existingItemIndex >= 0) {
      // Agar mahsulot allaqachon savatda bo'lsa, miqdorini oshiramiz
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += quantity
      setCart(updatedCart)
    } else {
      // Yangi mahsulot qo'shamiz
      const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        images_urls: item.images?.map(img => img.url) || [],
        category_name: item.category?.name || '',
        subcategory_name: item.subcategory?.name || '',
        company_name: item.company?.name || '',
        unit: item.unit
      }
      setCart([...cart, newItem])
    }
    
    // Muvaffaqiyat xabari
    alert(`${quantity} ta "${item.name}" savatga qo'shildi!`)
  }

  function buyNow() {
    addToCart()
    // Savat sahifasiga yo'naltirish
    window.location.href = '/buyer/cart'
  }

  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  function getTotalImages() {
    return item?.images_urls ? item.images_urls.length : (item?.images ? item.images.length : 0)
  }

  function getImageUrl(index) {
    if (item?.images_urls) {
      return item.images_urls[index]
    } else if (item?.images) {
      return item.images[index]?.url
    }
    return ''
  }

  if (loading) {
    return (
      <RoleGuard requiredRole="BUYER" requireCompany={true}>
        <div className="min-h-screen bg-gray-50">
          <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />
          <div className="flex items-center justify-center h-64">
            <div className="spinner w-8 h-8"></div>
          </div>
        </div>
      </RoleGuard>
    )
  }

  if (!item) {
    return (
      <RoleGuard requiredRole="BUYER" requireCompany={true}>
        <div className="min-h-screen bg-gray-50">
          <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mahsulot topilmadi</h2>
              <Link to="/buyer" className="btn-primary">Asosiy sahifaga qaytish</Link>
            </div>
          </div>
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard requiredRole="BUYER" requireCompany={true}>
      <div className="min-h-screen bg-gray-50">
        <BuyerHeader showFilters={false} cartCount={getCartItemCount()} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link to="/buyer" className="hover:text-green-600 transition-colors">Asosiy sahifa</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/buyer/catalog" className="hover:text-green-600 transition-colors">Katalog</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{item.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-6">
              <div className="aspect-square bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative group">
                {(item.images_urls && item.images_urls.length > 0) || (item.images && item.images.length > 0) ? (
                  <>
                    <img
                      src={getImageUrl(selectedImage)}
                      alt={item.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setShowImageModal(true)}
                    />
                    
                    {/* Navigation Buttons */}
                    {((item.images_urls && item.images_urls.length > 1) || (item.images && item.images.length > 1)) && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => {
                            const totalImages = getTotalImages()
                            setSelectedImage(selectedImage > 0 ? selectedImage - 1 : totalImages - 1)
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        {/* Next Button */}
                        <button
                          onClick={() => {
                            const totalImages = getTotalImages()
                            setSelectedImage(selectedImage < totalImages - 1 ? selectedImage + 1 : 0)
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                          {selectedImage + 1}/{getTotalImages()}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="h-24 w-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">Rasm mavjud emas</p>
                    </div>
                  </div>
                )}
              </div>
              
              {((item.images_urls && item.images_urls.length > 1) || (item.images && item.images.length > 1)) && (
                <div className="grid grid-cols-4 gap-3">
                  {(item.images_urls || item.images || []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-green-500 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={item.images_urls ? image : image.url}
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => setShowImageModal(true)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {item.name}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{item.category?.name}</span>
                  </div>
                  {item.subcategory && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>{item.subcategory.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-5xl font-bold text-green-600">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-xl text-gray-600">
                    / {item.unit}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    item.status === 'mavjud' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        item.status === 'mavjud' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {item.status === 'mavjud' ? 'Mavjud' : 'Mavjud emas'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Qoldiq: <span className="font-semibold">{item.quantity} {item.unit}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Kompaniya ma'lumotlari</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Kompaniya:
                    </span>
                    <span className="font-semibold text-gray-900">{item.company?.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Mavjud miqdor:
                    </span>
                    <span className="font-semibold text-gray-900">{item.quantity} {item.unit}</span>
                  </div>
                </div>
              </div>

              {item.description && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Mahsulot tavsifi</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8" />
                      </svg>
                      Miqdor tanlang:
                    </label>
                    <span className="text-sm text-gray-600">
                      Maksimal: <span className="font-semibold">{item.quantity} {item.unit}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center bg-gray-50 rounded-xl p-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
                      >
                        <span className="text-xl font-bold text-gray-600">-</span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-4 py-2 text-center text-xl font-semibold border-0 focus:ring-0 bg-transparent"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}
                        className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
                      >
                        <span className="text-xl font-bold text-gray-600">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={addToCart}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      Savatga qo'shish
                    </button>
                    <button
                      onClick={buyNow}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Darhol sotib olish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowImageModal(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="relative z-10 max-w-4xl max-h-[90vh] w-full mx-4">
              {/* Close Button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Image */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={getImageUrl(selectedImage)}
                  alt={item.name}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                
                {/* Navigation Buttons */}
                {getTotalImages() > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={() => {
                        const totalImages = getTotalImages()
                        setSelectedImage(selectedImage > 0 ? selectedImage - 1 : totalImages - 1)
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={() => {
                        const totalImages = getTotalImages()
                        setSelectedImage(selectedImage < totalImages - 1 ? selectedImage + 1 : 0)
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-2 rounded-full">
                      {selectedImage + 1} / {getTotalImages()}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {getTotalImages() > 1 && (
                <div className="flex justify-center mt-4 space-x-2 max-w-full overflow-x-auto pb-2">
                  {(item.images_urls || item.images || []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-white ring-2 ring-white' 
                          : 'border-white/50 hover:border-white'
                      }`}
                    >
                      <img
                        src={item.images_urls ? image : image.url}
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
