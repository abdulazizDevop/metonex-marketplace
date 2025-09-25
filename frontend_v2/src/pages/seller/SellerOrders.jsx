import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('offers'); // 'offers', 'orders'

  const [ordersData] = useState({
    offers: [
      {
        id: 1,
        title: 'Rebar Ø12, 20 tons',
        buyer: 'Apex Construction',
        price: '$710/t',
        status: 'PENDING',
        deadline: '2024-07-25',
        hasNewOffer: true
      },
      {
        id: 2,
        title: 'Concrete Mix C25, 50 m³',
        buyer: 'BuildCorp Ltd',
        price: '$85/m³',
        status: 'ACCEPTED',
        deadline: '2024-07-30',
        hasNewOffer: false
      }
    ],
    orders: [
      {
        id: 1,
        title: 'Steel Beams I-200, 10 pieces',
        buyer: 'SteelCorp Ltd',
        amount: '$15,000',
        status: 'IN_PROGRESS',
        progress: 75,
        deliveryDate: '2024-08-15'
      },
      {
        id: 2,
        title: 'Cement Bags 50kg, 100 pieces',
        buyer: 'CementPro',
        amount: '$2,500',
        status: 'DELIVERED',
        progress: 100,
        deliveryDate: '2024-07-20'
      }
    ]
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleAcceptOffer = (offerId) => {
    console.log(`Accepting offer ${offerId}`);
  };

  const handleDeclineOffer = (offerId) => {
    console.log(`Declining offer ${offerId}`);
  };

  const handleViewOrder = (orderId) => {
    console.log(`Viewing order ${orderId}`);
  };

  const renderOffers = () => (
    <div className="space-y-4">
      {ordersData.offers.map((offer) => (
        <div key={offer.id} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">{offer.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
              offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {offer.status}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Buyer:</span> {offer.buyer}
            </div>
            <div>
              <span className="font-medium">Price:</span> {offer.price}
            </div>
            <div>
              <span className="font-medium">Deadline:</span> {offer.deadline}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {offer.status === 'PENDING' && (
              <>
                <button
                  onClick={() => handleDeclineOffer(offer.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAcceptOffer(offer.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Accept
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      {ordersData.orders.map((order) => (
        <div key={order.id} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">{order.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
              order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Buyer:</span> {order.buyer}
            </div>
            <div>
              <span className="font-medium">Amount:</span> {order.amount}
            </div>
            <div>
              <span className="font-medium">Delivery:</span> {order.deliveryDate}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{order.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${order.progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleViewOrder(order.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Offers</h2>
              <span className="text-sm text-gray-500">
                {ordersData.offers.filter(o => o.hasNewOffer).length} new offers
              </span>
            </div>
            {renderOffers()}
          </div>
        );
      case 'orders':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Orders</h2>
              <span className="text-sm text-gray-500">
                {ordersData.orders.length} total orders
              </span>
            </div>
            {renderOrders()}
          </div>
        );
      default:
        return renderOffers();
    }
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
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Orders & Offers</h1>
          <div className="w-10"></div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'offers', label: 'Offers', icon: 'local_offer' },
            { id: 'orders', label: 'Orders', icon: 'list_alt' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {renderTabContent()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-bold">Orders</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-xs font-medium">Products</span>
          </button>
          <button 
            onClick={() => navigate('/seller/profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button 
            onClick={() => navigate('/seller/analytics')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SellerOrders;
