import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerDeliveryProcess = () => {
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
    paymentMethod: 'Bank Transfer',
    status: 'in_preparation'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryStatus, setDeliveryStatus] = useState('preparing');

  const steps = [
    { 
      id: 1, 
      title: 'Buyurtma tayyorlanmoqda', 
      description: 'Mahsulot omborda tayyorlanmoqda', 
      status: 'completed',
      icon: 'inventory_2'
    },
    { 
      id: 2, 
      title: 'Yetkazib berish rejalashtirilmoqda', 
      description: 'Kuryer yoki transport tayinlanmoqda', 
      status: 'completed',
      icon: 'schedule'
    },
    { 
      id: 3, 
      title: 'Yo\'lda', 
      description: 'Mahsulot yo\'lda', 
      status: 'current',
      icon: 'local_shipping'
    },
    { 
      id: 4, 
      title: 'Yetkazib berilgan', 
      description: 'Mahsulot xaridorga yetkazib berildi', 
      status: 'pending',
      icon: 'task_alt'
    }
  ];

  const handleBack = () => {
    navigate(`/seller/order-details/${id}`, {
      state: { returnTab }
    });
  };

  const handleUpdateStatus = (status) => {
    setDeliveryStatus(status);
    if (status === 'in_transit') {
      setCurrentStep(3);
      // Navigate to tracking page
      navigate(`/seller/order-tracking/${id}`, {
        state: { returnTab, orderData: { ...orderData, status: 'in_transit' } }
      });
    } else if (status === 'delivered') {
      setCurrentStep(4);
      // Navigate to delivery confirmation
      navigate(`/seller/order-details/${id}`, {
        state: { returnTab, status: 'delivered' }
      });
    }
  };

  const handleContactBuyer = () => {
    window.open(`tel:${orderData.buyer.contact}`);
  };

  const handleEmailBuyer = () => {
    window.open(`mailto:${orderData.buyer.email}`);
  };

  const handleViewOrderDetails = () => {
    navigate(`/seller/order-details/${id}`, {
      state: { returnTab }
    });
  };

  const handleTrackPackage = () => {
    navigate(`/seller/order-tracking/${id}`, {
      state: { returnTab, orderData }
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'in_transit':
        return 'bg-[#6C4FFF]/10 text-[#6C4FFF]';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'preparing':
        return 'Tayyorlanmoqda';
      case 'in_transit':
        return 'Yo\'lda';
      case 'delivered':
        return 'Yetkazib berilgan';
      default:
        return status;
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
              <h1 className="text-lg font-semibold text-gray-900">Yetkazib berish jarayoni</h1>
              <p className="text-sm text-gray-500">Buyurtma ID: {orderData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Buyurtma xulosasi</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(deliveryStatus)}`}>
              {getStatusDisplayName(deliveryStatus)}
            </span>
          </div>
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
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish jarayoni</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-500' 
                    : step.status === 'current' 
                      ? 'bg-[#6C4FFF]' 
                      : 'bg-gray-200'
                }`}>
                  <span className={`material-symbols-outlined text-lg ${
                    step.status === 'completed' 
                      ? 'text-white' 
                      : step.status === 'current' 
                        ? 'text-white' 
                        : 'text-gray-500'
                  }`}>
                    {step.status === 'completed' ? 'check' : step.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    step.status === 'completed' 
                      ? 'text-green-700' 
                      : step.status === 'current' 
                        ? 'text-[#6C4FFF]' 
                        : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Actions */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish amallari</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleUpdateStatus('in_transit')}
              disabled={deliveryStatus === 'in_transit' || deliveryStatus === 'delivered'}
              className="w-full p-4 border border-[#6C4FFF] rounded-lg hover:bg-[#6C4FFF]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[#6C4FFF] mr-3">local_shipping</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Yo'lda deb belgilash</p>
                  <p className="text-sm text-gray-600">Mahsulot olib ketildi va yo'lda</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleUpdateStatus('delivered')}
              disabled={deliveryStatus === 'delivered'}
              className="w-full p-4 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined text-green-600 mr-3">check_circle</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Yetkazib berilgan deb belgilash</p>
                  <p className="text-sm text-gray-600">Mahsulot xaridorga yetkazib berildi</p>
                </div>
              </div>
            </button>

            <button 
              onClick={handleTrackPackage}
              className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined text-gray-600 mr-3">track_changes</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Mahsulotni kuzatish</p>
                  <p className="text-sm text-gray-600">Yetkazib berish kuzatuv ma'lumotlarini ko'rish</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish ma'lumotlari</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Yetkazib berish manzili:</span>
              <span className="font-medium text-right max-w-xs">{orderData.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxminiy yetkazib berish:</span>
              <span className="font-medium">{orderData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov usuli:</span>
              <span className="font-medium">{orderData.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aloqa</h3>
          <div className="space-y-3">
            <button 
              onClick={handleContactBuyer}
              className="w-full p-4 border border-[#6C4FFF] rounded-lg hover:bg-[#6C4FFF]/5 transition-colors"
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[#6C4FFF] mr-3">phone</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Xaridorga qo'ng'iroq qilish</p>
                  <p className="text-sm text-gray-600">Xaridor bilan telefon orqali bog'lanish</p>
                </div>
              </div>
            </button>

            <button 
              onClick={handleEmailBuyer}
              className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined text-gray-600 mr-3">mail</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Xaridorga email yuborish</p>
                  <p className="text-sm text-gray-600">Xaridor bilan email orqali bog'lanish</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewOrderDetails}
          className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
        >
          Batafsil ma'lumotlarni ko'rish
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerDeliveryProcess;
