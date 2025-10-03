import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerWaitingForBuyerPayment = () => {
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
    estimatedPaymentTime: '2-3 business days',
    buyer: {
      name: 'BuildCorp Ltd',
      company: 'BuildCorp Construction',
      contact: '+998 91 234 56 78',
      email: 'contact@buildcorp.uz'
    },
    paymentMethod: 'Bank Transfer',
    contractSent: true,
    contractUrl: '/contracts/contract-001.pdf'
  });

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show reminder after 5 minutes
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 300000); // 5 minutes

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
    console.log('Sending payment reminder to buyer...');
    setShowReminder(false);
    // In real app, this would send a reminder
    alert('Xaridorga eslatma yuborildi');
  };

  const handleContactBuyer = () => {
    window.open(`tel:${orderData.buyer.contact}`);
  };

  const handleEmailBuyer = () => {
    window.open(`mailto:${orderData.buyer.email}`);
  };

  const handleViewContract = () => {
    // Navigate to contract view
    navigate('/seller/contract-view', {
      state: { contractData: orderData }
    });
  };

  const handleCancelOrder = () => {
    if (window.confirm('Buyurtmani bekor qilmoqchimisiz?')) {
      console.log('Cancelling order...');
      // In real app, this would cancel the order
      navigate(`/seller/orders?tab=${returnTab}`);
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
              <h1 className="text-lg font-semibold text-gray-900">To'lov kutilmoqda</h1>
              <p className="text-sm text-gray-500">Buyurtma ID: {orderData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Status Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">schedule</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-yellow-800">To'lov kutilmoqda</h2>
              <p className="text-yellow-700">Xaridor to'lovni amalga oshirishini kutamiz</p>
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
              <span className="text-gray-600">To'lov usuli:</span>
              <span className="font-medium">{orderData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buyurtma sanasi:</span>
              <span className="font-medium">{orderData.orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kutilayotgan vaqt:</span>
              <span className="font-medium">{orderData.estimatedPaymentTime}</span>
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
            <p className="text-sm text-gray-500">To'lov kutilayotgan vaqt</p>
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
                <p className="font-medium text-gray-900">Shartnoma yuborildi</p>
                <p className="text-sm text-gray-500">Xaridor shartnomani olgan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#6C4FFF] rounded-full flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-white text-sm">payment</span>
              </div>
              <div>
                <p className="font-medium text-[#6C4FFF]">To'lov kutilmoqda</p>
                <p className="text-sm text-gray-500">Xaridor to'lovni amalga oshiradi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-500 text-sm">inventory_2</span>
              </div>
              <div>
                <p className="font-medium text-gray-500">Tayyorlash</p>
                <p className="text-sm text-gray-500">To'lovdan keyin boshlanadi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Banner */}
        {showReminder && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">info</span>
              <div className="flex-1">
                <p className="text-blue-800 font-medium">To'lov kutilgandan ko'proq vaqt ketmoqdami?</p>
                <p className="text-blue-700 text-sm">Xaridorga eslatma yuborishingiz mumkin</p>
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
            onClick={handleViewContract}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Shartnomani ko'rish
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleContactBuyer}
              className="flex-1 bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
            >
              Qo'ng'iroq qilish
            </button>
            <button
              onClick={handleEmailBuyer}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Email yuborish
            </button>
          </div>
          <button
            onClick={handleCancelOrder}
            className="w-full bg-white text-red-600 py-3 px-4 rounded-lg border border-red-300 hover:bg-red-50 transition-colors font-medium"
          >
            Buyurtmani bekor qilish
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerWaitingForBuyerPayment;
