import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BuyerProducts = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('price')

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'steel', name: 'Steel', icon: 'build' },
    { id: 'concrete', name: 'Concrete', icon: 'construction' },
    { id: 'lumber', name: 'Lumber', icon: 'forest' },
    { id: 'electrical', name: 'Electrical', icon: 'electrical_services' },
    { id: 'plumbing', name: 'Plumbing', icon: 'plumbing' },
    { id: 'tools', name: 'Tools', icon: 'handyman' }
  ]

  const products = [
    // Steel Products
    {
      id: 1,
      name: 'Reinforced Steel Bars Ø12',
      category: 'steel',
      supplier: 'SteelCorp Ltd',
      price: '$710/ton',
      originalPrice: '$750/ton',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Grade 60 steel bars',
      minOrder: '5 tons',
      delivery: '2-3 days',
      location: 'Tashkent',
      verified: true,
      discount: 5,
      isNew: true
    },
    {
      id: 7,
      name: 'Steel Beams I-200',
      category: 'steel',
      supplier: 'MetalWorks',
      price: '$120/piece',
      originalPrice: '$130/piece',
      rating: 4.7,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Structural steel beams',
      minOrder: '10 pieces',
      delivery: '3-4 days',
      location: 'Tashkent',
      verified: true,
      discount: 8,
      isNew: false
    },
    {
      id: 9,
      name: 'Steel Plates 10mm',
      category: 'steel',
      supplier: 'SteelMax',
      price: '$95/sqm',
      originalPrice: '$105/sqm',
      rating: 4.6,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Structural steel plates',
      minOrder: '20 sqm',
      delivery: '2-3 days',
      location: 'Samarkand',
      verified: true,
      discount: 10,
      isNew: true
    },
    // Concrete Products
    {
      id: 2,
      name: 'Concrete Mix C25/30',
      category: 'concrete',
      supplier: 'CementPro',
      price: '$85/m³',
      originalPrice: '$90/m³',
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Ready-mix concrete',
      minOrder: '10 m³',
      delivery: '1-2 days',
      location: 'Samarkand',
      verified: true,
      discount: 6,
      isNew: false
    },
    {
      id: 8,
      name: 'Cement Bags 50kg',
      category: 'concrete',
      supplier: 'CementPlus',
      price: '$25/bag',
      originalPrice: '$28/bag',
      rating: 4.3,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Portland cement bags',
      minOrder: '100 bags',
      delivery: '1-2 days',
      location: 'Samarkand',
      verified: true,
      discount: 11,
      isNew: false
    },
    {
      id: 10,
      name: 'Concrete Blocks 20x20x40',
      category: 'concrete',
      supplier: 'BlockMaster',
      price: '$2.5/piece',
      originalPrice: '$3/piece',
      rating: 4.4,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Hollow concrete blocks',
      minOrder: '500 pieces',
      delivery: '2-3 days',
      location: 'Bukhara',
      verified: true,
      discount: 17,
      isNew: false
    },
    // Lumber Products
    {
      id: 3,
      name: 'Pine Lumber 2x4x8',
      category: 'lumber',
      supplier: 'WoodWorks',
      price: '$45/piece',
      originalPrice: '$50/piece',
      rating: 4.7,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Kiln-dried pine lumber',
      minOrder: '50 pieces',
      delivery: '3-5 days',
      location: 'Bukhara',
      verified: false,
      discount: 10,
      isNew: false
    },
    {
      id: 11,
      name: 'Oak Boards 1x6x12',
      category: 'lumber',
      supplier: 'PremiumWood',
      price: '$85/piece',
      originalPrice: '$95/piece',
      rating: 4.8,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Premium oak boards',
      minOrder: '20 pieces',
      delivery: '4-5 days',
      location: 'Tashkent',
      verified: true,
      discount: 11,
      isNew: true
    },
    {
      id: 12,
      name: 'Plywood Sheets 18mm',
      category: 'lumber',
      supplier: 'PlyMax',
      price: '$35/sheet',
      originalPrice: '$40/sheet',
      rating: 4.5,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Marine grade plywood',
      minOrder: '10 sheets',
      delivery: '2-3 days',
      location: 'Namangan',
      verified: true,
      discount: 13,
      isNew: false
    },
    // Electrical Products
    {
      id: 4,
      name: 'Copper Wire 2.5mm²',
      category: 'electrical',
      supplier: 'ElectroSupply',
      price: '$12/meter',
      originalPrice: '$15/meter',
      rating: 4.5,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Copper electrical wire',
      minOrder: '100 meters',
      delivery: '1-2 days',
      location: 'Tashkent',
      verified: true,
      discount: 20,
      isNew: true
    },
    {
      id: 13,
      name: 'Circuit Breaker 32A',
      category: 'electrical',
      supplier: 'ElectroTech',
      price: '$25/piece',
      originalPrice: '$30/piece',
      rating: 4.6,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'MCB circuit breaker',
      minOrder: '10 pieces',
      delivery: '1-2 days',
      location: 'Tashkent',
      verified: true,
      discount: 17,
      isNew: false
    },
    {
      id: 14,
      name: 'LED Panel Light 36W',
      category: 'electrical',
      supplier: 'LightPro',
      price: '$18/piece',
      originalPrice: '$22/piece',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Energy efficient LED panel',
      minOrder: '20 pieces',
      delivery: '1-2 days',
      location: 'Samarkand',
      verified: true,
      discount: 18,
      isNew: true
    },
    // Plumbing Products
    {
      id: 5,
      name: 'PVC Pipe 110mm',
      category: 'plumbing',
      supplier: 'PipeMaster',
      price: '$8/meter',
      originalPrice: '$10/meter',
      rating: 4.4,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'PVC drainage pipe',
      minOrder: '20 meters',
      delivery: '2-3 days',
      location: 'Namangan',
      verified: true,
      discount: 20,
      isNew: false
    },
    {
      id: 15,
      name: 'Copper Pipe 15mm',
      category: 'plumbing',
      supplier: 'PipeElite',
      price: '$15/meter',
      originalPrice: '$18/meter',
      rating: 4.8,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Copper water pipe',
      minOrder: '50 meters',
      delivery: '2-3 days',
      location: 'Tashkent',
      verified: true,
      discount: 17,
      isNew: false
    },
    {
      id: 16,
      name: 'Water Heater 50L',
      category: 'plumbing',
      supplier: 'HeatMaster',
      price: '$180/piece',
      originalPrice: '$200/piece',
      rating: 4.5,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Electric water heater',
      minOrder: '1 piece',
      delivery: '1-2 days',
      location: 'Samarkand',
      verified: true,
      discount: 10,
      isNew: true
    },
    // Tools Products
    {
      id: 6,
      name: 'Cordless Drill Set',
      category: 'tools',
      supplier: 'ToolTech',
      price: '$150/set',
      originalPrice: '$180/set',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Professional drill set',
      minOrder: '1 set',
      delivery: '1 day',
      location: 'Tashkent',
      verified: true,
      discount: 17,
      isNew: true
    },
    {
      id: 17,
      name: 'Circular Saw 7.25"',
      category: 'tools',
      supplier: 'SawPro',
      price: '$120/piece',
      originalPrice: '$140/piece',
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Professional circular saw',
      minOrder: '1 piece',
      delivery: '1-2 days',
      location: 'Tashkent',
      verified: true,
      discount: 14,
      isNew: false
    },
    {
      id: 18,
      name: 'Tool Set 100pcs',
      category: 'tools',
      supplier: 'ToolBox',
      price: '$85/set',
      originalPrice: '$100/set',
      rating: 4.7,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop',
      description: 'Complete tool set',
      minOrder: '1 set',
      delivery: '1-2 days',
      location: 'Bukhara',
      verified: true,
      discount: 15,
      isNew: false
    }
  ]

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleProductClick = (productId) => {
    navigate(`/buyer/product/${productId}`)
  }

  const handleRequestQuote = (productId) => {
    navigate(`/buyer/request-quote/${productId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-b border-gray-200 z-50">
        {/* Header */}
        <div className="px-4 py-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Products</h1>
            </div>
            <button 
              onClick={() => navigate('/buyer/notifications')}
              className="relative p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 text-white text-xs font-bold text-center">3</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Categories - Horizontal Scroll */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors text-sm ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {category.icon}
                </span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="px-4 pb-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Content with top padding */}
      <div className="pt-44">
        {/* Category Sections */}
        {selectedCategory === 'all' ? (
          // Show all categories in horizontal scroll rows
          Object.entries(groupedProducts).map(([categoryId, categoryProducts]) => {
            const category = categories.find(cat => cat.id === categoryId)
            return (
              <div key={categoryId} className="mb-6">
                {/* Category Header */}
                <div className="px-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-gray-600">
                        {category?.icon}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900">{category?.name}</h2>
                      <span className="text-sm text-gray-500">({categoryProducts.length})</span>
                    </div>
                    <button 
                      onClick={() => setSelectedCategory(categoryId)}
                      className="text-sm text-blue-600 font-medium hover:text-blue-700"
                    >
                      See All
                    </button>
                  </div>
                </div>

                {/* Horizontal Scroll Products */}
                <div className="px-4">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="flex-shrink-0 w-48 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.isNew && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                NEW
                              </span>
                            )}
                            {product.discount > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                -{product.discount}%
                              </span>
                            )}
                          </div>

                          {/* Verified Badge */}
                          {product.verified && (
                            <div className="absolute top-2 right-2">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <span className="material-symbols-outlined text-xs mr-0.5">verified</span>
                                ✓
                              </span>
                            </div>
                          )}

                          {/* Location */}
                          <div className="absolute bottom-2 left-2">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 shadow-sm">
                              <span className="material-symbols-outlined text-xs mr-0.5">location_on</span>
                              {product.location}
                            </span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                          {/* Supplier */}
                          <p className="text-xs text-gray-500 mb-1 truncate">{product.supplier}</p>
                          
                          {/* Product Name */}
                          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`material-symbols-outlined text-xs ${
                                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviews})</span>
                          </div>

                          {/* Price */}
                          <div className="mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">Min: {product.minOrder}</p>
                          </div>

                          {/* Delivery */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">local_shipping</span>
                              {product.delivery}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleProductClick(product.id)}
                              className="flex-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleRequestQuote(product.id)}
                              className="flex-1 px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                            >
                              Quote
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          // Show filtered products in grid when category is selected
          <div className="px-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          NEW
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Verified Badge */}
                    {product.verified && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="material-symbols-outlined text-xs mr-0.5">verified</span>
                          ✓
                        </span>
                      </div>
                    )}

                    {/* Location */}
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 shadow-sm">
                        <span className="material-symbols-outlined text-xs mr-0.5">location_on</span>
                        {product.location}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Supplier */}
                    <p className="text-xs text-gray-500 mb-1 truncate">{product.supplier}</p>
                    
                    {/* Product Name */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-xs ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Min: {product.minOrder}</p>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">local_shipping</span>
                        {product.delivery}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleProductClick(product.id)}
                        className="flex-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRequestQuote(product.id)}
                        className="flex-1 px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                      >
                        Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 px-4">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && selectedCategory !== 'all' && (
          <div className="px-4 py-6">
            <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyerProducts