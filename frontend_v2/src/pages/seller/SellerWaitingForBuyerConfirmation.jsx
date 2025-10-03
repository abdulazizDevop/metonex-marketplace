import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerWaitingForBuyerConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'orders';

  // Mock data for order
  const [orderData] = useState(location.state?.orderData || {
    id: id,
    requestTitle: 'Concrete Mix C25, 50 m³',
    totalAmount: '$4,250',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    buyer: {
      name: 'BuildCorp Ltd',
      company: 'BuildCorp Construction',
      contact: '+998 91 234 56 78',
      email: 'contact@buildcorp.uz'
    },
    deliveryAddress: 'Samarqand shahar, Registon ko\'chasi, 15-uy',
    driver: {
      name: 'Akmal Karimov',
      phone: '+998 90 123 45 67',
      vehicle: 'Kamaz-5320 (A123BC)'
    },
    estimatedConfirmationTime: '24 hours'
  });

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show reminder after 2 hours
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 7200000); // 2 hours

    return () => {
      clearInterval(timer);
      clearTimeout(reminderTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate(`/seller/order-details/${id}`, {
      state: { returnTab }
    });
  };

  const handleSendReminder = () => {
    console.log('Sending delivery confirmation reminder to buyer...');
    setShowReminder(false);
    // In real app, this would send a reminder
    alert('Xaridorga yetkazib berish tasdiqlash eslatmasi yuborildi');
  };

  const handleContactBuyer = () => {
    window.open(`tel:${orderData.buyer.contact}`);
  };

  const handleEmailBuyer = () => {
    window.open(`mailto:${orderData.buyer.email}`);
  };

  const handleContactDriver = () => {
    window.open(`tel:${orderData.driver.phone}`);
  };

  const handleViewDeliveryDetails = () => {
    // Navigate to delivery details
    navigate(`/seller/order-tracking/${id}`, {
      state: { returnTab, orderData }
    });
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
              <h1 className="text-lg font-semibold text-gray-900">Yetkazib berish tasdiqlanishi kutilmoqda</h1>
              <p className="text-sm text-gray-500">Buyurtma ID: {orderData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">local_shipping</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-800">Yetkazib berildi</h2>
              <p className="text-blue-700">Xaridor yetkazib berishni tasdiqlashini kutamiz</p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyurtma ma'lumotlari</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Mahsulot:</span>
              <span className="font-medium">{orderData.requestTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Xaridor:</span>
              <span className="font-medium">{orderData.buyer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa:</span>
              <span className="font-medium text-[#6C4FFF]">{orderData.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yetkazib berish sanasi:</span>
              <span className="font-medium">{orderData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kutilayotgan vaqt:</span>
              <span className="font-medium">{orderData.estimatedConfirmationTime}</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Kutilayotgan vaqt</h3>
          <div className="text-center">
            <div className="text-3xl font-mono text-[#6C4FFF] mb-2">
              {formatTime(timeElapsed)}
            </div>
            <p className="text-sm text-gray-500">Tasdiqlash kutilayotgan vaqt</p>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib berish ma'lumotlari</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Manzil:</span>
              <span className="font-medium text-right">{orderData.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Haydovchi:</span>
              <span className="font-medium">{orderData.driver.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transport:</span>
              <span className="font-medium">{orderData.driver.vehicle}</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Jarayon holati</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">To'lov qilindi</p>
                <p className="text-sm text-gray-500">Xaridor to'lovni amalga oshirdi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Tayyorlandi</p>
                <p className="text-sm text-gray-500">Mahsulot tayyorlandi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Yetkazib berildi</p>
                <p className="text-sm text-gray-500">Mahsulot yetkazib berildi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#6C4FFF] rounded-full flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-white text-sm">task_alt</span>
              </div>
              <div>
                <p className="font-medium text-[#6C4FFF]">Tasdiqlanishi kutilmoqda</p>
                <p className="text-sm text-gray-500">Xaridor tasdiqlashini kutamiz</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-500 text-sm">account_balance</span>
              </div>
              <div>
                <p className="font-medium text-gray-500">To'lov o'tkaziladi</p>
                <p className="text-sm text-gray-500">Tasdiqlangandan keyin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Banner */}
        {showReminder && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-600">info</span>
              <div className="flex-1">
                <p className="text-orange-800 font-medium">Tasdiqlash kutilgandan ko'proq vaqt ketmoqdami?</p>
                <p className="text-orange-700 text-sm">Xaridorga eslatma yuborishingiz mumkin</p>
              </div>
              <button
                onClick={handleSendReminder}
                className="px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm"
              >
                Eslatma yuborish
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleViewDeliveryDetails}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Yetkazib berish tafsilotlarini ko'rish
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleContactBuyer}
              className="flex-1 bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
            >
              Xaridorga qo'ng'iroq
            </button>
            <button
              onClick={handleContactDriver}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Haydovchiga qo'ng'iroq
            </button>
          </div>
          <button
            onClick={handleEmailBuyer}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Xaridorga email yuborish
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerWaitingForBuyerConfirmation;
