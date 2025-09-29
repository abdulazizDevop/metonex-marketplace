import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DeliveryFeedback = () => {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState({
    overallRating: 0,
    productQuality: 0,
    deliverySpeed: 0,
    communication: 0,
    packaging: 0,
    comment: '',
    recommend: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const orderDetails = {
    orderId: 'ORD-2024-001',
    product: 'Concrete Mix M300',
    supplier: 'Metro Construction Supplies',
    deliveryDate: '2024-01-15'
  }

  const ratingCategories = [
    { key: 'overallRating', label: 'Overall Experience', icon: 'star' },
    { key: 'productQuality', label: 'Product Quality', icon: 'inventory' },
    { key: 'deliverySpeed', label: 'Delivery Speed', icon: 'schedule' },
    { key: 'communication', label: 'Communication', icon: 'message' },
    { key: 'packaging', label: 'Packaging', icon: 'inventory_2' }
  ]

  const handleRatingChange = (category, rating) => {
    setFeedback(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      console.log('Feedback submitted:', feedback)
      setIsSubmitting(false)
      navigate('/buyer/dashboard-1')
    }, 2000)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const isFormValid = () => {
    return feedback.overallRating > 0 && 
           feedback.productQuality > 0 && 
           feedback.deliverySpeed > 0 && 
           feedback.communication > 0 && 
           feedback.packaging > 0 &&
           feedback.recommend !== null
  }

  const StarRating = ({ rating, onRatingChange, disabled = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onRatingChange(star)}
            disabled={disabled}
            className={`w-8 h-8 ${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${!disabled ? 'hover:text-yellow-400' : ''} transition-colors`}
          >
            <span className="material-symbols-outlined text-2xl">star</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Delivery Feedback</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{orderDetails.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">{orderDetails.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Date:</span>
                <span className="font-medium">{orderDetails.deliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Rate Your Experience</h2>
            <div className="space-y-6">
              {ratingCategories.map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-purple-600">{category.icon}</span>
                    <span className="font-medium text-gray-900">{category.label}</span>
                  </div>
                  <StarRating
                    rating={feedback[category.key]}
                    onRatingChange={(rating) => handleRatingChange(category.key, rating)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Would you recommend this supplier?</h2>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFeedback(prev => ({ ...prev, recommend: true }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  feedback.recommend === true
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-green-600">thumb_up</span>
                  <span className={`font-medium ${
                    feedback.recommend === true ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Yes, I recommend
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFeedback(prev => ({ ...prev, recommend: false }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  feedback.recommend === false
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-red-600">thumb_down</span>
                  <span className={`font-medium ${
                    feedback.recommend === false ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    No, I don't recommend
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Additional Comments</h2>
            <textarea
              name="comment"
              value={feedback.comment}
              onChange={handleInputChange}
              placeholder="Share your experience with other buyers..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Privacy Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">Your Privacy</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Your feedback helps other buyers make informed decisions</p>
              <p>• Your personal information is never shared</p>
              <p>• Suppliers can see your rating but not your identity</p>
              <p>• You can edit your review within 30 days</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isFormValid() && !isSubmitting
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DeliveryFeedback