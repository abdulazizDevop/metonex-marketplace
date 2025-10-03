import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const FollowingPaymentsSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for payment
  const [paymentData] = useState(location.state?.paymentData || {
    id: 'PAY-002',
    orderId: 'ORD-001',
    amount: '$1,500',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-789456123',
    date: '2024-01-20',
    status: 'completed'
  });

  const handleViewOrder = () => {
    navigate(`/buyer/order/${paymentData.orderId}`);
  };

  const handleViewReceipt = () => {
    // Navigate to receipt page
    navigate('/buyer/receipt', {
      state: { paymentData }
    });
  };

  const handleBackToOrders = () => {
    navigate('/buyer/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">To'lov muvaffaqiyatli</h1>
            <button
              onClick={handleBackToOrders}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Success Icon */}
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-6xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            To'lov muvaffaqiyatli amalga oshirildi!
          </h2>
          <p className="text-gray-600">
            Keyingi to'lov muvaffaqiyatli qabul qilindi
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov ma'lumotlari</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov ID:</span>
              <span className="font-medium">{paymentData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buyurtma ID:</span>
              <span className="font-medium">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Summa:</span>
              <span className="font-bold text-[#6C4FFF] text-lg">{paymentData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov usuli:</span>
              <span className="font-medium">{paymentData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tranzaksiya ID:</span>
              <span className="font-medium text-sm">{paymentData.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sana:</span>
              <span className="font-medium">{paymentData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Holat:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Muvaffaqiyatli
              </span>
            </div>
          </div>
        </div>

        {/* Payment Timeline */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov jarayoni</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">To'lov yuborildi</p>
                <p className="text-xs text-gray-500">2024-01-20 14:30</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Bank tomonidan qabul qilindi</p>
                <p className="text-xs text-gray-500">2024-01-20 14:32</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sotuvchiga yetkazildi</p>
                <p className="text-xs text-gray-500">2024-01-20 14:35</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">To'lov tasdiqlandi</p>
                <p className="text-xs text-gray-500">2024-01-20 14:40</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Keyingi qadamlar</h4>
              <p className="text-sm text-blue-800">
                To'lov tasdiqlandi. Sotuvchi buyurtmani tayyorlashni boshlaydi. 
                Buyurtma holatini kuzatish sahifasidan kuzatishingiz mumkin.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewOrder}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Buyurtmani ko'rish
          </button>
          <button
            onClick={handleViewReceipt}
            className="w-full bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
          >
            Chekni ko'rish
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default FollowingPaymentsSuccess;
