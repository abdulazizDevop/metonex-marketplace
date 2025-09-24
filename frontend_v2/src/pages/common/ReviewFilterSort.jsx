import React, { useState } from 'react';

const ReviewFilterSort = () => {
  const [filters, setFilters] = useState({
    rating: '',
    dateRange: '',
    category: '',
    verified: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const reviews = [
    {
      id: 1,
      userName: 'Ahmad Karimov',
      rating: 5,
      date: '2024-01-15',
      verified: true,
      category: 'Steel Products',
      comment: 'Ajoyib sifat! Yetkazib berish ham juda tez bo\'ldi. Tavsiya qilaman.',
      helpful: 12
    },
    {
      id: 2,
      userName: 'Malika Tosheva',
      rating: 4,
      date: '2024-01-14',
      verified: true,
      category: 'Construction Materials',
      comment: 'Mahsulot yaxshi, lekin narx biroz yuqori. Umuman olganda qoniqdim.',
      helpful: 8
    },
    {
      id: 3,
      userName: 'Bobur Rahimov',
      rating: 5,
      date: '2024-01-13',
      verified: false,
      category: 'Tools',
      comment: 'Birinchi marta buyurtma berdim. Hamma narsa aynan rasmda ko\'rsatilganday.',
      helpful: 15
    },
    {
      id: 4,
      userName: 'Dilnoza Usmanova',
      rating: 3,
      date: '2024-01-12',
      verified: true,
      category: 'Steel Products',
      comment: 'Mahsulot yaxshi, lekin yetkazib berish biroz kechikdi.',
      helpful: 5
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filters.rating && review.rating !== parseInt(filters.rating)) return false;
      if (filters.category && review.category !== filters.category) return false;
      if (filters.verified && !review.verified) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'most_helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setFilters({
      rating: '',
      dateRange: '',
      category: '',
      verified: false
    });
    setSortBy('newest');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Sharhlar</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">filter_list</span>
            Filter & Sort
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Jami {filteredAndSortedReviews.length} ta sharh topildi
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Eng yangi</option>
              <option value="oldest">Eng eski</option>
              <option value="highest">Eng yuqori baho</option>
              <option value="lowest">Eng past baho</option>
              <option value="most_helpful">Eng foydali</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filterlar</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Barchasini tozalash
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baho
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Barcha baholar</option>
                <option value="5">5 yulduz</option>
                <option value="4">4 yulduz</option>
                <option value="3">3 yulduz</option>
                <option value="2">2 yulduz</option>
                <option value="1">1 yulduz</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Barcha kategoriyalar</option>
                <option value="Steel Products">Po'lat mahsulotlari</option>
                <option value="Construction Materials">Qurilish materiallari</option>
                <option value="Tools">Asboblar</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sana
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Barcha vaqtlar</option>
                <option value="week">Oxirgi hafta</option>
                <option value="month">Oxirgi oy</option>
                <option value="3months">Oxirgi 3 oy</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Faqat tasdiqlangan
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">
                    {review.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{review.userName}</h4>
                    {review.verified && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        ✓ Tasdiqlangan
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {review.category}
              </span>
            </div>

            <p className="text-gray-700 mb-3">{review.comment}</p>

            <div className="flex items-center justify-between">
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <span className="material-symbols-outlined mr-1 text-sm">thumb_up</span>
                Foydali ({review.helpful})
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Javob berish
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">
            sentiment_dissatisfied
          </span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hech qanday sharh topilmadi
          </h3>
          <p className="text-gray-600">
            Filterlarni o'zgartirib ko'ring yoki barcha filterlarni tozalang.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewFilterSort;
