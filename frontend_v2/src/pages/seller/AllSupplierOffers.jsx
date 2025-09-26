import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AllSupplierOffers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, approved, rejected, counter-offer
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [showBestPriceAlert, setShowBestPriceAlert] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // URL dan request ID ni olish
  const requestId = location.state?.requestId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    // Har doim mock ma'lumotlarni yuklaymiz
    fetchRequestAndOffers();
  }, [requestId]);

  useEffect(() => {
    filterOffers();
  }, [offers, filter]);

  const fetchRequestAndOffers = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Mock request data
      setRequestData({
        id: requestId || 'REQ-001',
        title: 'Concrete Mix',
        quantity: '50 tons',
        deadline: '2024-08-15',
        specifications: 'High-grade concrete mix for foundation work'
      });

      // Mock offers data
      setOffers([
        {
          id: 'offer_1',
          supplierId: '12345',
          supplierName: 'Toshkent Qurilish Materiallari',
          status: 'rejected',
          statusText: 'Rad etilgan',
          price: 500000,
          deliveryTime: 3,
          reason: 'Zaxira tugagan',
          rejectedAt: '2024-08-10T10:30:00',
          alternativeSuppliers: ['67890', '11223']
        },
        {
          id: 'offer_2',
          supplierId: '67890',
          supplierName: 'Samarqand Qurilish',
          status: 'approved',
          statusText: 'Tasdiqlangan',
          price: 500000,
          deliveryTime: 3,
          approvedAt: '2024-08-10T14:20:00',
          isBestPrice: true,
          paymentMethod: 'Bank Transfer'
        },
        {
          id: 'offer_3',
          supplierId: '54321',
          supplierName: 'Premium Materials Co.',
          status: 'counter-offer',
          statusText: 'Qarshi taklif',
          originalPrice: 600000,
          counterPrice: 600000,
          deliveryTime: 5,
          counterOfferDetails: 'Qisman hozir, qolgani ertaga',
          counterOfferAt: '2024-08-10T16:45:00',
          originalOfferAt: '2024-08-10T12:00:00'
        },
        {
          id: 'offer_4',
          supplierId: '98765',
          supplierName: 'Fast Delivery Co.',
          status: 'pending',
          statusText: 'Kutilmoqda',
          price: 450000,
          deliveryTime: 2,
          submittedAt: '2024-08-10T18:00:00',
          isBestPrice: false
        }
      ]);
      
      setError(null);
      setLoading(false);
    }, 1000); // 1 second loading simulation
  };

  const filterOffers = () => {
    let filtered = [...offers];

    if (filter !== 'all') {
      filtered = filtered.filter(offer => offer.status === filter);
    }

    // Sort by status priority and price
    filtered.sort((a, b) => {
      const statusPriority = { 'approved': 1, 'counter-offer': 2, 'pending': 3, 'rejected': 4 };
      const aPriority = statusPriority[a.status] || 5;
      const bPriority = statusPriority[b.status] || 5;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return a.price - b.price;
    });

    setFilteredOffers(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handlePayOffer = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      navigate(`/buyer/offer-payment/${offerId}`, {
        state: { 
          offer,
          requestData
        }
      });
    }
  };

  const handleRejectOffer = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer?.isBestPrice) {
      setSelectedOffer(offer);
      setShowBestPriceAlert(true);
      return;
    }

    // Mock success
    setOffers(prev => prev.map(o => 
      o.id === offerId 
        ? { ...o, status: 'rejected', statusText: 'Rad etilgan' }
        : o
    ));
  };

  const handleAcceptCounterOffer = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      navigate(`/buyer/accept-counter-offer/${offerId}`, {
        state: { 
          offer,
          requestData
        }
      });
    }
  };

  const handleRejectCounterOffer = (offerId) => {
    // Mock success - auto-send to next supplier
    setOffers(prev => prev.map(o => 
      o.id === offerId 
        ? { ...o, status: 'rejected', statusText: 'Rad etilgan' }
        : o
    ));
  };

  const handleSendToAlternativeSupplier = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer?.alternativeSuppliers?.length > 0) {
      navigate(`/buyer/send-to-alternative-supplier/${offerId}`, {
        state: { 
          offer,
          requestData,
          alternativeSuppliers: offer.alternativeSuppliers
        }
      });
    }
  };

  const handleConfirmReject = () => {
    if (selectedOffer) {
      handleRejectOffer(selectedOffer.id);
    }
    setShowBestPriceAlert(false);
    setSelectedOffer(null);
  };

  const handleCancelReject = () => {
    setShowBestPriceAlert(false);
    setSelectedOffer(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full';
      case 'rejected':
        return 'px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full';
      case 'counter-offer':
        return 'px-2 py-1 text-xs font-medium text-gray-800 bg-yellow-300 rounded-full';
      case 'pending':
        return 'px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full';
      default:
        return 'px-2 py-1 text-xs font-medium text-white bg-gray-500 rounded-full';
    }
  };

  const getFilterButtonClass = (filterType) => {
    return `px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
      filter === filterType
        ? 'bg-purple-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
            error
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Xatolik</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-20 border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-center text-gray-900">
            Yetkazib beruvchi takliflari
          </h1>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-2">
          <button 
            onClick={() => handleFilterChange('all')}
            className={getFilterButtonClass('all')}
          >
            Barchasi
          </button>
          <button 
            onClick={() => handleFilterChange('approved')}
            className={getFilterButtonClass('approved')}
          >
            Tasdiqlangan
          </button>
          <button 
            onClick={() => handleFilterChange('counter-offer')}
            className={getFilterButtonClass('counter-offer')}
          >
            Qarshi taklif
          </button>
          <button 
            onClick={() => handleFilterChange('pending')}
            className={getFilterButtonClass('pending')}
          >
            Kutilmoqda
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              assignment_turned_in
            </span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Takliflar topilmadi
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Hozircha takliflar yo\'q'
                : `${filter} holatidagi takliflar yo'q`
              }
            </p>
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex flex-col">
                <span className={getStatusBadgeClass(offer.status)}>
                  {offer.statusText}
                </span>
                
                <h2 className="mt-3 text-lg font-semibold text-gray-900">
                  Yetkazib beruvchi #{offer.supplierId}
                </h2>
                <p className="text-sm text-gray-600">{offer.supplierName}</p>

                {/* Price Display */}
                {offer.status === 'counter-offer' ? (
                  <div className="flex items-baseline justify-between mt-2">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(offer.counterPrice)}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        Asl: {formatCurrency(offer.originalPrice)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Yetkazib berish: {offer.deliveryTime} kun
                    </p>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-4xl font-bold text-gray-900">
                      {formatCurrency(offer.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Yetkazib berish: {offer.deliveryTime} kun
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                {offer.reason && (
                  <p className="mt-1 text-sm text-red-600">
                    Sabab: {offer.reason}
                  </p>
                )}

                {offer.counterOfferDetails && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-400 rounded-lg">
                    <p className="text-sm text-gray-800">
                      {offer.counterOfferDetails}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="mt-2 text-xs text-gray-500">
                  {offer.status === 'counter-offer' && (
                    <p>Qarshi taklif: {formatDate(offer.counterOfferAt)}</p>
                  )}
                  {offer.status === 'approved' && (
                    <p>Tasdiqlangan: {formatDate(offer.approvedAt)}</p>
                  )}
                  {offer.status === 'rejected' && (
                    <p>Rad etilgan: {formatDate(offer.rejectedAt)}</p>
                  )}
                  {offer.status === 'pending' && (
                    <p>Yuborilgan: {formatDate(offer.submittedAt)}</p>
                  )}
                </div>

                {/* Action Buttons */}
                {offer.status === 'approved' && (
                  <div className="mt-4 space-y-2">
                    <button 
                      onClick={() => handlePayOffer(offer.id)}
                      className="w-full py-3 text-base font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      To'lash
                    </button>
                    <button 
                      onClick={() => handleRejectOffer(offer.id)}
                      className="w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Rad etish
                    </button>
                  </div>
                )}

                {offer.status === 'counter-offer' && (
                  <div className="mt-4 space-y-3">
                    <button 
                      onClick={() => handleAcceptCounterOffer(offer.id)}
                      className="w-full py-3 text-base font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Qabul qilish
                    </button>
                    <button 
                      onClick={() => handleRejectCounterOffer(offer.id)}
                      className="w-full py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Rad etish va avtomatik yuborish
                    </button>
                  </div>
                )}

                {offer.status === 'rejected' && offer.alternativeSuppliers?.length > 0 && (
                  <button 
                    onClick={() => handleSendToAlternativeSupplier(offer.id)}
                    className="w-full py-3 mt-4 text-base font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    {offer.alternativeSuppliers.length} ta alternativ yetkazib beruvchiga yuborish
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Best Price Alert Modal */}
      {showBestPriceAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 p-6 bg-white rounded-2xl shadow-xl w-full max-w-sm text-center">
            <div className="flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-500 text-3xl mr-2">warning</span>
              <h2 className="text-lg font-bold text-gray-900">Eng yaxshi narx ogohlantirishi</h2>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Bu hozir mavjud bo'lgan eng yaxshi narx. Rad etish loyihangizni kechiktirishi mumkin.
            </p>
            <div className="mt-6 flex justify-between gap-3">
              <button 
                onClick={handleCancelReject}
                className="flex-1 py-2.5 text-base font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 text-base font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Baribir rad etish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSupplierOffers;
