import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'completed', 'notifications'
  
  const [ordersData] = useState({
    activeRequests: [
      {
        id: 1,
        title: 'Rebar Ø12, 20 tons',
        status: 'NEW OFFERS',
        offersCount: 3,
        lowestPrice: '$710/t',
        fastestDelivery: '2 days',
        hasNewOffers: true,
        deadline: '2024-07-25',
        category: 'Steel',
        quantity: '20 tons',
        specifications: 'Grade 60, ASTM A615'
      },
      {
        id: 2,
        title: 'Concrete Mix C25, 50 m³',
        status: 'PENDING',
        offersCount: 1,
        lowestPrice: '$85/m³',
        fastestDelivery: '1 day',
        hasNewOffers: false,
        deadline: '2024-07-30',
        category: 'Concrete',
        quantity: '50 m³',
        specifications: 'C25/30, 28-day strength'
      }
    ],
    completedRequests: [
      {
        id: 3,
        title: 'Steel Beams I-200, 10 pieces',
        status: 'COMPLETED',
        completedDate: '2 days ago',
        totalAmount: '$15,000',
        supplier: 'SteelCorp Ltd',
        rating: 5
      },
      {
        id: 4,
        title: 'Cement Bags 50kg, 100 pieces',
        status: 'COMPLETED',
        completedDate: '1 week ago',
        totalAmount: '$2,500',
        supplier: 'CementPro',
        rating: 4
      }
    ],
    notifications: [
      {
        id: 1,
        type: 'offer',
        title: 'New offer received',
        message: 'You have received 2 new offers for "Rebar Ø12, 20 tons"',
        time: '5 minutes ago',
        isRead: false
      },
      {
        id: 2,
        type: 'delivery',
        title: 'Delivery update',
        message: 'Your order "Steel Beams I-200" is out for delivery',
        time: '1 hour ago',
        isRead: true
      },
      {
        id: 3,
        type: 'payment',
        title: 'Payment reminder',
        message: 'Payment due for order #1234 in 2 days',
        time: '3 hours ago',
        isRead: false
      }
    ],
    estimates: [
      {
        id: 1,
        project: 'Office Building Construction',
        totalValue: '$250,000',
        items: 45,
        status: 'Draft',
        lastModified: '2 hours ago'
      },
      {
        id: 2,
        project: 'Warehouse Renovation',
        totalValue: '$180,000',
        items: 32,
        status: 'Ready',
        lastModified: '1 day ago'
      }
    ]
  });

  const handleViewOffers = (requestId) => {
    console.log(`Viewing offers for request ${requestId}`);
    navigate('/buyer/counter-offers');
  };

  const handleRemindSuppliers = (requestId) => {
    console.log(`Reminding suppliers for request ${requestId}`);
    // Send reminder to suppliers
  };

  const handleReorder = (requestId) => {
    console.log(`Reordering request ${requestId}`);
    navigate('/buyer/home');
  };

  const handleViewDetails = (requestId) => {
    console.log(`Viewing details for request ${requestId}`);
    // Navigate to request details page
  };

  const handleNewRequest = () => {
    navigate('/buyer/home');
  };

  const handleUploadBOM = () => {
    navigate('/buyer/home');
  };

  const handleTrackOrders = () => {
    navigate('/buyer/orders');
  };

  const handleReorderFromHistory = () => {
    navigate('/buyer/home');
  };

  const handleViewAllHistory = () => {
    console.log('Viewing all history');
  };

  const handleCheckOffers = () => {
    navigate('/buyer/counter-offers');
  };

  const renderActiveRequests = () => (
    <div className="space-y-4">
      {ordersData.activeRequests.length > 0 ? (
        ordersData.activeRequests.map((request) => (
          <div key={request.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">{request.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  request.hasNewOffers ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {request.status}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Category:</span> {request.category}
              </div>
              <div>
                <span className="font-medium">Quantity:</span> {request.quantity}
              </div>
              <div>
                <span className="font-medium">Offers:</span> {request.offersCount}
              </div>
              <div>
                <span className="font-medium">Deadline:</span> {request.deadline}
              </div>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-green-600 font-medium">Lowest: {request.lowestPrice}</span>
              <span className="text-blue-600 font-medium">Fastest: {request.fastestDelivery}</span>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {request.hasNewOffers && (
                <button
                  onClick={() => handleViewOffers(request.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Offers
                </button>
              )}
              <button
                onClick={() => handleRemindSuppliers(request.id)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Remind Suppliers
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
          <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
          <p>No active requests</p>
          <button
            onClick={handleNewRequest}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Create New Request
          </button>
        </div>
      )}
    </div>
  );

  const renderCompletedRequests = () => (
    <div className="space-y-4">
      {ordersData.completedRequests.length > 0 ? (
        ordersData.completedRequests.map((request) => (
          <div key={request.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">{request.title}</h3>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                {request.status}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Supplier:</span> {request.supplier}
              </div>
              <div>
                <span className="font-medium">Amount:</span> {request.totalAmount}
              </div>
              <div>
                <span className="font-medium">Completed:</span> {request.completedDate}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Rating:</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-outlined text-sm ${
                        i < request.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleReorder(request.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Reorder
              </button>
              <button
                onClick={() => handleViewDetails(request.id)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
          <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
          <p>No completed requests</p>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      {ordersData.notifications.length > 0 ? (
        ordersData.notifications.map((notification) => (
          <div key={notification.id} className={`rounded-2xl bg-white p-4 shadow-sm ${
            !notification.isRead ? 'border-l-4 border-blue-500' : ''
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex size-10 items-center justify-center rounded-full ${
                notification.type === 'offer' ? 'bg-green-100' :
                notification.type === 'delivery' ? 'bg-blue-100' :
                'bg-orange-100'
              }`}>
                <span className={`material-symbols-outlined text-sm ${
                  notification.type === 'offer' ? 'text-green-600' :
                  notification.type === 'delivery' ? 'text-blue-600' :
                  'text-orange-600'
                }`}>
                  {notification.type === 'offer' ? 'local_offer' :
                   notification.type === 'delivery' ? 'local_shipping' :
                   'payment'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
          <span className="material-symbols-outlined text-4xl mb-2">notifications_none</span>
          <p>No notifications</p>
        </div>
      )}
    </div>
  );

  const renderEstimates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Estimates</h2>
        <button
          onClick={handleUploadBOM}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Upload New Estimate
        </button>
      </div>
      
      {ordersData.estimates.length > 0 ? (
        ordersData.estimates.map((estimate) => (
          <div key={estimate.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">{estimate.project}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                estimate.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {estimate.status}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Value:</span> {estimate.totalValue}
              </div>
              <div>
                <span className="font-medium">Items:</span> {estimate.items}
              </div>
              <div>
                <span className="font-medium">Last Modified:</span> {estimate.lastModified}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
          <span className="material-symbols-outlined text-4xl mb-2">description</span>
          <p>No estimates available</p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Active Requests</h2>
              <button
                onClick={handleNewRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                New Request
              </button>
            </div>
            {renderActiveRequests()}
          </div>
        );
      case 'completed':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Completed Requests</h2>
              <button
                onClick={handleViewAllHistory}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                View All History
              </button>
            </div>
            {renderCompletedRequests()}
          </div>
        );
      case 'notifications':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <button
                onClick={handleCheckOffers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Check Offers
              </button>
            </div>
            {renderNotifications()}
          </div>
        );
      case 'estimates':
        return renderEstimates();
      default:
        return renderActiveRequests();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-[#f5f5f7]">
      <header className="sticky top-0 z-10 border-b border-[#d2d2d7] bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="w-10">
            <button className="flex items-center justify-center">
              <img
                src="https://placehold.co/40x40"
                alt="User avatar"
                className="size-10 rounded-full object-cover"
              />
            </button>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          </div>
          <div className="w-10">
            <button className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-gray-700">notifications</span>
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {[
          { id: 'active', label: 'Active', icon: 'pending' },
          { id: 'completed', label: 'Completed', icon: 'check_circle' },
          { id: 'notifications', label: 'Notifications', icon: 'notifications' },
          { id: 'estimates', label: 'Estimates', icon: 'description' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <main className="flex-grow p-4">
        {renderTabContent()}
      </main>

      <footer className="sticky bottom-0 border-t border-gray-200 bg-white">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/buyer/home')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-bold">Orders</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/counter-offers')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
            <span className="text-xs font-medium">Counter Offers</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/my-company')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">business</span>
            <span className="text-xs font-medium">Company</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BuyerOrders;
