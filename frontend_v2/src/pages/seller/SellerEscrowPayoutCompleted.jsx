import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerEscrowPayoutCompleted = () => {
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
    payoutDate: '2024-01-21',
    buyer: {
      name: 'BuildCorp Ltd',
      company: 'BuildCorp Construction',
      contact: '+998 91 234 56 78',
      email: 'contact@buildcorp.uz'
    },
    transactionDetails: {
      transactionId: 'TXN-2024-001234',
      amount: '$4,250.00',
      fees: '$42.50',
      netAmount: '$4,207.50',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'REF-789456123',
      bankAccount: '****1234'
    }
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleViewOrders = () => {
    navigate('/seller/orders');
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
              <h1 className="text-lg font-semibold text-gray-900">To'lov muvaffaqiyatli</h1>
              <p className="text-sm text-gray-500">Buyurtma ID: {orderData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Success Animation */}
        <div className="text-center py-8">
          <div className={`relative inline-block ${isAnimating ? 'animate-bounce' : ''}`}>
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
            </div>
            {/* Ripple effect */}
            <div className={`absolute inset-0 rounded-full border-4 border-green-300 ${isAnimating ? 'animate-ping' : ''}`}></div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
            To'lov muvaffaqiyatli!
          </h1>
          <p className="text-lg text-gray-600">
            Escrow to'lovi muvaffaqiyatli amalga oshirildi
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Jami to'lov summasi</p>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {orderData.transactionDetails.amount}
            </div>
            <p className="text-sm text-gray-500">
              Sof summa (komissiyasiz): <span className="font-semibold">{orderData.transactionDetails.netAmount}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="material-symbols-outlined text-green-500">account_balance</span>
            <span>Bankingizga o'tkazildi</span>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tranzaksiya xulosasi</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mahsulot</span>
              <span className="font-medium text-gray-900">{orderData.requestTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Xaridor</span>
              <span className="font-medium text-gray-900">{orderData.buyer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buyurtma sanasi</span>
              <span className="font-medium text-gray-900">{orderData.orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yetkazib berish sanasi</span>
              <span className="font-medium text-gray-900">{orderData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov sanasi</span>
              <span className="font-medium text-gray-900">{orderData.payoutDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov usuli</span>
              <span className="font-medium text-gray-900">{orderData.transactionDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank hisobi</span>
              <span className="font-medium text-gray-900">{orderData.transactionDetails.bankAccount}</span>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">To'lov tafsilotlari</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa</span>
              <span className="font-medium text-gray-900">{orderData.transactionDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform komissiyasi</span>
              <span className="font-medium text-red-600">-{orderData.transactionDetails.fees}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
              <span className="text-gray-900">Sof summa</span>
              <span className="text-green-600">{orderData.transactionDetails.netAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tranzaksiya ID</span>
              <span className="font-mono text-sm text-gray-900">{orderData.transactionDetails.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Referens raqami</span>
              <span className="font-mono text-sm text-gray-900">{orderData.transactionDetails.referenceNumber}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">To'lov jarayoni</h3>
          <div className="space-y-4">
            {[
              { status: 'completed', title: 'Buyurtma qabul qilindi', date: 'Jan 15, 2024', time: '10:30' },
              { status: 'completed', title: 'To\'lov xavfsiz saqlandi', date: 'Jan 15, 2024', time: '11:45' },
              { status: 'completed', title: 'Mahsulot yetkazib berildi', date: 'Jan 20, 2024', time: '14:15' },
              { status: 'completed', title: 'Yetkazib berish tasdiqlandi', date: 'Jan 20, 2024', time: '16:30' },
              { status: 'completed', title: 'To\'lov qayta ishlandi', date: 'Jan 21, 2024', time: '09:00' }
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <span className="material-symbols-outlined text-white text-sm">
                    {step.status === 'completed' ? 'check' : 'schedule'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.date} soat {step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-green-500 mt-0.5">celebration</span>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Tabriklaymiz!</h4>
              <p className="text-sm text-green-700">
                To'lovingiz muvaffaqiyatli qayta ishlandi va hisobingizga o'tkazildi. 
                Pul 1-2 ish kuni ichida ko'rinadi.
              </p>
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
          <button
            onClick={handleViewOrders}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Barcha buyurtmalarni ko'rish
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerEscrowPayoutCompleted;
