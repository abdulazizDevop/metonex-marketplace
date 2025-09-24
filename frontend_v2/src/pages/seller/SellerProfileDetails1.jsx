import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerProfileDetails1 = () => {
  const navigate = useNavigate();
  
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
      { rating: 5, percentage: 80 },
      { rating: 4, percentage: 15 },
      { rating: 3, percentage: 3 },
      { rating: 2, percentage: 1 },
      { rating: 1, percentage: 1 }
    ],
    recentReviews: [
      {
        author: 'Anonymous',
        date: '2 weeks ago',
        rating: 5,
        comment: 'Excellent supplier, always on time and quality materials.'
      },
      {
        author: 'Anonymous',
        date: '1 month ago',
        rating: 4,
        comment: 'Good experience overall, some delays but resolved quickly.'
      }
    ],
    team: [
      { name: 'Ava Chen', position: 'CEO' },
      { name: 'Leo Martinez', position: 'Accountant' }
    ]
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    console.log('Editing profile...');
  };

  const handleCall = (name) => {
    console.log(`Calling ${name}...`);
  };

  const handleEmail = (name) => {
    console.log(`Emailing ${name}...`);
  };

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

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Supplier Profile</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 bg-white p-4">
          <div className="flex flex-col items-center gap-4 pb-6">
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

          <div className="space-y-6">
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

            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#140e1b]">Reviews</h2>
                <p className="text-sm font-medium text-gray-600">{profileData.totalReviews} Reviews</p>
              </div>
              
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                <div className="space-y-3">
                  {profileData.reviews.map((review, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                        <span>{review.rating}</span>
                        <span className="material-symbols-outlined text-base text-yellow-400">star</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div 
                            className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${review.percentage}%` }}
                          />
                        </div>
                      </div>
                      <p className="w-10 text-right text-sm font-medium text-gray-600">{review.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-5">
                {profileData.recentReviews.map((review, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 p-4">
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
                        onClick={() => handleCall(member.name)}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <span className="material-symbols-outlined text-xl">call</span>
                      </button>
                      <button 
                        onClick={() => handleEmail(member.name)}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <span className="material-symbols-outlined text-xl">mail</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <footer className="sticky bottom-0 border-t border-gray-100 bg-white/95 pb-safe">
        <div className="flex flex-col gap-4 p-4">
          <button 
            onClick={handleEditProfile}
            className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#a35ee8] text-base font-bold text-white shadow-lg shadow-[#a35ee8]/30 hover:bg-[#8B4BC7] transition-colors"
          >
            <span className="truncate">Edit Profile</span>
          </button>
        </div>
        
        <nav className="flex justify-around border-t border-gray-200 py-2">
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#a35ee8]">
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#a35ee8]">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-medium">Requests</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#a35ee8]">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs font-medium">Products</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#a35ee8]">
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-bold">Profile</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default SellerProfileDetails1;
