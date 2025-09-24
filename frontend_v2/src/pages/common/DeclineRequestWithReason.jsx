import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeclineRequestWithReason = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestDetails = {
    requestId: 'REQ-2024-001',
    buyerName: 'BuildCo Ltd.',
    productType: 'Steel Beams',
    quantity: 50,
    requestedPrice: 7500.00,
    deadline: '2024-01-25'
  };

  const declineReasons = [
    {
      id: 'price_too_low',
      label: 'Narx juda past',
      description: 'Taklif etilgan narx bizning standart narxlarimizdan past'
    },
    {
      id: 'insufficient_quantity',
      label: 'Miqdor yetarli emas',
      description: 'So\'ralgan miqdor bizning minimum buyurtma talablariga javob bermaydi'
    },
    {
      id: 'short_deadline',
      label: 'Muddat juda qisqa',
      description: 'Yetkazib berish muddati bizning ishlab chiqarish rejalarimizga mos kelmaydi'
    },
    {
      id: 'product_unavailable',
      label: 'Mahsulot mavjud emas',
      description: 'Hozircha so\'ralgan mahsulotimiz mavjud emas'
    },
    {
      id: 'quality_requirements',
      label: 'Sifat talablari',
      description: 'Buyerning sifat talablari bizning mahsulotlarimiz bilan mos kelmaydi'
    },
    {
      id: 'location_issue',
      label: 'Yetkazib berish muammosi',
      description: 'Yetkazib berish manzili bizning xizmat ko\'rsatish hududimizdan tashqarida'
    },
    {
      id: 'custom',
      label: 'Boshqa sabab',
      description: 'Boshqa sababni ko\'rsating'
    }
  ];

  const handleReasonSelect = (reasonId) => {
    setSelectedReason(reasonId);
    if (reasonId !== 'custom') {
      setCustomReason('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert('Iltimos, rad etish sababini tanlang');
      return;
    }

    if (selectedReason === 'custom' && !customReason.trim()) {
      alert('Iltimos, maxsus sababni yozing');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('So\'rov rad etildi va buyerga xabar yuborildi');
      navigate('/supplier/requests');
    }, 1500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">So'rovni Rad Etish</h1>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
              Rad etish
            </span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="material-symbols-outlined text-yellow-600 mr-3 mt-0.5">
                warning
              </span>
              <div>
                <h3 className="text-yellow-800 font-medium">Ogohlantirish</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  So'rovni rad etgandan so'ng, uni qaytarib bo'lmaydi. Buyer avtomatik ravishda xabar oladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">So'rov Tafsilotlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">So'rov ID:</p>
              <p className="font-medium text-gray-900">#{requestDetails.requestId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Buyer:</p>
              <p className="font-medium text-gray-900">{requestDetails.buyerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mahsulot:</p>
              <p className="font-medium text-gray-900">{requestDetails.productType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Miqdor:</p>
              <p className="font-medium text-gray-900">{requestDetails.quantity} dona</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taklif etilgan narx:</p>
              <p className="font-medium text-gray-900">${requestDetails.requestedPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Muddat:</p>
              <p className="font-medium text-gray-900">{requestDetails.deadline}</p>
            </div>
          </div>
        </div>

        {/* Decline Reason Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rad Etish Sababi</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {declineReasons.map((reason) => (
                <div
                  key={reason.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReason === reason.id
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleReasonSelect(reason.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id={reason.id}
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={() => handleReasonSelect(reason.id)}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <div className="ml-3 flex-1">
                      <label htmlFor={reason.id} className="block">
                        <span className="font-medium text-gray-900">{reason.label}</span>
                        <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedReason === 'custom' && (
              <div className="mb-6">
                <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Maxsus sabab
                </label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Rad etish sababini batafsil yozing..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bu xabar buyerga yuboriladi. Professional va hurmatli bo'ling.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !selectedReason}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined mr-2 animate-spin text-sm">refresh</span>
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2 text-sm">close</span>
                    So'rovni Rad Etish
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <span className="material-symbols-outlined text-blue-600 mr-3 mt-0.5">
              info
            </span>
            <div>
              <h3 className="text-blue-800 font-medium">Qo'shimcha Ma'lumot</h3>
              <p className="text-blue-700 text-sm mt-1">
                So'rovni rad etgandan so'ng, buyer boshqa supplierlar tomonidan yuborilgan takliflarni ko'ra oladi. 
                Siz ham kelajakda shunga o'xshash so'rovlar uchun taklif yuborishingiz mumkin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclineRequestWithReason;
