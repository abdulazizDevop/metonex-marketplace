import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const FirstOrderCongratulations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for first order
  const [orderData] = useState(location.state?.orderData || {
    id: 'ORD-001',
    title: 'Concrete Mix C25, 50 m³',
    totalAmount: '$4,250',
    supplier: 'SteelCorp Ltd',
    orderDate: '2024-01-15',
    estimatedDelivery: '2024-01-22'
  });

  const handleViewOrder = () => {
    navigate(`/buyer/order/${orderData.id}`);
  };

  const handleTrackOrder = () => {
    navigate(`/buyer/order-tracking/${orderData.id}`);
  };

  const handleBackToHome = () => {
    navigate('/buyer/home');
  };

  const handleExploreProducts = () => {
    navigate('/buyer/products');
  };

  const handleLeaveReview = () => {
    navigate('/buyer/delivery-feedback', {
      state: {
        orderData: orderData,
        fromCongratulations: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C4FFF] to-[#5A3FE6] pb-20">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-white">Tabriknoma!</h1>
            <button
              onClick={handleBackToHome}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-white text-xl">close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-6">
        {/* Celebration Section */}
        <div className="text-center py-8">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-white text-8xl">
              celebration
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Tabriklaymiz!
          </h2>
          <p className="text-white/90 text-lg mb-2">
            Sizning birinchi buyurtmangiz
          </p>
          <p className="text-white/80">
            muvaffaqiyatli yaratildi
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-white text-3xl">
                shopping_bag
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Birinchi buyurtma</h3>
            <p className="text-white/80">Buyurtma ID: {orderData.id}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Mahsulot:</span>
              <span className="text-white font-medium">{orderData.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Sotuvchi:</span>
              <span className="text-white font-medium">{orderData.supplier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Jami summa:</span>
              <span className="text-white font-bold text-xl">{orderData.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Buyurtma sanasi:</span>
              <span className="text-white font-medium">{orderData.orderDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Yetkazib berish:</span>
              <span className="text-white font-medium">{orderData.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-yellow-300 text-4xl">
                emoji_events
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Yutuq ochildi!</h4>
            <p className="text-white/80 text-sm mb-3">
              "Birinchi buyurtma" yutug'ini qo'lga kiritdingiz
            </p>
            <div className="bg-yellow-400/20 border border-yellow-300/30 rounded-lg p-3">
              <p className="text-yellow-200 text-sm font-medium">
                🎉 Sizning birinchi buyurtmangiz uchun maxsus chegirma!
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
          <h4 className="text-lg font-bold text-white mb-4">Keyingi qadamlar</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <p className="text-white/80 text-sm">Sotuvchi buyurtmangizni tayyorlashni boshlaydi</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <p className="text-white/80 text-sm">Buyurtma holatini kuzatish sahifasidan kuzatishingiz mumkin</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <p className="text-white/80 text-sm">Yetkazib berish haqida xabar beriladi</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLeaveReview}
            className="w-full bg-white text-[#6C4FFF] py-4 px-4 rounded-xl hover:bg-white/90 transition-colors font-bold text-lg"
          >
            Sharh qoldirish
          </button>
          <button
            onClick={handleViewOrder}
            className="w-full bg-white/20 text-white py-3 px-4 rounded-xl border border-white/30 hover:bg-white/30 transition-colors font-medium"
          >
            Buyurtmani ko'rish
          </button>
          <button
            onClick={handleExploreProducts}
            className="w-full bg-transparent text-white py-3 px-4 rounded-xl border border-white/50 hover:bg-white/10 transition-colors font-medium"
          >
            Boshqa mahsulotlarni ko'rish
          </button>
        </div>

        {/* Social Share */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-3">Birinchi buyurtmangizni baham ko'ring!</p>
            <div className="flex justify-center gap-3">
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined text-white text-xl">share</span>
              </button>
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined text-white text-xl">favorite</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default FirstOrderCongratulations;
