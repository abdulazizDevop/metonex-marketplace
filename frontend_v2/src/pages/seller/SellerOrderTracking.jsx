import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerOrderTracking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'orders';

  // Mock data for order tracking
  const [orderData] = useState({
    id: id,
    requestTitle: 'Concrete Mix C25, 50 m³',
    status: 'in_transit',
    totalAmount: '$4,250',
    orderDate: '2024-01-15',
    deliveryDate: '2024-07-29',
    trackingNumber: 'TRK001234',
    buyer: {
      name: 'BuildCorp Ltd',
      company: 'BuildCorp Construction',
      location: 'Samarqand, Uzbekistan',
      contact: '+998 91 234 56 78'
    },
    deliveryAddress: 'Samarqand shahar, Registon ko\'chasi, 15-uy',
    currentLocation: 'Toshkent - Samarqand yo\'li, 45 km',
    estimatedArrival: '2024-07-29 14:00',
    driver: {
      name: 'Akmal Karimov',
      phone: '+998 90 123 45 67',
      vehicle: 'Kamaz-5320 (A123BC)'
    },
    timeline: [
      {
        id: 1,
        status: 'ordered',
        statusText: 'Buyurtma qabul qilindi',
        date: '2024-01-15 10:30',
        location: 'Toshkent',
        completed: true,
        icon: 'shopping_cart'
      },
      {
        id: 2,
        status: 'confirmed',
        statusText: 'Buyurtma tasdiqlandi',
        date: '2024-01-16 09:15',
        location: 'Toshkent',
        completed: true,
        icon: 'check_circle'
      },
      {
        id: 3,
        status: 'preparation',
        statusText: 'Tayyorlash boshlandi',
        date: '2024-01-17 08:00',
        location: 'Toshkent',
        completed: true,
        icon: 'build'
      },
      {
        id: 4,
        status: 'dispatched',
        statusText: 'Yuklangan va jo\'natilgan',
        date: '2024-01-18 14:20',
        location: 'Toshkent',
        completed: true,
        icon: 'local_shipping'
      },
      {
        id: 5,
        status: 'in_transit',
        statusText: 'Yo\'lda',
        date: '2024-01-19 16:45',
        location: 'Toshkent - Samarqand yo\'li',
        completed: true,
        icon: 'directions_car'
      },
      {
        id: 6,
        status: 'delivered',
        statusText: 'Yetkazib berilgan',
        date: null,
        location: 'Samarqand',
        completed: false,
        icon: 'done_all'
      }
    ]
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate(`/seller/order-details/${id}`, {
      state: { returnTab }
    });
  };

  const handleCallDriver = () => {
    window.open(`tel:${orderData.driver.phone}`);
  };

  const handleContactBuyer = () => {
    window.open(`tel:${orderData.buyer.contact}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered':
      case 'confirmed':
      case 'preparation':
      case 'dispatched':
      case 'in_transit':
        return 'bg-[#6C4FFF]'
      case 'delivered':
        return 'bg-green-500'
      default:
        return 'bg-gray-400'
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'ordered':
      case 'confirmed':
      case 'preparation':
      case 'dispatched':
      case 'in_transit':
        return 'text-[#6C4FFF]'
      case 'delivered':
        return 'text-green-500'
      default:
        return 'text-gray-400'
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Kutilmoqda';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    const completedSteps = orderData.timeline.filter(step => step.completed).length;
    return (completedSteps / orderData.timeline.length) * 100;
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-gray-50">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Buyurtma kuzatuvi</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{orderData.requestTitle}</h2>
                <p className="text-sm text-gray-600 mt-1">Buyurtma raqami: #{orderData.id}</p>
                <p className="text-sm text-gray-600">Tracking: {orderData.trackingNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#6C4FFF]">{orderData.totalAmount}</p>
                <p className="text-sm text-gray-500">Jami summa</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Jarayon</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-[#6C4FFF] rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-3 p-3 bg-[#6C4FFF]/10 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-[#6C4FFF] animate-pulse"></div>
              <div className="flex-1">
                <p className="font-semibold text-[#6C4FFF]">Yo'lda</p>
                <p className="text-sm text-gray-600">{orderData.currentLocation}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Taxminiy yetib kelish</p>
                <p className="text-sm text-gray-600">{formatTime(orderData.estimatedArrival)}</p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Haydovchi ma'lumotlari</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#6C4FFF]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6C4FFF]">person</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{orderData.driver.name}</h4>
                <p className="text-sm text-gray-600">{orderData.driver.vehicle}</p>
                <p className="text-sm text-gray-500">{orderData.driver.phone}</p>
              </div>
              <button
                onClick={handleCallDriver}
                className="px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm font-medium"
              >
                Qo'ng'iroq
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib berish manzili</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#6C4FFF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#6C4FFF] text-sm">location_on</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{orderData.deliveryAddress}</p>
                <p className="text-sm text-gray-600 mt-1">Buyer: {orderData.buyer.name}</p>
                <p className="text-sm text-gray-500">{orderData.buyer.contact}</p>
              </div>
              <button
                onClick={handleContactBuyer}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Aloqa
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jarayon tarixi</h3>
            <div className="space-y-4">
              {orderData.timeline.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? getStatusColor(step.status) : 'bg-gray-200'
                    }`}>
                      <span className={`material-symbols-outlined text-sm ${
                        step.completed ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.icon}
                      </span>
                    </div>
                    {index < orderData.timeline.length - 1 && (
                      <div className={`w-0.5 h-8 mt-2 ${
                        orderData.timeline[index + 1].completed ? 'bg-[#6C4FFF]' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${
                        step.completed ? getStatusTextColor(step.status) : 'text-gray-400'
                      }`}>
                        {step.statusText}
                      </p>
                      <p className="text-xs text-gray-500">{formatTime(step.date)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Updates */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-time yangilanishlar</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Yuk Toshkentdan jo'natildi</p>
                  <p className="text-xs text-gray-500">2 soat oldin</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Yo'lda - Toshkent-Samarqand</p>
                  <p className="text-xs text-gray-500">30 daqiqa oldin</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-200 space-y-2">
          <button
            onClick={handleCallDriver}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            Haydovchiga qo'ng'iroq qilish
          </button>
          <button
            onClick={handleContactBuyer}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Buyer bilan aloqa
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerOrderTracking;
