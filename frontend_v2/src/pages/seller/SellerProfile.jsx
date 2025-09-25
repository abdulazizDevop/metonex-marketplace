import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const [profileData] = useState({
    companyName: 'BuildRight Supplies',
    supplierId: '789012',
    rating: 4.7,
    rank: 5,
    totalSuppliers: 100,
    totalReviews: 120,
    profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj41-PwDLpMDAVf0vzGk89KRvxCUknfTyrhRvmtMkNK29xe4ngs3qUssLoayhPwAPuseJ84dl4TTlO08AqaWnQv0SwBd-5IJCxShTODuYldLnvXjMN3CQz-qUKnPRuonOTqO0zq6JFolj-oGctqKvT4CvxMJg6wBjgG6YxWYe4ZoNFYzIzAIv9RNp9agkGsbGcyyXpuZ3ZxU52YS_6KQDSKXw2zipAFfkEschcYc8183tWUl4w_G6Ni_wrkTSpRkOzPieIq_Zkh6o',
    metrics: [
      { name: 'On-time Delivery', value: '98%', icon: 'local_shipping', trend: 'up', color: 'text-green-500' },
      { name: 'Avg. Response', value: '2 hrs', icon: 'schedule', trend: 'down', color: 'text-red-500' },
      { name: 'NPS Score', value: '85', icon: 'thumb_up', trend: 'up', color: 'text-green-500' },
      { name: 'Completed Orders', value: '500+', icon: 'task_alt', trend: 'up', color: 'text-green-500' },
      { name: 'Avg. Order Value', value: '$15,000', icon: 'paid', trend: 'down', color: 'text-red-500' },
      { name: 'Monthly Growth', value: '+12%', icon: 'trending_up', trend: 'up', color: 'text-green-500' }
    ],
    categories: ['Concrete', 'Lumber', 'Steel'],
    certifications: [
      { name: 'ISO 9001', icon: 'verified' },
      { name: 'Quality Assurance Seal', icon: 'shield' }
    ],
    reviews: [
      { rating: 5, percentage: 80, count: 96 },
      { rating: 4, percentage: 15, count: 18 },
      { rating: 3, percentage: 3, count: 4 },
      { rating: 2, percentage: 1, count: 1 },
      { rating: 1, percentage: 1, count: 1 }
    ],
    recentReviews: [
      {
        id: 1,
        author: 'Anonymous',
        date: '2 weeks ago',
        rating: 5,
        comment: 'Excellent supplier, always on time and quality materials. The best we\'ve worked with.',
        helpful: 12,
        comments: 0
      },
      {
        id: 2,
        author: 'Anonymous',
        date: '3 weeks ago',
        rating: 5,
        comment: 'Fantastic service and product quality. Highly recommend BuildRight Supplies.',
        helpful: 8,
        comments: 0
      },
      {
        id: 3,
        author: 'Anonymous',
        date: '1 month ago',
        rating: 4,
        comment: 'Good experience overall, some delays but resolved quickly.',
        helpful: 2,
        comments: 0
      },
      {
        id: 4,
        author: 'Anonymous',
        date: '2 months ago',
        rating: 5,
        comment: 'Top-notch materials and customer service. Couldn\'t ask for more.',
        helpful: 5,
        comments: 0
      }
    ],
    team: [
      { 
        name: 'Ava Chen', 
        position: 'CEO',
        phone: '+1 (555) 123-4567',
        email: 'ava.chen@buildright.com'
      },
      { 
        name: 'Leo Martinez', 
        position: 'Accountant',
        phone: '+1 (555) 234-5678',
        email: 'leo.martinez@buildright.com'
      }
    ]
  });

  const handleBack = () => {
    if (showReviewsModal) {
      setShowReviewsModal(false);
      setSelectedRating('all');
    } else {
      navigate(-1);
    }
  };

  const handleEditProfile = () => {
    navigate('/seller/edit-profile');
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  const handleReviewFilter = (rating) => {
    setSelectedRating(rating);
  };

  const handleSortChange = () => {
    setSortBy(sortBy === 'recent' ? 'oldest' : 'recent');
  };

  const filteredReviews = selectedRating === 'all' 
    ? profileData.recentReviews 
    : profileData.recentReviews.filter(review => review.rating === parseInt(selectedRating));

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

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'arrow_upward' : 'arrow_downward';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Performance Metrics</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {profileData.metrics.map((metric, index) => (
                  <div key={index} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        metric.name === 'Monthly Growth' ? 'bg-[#e6f4e6] text-[#4caf50]' : 'bg-[#ede8f3] text-[#735095]'
                      }`}>
                        <span className="material-symbols-outlined">{metric.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#140e1b]">{metric.name}</p>
                        <div className="flex items-center gap-1">
                          <p className={`text-lg font-bold ${
                            metric.name === 'Monthly Growth' ? 'text-[#4caf50]' : 'text-[#735095]'
                          }`}>
                            {metric.value}
                          </p>
                          <span className={`material-symbols-outlined text-sm ${metric.color}`}>
                            {getTrendIcon(metric.trend)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Categories */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Product Categories</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profileData.categories.map((category, index) => (
                  <span key={index} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                    {category}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Certifications</h2>
              <div className="mt-3 space-y-3">
                {profileData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                      <span className="material-symbols-outlined">{cert.icon}</span>
                    </div>
                    <p className="flex-1 font-medium text-[#140e1b]">{cert.name}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Reviews Summary */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#140e1b]">Reviews</h2>
                <button 
                  onClick={() => setShowReviewsModal(true)}
                  className="text-sm font-medium text-gray-600 hover:text-[#735095] transition-colors"
                >
                  {profileData.totalReviews} Reviews
                </button>
              </div>
              
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 font-medium text-gray-600">Rating</th>
                      <th className="py-2 font-medium text-gray-600">Percentage</th>
                      <th className="py-2 font-medium text-gray-600">Breakdown</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.reviews.map((review, index) => (
                      <tr 
                        key={index} 
                        className="group cursor-pointer hover:bg-gray-100"
                        onClick={() => setShowReviewsModal(true)}
                      >
                        <td className="py-2.5 font-medium text-gray-800">{review.rating} ⭐</td>
                        <td className="py-2.5 font-medium text-gray-800">{review.percentage}%</td>
                        <td className="py-2.5">
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div 
                              className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                              style={{ width: `${review.percentage}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">chevron_right</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 space-y-5">
                {profileData.recentReviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="rounded-lg border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gray-200">
                        <span className="material-symbols-outlined text-gray-500">person</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <p className="font-semibold text-[#140e1b]">{review.author}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            {/* Team Members */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b]">Team</h2>
              <div className="mt-3 space-y-3">
                {profileData.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#ede8f3] text-[#735095]">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#140e1b]">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCall(member.phone)}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">call</span>
                      </button>
                      <button 
                        onClick={() => handleEmail(member.email)}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">mail</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-white">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Supplier Profile</h1>
          <div className="w-10"></div>
        </header>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 p-4 pb-6 bg-white">
          <div className="relative">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28" 
              style={{ backgroundImage: `url("${profileData.profileImage}")` }}
            />
            <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-2 ring-white">
              <span className="material-symbols-outlined text-sm">star</span>
              <span>Top Rated</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[22px] font-bold text-[#140e1b]">{profileData.companyName}</p>
            <p className="text-sm text-gray-500">Supplier ID: {profileData.supplierId}</p>
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="font-semibold text-yellow-500">{profileData.rating}</span>
                <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                <span className="text-gray-400">·</span>
                <span className="font-medium text-gray-600">Rank #{profileData.rank} of {profileData.totalSuppliers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'reviews', label: 'Reviews', icon: 'star' },
            { id: 'team', label: 'Team', icon: 'group' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#a35ee8] text-[#a35ee8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4">
          {renderTabContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-gray-100 bg-white/95 pb-safe">
        <div className="flex flex-col gap-4 p-4">
          <button 
            onClick={handleEditProfile}
            className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#a35ee8] text-base font-bold text-white shadow-lg shadow-[#a35ee8]/30 hover:bg-[#8e4dd1] transition-colors"
          >
            <span className="truncate">Edit Profile</span>
          </button>
        </div>
        
        <nav className="flex justify-around border-t border-gray-200 py-2">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/seller/requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-medium">Requests</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#a35ee8] transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs font-medium">Products</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#a35ee8]">
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-bold">Profile</span>
          </button>
        </nav>
      </footer>

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="absolute inset-0 z-20 flex flex-col bg-gray-50">
          <header className="sticky top-0 z-20 flex flex-col border-b border-gray-200 bg-white/95 pb-3 pt-4 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4">
              <button 
                onClick={() => setShowReviewsModal(false)}
                className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
              </button>
              <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Reviews</h1>
              <div className="w-10"></div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <button 
                onClick={() => handleReviewFilter('all')}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedRating === 'all' 
                    ? 'border-transparent bg-[#a35ee8] text-white' 
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-base">tune</span>
                <span>All Ratings</span>
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleReviewFilter(rating.toString())}
                  className={`flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedRating === rating.toString()
                      ? 'border-[#a35ee8] bg-[#a35ee8] text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <span>{rating}</span>
                  <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between px-4">
              <p className="text-sm font-medium text-gray-600">Showing {sortedReviews.length} reviews</p>
              <button 
                onClick={handleSortChange}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>{sortBy === 'recent' ? 'Most Recent' : 'Oldest First'}</span>
                <span className="material-symbols-outlined text-base">unfold_more</span>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-gray-100 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-200">
                      <span className="material-symbols-outlined text-gray-500">person</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="font-semibold text-[#140e1b]">{review.author}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1.5 font-medium text-[#735095] hover:text-[#8e4dd1] transition-colors">
                          <span className="material-symbols-outlined text-lg">thumb_up</span>
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center gap-1.5 font-medium text-gray-500 hover:text-[#735095] transition-colors">
                          <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
