import { useState, useEffect } from 'react'
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal.jsx'
import { createRating, getCompanyRatings, getOrderRating } from '../utils/api.js'

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  order, 
  companyId,
  mode = 'create', // 'create' or 'view'
  onSuccess 
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [existingReview, setExistingReview] = useState(null)

  useEffect(() => {
    if (isOpen) {
      if (mode === 'view' && companyId) {
        loadCompanyReviews()
      } else if (mode === 'create' && order) {
        loadExistingReview()
      }
    }
  }, [isOpen, mode, companyId, order])

  async function loadCompanyReviews() {
    try {
      const data = await getCompanyRatings(companyId)
      setReviews(data.ratings || [])
      setAverageRating(data.average_rating || 0)
      setTotalReviews(data.total_ratings || 0)
    } catch (error) {
      console.error('Reviewlarni yuklashda xato:', error)
    }
  }

  async function loadExistingReview() {
    try {
      const review = await getOrderRating(order.id)
      if (review) {
        setExistingReview(review)
        setRating(review.overall_score)
        setComment(review.comment || '')
      }
    } catch (error) {
      console.error('Mavjud review yuklashda xato:', error)
    }
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Baho tanlang')
      return
    }
    
    if (!comment.trim()) {
      alert('Izoh yozing')
      return
    }
    
    setLoading(true)
    try {
      await createRating({
        order: order.id,
        rating: rating,
        comment: comment.trim()
      })
      onSuccess?.(rating, comment)
      onClose()
    } catch (error) {
      console.error('Review yuborishda xato:', error)
      // Error handling will be done by parent component
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '-'
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('uz-UZ')
    } catch {
      return '-'
    }
  }

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onStarClick(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform duration-150`}
            disabled={!interactive}
          >
            <svg
              className={`w-6 h-6 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  const getRatingText = (rating) => {
    const texts = {
      1: 'Juda yomon',
      2: 'Yomon', 
      3: 'O\'rtacha',
      4: 'Yaxshi',
      5: 'Ajoyib'
    }
    return texts[rating] || ''
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Review berish' : 'Reviewlar'}
        </h2>
        {mode === 'view' && (
          <p className="text-gray-600 mt-2">
            Kompaniya: {order?.supplier_company_name || 'Noma\'lum'}
          </p>
        )}
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {mode === 'create' ? (
            <>
              {/* Create Review */}
              {existingReview ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-blue-800">Mavjud review</span>
                  </div>
                  <p className="text-blue-700">Bu buyurtma uchun allaqachon review berilgan</p>
                </div>
              ) : (
                <>
                  {/* Rating Selection */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Baho berish
                    </h3>
                    
                    <div className="text-center">
                      <div className="mb-4">
                        {renderStars(rating, true, setRating)}
                      </div>
                      {rating > 0 && (
                        <p className="text-lg font-medium text-gray-700">
                          {getRatingText(rating)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Izoh yozish
                    </h3>
                    
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Xizmat haqida fikringizni yozing..."
                      rows={4}
                      className="w-full bg-gray-50 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* View Reviews */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-gray-600">
                    {totalReviews} ta review asosida
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {review.rater_company_name?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.rater_company_name || 'Noma\'lum'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </div>
                          </div>
                        </div>
                        <div>
                          {renderStars(review.overall_score)}
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Reviewlar yo'q</h3>
                    <p className="mt-1 text-sm text-gray-500">Hozircha bu kompaniyaga review berilmagan</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Yopish
          </button>
          
          {mode === 'create' && !existingReview && (
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !comment.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Review yuborish
                </>
              )}
            </button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  )
}
