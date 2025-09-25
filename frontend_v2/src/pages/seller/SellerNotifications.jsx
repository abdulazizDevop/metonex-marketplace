import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerNotifications = () => {
  const navigate = useNavigate();
  
  const [notifications] = useState([
    {
      id: 1,
      type: 'offer',
      title: 'New offer received',
      message: 'You have received a new offer for "Rebar Ø12, 20 tons" from Apex Construction',
      time: '5 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'order',
      title: 'Order status update',
      message: 'Order #1234 has been confirmed and is now in production',
      time: '1 hour ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment received',
      message: 'Payment of $15,000 has been received for order #1234',
      time: '3 hours ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: 4,
      type: 'delivery',
      title: 'Delivery scheduled',
      message: 'Delivery for order #1234 is scheduled for tomorrow at 10:00 AM',
      time: '1 day ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 5,
      type: 'system',
      title: 'System maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
      time: '2 days ago',
      isRead: true,
      priority: 'low'
    }
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNotificationClick = (notificationId) => {
    console.log(`Opening notification ${notificationId}`);
    // Mark as read and navigate to relevant page
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'offer':
        return 'local_offer';
      case 'order':
        return 'shopping_cart';
      case 'payment':
        return 'payment';
      case 'delivery':
        return 'local_shipping';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600';
    if (priority === 'medium') return 'text-blue-600';
    if (priority === 'low') return 'text-gray-600';
    return 'text-gray-600';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Notifications</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">All Notifications</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`rounded-2xl bg-white p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-full ${
                      notification.priority === 'high' ? 'bg-red-100' :
                      notification.priority === 'medium' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      <span className={`material-symbols-outlined text-sm ${getNotificationColor(notification.type, notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-bold ${getPriorityBadge(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
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
          <button 
            onClick={() => navigate('/seller/requests')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-medium">Requests</span>
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
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="material-symbols-outlined">notifications</span>
            <span className="text-xs font-bold">Notifications</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SellerNotifications;
