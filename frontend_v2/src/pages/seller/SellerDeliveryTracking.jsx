import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerDeliveryTracking = () => {
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
    trackingNumber: 'TRK001234',
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
      vehicle: 'Kamaz-5320 (A123BC)',
      license: 'DL-123456'
    },
    currentLocation: 'Toshkent - Samarqand yo\'li, 45 km',
    estimatedArrival: '2024-01-20 14:00',
    status: 'in_transit'
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState(orderData.currentLocation);

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

  const handleContactDriver = () => {
    window.open(`tel:${orderData.driver.phone}`);
  };

  const handleContactBuyer = () => {
    window.open(`tel:${orderData.buyer.contact}`);
  };

  const handleEmailBuyer = () => {
    window.open(`mailto:${orderData.buyer.email}`);
  };

  const handleUpdateLocation = () => {
    // Simulate location update
    const locations = [
      'Toshkent - Samarqand yo\'li, 45 km',
      'Toshkent - Samarqand yo\'li, 30 km',
      'Samarqand shahar chegarasi',
      'Samarqand shahar markazi',
      'Registon ko\'chasi yaqinida'
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setCurrentLocation(randomLocation);
  };

  const handleMarkDelivered = () => {
    if (window.confirm('Mahsulot yetkazib berilganini tasdiqlaysizmi?')) {
      console.log('Marking as delivered...');
      // In real app, this would update the order status
      navigate(`/seller/order-details/${id}`, {
        state: { returnTab, status: 'delivered' }
      });
    }
  };

  const getStatusInfo = () => {
    switch (orderData.status) {
      case 'in_transit':
        return {
          title: 'Yo\'lda',
          description: 'Mahsulot sizga yetkazilmoqda',
          icon: 'local_shipping',
          color: 'from-[#6C4FFF] to-[#5A3FE6]',
          bgColor: 'bg-[#6C4FFF]/10',
          textColor: 'text-[#6C4FFF]'
        };
      case 'delivered':
        return {
          title: 'Yetkazib berilgan',
          description: 'Mahsulot muvaffaqiyatli yetkazib berildi',
          icon: 'task_alt',
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
      default:
        return {
          title: 'Tayyorlanmoqda',
          description: 'Mahsulot tayyorlanmoqda',
          icon: 'inventory_2',
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-600'
        };
    }
  };

  const getTimelineSteps = () => {
    const steps = [
      {
        id: 1,
        title: 'Buyurtma qabul qilindi',
        description: 'Buyurtmangiz muvaffaqiyatli qabul qilindi',
        icon: 'check_circle',
        completed: true,
        date: '2024-01-15 10:30'
      },
      {
        id: 2,
        title: 'To\'lov qilindi',
        description: 'Xaridor to\'lovni amalga oshirdi',
        icon: 'payment',
        completed: true,
        date: '2024-01-16 09:15'
      },
      {
        id: 3,
        title: 'Tayyorlanmoqda',
        description: 'Mahsulot omborda tayyorlanmoqda',
        icon: 'inventory_2',
        completed: true,
        date: '2024-01-17 08:00'
      },
      {
        id: 4,
        title: 'Yo\'lda',
        description: 'Mahsulot sizga yetkazilmoqda',
        icon: 'local_shipping',
        completed: orderData.status === 'in_transit' || orderData.status === 'delivered',
        active: orderData.status === 'in_transit',
        date: orderData.status === 'in_transit' || orderData.status === 'delivered' ? '2024-01-18 14:20' : null
      },
      {
        id: 5,
        title: 'Yetkazib berilgan',
        description: 'Mahsulot muvaffaqiyatli yetkazib berildi',
        icon: 'task_alt',
        completed: orderData.status === 'delivered',
        active: orderData.status === 'delivered',
        date: orderData.status === 'delivered' ? '2024-01-19 16:45' : null
      }
    ];

    return steps;
  };

  const statusInfo = getStatusInfo();
  const timelineSteps = getTimelineSteps();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-b ${statusInfo.color} text-white`}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-semibold">Yetkazib berish kuzatuvi</h1>
              <p className="text-sm text-white/80">Buyurtma ID: {orderData.id}</p>
            </div>
          </div>
        </div>

        {/* Status Header */}
        <div className="px-4 pb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-white text-4xl">
                {statusInfo.icon}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{statusInfo.title}</h2>
            <p className="text-white/80">{statusInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
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
              <span className="text-gray-600">Kuzatish raqami:</span>
              <span className="font-medium">{orderData.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yetkazib berish sanasi:</span>
              <span className="font-medium">{orderData.deliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Current Location */}
        {orderData.status === 'in_transit' && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hozirgi joylashuv</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Joriy joylashuv:</span>
                <span className="font-medium">{currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxminiy yetib kelish:</span>
                <span className="font-medium">{orderData.estimatedArrival}</span>
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
        )}

        {/* Timeline */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish jarayoni</h3>
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500' 
                    : step.active 
                      ? statusInfo.bgColor 
                      : 'bg-gray-200'
                }`}>
                  <span className={`material-symbols-outlined text-lg ${
                    step.completed 
                      ? 'text-white' 
                      : step.active 
                        ? statusInfo.textColor 
                        : 'text-gray-500'
                  }`}>
                    {step.completed ? 'check' : step.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    step.completed 
                      ? 'text-gray-900' 
                      : step.active 
                        ? statusInfo.textColor 
                        : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.date && (
                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Haydovchi ma'lumotlari</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ism:</span>
              <span className="font-medium">{orderData.driver.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telefon:</span>
              <span className="font-medium">{orderData.driver.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transport:</span>
              <span className="font-medium">{orderData.driver.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Haydovchilik guvohnomasi:</span>
              <span className="font-medium">{orderData.driver.license}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib berish manzili</h3>
          <p className="text-gray-700">{orderData.deliveryAddress}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {orderData.status === 'in_transit' && (
            <>
              <button
                onClick={handleUpdateLocation}
                className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
              >
                Joylashuvni yangilash
              </button>
              <button
                onClick={handleContactDriver}
                className="w-full bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
              >
                Haydovchini chaqirish
              </button>
            </>
          )}
          {orderData.status === 'in_transit' && (
            <button
              onClick={handleMarkDelivered}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Yetkazib berilgan deb belgilash
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleContactBuyer}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Xaridorga qo'ng'iroq
            </button>
            <button
              onClick={handleEmailBuyer}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Email yuborish
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerDeliveryTracking;
