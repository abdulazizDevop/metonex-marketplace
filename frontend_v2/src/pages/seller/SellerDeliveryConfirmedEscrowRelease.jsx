import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerDeliveryConfirmedEscrowRelease = () => {
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
    confirmationDate: '2024-01-20',
    buyer: {
      name: 'BuildCorp Ltd',
      company: 'BuildCorp Construction',
      contact: '+998 91 234 56 78',
      email: 'contact@buildcorp.uz'
    },
    escrowDetails: {
      amount: '$4,250',
      fees: '$42.50',
      netAmount: '$4,207.50',
      processingTime: '1-3 business days',
      referenceNumber: 'ESC-789456123'
    }
  });

  const [processingTime, setProcessingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProcessingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
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

  const handleViewTransaction = () => {
    // Navigate to transaction details
    navigate('/seller/transactions', {
      state: { orderId: orderData.id }
    });
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt...');
    // In real app, this would download the receipt
    alert('Kvitansiya yuklab olinmoqda...');
  };

  const handleNewOrder = () => {
    navigate('/seller/orders?tab=requests');
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
              <h1 className="text-lg font-semibold text-gray-900">To'lov jarayoni</h1>
              <p className="text-sm text-gray-500">Buyurtma ID: {orderData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-800">Yetkazib berish tasdiqlandi!</h2>
              <p className="text-green-700">Escrow to'lovi jarayoni boshlandi</p>
            </div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov summasi</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#6C4FFF] mb-2">
              {orderData.escrowDetails.amount}
            </div>
            <p className="text-sm text-gray-500">
              Sof summa (komissiyasiz): <span className="font-semibold">{orderData.escrowDetails.netAmount}</span>
            </p>
          </div>
        </div>

        {/* Processing Timer */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Jarayon vaqti</h3>
          <div className="text-center">
            <div className="text-2xl font-mono text-[#6C4FFF] mb-2">
              {formatTime(processingTime)}
            </div>
            <p className="text-sm text-gray-500">To'lov qayta ishlanmoqda</p>
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
              <span className="text-gray-600">Yetkazib berish sanasi:</span>
              <span className="font-medium">{orderData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasdiqlash sanasi:</span>
              <span className="font-medium">{orderData.confirmationDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa:</span>
              <span className="font-medium text-[#6C4FFF]">{orderData.escrowDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Komissiya:</span>
              <span className="font-medium text-red-600">-{orderData.escrowDetails.fees}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">Sof summa:</span>
              <span className="font-bold text-green-600">{orderData.escrowDetails.netAmount}</span>
            </div>
          </div>
        </div>

        {/* Escrow Details */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Escrow ma'lumotlari</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Qayta ishlash vaqti:</span>
              <span className="font-medium">{orderData.escrowDetails.processingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Referens raqami:</span>
              <span className="font-medium font-mono text-sm">{orderData.escrowDetails.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-[#6C4FFF]/10 text-[#6C4FFF] rounded-full text-sm font-medium">
                Qayta ishlanmoqda
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov jarayoni</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Buyurtma qabul qilindi</p>
                <p className="text-sm text-gray-500">{orderData.orderDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">To'lov qilindi</p>
                <p className="text-sm text-gray-500">Escrow hisobiga</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Yetkazib berildi</p>
                <p className="text-sm text-gray-500">{orderData.deliveryDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Tasdiqlandi</p>
                <p className="text-sm text-gray-500">{orderData.confirmationDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#6C4FFF] rounded-full flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-white text-sm">account_balance</span>
              </div>
              <div>
                <p className="font-medium text-[#6C4FFF]">To'lov o'tkazilmoqda</p>
                <p className="text-sm text-gray-500">1-3 ish kuni ichida</p>
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
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• To'lov 1-3 ish kuni ichida amalga oshiriladi</li>
                <li>• To'lov holati haqida xabar beriladi</li>
                <li>• Hisobingizga to'lov tushganda bildirishnoma yuboriladi</li>
                <li>• Kvitansiyani yuklab olishingiz mumkin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadReceipt}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Kvitansiyani yuklab olish
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleViewTransaction}
              className="flex-1 bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
            >
              Tranzaksiyani ko'rish
            </button>
            <button
              onClick={handleNewOrder}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Yangi buyurtma
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerDeliveryConfirmedEscrowRelease;
