import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [quoteData, setQuoteData] = useState({
    quantity: 1,
    message: '',
    deliveryDate: '',
    specialRequirements: ''
  })

  // Sample product data (in real app, this would come from API)
  const sampleProducts = {
    1: {
      id: 1,
      name: 'Reinforced Steel Bars Ø12',
      category: 'steel',
      supplier: 'SteelCorp Ltd',
      price: '$710/ton',
      originalPrice: '$750/ton',
      rating: 4.8,
      reviews: 124,
      images: [
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop'
      ],
      description: 'High-quality Grade 60 steel bars suitable for construction projects. These reinforced steel bars provide excellent strength and durability for concrete reinforcement.',
      specifications: {
        'Material': 'Grade 60 Steel',
        'Diameter': '12mm',
        'Length': '12m',
        'Weight': '0.888 kg/m',
        'Tensile Strength': '600 MPa',
        'Yield Strength': '420 MPa'
      },
      minOrder: '5 tons',
      maxOrder: '1000 tons',
      delivery: '2-3 days',
      location: 'Tashkent',
      verified: true,
      discount: 5,
      isNew: true,
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
          name: 'Steel Beams I-200',
          price: '$120/piece',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop',
          discount: 8
        },
        {
          id: 9,
          name: 'Steel Plates 10mm',
          price: '$95/sqm',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop',
          discount: 10
        }
      ]
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const productData = sampleProducts[id] || sampleProducts[1]
      setProduct(productData)
      setQuantity(productData.minOrder ? parseInt(productData.minOrder) : 1)
      setQuoteData(prev => ({
        ...prev,
        quantity: productData.minOrder ? parseInt(productData.minOrder) : 1
      }))
      setLoading(false)
    }, 1000)
  }, [id])

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 1
    setQuantity(numValue)
    setQuoteData(prev => ({ ...prev, quantity: numValue }))
  }

  const handleQuoteSubmit = (e) => {
    e.preventDefault()
    // Simulate API call
    console.log('Quote request:', quoteData)
    alert('Quote request sent successfully!')
    setShowQuoteModal(false)
    navigate('/buyer/orders')
  }

  const handleQuoteInputChange = (field, value) => {
    setQuoteData(prev => ({ ...prev, [field]: value }))
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
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Product Details</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <span className="material-symbols-outlined text-xl">favorite_border</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
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
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
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
              {product.isNew && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  NEW
                </span>
              )}
              {product.discount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Verified Badge */}
            {product.verified && (
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
            {product.supplierInfo.verified && (
              <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>

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
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Min order: {product.minOrder} • Max order: {product.maxOrder}
            </p>
          </div>

          {/* Location & Delivery */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {product.location}
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              {product.delivery}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                className="w-20 text-center border border-gray-300 rounded-lg py-2 text-sm"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <span className="text-sm text-gray-500 ml-2">tons</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request Quote
            </button>
            <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-xl">chat</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Supplier Information</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Company</span>
              <span className="text-gray-900 font-medium">{product.supplierInfo.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rating</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-900">{product.supplierInfo.rating}</span>
                <span className="text-gray-500">({product.supplierInfo.reviews})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Location</span>
              <span className="text-gray-900">{product.supplierInfo.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Established</span>
              <span className="text-gray-900">{product.supplierInfo.established}</span>
            </div>
            <div>
              <span className="text-gray-600 block mb-1">Specialties</span>
              <div className="flex flex-wrap gap-1">
                {product.supplierInfo.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Related Products</h2>
          <div className="grid grid-cols-2 gap-3">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{relatedProduct.price}</span>
                    {relatedProduct.discount > 0 && (
                      <span className="text-xs text-red-600">-{relatedProduct.discount}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Request Quote</h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleQuoteSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quoteData.quantity}
                  onChange={(e) => handleQuoteInputChange('quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                <input
                  type="date"
                  value={quoteData.deliveryDate}
                  onChange={(e) => handleQuoteInputChange('deliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={quoteData.message}
                  onChange={(e) => handleQuoteInputChange('message', e.target.value)}
                  placeholder="Tell the supplier about your requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea
                  value={quoteData.specialRequirements}
                  onChange={(e) => handleQuoteInputChange('specialRequirements', e.target.value)}
                  placeholder="Any special requirements or specifications..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Send Quote Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
