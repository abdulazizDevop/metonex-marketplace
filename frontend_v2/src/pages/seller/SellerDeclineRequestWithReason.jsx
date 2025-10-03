import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerDeclineRequestWithReason = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'requests';

  // Mock data for request
  const [requestData] = useState(location.state?.requestData || {
    id: id,
    title: 'Concrete Mix C25, 50 m³',
    buyer: 'BuildCorp Ltd',
    requestedDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    budget: '$4,000 - $5,000',
    location: 'Samarqand shahar',
    description: 'High-quality concrete mix for construction project. Need delivery within 5 days.',
    specifications: [
      'Grade: C25',
      'Quantity: 50 m³',
      'Delivery: Within 5 days',
      'Quality: Premium'
    ]
  });

  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const declineReasons = [
    {
      id: 'capacity',
      title: 'Ish hajmi yetarli emas',
      description: 'Hozirgi vaqtda bunday hajmdagi buyurtmani bajarish imkoniyati yo\'q'
    },
    {
      id: 'timeline',
      title: 'Vaqt yetarli emas',
      description: 'Belgilangan muddatda yetkazib berish imkoniyati yo\'q'
    },
    {
      id: 'location',
      title: 'Yetkazib berish joyi uzoq',
      description: 'Belgilangan joyga yetkazib berish xizmati mavjud emas'
    },
    {
      id: 'price',
      title: 'Narx mos kelmaydi',
      description: 'Xaridorning taklif qilgan narx bizning narxlarimizga mos kelmaydi'
    },
    {
      id: 'quality',
      title: 'Sifat talablari yuqori',
      description: 'So\'ralgan sifat darajasini ta\'minlay olmaymiz'
    },
    {
      id: 'other',
      title: 'Boshqa sabab',
      description: 'Yuqoridagilardan boshqa sabab'
    }
  ];

  const handleBack = () => {
    navigate(`/seller/request-details/${id}`, {
      state: { returnTab }
    });
  };

  const handleReasonSelect = (reasonId) => {
    setSelectedReason(reasonId);
    if (reasonId !== 'other') {
      setCustomReason('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('Iltimos, rad etish sababini tanlang');
      return;
    }

    if (selectedReason === 'other' && !customReason.trim()) {
      alert('Iltimos, boshqa sababni batafsil yozing');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reason = selectedReason === 'other' 
        ? customReason 
        : declineReasons.find(r => r.id === selectedReason)?.title;

      console.log('Request declined:', {
        requestId: id,
        reason: reason,
        timestamp: new Date().toISOString()
      });

      // Navigate back to requests with success message
      navigate(`/seller/orders?tab=${returnTab}`, {
        state: { 
          message: 'So\'rov muvaffaqiyatli rad etildi',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h1 className="text-lg font-semibold text-gray-900">So'rovni rad etish</h1>
              <p className="text-sm text-gray-500">So'rov ID: {requestData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Request Summary */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">So'rov xulosasi</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Mahsulot:</span>
              <span className="font-medium">{requestData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Xaridor:</span>
              <span className="font-medium">{requestData.buyer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Byudjet:</span>
              <span className="font-medium text-[#6C4FFF]">{requestData.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yetkazib berish sanasi:</span>
              <span className="font-medium">{requestData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Joylashuv:</span>
              <span className="font-medium">{requestData.location}</span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="material-symbols-outlined text-red-600 mr-3 mt-0.5">
              warning
            </span>
            <div>
              <h4 className="text-red-800 font-medium">Diqqat!</h4>
              <p className="text-red-700 text-sm mt-1">
                So'rovni rad etgach, uni qayta tiklash imkoniyati bo'lmaydi. 
                Iltimos, sababni diqqat bilan tanlang.
              </p>
            </div>
          </div>
        </div>

        {/* Decline Reasons */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rad etish sababi</h3>
          <div className="space-y-3">
            {declineReasons.map((reason) => (
              <label
                key={reason.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedReason === reason.id
                    ? 'border-[#6C4FFF] bg-[#6C4FFF]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => handleReasonSelect(reason.id)}
                    className="mt-1 mr-3 text-[#6C4FFF] focus:ring-[#6C4FFF]"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{reason.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Reason Input */}
        {selectedReason === 'other' && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Boshqa sabab</h3>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Rad etish sababini batafsil yozing..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-2">
              {customReason.length}/500 belgi
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedReason || (selectedReason === 'other' && !customReason.trim())}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Rad etilmoqda...
              </div>
            ) : (
              'So\'rovni rad etish'
            )}
          </button>
          
          <button
            onClick={handleBack}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Bekor qilish
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="material-symbols-outlined text-blue-600 mr-3 mt-0.5">
              info
            </span>
            <div>
              <h4 className="text-blue-800 font-medium">Ma'lumot</h4>
              <p className="text-blue-700 text-sm mt-1">
                So'rovni rad etgach, xaridorga avtomatik xabar yuboriladi. 
                Agar keyinchalik fikringizni o'zgartirsangiz, xaridor bilan to'g'ridan-to'g'ri bog'lanishingiz mumkin.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerDeclineRequestWithReason;
