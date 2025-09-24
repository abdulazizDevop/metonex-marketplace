import React, { useState } from 'react';

const AllSupplierOffers = () => {
  const [sortBy, setSortBy] = useState('price');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOffers, setSelectedOffers] = useState([]);

  const offers = [
    {
      id: 'OFF-001',
      supplierName: 'MetallTech Solutions',
      productType: 'Steel Beams',
      quantity: 50,
      unitPrice: 145.00,
      totalPrice: 7250.00,
      deliveryTime: '5 days',
      rating: 4.8,
      verified: true,
      status: 'pending',
      submittedAt: '2024-01-15 14:30',
      notes: 'Grade A steel with galvanized finish'
    },
    {
      id: 'OFF-002',
      supplierName: 'SteelWorks Ltd.',
      productType: 'Steel Beams',
      quantity: 50,
      unitPrice: 150.00,
      totalPrice: 7500.00,
      deliveryTime: '7 days',
      rating: 4.6,
      verified: true,
      status: 'pending',
      submittedAt: '2024-01-15 16:45',
      notes: 'Premium quality with 2-year warranty'
    },
    {
      id: 'OFF-003',
      supplierName: 'Premium Steel Corp.',
      productType: 'Steel Beams',
      quantity: 50,
      unitPrice: 140.00,
      totalPrice: 7000.00,
      deliveryTime: '4 days',
      rating: 4.9,
      verified: true,
      status: 'accepted',
      submittedAt: '2024-01-15 18:20',
      notes: 'Fastest delivery with quality guarantee'
    },
    {
      id: 'OFF-004',
      supplierName: 'Construction Materials Co.',
      productType: 'Steel Beams',
      quantity: 50,
      unitPrice: 155.00,
      totalPrice: 7750.00,
      deliveryTime: '10 days',
      rating: 4.4,
      verified: false,
      status: 'pending',
      submittedAt: '2024-01-16 09:15',
      notes: 'Standard quality, bulk discount available'
    }
  ];

  const filteredOffers = offers.filter(offer => 
    filterStatus === 'all' || offer.status === filterStatus
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.totalPrice - b.totalPrice;
      case 'delivery':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'rating':
        return b.rating - a.rating;
      case 'submitted':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      default:
        return 0;
    }
  });

  const handleOfferSelect = (offerId) => {
    setSelectedOffers(prev => 
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleAcceptOffer = (offerId) => {
    if (confirm('Bu taklifni qabul qilishni xohlaysizmi?')) {
      alert('Taklif qabul qilindi!');
    }
  };

  const handleRejectOffer = (offerId) => {
    if (confirm('Bu taklifni rad etishni xohlaysizmi?')) {
      alert('Taklif rad etildi!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Barcha Supplier Takliflari</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredOffers.length} ta taklif topildi
              </span>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <span className="material-symbols-outlined mr-2 text-sm">download</span>
                Export
              </button>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Saralash:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="price">Narx bo'yicha</option>
                <option value="delivery">Yetkazib berish bo'yicha</option>
                <option value="rating">Reyting bo'yicha</option>
                <option value="submitted">Vaqt bo'yicha</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Holat:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Barchasi</option>
                <option value="pending">Kutilmoqda</option>
                <option value="accepted">Qabul qilingan</option>
                <option value="rejected">Rad etilgan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
                selectedOffers.includes(offer.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${offer.status === 'accepted' ? 'border-green-500 bg-green-50' : ''}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedOffers.includes(offer.id)}
                      onChange={() => handleOfferSelect(offer.id)}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{offer.supplierName}</h3>
                        {offer.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            ✓ Tasdiqlangan
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.status === 'accepted' ? 'Qabul qilingan' :
                           offer.status === 'rejected' ? 'Rad etilgan' : 'Kutilmoqda'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Mahsulot:</p>
                          <p className="font-medium text-gray-900">{offer.productType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Miqdor:</p>
                          <p className="font-medium text-gray-900">{offer.quantity} dona</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Birlik narxi:</p>
                          <p className="font-medium text-gray-900">${offer.unitPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Jami narx:</p>
                          <p className="font-bold text-green-600 text-lg">${offer.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-blue-500 mr-2 text-sm">
                            schedule
                          </span>
                          <span className="text-sm text-gray-600">Yetkazib berish:</span>
                          <span className="font-medium text-gray-900 ml-1">{offer.deliveryTime}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-yellow-500 mr-2 text-sm">
                            star
                          </span>
                          <span className="text-sm text-gray-600">Reyting:</span>
                          <span className="font-medium text-gray-900 ml-1">{offer.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-gray-500 mr-2 text-sm">
                            access_time
                          </span>
                          <span className="text-sm text-gray-600">Yuborilgan:</span>
                          <span className="font-medium text-gray-900 ml-1">{offer.submittedAt}</span>
                        </div>
                      </div>

                      {offer.notes && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 mb-1">Izoh:</p>
                          <p className="text-sm text-gray-900">{offer.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {offer.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined mr-1 text-sm">check</span>
                          Qabul qilish
                        </button>
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined mr-1 text-sm">close</span>
                          Rad etish
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <span className="material-symbols-outlined mr-1 text-sm">message</span>
                      Xabar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedOffers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="text-purple-600 font-medium">
                  {selectedOffers.length} ta taklif tanlandi
                </span>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <span className="material-symbols-outlined mr-2 text-sm">check</span>
                  Barchasini qabul qilish
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <span className="material-symbols-outlined mr-2 text-sm">close</span>
                  Barchasini rad etish
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined mr-2 text-sm">download</span>
                  Tanlanganlarni export qilish
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredOffers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">
              assignment
            </span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hech qanday taklif topilmadi
            </h3>
            <p className="text-gray-600">
              Filterlarni o'zgartirib ko'ring yoki barcha filterlarni tozalang.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSupplierOffers;