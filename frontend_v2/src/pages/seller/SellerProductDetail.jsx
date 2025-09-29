import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BottomNavigation from '../../components/BottomNavigation'

const SellerProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Sample product data (in real app, this would come from API)
  const sampleProducts = {
    1: {
      id: 1,
      brand: 'SteelCorp',
      grade: 'Grade 60',
      category: 'Metal',
      supplier: 'SteelCorp Ltd',
      base_price: 710000,
      currency: 'UZS',
      unit: 'ton',
      min_order_quantity: 5,
      rating: 4.8,
      review_count: 124,
      view_count: 1250,
      photos: [
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop'
      ],
      certificates: [
        'https://example.com/cert1.pdf',
        'https://example.com/cert2.pdf'
      ],
      specifications: {
        'Material': 'Grade 60 Steel',
        'Diameter': '12mm',
        'Length': '12m',
        'Weight': '0.888 kg/m',
        'Tensile Strength': '600 MPa',
        'Yield Strength': '420 MPa'
      },
      material: 'Steel',
      origin_country: 'Uzbekistan',
      warranty_period: 12,
      delivery_locations: ['Tashkent', 'Samarkand', 'Bukhara'],
      is_active: true,
      is_featured: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:45:00Z',
      orders_count: 50,
      total_sales: 35500000,
      last_order_date: '2024-01-18T09:15:00Z'
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const productData = sampleProducts[id] || sampleProducts[1]
      setProduct(productData)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleCopyLink = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      alert('Havola nusxalandi!')
    } catch (err) {
      console.error('Failed to copy URL:', err)
      alert('Havolani nusxalashda xatolik')
    }
  }

  const handleSocialShare = (option) => {
    const url = window.location.href
    const shareUrl = option.url + encodeURIComponent(url)
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleImageNavigation = (direction) => {
    if (direction === 'prev') {
      setSelectedImage(prev => prev === 0 ? product.photos.length - 1 : prev - 1)
    } else {
      setSelectedImage(prev => prev === product.photos.length - 1 ? 0 : prev + 1)
    }
  }

  const handleImageClick = () => {
    setShowImageModal(true)
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    console.log('Delete product:', product.id)
    // TODO: Implement delete functionality
    setShowDeleteModal(false)
    navigate('/seller/products')
  }

  const shareOptions = [
    { 
      name: 'Telegram', 
      icon: 'https://telegram.org/img/t_logo.png',
      url: 'https://t.me/share/url?url=',
      color: 'bg-blue-500' 
    },
    { 
      name: 'WhatsApp', 
      icon: 'https://web.whatsapp.com/favicon.ico',
      url: 'https://wa.me/?text=',
      color: 'bg-green-500' 
    },
    { 
      name: 'Facebook', 
      icon: 'https://facebook.com/favicon.ico',
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      color: 'bg-blue-600' 
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mahsulot ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mahsulot topilmadi</h3>
          <p className="text-gray-500 mb-4">Qidirilayotgan mahsulot mavjud emas</p>
          <button
            onClick={() => navigate('/seller/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mahsulotlar sahifasiga qaytish
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
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Mahsulot tafsilotlari</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {/* Product Images */}
        <div className="bg-white">
          <div className="relative aspect-square">
            <img
              src={product.photos[selectedImage]}
              alt={`${product.brand} ${product.grade}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
            />
            
            {/* Navigation Buttons */}
            {product.photos.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </>
            )}
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {product.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_featured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Taniqli
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.is_active ? 'Faol' : 'Nofaol'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          {/* Product Name */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">{product.brand} {product.grade}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`material-symbols-outlined text-sm ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.review_count} sharhlar)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('uz-UZ', {
                  style: 'currency',
                  currency: product.currency,
                  minimumFractionDigits: 0
                }).format(product.base_price)} / {product.unit}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Minimal buyurtma: {product.min_order_quantity} {product.unit}
            </p>
          </div>

          {/* Location & Delivery */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {product.delivery_locations.join(', ')}
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              {product.origin_country}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 bg-[#6C4FFF] text-white py-3 rounded-lg font-medium hover:bg-[#5A3FE6] transition-colors"
            >
              Tahrirlash
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Statistika</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{product.view_count}</div>
              <div className="text-sm text-gray-600">Ko'rishlar</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{product.orders_count}</div>
              <div className="text-sm text-gray-600">Buyurtmalar</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('uz-UZ', {
                  style: 'currency',
                  currency: product.currency,
                  minimumFractionDigits: 0,
                  notation: 'compact'
                }).format(product.total_sales)}
              </div>
              <div className="text-sm text-gray-600">Jami sotish</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{product.rating}</div>
              <div className="text-sm text-gray-600">Reyting</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tavsif</h2>
          <div className="space-y-2">
            <p className="text-gray-600 leading-relaxed">
              <strong>Material:</strong> {product.material}
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Ishlab chiqarish davlati:</strong> {product.origin_country}
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Kafolat muddati:</strong> {product.warranty_period} oy
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Yaratilgan:</strong> {new Date(product.created_at).toLocaleDateString('uz-UZ')}
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Yangilangan:</strong> {new Date(product.updated_at).toLocaleDateString('uz-UZ')}
            </p>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Texnik xususiyatlar</h2>
          <div className="space-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 font-medium">{key}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        {product.certificates && product.certificates.length > 0 && (
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sertifikatlar</h2>
            <div className="space-y-2">
              {product.certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-600">description</span>
                    <span className="text-sm text-gray-900">Sertifikat {index + 1}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ko'rish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mahsulotni ulashish</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-4"
              >
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">content_copy</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Havolani nusxalash</span>
              </button>

              {/* Social Media Options */}
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSocialShare(option)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={option.icon}
                        alt={option.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className={`w-full h-full ${option.color} flex items-center justify-center`} style={{display: 'none'}}>
                        <span className="material-symbols-outlined text-white text-lg">
                          {option.name === 'Telegram' ? 'send' : 
                           option.name === 'WhatsApp' ? 'chat' : 'facebook'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={product.photos[selectedImage]}
              alt={`${product.brand} ${product.grade}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Navigation Buttons */}
            {product.photos.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {product.photos.length}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-red-500 mb-4">warning</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mahsulotni o'chirish</h3>
              <p className="text-gray-600 mb-6">
                Bu mahsulotni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

export default SellerProductDetail
