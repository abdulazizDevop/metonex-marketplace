import { useState, useEffect } from 'react'
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal.jsx'
import ReviewModal from './ReviewModal.jsx'
import { getCompany, getCompanyRatings, getCertificates, getItems } from '../utils/api.js'

export default function CompanyProfileModal({ 
  isOpen, 
  onClose, 
  companyId,
  companyName,
  onSuccess 
}) {
  const [activeTab, setActiveTab] = useState('info') // 'info', 'products', 'certificates', 'reviews'
  const [company, setCompany] = useState(null)
  const [products, setProducts] = useState([])
  const [certificates, setCertificates] = useState([])
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    if (isOpen && companyId) {
      loadCompanyData()
    }
  }, [isOpen, companyId])

  async function loadCompanyData() {
    setLoading(true)
    try {
      const [companyData, productsData, certificatesData, reviewsData] = await Promise.all([
        getCompany(companyId),
        getItems({ company: companyId, page_size: 10 }),
        getCertificates(companyId),
        getCompanyRatings(companyId)
      ])
      
      setCompany(companyData)
      setProducts(productsData.results || productsData || [])
      setCertificates(certificatesData || [])
      setReviews(reviewsData.ratings || [])
      setAverageRating(reviewsData.average_rating || 0)
      setTotalReviews(reviewsData.total_ratings || 0)
    } catch (error) {
      console.error('Kompaniya ma\'lumotlarini yuklashda xato:', error)
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

  const formatPrice = (price) => {
    if (!price && price !== 0) return '-'
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const tabs = [
    { id: 'info', name: 'Ma\'lumotlar', icon: '🏢' },
    { id: 'products', name: 'Mahsulotlar', icon: '📦' },
    { id: 'certificates', name: 'Sertifikatlar', icon: '📜' },
    { id: 'reviews', name: 'Reviewlar', icon: '⭐' }
  ]

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">
            {company?.name || companyName || 'Kompaniya ma\'lumotlari'}
          </h2>
          {company && (
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({totalReviews} ta review)
                </span>
              </div>
            </div>
          )}
        </ModalHeader>

        <ModalBody>
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 bg-white text-blue-600'
                        : 'border-transparent bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Company Info Tab */}
              {activeTab === 'info' && company && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Asosiy ma'lumotlar</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Kompaniya nomi</label>
                          <p className="text-lg font-semibold text-gray-900">{company.name}</p>
                        </div>
                        
                        {company.description && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tavsif</label>
                            <p className="text-gray-700 leading-relaxed">{company.description}</p>
                          </div>
                        )}
                        
                        {company.address && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Manzil</label>
                            <p className="text-gray-700">{company.address}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {company.phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Telefon</label>
                            <p className="text-gray-700">{company.phone}</p>
                          </div>
                        )}
                        
                        {company.email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-700">{company.email}</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Ro'yxatdan o'tgan</label>
                          <p className="text-gray-700">{formatDate(company.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {company.logo && (
                      <div className="mt-6">
                        <label className="text-sm font-medium text-gray-500 block mb-2">Logo</label>
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mahsulotlar</h3>
                    
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                          <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            {product.images_urls && product.images_urls.length > 0 && (
                              <img 
                                src={product.images_urls[0]} 
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                            )}
                            <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{product.category_name}</p>
                            <p className="text-lg font-bold text-green-600">{formatPrice(product.price)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Mahsulotlar yo'q</h3>
                        <p className="mt-1 text-sm text-gray-500">Bu kompaniya hali mahsulot qo'shmagan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sertifikatlar</h3>
                    
                    {certificates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificates.map((cert, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <img 
                              src={cert.sertificate} 
                              alt={`Sertifikat ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                            <p className="text-sm text-gray-600">Sertifikat {index + 1}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Sertifikatlar yo'q</h3>
                        <p className="mt-1 text-sm text-gray-500">Bu kompaniya hali sertifikat yuklamagan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Reviewlar</h3>
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Review berish
                      </button>
                    </div>
                    
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
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
                        ))}
                      </div>
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
                </div>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Yopish
          </button>
        </ModalFooter>
      </Modal>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        order={null}
        companyId={companyId}
        mode="view"
        onSuccess={() => {
          loadCompanyData()
          setShowReviewModal(false)
        }}
      />
    </>
  )
}
