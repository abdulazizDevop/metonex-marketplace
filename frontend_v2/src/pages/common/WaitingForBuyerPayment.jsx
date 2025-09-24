import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WaitingForBuyerPayment = () => {
  const navigate = useNavigate();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showReminder, setShowReminder] = useState(false);

  const orderDetails = {
    orderId: 'ORD-2024-001',
    buyer: 'BuildCo Ltd.',
    amount: 1500.00,
    paymentMethod: 'Secure Transaction',
    estimatedTime: '2-3 business days'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show reminder after 5 minutes
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 300000); // 5 minutes

    return () => {
      clearInterval(timer);
      clearTimeout(reminderTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendReminder = () => {
    // Implement send reminder functionality
    console.log('Sending payment reminder to buyer...');
    setShowReminder(false);
  };

  const handleContactBuyer = () => {
    // Navigate to contact buyer page
    navigate('/contact-buyer');
  };

  const handleCancelOrder = () => {
    // Navigate to cancel order page
    navigate('/cancel-order');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Waiting for Payment</h1>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            Pending
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Order: <span className="font-medium text-gray-900">#{orderDetails.orderId}</span></p>
            <p className="text-gray-600">Amount: <span className="font-bold text-green-600">${orderDetails.amount}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Waiting time:</p>
            <p className="text-lg font-mono text-gray-900">{formatTime(timeElapsed)}</p>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100">
            <span className="material-symbols-outlined text-4xl text-blue-600">
              payment
            </span>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Awaiting Buyer Payment
        </h2>
        <p className="text-gray-600 text-center mb-6">
          The buyer has {orderDetails.estimatedTime} to complete payment for this order.
        </p>

        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-sm text-gray-500 text-center">
          Payment processing in progress...
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Buyer:</span>
            <span className="font-medium text-gray-900">{orderDetails.buyer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium text-gray-900">{orderDetails.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-green-600">${orderDetails.amount}</span>
          </div>
        </div>
      </div>

      {/* Reminder Banner */}
      {showReminder && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="material-symbols-outlined text-yellow-600 mr-3">
              schedule
            </span>
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Payment taking longer than expected?</p>
              <p className="text-yellow-700 text-sm">Send a gentle reminder to the buyer.</p>
            </div>
            <button 
              onClick={handleSendReminder}
              className="ml-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Send Reminder
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleContactBuyer}
            className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-blue-600 mr-3">message</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Contact Buyer</p>
                <p className="text-sm text-gray-600">Send message or call buyer</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleCancelOrder}
            className="p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-red-600 mr-3">cancel</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Cancel Order</p>
                <p className="text-sm text-gray-600">Cancel if payment is delayed</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingForBuyerPayment;
