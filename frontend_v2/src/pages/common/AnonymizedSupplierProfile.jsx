import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AnonymizedSupplierProfile = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showContactModal, setShowContactModal] = useState(false)

  // Mock data for anonymized supplier
  const supplierData = {
    id: 'SUP-****-****',
    name: 'Industrial Solutions Ltd.',
    location: 'Central Asia',
    established: '2015',
    rating: 4.8,
    totalReviews: 247,
    responseTime: '< 2 hours',
    completionRate: 98.5,
    categories: ['Construction Equipment', 'Industrial Machinery', 'Safety Equipment'],
    certifications: ['ISO 9001:2015', 'CE Certified', 'OSHA Compliant'],
    languages: ['English', 'Russian', 'Uzbek'],
    paymentMethods: ['Bank Transfer', 'Escrow', 'Credit Card'],
    deliveryRegions: ['Central Asia', 'Eastern Europe', 'Middle East']
  }

  const products = [
    {
      id: 1,
      name: 'Heavy Duty Excavator',
      category: 'Construction Equipment',
      price: '$45,000 - $65,000',
      moq: '1 unit',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
      rating: 4.9,
      reviews: 23
    },
    {
      id: 2,
      name: 'Industrial Conveyor System',
      category: 'Industrial Machinery',
      price: '$12,000 - $25,000',
      moq: '5 units',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
      rating: 4.7,
      reviews: 18
    },
    {
      id: 3,
      name: 'Safety Equipment Set',
      category: 'Safety Equipment',
      price: '$500 - $1,200',
      moq: '50 units',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
      rating: 4.8,
      reviews: 31
    }
  ]

  const reviews = [
    {
      id: 1,
      rating: 5,
      comment: 'Excellent quality equipment, delivered on time. Highly recommended!',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      rating: 4,
      comment: 'Good supplier, responsive communication. Product quality as described.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      rating: 5,
      comment: 'Professional service, competitive pricing. Will order again.',
      date: '2024-01-05',
      verified: true
    }
  ]

  const handleContactSupplier = () => {
    setShowContactModal(true)
  }

  const handleSendMessage = () => {
    // Handle sending message
    setShowContactModal(false)
    navigate('/buyer/offers')
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        star
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleContactSupplier}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Supplier Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">business</span>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{supplierData.name}</h1>
                <div className="flex items-center gap-1">
                  {renderStars(supplierData.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    {supplierData.rating} ({supplierData.totalReviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{supplierData.responseTime}</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{supplierData.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{supplierData.established}</div>
                  <div className="text-sm text-gray-600">Established</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{supplierData.location}</div>
                  <div className="text-sm text-gray-600">Location</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'products', label: 'Products' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {supplierData.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {supplierData.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">verified</span>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                    <p className="text-gray-600">{supplierData.languages.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Methods</h4>
                    <p className="text-gray-600">{supplierData.paymentMethods.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Regions</h4>
                    <p className="text-gray-600">{supplierData.deliveryRegions.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <div>Price: {product.price}</div>
                        <div>MOQ: {product.moq}</div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                      {review.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Supplier</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {supplierData.name} to discuss your requirements.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnonymizedSupplierProfile
