import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [flowData, setFlowData] = useState({
    fromAvailableProducts: false,
    selectedCategories: [],
    flowStep: null,
    returnPath: null
  })
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [quantityError, setQuantityError] = useState('')

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
      supplierInfo: {
        name: 'SteelCorp Ltd',
        rating: 4.9,
        reviews: 1250,
        verified: true,
        location: 'Tashkent',
        established: '2015',
        specialties: ['Steel Products', 'Construction Materials', 'Metal Fabrication']
      },
      relatedProducts: [
        {
          id: 7,
          brand: 'SteelCorp',
          grade: 'I-200',
          base_price: 120000,
          currency: 'UZS',
          unit: 'piece',
          photos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop']
        },
        {
          id: 9,
          brand: 'SteelCorp',
          grade: '10mm',
          base_price: 95000,
          currency: 'UZS',
          unit: 'sqm',
          photos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop']
        }
      ]
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const productData = sampleProducts[id] || sampleProducts[1]
      setProduct(productData)
      setQuantity(productData.min_order_quantity || 1)
      setLoading(false)
    }, 1000)
  }, [id])

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        fromAvailableProducts: location.state.fromAvailableProducts || false,
        selectedCategories: location.state.selectedCategories || [],
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || null
      });
    }
  }, [location.state]);

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 1
    const minOrder = product ? product.min_order_quantity : 1
    
    setQuantity(numValue)
    
    // Validate minimum order
    if (numValue < minOrder) {
      setQuantityError(`Minimal buyurtma ${minOrder} ${product.unit}`)
    } else {
      setQuantityError('')
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleCopyLink = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy URL:', err)
      alert('Failed to copy link')
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
    },
    { 
      name: 'Instagram', 
      icon: 'https://instagram.com/favicon.ico',
      url: 'https://www.instagram.com/',
      color: 'bg-pink-500' 
    }
  ]

  const sendRequest = () => {
    if (quantityError) {
      return
    }

    // Navigate to RFQ form with product data and flow context
    navigate('/buyer/rfq-form', { 
      state: { 
        product: product,
        selectedCategories: flowData.selectedCategories.length > 0 ? flowData.selectedCategories : [product.category],
        flowData,
        flowStep: 'rfq-creation',
        returnPath: `/buyer/product/${id}`
      } 
    })
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product not found</h3>
          <p className="text-gray-500 mb-4">The product you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/buyer/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
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
            <h1 className="text-lg font-bold text-gray-900">Product Details</h1>
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

            {/* Badges */}
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

            {/* Verified Badge */}
            {product.supplierInfo?.verified && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="material-symbols-outlined text-xs mr-1">verified</span>
                  Verified
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          {/* Supplier */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">{product.supplier}</span>
            {product.supplierInfo?.verified && (
              <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
            )}
          </div>

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

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Miqdor</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className={`w-20 text-center border rounded-lg py-2 text-sm ${
                  quantityError 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <span className="text-sm text-gray-500 ml-2">{product.unit}</span>
            </div>
            {quantityError && (
              <p className="text-red-500 text-xs mt-1">{quantityError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={sendRequest}
              disabled={quantityError}
              className="flex-1 bg-[#6C4FFF] text-white py-3 rounded-lg font-medium hover:bg-[#5A3FE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buyurtma berish
            </button>
            <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-xl">chat</span>
            </button>
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

        {/* Supplier Info */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib beruvchi ma'lumotlari</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Kompaniya</span>
              <span className="text-gray-900 font-medium">{product.supplierInfo?.name || product.supplier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reyting</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-900">{product.supplierInfo?.rating || product.rating}</span>
                <span className="text-gray-500">({product.supplierInfo?.reviews || product.review_count})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Manzil</span>
              <span className="text-gray-900">{product.supplierInfo?.location || product.delivery_locations?.[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tashkil etilgan</span>
              <span className="text-gray-900">{product.supplierInfo?.established || 'Noma\'lum'}</span>
            </div>
            <div>
              <span className="text-gray-600 block mb-1">Ixtisosliklar</span>
              <div className="flex flex-wrap gap-1">
                {product.supplierInfo?.specialties?.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {specialty}
                  </span>
                )) || (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    Qurilish materiallari
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="bg-white px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">O'xshash mahsulotlar</h2>
            <div className="grid grid-cols-2 gap-3">
              {product.relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/buyer/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.photos[0]}
                      alt={`${relatedProduct.brand} ${relatedProduct.grade}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{relatedProduct.brand} {relatedProduct.grade}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('uz-UZ', {
                          style: 'currency',
                          currency: relatedProduct.currency,
                          minimumFractionDigits: 0
                        }).format(relatedProduct.base_price)} / {relatedProduct.unit}
                      </span>
                    </div>
                  </div>
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
                           option.name === 'WhatsApp' ? 'chat' : 
                           option.name === 'Facebook' ? 'facebook' : 'photo_camera'}
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
    </div>
  )
}

export default ProductDetail
