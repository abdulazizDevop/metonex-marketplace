import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';
import { userApi } from '../../utils/userApi';

const SellerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [flowData, setFlowData] = useState({
    fromDashboard: false,
    flowStep: null,
    returnPath: null
  });
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Documents state
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'contract',
    file: null
  });
  
  // Real profile data from API
  const [profileData, setProfileData] = useState({
    companyName: 'Loading...',
    supplierId: 'Loading...',
    rating: 0,
    rank: 0,
    totalSuppliers: 0,
    totalReviews: 0,
    profileImage: '',
    metrics: [],
    categories: [],
    certifications: [],
    reviews: [],
    recentReviews: [],
    team: []
  });

  // Initialize flow data from location state
  React.useEffect(() => {
    if (location.state) {
      setFlowData({
        fromDashboard: location.state.fromDashboard || false,
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || null
      });
    }
  }, [location.state]);

  // Load profile data from API
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [profileResponse, statsResponse] = await Promise.all([
        userApi.getProfile(),
        userApi.getSellerStats()
      ]);

      console.log('Profile data:', profileResponse);
      console.log('Stats data:', statsResponse);

      // Transform API data to UI format
      setProfileData({
        companyName: profileResponse.company?.name || 'Kompaniya nomi yo\'q',
        supplierId: profileResponse.id || 'N/A',
        rating: statsResponse.avg_rating || 0,
        rank: statsResponse.sales_rank || 0,
        totalSuppliers: 0, // Bu ma'lumot yo'q, TODO: qo'shish kerak
        totalReviews: statsResponse.total_reviews || 0,
        profileImage: profileResponse.avatar || '',
        metrics: [
          { name: 'Jami mahsulotlar', value: statsResponse.products?.total || '0', icon: 'inventory', trend: 'up', color: 'text-blue-500' },
          { name: 'Faol takliflar', value: statsResponse.offers?.active || '0', icon: 'local_offer', trend: 'up', color: 'text-green-500' },
          { name: 'Savdo buyurtmalari', value: statsResponse.orders?.total || '0', icon: 'shopping_cart', trend: 'up', color: 'text-purple-500' },
          { name: 'Profil to\'liqligi', value: `${statsResponse.profile_completion}%`, icon: 'verified', trend: statsResponse.profile_completion === 100 ? 'up' : 'down', color: 'text-green-500' }
        ],
        categories: statsResponse.categories || [],
        certifications: [],
        reviews: [],
        recentReviews: [],
        team: []
      });

    } catch (error) {
      console.error('Profile yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (showReviewsModal) {
      setShowReviewsModal(false);
      setSelectedRating('all');
    } else if (flowData.returnPath) {
      navigate(flowData.returnPath);
    } else {
      navigate(-1);
    }
  };

  const handleEditProfile = () => {
    navigate('/seller/edit-profile', {
      state: {
        fromProfile: true,
        flowStep: 'profile-edit',
        returnPath: '/seller/profile'
      }
    });
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  // Document handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadForm.title || !uploadForm.file) {
      alert('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    const newDocument = {
      id: documents.length + 1,
      title: uploadForm.title,
      type: uploadForm.type,
      status: 'pending',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileName: uploadForm.file.name
    };

    setDocuments(prev => [...prev, newDocument]);
    setUploadForm({ title: '', type: 'contract', file: null });
    setShowUploadModal(false);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const getDocumentTypeLabel = (type) => {
    const types = {
      'company_license': 'Kompaniya litsenziyasi',
      'tax_certificate': 'Soliq guvohnomasi',
      'contract': 'Shartnoma',
      'invoice': 'Hisob-faktura',
      'ttn': 'TTN (Transport hujjati)',
      'certificate': 'Sertifikat',
      'other': 'Boshqa'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      'verified': 'Tasdiqlangan',
      'pending': 'Kutilmoqda',
      'rejected': 'Rad etilgan'
    };
    return statuses[status] || status;
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
      return new Date(a.date) - new(Date);
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
            {profileData.categories.length > 0 && (
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
            )}
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
              
              {profileData.totalReviews === 0 ? (
                <div className="mt-4 text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400 text-2xl">star</span>
                    </div>
                    <p className="text-gray-500">Hozircha sharhlar yo'q</p>
                  </div>
                </div>
              ) : (
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
              )}
            </section>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            {/* Documents Header */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#140e1b]">Hujjatlar</h2>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6C4FFF] text-white text-sm font-medium rounded-lg hover:bg-[#5A3FE6] transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Yuklash
                </button>
              </div>
              
              {/* Documents List */}
              <div className="mt-4 space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-2xl">description</span>
                      </div>
                      <p className="text-gray-500">Hech qanday hujjat yuklanmagan</p>
                      <button 
                        onClick={() => setShowUploadModal(true)}
                        className="text-[#6C4FFF] text-sm font-medium hover:underline"
                      >
                        Birinchi hujjatni yuklang
                      </button>
                    </div>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#6C4FFF]/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#6C4FFF]">description</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#140e1b] truncate">{doc.title}</h3>
                        <p className="text-sm text-gray-500">{getDocumentTypeLabel(doc.type)}</p>
                        <div className="flex items-center gap-2 mt-2.5 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                            {getStatusText(doc.status)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{doc.fileSize}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{doc.uploadDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            // Mock download
                            alert(`${doc.fileName} yuklab olinmoqda...`);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Yuklab olish"
                        >
                          <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="O'chirish"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
              {profileData.team.length === 0 ? (
                <div className="mt-4 text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400 text-2xl">group</span>
                    </div>
                    <p className="text-gray-500">Hozircha jamoa a'zolari qo'shilmagan</p>
                  </div>
                </div>
              ) : (
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
              )}
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8}h-8 border-4 border-[#6C4FFF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yuklanmoqda...</p>
        </div>
      </div>
    );
  }

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
            {profileData.rating > 0 && (
              <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-2 ring-white">
                <span className="material-symbols-outlined text-sm">star</span>
                <span>Top Rated</span>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-[22px] font-bold text-[#140e1b]">{profileData.companyName}</p>
            <p className="text-sm text-gray-500">Supplier ID: {profileData.supplierId}</p>
            {profileData.rating > 0 && (
              <div className="mt-2 flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span className="font-semibold text-yellow-500">{profileData.rating}</span>
                  <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                  <span className="text-gray-400">·</span>
                  <span className="font-medium text-gray-600">Rank #{profileData.rank}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'reviews', label: 'Reviews', icon: 'star' },
            { id: 'documents', label: 'Documents', icon: 'description' },
            { id: 'team', label: 'Team', icon: 'group' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#6C4FFF] text-[#6C4FFF]'
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
            className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#6C4FFF] text-base font-bold text-white shadow-lg shadow-[#6C4FFF]/30 hover:bg-[#5A3FE6] transition-colors"
          >
            <span className="truncate">Edit Profile</span>
          </button>
        </div>
        
        <BottomNavigation />
      </footer>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#140e1b]">Hujjat yuklash</h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: '', type: 'contract', file: null });
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hujjat nomi
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Hujjat nomini kiriting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                />
              </div>
              
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hujjat turi
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                >
                  <option value="contract">Shartnoma</option>
                  <option value="invoice">Hisob-faktura</option>
                  <option value="ttn">TTN (Transport hujjati)</option>
                  <option value="company_license">Kompaniya litsenziyasi</option>
                  <option value="tax_certificate">Soliq guvohnomasi</option>
                  <option value="certificate">Sertifikat</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fayl
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#a35ee8] transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-gray-400">cloud_upload</span>
                      <span className="text-sm text-gray-600">
                        {uploadForm.file ? uploadForm.file.name : 'Faylni tanlang yoki sudrab tashlang'}
                      </span>
                      <span className="text-xs text-gray-500">PDF, JPG, PNG, DOC (max 10MB)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: '', type: 'contract', file: null });
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!uploadForm.title || !uploadForm.file}
                className="flex-1 px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Yuklash
              </button>
            </div>
          </div>
        </div>
      )}

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
                    ? 'border-transparent bg-[#6C4FFF] text-white' 
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
                      ? 'border-[#6C4FFF] bg-[#6C4FFF] text-white'
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
                <span>{sortBy === ' recent' ? 'Most Recent' : 'Oldest First'}</span>
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
                        <button className="flex items-center gap-1.5 font-medium text-[#6C4FFF] hover:text-[#5A3FE6] transition-colors">
                          <span className="material-symbols-outlined text-lg">thumb_up</span>
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center gap-1.5 font-medium text-gray-500 hover:text-[#6C4FFF] transition-colors">
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