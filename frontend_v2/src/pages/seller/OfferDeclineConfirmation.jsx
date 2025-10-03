import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const OfferDeclineConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const userRole = location.state?.userRole || 'buyer'; // 'buyer' or 'seller'
  const returnTab = location.state?.returnTab || 'offers';
  const offerData = location.state?.offerData;

  // Mock data for offer
  const [offer] = useState(offerData || {
    id: id,
    requestTitle: 'Concrete Mix C25, 50 m³',
    supplier: 'SteelCorp Ltd',
    buyer: 'BuildCorp Ltd',
    price: '$4,250',
    deliveryDate: '2024-01-20',
    status: 'pending',
    createdDate: '2024-01-15'
  });

  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Different reasons based on user role
  const getDeclineReasons = () => {
    if (userRole === 'buyer') {
      return [
        {
          id: 'price_high',
          title: 'Narx juda yuqori',
          description: 'Taklif qilingan narx bizning byudjetimizdan yuqori'
        },
        {
          id: 'delivery_time',
          title: 'Yetkazib berish vaqti mos kelmaydi',
          description: 'Belgilangan vaqtda yetkazib berish imkoniyati yo\'q'
        },
        {
          id: 'quality_concerns',
          title: 'Sifat haqida shubha',
          description: 'Mahsulot sifatiga ishonch hosil qila olmaymiz'
        },
        {
          id: 'supplier_reputation',
          title: 'Yetkazib beruvchi obro\'si',
          description: 'Yetkazib beruvchi haqida yetarli ma\'lumot yo\'q'
        },
        {
          id: 'payment_terms',
          title: 'To\'lov shartlari mos kelmaydi',
          description: 'Taklif qilingan to\'lov shartlari bizga mos kelmaydi'
        },
        {
          id: 'other',
          title: 'Boshqa sabab',
          description: 'Yuqoridagilardan boshqa sabab'
        }
      ];
    } else {
      // Seller declining buyer's counter offer
      return [
        {
          id: 'price_low',
          title: 'Narx juda past',
          description: 'Taklif qilingan narx bizning narxlarimizdan past'
        },
        {
          id: 'quantity_insufficient',
          title: 'Miqdor yetarli emas',
          description: 'Taklif qilingan miqdor bizning minimal talablarimizdan kam'
        },
        {
          id: 'delivery_constraints',
          title: 'Yetkazib berish cheklovlari',
          description: 'Belgilangan joyga yetkazib berish imkoniyati yo\'q'
        },
        {
          id: 'timeline_issues',
          title: 'Vaqt muammolari',
          description: 'Belgilangan muddatda bajarish imkoniyati yo\'q'
        },
        {
          id: 'payment_terms',
          title: 'To\'lov shartlari mos kelmaydi',
          description: 'Taklif qilingan to\'lov shartlari bizga mos kelmaydi'
        },
        {
          id: 'other',
          title: 'Boshqa sabab',
          description: 'Yuqoridagilardan boshqa sabab'
        }
      ];
    }
  };

  const declineReasons = getDeclineReasons();

  const handleBack = () => {
    if (userRole === 'buyer') {
      navigate(`/buyer/offer-details/${id}`, {
        state: { returnTab }
      });
    } else {
      navigate(`/seller/offer-details/${id}`, {
        state: { returnTab }
      });
    }
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

      console.log('Offer declined:', {
        offerId: id,
        userRole: userRole,
        reason: reason,
        timestamp: new Date().toISOString()
      });

      // Navigate back with success message
      if (userRole === 'buyer') {
        navigate(`/buyer/orders?tab=${returnTab}`, {
          state: { 
            message: 'Taklif muvaffaqiyatli rad etildi',
            type: 'success'
          }
        });
      } else {
        navigate(`/seller/orders?tab=${returnTab}`, {
          state: { 
            message: 'Qarshi taklif muvaffaqiyatli rad etildi',
            type: 'success'
          }
        });
      }

    } catch (error) {
      console.error('Error declining offer:', error);
      alert('Taklifni rad etishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPageTitle = () => {
    if (userRole === 'buyer') {
      return 'Taklifni rad etish';
    } else {
      return 'Qarshi taklifni rad etish';
    }
  };

  const getPageDescription = () => {
    if (userRole === 'buyer') {
      return 'Yetkazib beruvchining taklifini rad etish';
    } else {
      return 'Xaridorning qarshi taklifini rad etish';
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
              <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-500">{getPageDescription()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Offer Summary */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Taklif xulosasi</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Mahsulot:</span>
              <span className="font-medium">{offer.requestTitle}</span>
            </div>
            {userRole === 'buyer' ? (
              <div className="flex justify-between">
                <span className="text-gray-600">Yetkazib beruvchi:</span>
                <span className="font-medium">{offer.supplier}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-gray-600">Xaridor:</span>
                <span className="font-medium">{offer.buyer}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Narx:</span>
              <span className="font-medium text-[#6C4FFF]">{offer.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yetkazib berish sanasi:</span>
              <span className="font-medium">{offer.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yaratilgan:</span>
              <span className="font-medium">{offer.createdDate}</span>
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
                {userRole === 'buyer' 
                  ? 'Taklifni rad etgach, uni qayta tiklash imkoniyati bo\'lmaydi. Iltimos, sababni diqqat bilan tanlang.'
                  : 'Qarshi taklifni rad etgach, xaridor avtomatik ravishda keyingi yetkazib beruvchiga yo\'naltiriladi.'
                }
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
              userRole === 'buyer' ? 'Taklifni rad etish' : 'Qarshi taklifni rad etish'
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
                {userRole === 'buyer' 
                  ? 'Taklifni rad etgach, yetkazib beruvchiga avtomatik xabar yuboriladi. Agar keyinchalik fikringizni o\'zgartirsangiz, yetkazib beruvchi bilan to\'g\'ridan-to\'g\'ri bog\'lanishingiz mumkin.'
                  : 'Qarshi taklifni rad etgach, xaridor avtomatik ravishda keyingi yetkazib beruvchiga yo\'naltiriladi va sizga xabar yuboriladi.'
                }
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

export default OfferDeclineConfirmation;