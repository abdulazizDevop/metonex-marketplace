import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SupplierProfileView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for supplier profile
  const [supplierData] = useState(location.state?.supplierData || {
    id: 'SUP-001',
    companyName: 'SteelCorp Manufacturing',
    contactPerson: 'Ahmad Karimov',
    phone: '+998 91 234 56 78',
    email: 'ahmad@steelcorp.uz',
    address: 'Toshkent shahar, Chilonzor tumani, 15-uy',
    rating: 4.7,
    totalOrders: 156,
    totalReviews: 89,
    verified: true,
    memberSince: '2022',
    specialties: ['Steel Bars', 'Concrete Mix', 'Cement'],
    profileImage: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=SK',
    reviews: [
      {
        id: 1,
        author: 'Anonymous Buyer',
        date: '2 weeks ago',
        rating: 5,
        comment: 'Excellent supplier, always on time and quality materials. Highly recommend!',
        helpful: 12,
        orderId: 'ORD-001'
      },
      {
        id: 2,
        author: 'Anonymous Buyer',
        date: '1 month ago',
        rating: 4,
        comment: 'Good experience overall, some delays but resolved quickly.',
        helpful: 8,
        orderId: 'ORD-002'
      },
      {
        id: 3,
        author: 'Anonymous Buyer',
        date: '2 months ago',
        rating: 5,
        comment: 'Top-notch materials and customer service. Couldn\'t ask for more.',
        helpful: 15,
        orderId: 'ORD-003'
      }
    ],
    metrics: {
      onTimeDelivery: 95,
      qualityRating: 4.8,
      communicationRating: 4.6,
      priceCompetitiveness: 4.5
    }
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const handleBack = () => {
    navigate(-1);
  };

  const handleContactSupplier = () => {
    window.open(`tel:${supplierData.phone}`);
  };

  const handleEmailSupplier = () => {
    window.open(`mailto:${supplierData.email}`);
  };

  const handleSendRequest = () => {
    navigate('/buyer/rfq-form', {
      state: { 
        supplierData,
        preSelectedSupplier: true 
      }
    });
  };

  const handleViewProducts = () => {
    navigate('/buyer/products', {
      state: { 
        supplierFilter: supplierData.id 
      }
    });
  };

  const handleReviewFilter = (rating) => {
    setSelectedRating(rating);
  };

  const handleSortChange = () => {
    setSortBy(sortBy === 'recent' ? 'oldest' : 'recent');
  };

  const filteredReviews = selectedRating === 'all' 
    ? supplierData.reviews 
    : supplierData.reviews.filter(review => review.rating === parseInt(selectedRating));

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index}
        className={`material-symbols-outlined text-base ${
          index < rating ? 'text-yellow-500' : 'text-gray-300'
        }`}
      >
        star
      </span>
    ));
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Company Info */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Kompaniya ma'lumotlari</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Kompaniya:</span>
            <span className="font-medium">{supplierData.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kontakt shaxs:</span>
            <span className="font-medium">{supplierData.contactPerson}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Telefon:</span>
            <span className="font-medium">{supplierData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{supplierData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Manzil:</span>
            <span className="font-medium text-right">{supplierData.address}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ko'rsatkichlar</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Vaqtida yetkazib berish:</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${supplierData.metrics.onTimeDelivery}%` }}
                ></div>
              </div>
              <span className="font-medium">{supplierData.metrics.onTimeDelivery}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sifat bahosi:</span>
            <div className="flex items-center gap-1">
              {renderStars(Math.round(supplierData.metrics.qualityRating))}
              <span className="font-medium ml-1">{supplierData.metrics.qualityRating}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Aloqa bahosi:</span>
            <div className="flex items-center gap-1">
              {renderStars(Math.round(supplierData.metrics.communicationRating))}
              <span className="font-medium ml-1">{supplierData.metrics.communicationRating}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Narx raqobatbardoshligi:</span>
            <div className="flex items-center gap-1">
              {renderStars(Math.round(supplierData.metrics.priceCompetitiveness))}
              <span className="font-medium ml-1">{supplierData.metrics.priceCompetitiveness}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Mutaxassislik sohalari</h3>
        <div className="flex flex-wrap gap-2">
          {supplierData.specialties.map((specialty, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-[#6C4FFF]/10 text-[#6C4FFF] rounded-full text-sm font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      {/* Review Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button 
            onClick={() => handleReviewFilter('all')}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              selectedRating === 'all' 
                ? 'border-transparent bg-[#6C4FFF] text-white' 
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>Barcha baholar</span>
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleReviewFilter(rating.toString())}
              className={`flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                selectedRating === rating.toString()
                  ? 'border-[#6C4FFF] bg-[#6C4FFF] text-white'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              <span>{rating}</span>
              <span className="material-symbols-outlined text-base text-yellow-500">star</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{sortedReviews.length} ta baho ko'rsatilmoqda</p>
          <button 
            onClick={handleSortChange}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>{sortBy === 'recent' ? 'Eng yangi' : 'Eng eski'}</span>
            <span className="material-symbols-outlined text-base">unfold_more</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{review.author}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#6C4FFF] transition-colors">
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  <span>{review.helpful}</span>
                </button>
                <span className="text-sm text-gray-500">Buyurtma: {review.orderId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Sotuvchi profili</h1>
              <p className="text-sm text-gray-500">ID: {supplierData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={supplierData.profileImage}
              alt={supplierData.companyName}
              className="w-16 h-16 rounded-full object-cover"
            />
            {supplierData.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{supplierData.companyName}</h2>
            <p className="text-sm text-gray-500">{supplierData.contactPerson}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(supplierData.rating))}
                <span className="text-sm font-medium">{supplierData.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{supplierData.totalReviews} baho</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'overview', label: 'Umumiy' },
            { id: 'reviews', label: 'Baholar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#6C4FFF] text-[#6C4FFF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'reviews' && renderReviews()}
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <button
          onClick={handleSendRequest}
          className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
        >
          So'rov yuborish
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleViewProducts}
            className="flex-1 bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
          >
            Mahsulotlarni ko'rish
          </button>
          <button
            onClick={handleContactSupplier}
            className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Bog'lanish
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SupplierProfileView;
