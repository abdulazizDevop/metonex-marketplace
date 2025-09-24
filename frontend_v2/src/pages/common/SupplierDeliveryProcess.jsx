import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupplierDeliveryProcess = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryStatus, setDeliveryStatus] = useState('preparing');
  
  const steps = [
    { id: 1, title: 'Prepare Order', description: 'Pack items and prepare for shipment', status: 'completed' },
    { id: 2, title: 'Schedule Pickup', description: 'Arrange courier pickup', status: 'completed' },
    { id: 3, title: 'In Transit', description: 'Package is on the way', status: 'current' },
    { id: 4, title: 'Delivered', description: 'Package delivered to buyer', status: 'pending' }
  ];

  const orderDetails = {
    orderId: 'ORD-2024-001',
    buyer: 'BuildCo Ltd.',
    items: ['Steel Beams (10 units)', 'Concrete Mix (5 bags)'],
    totalAmount: 1500.00,
    deliveryAddress: '123 Construction Site, Tashkent, Uzbekistan',
    estimatedDelivery: '2024-01-15',
    paymentMethod: 'Cash on Delivery'
  };

  const handleUpdateStatus = (status) => {
    setDeliveryStatus(status);
    if (status === 'delivered') {
      setCurrentStep(4);
      navigate('/order-delivered-cash-pending');
    }
  };

  const handleContactBuyer = () => {
    // Implement contact buyer functionality
    console.log('Contacting buyer...');
  };

  const handleViewOrderDetails = () => {
    // Navigate to full order details
    navigate('/full-order-details');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Process</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Order #{orderDetails.orderId}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Buyer: <span className="font-medium text-gray-900">{orderDetails.buyer}</span></p>
            <p className="text-gray-600">Total: <span className="font-bold text-green-600">${orderDetails.totalAmount}</span></p>
          </div>
          <button 
            onClick={handleViewOrderDetails}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Progress</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.status === 'completed' ? 'bg-green-500 text-white' :
                step.status === 'current' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {step.status === 'completed' ? '✓' : step.id}
              </div>
              <div className="ml-4 flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'completed' ? 'text-green-700' :
                  step.status === 'current' ? 'text-blue-700' :
                  'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleUpdateStatus('in_transit')}
            disabled={deliveryStatus === 'in_transit' || deliveryStatus === 'delivered'}
            className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-blue-600 mr-3">local_shipping</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Mark as In Transit</p>
                <p className="text-sm text-gray-600">Package picked up and on the way</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleUpdateStatus('delivered')}
            disabled={deliveryStatus === 'delivered'}
            className="p-4 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-green-600 mr-3">check_circle</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Mark as Delivered</p>
                <p className="text-sm text-gray-600">Package delivered to buyer</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleContactBuyer}
            className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-purple-600 mr-3">message</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Contact Buyer</p>
                <p className="text-sm text-gray-600">Send message or call buyer</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-gray-600 mr-3">track_changes</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Track Package</p>
                <p className="text-sm text-gray-600">View delivery tracking info</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Address:</span>
            <span className="text-gray-900 font-medium text-right max-w-xs">{orderDetails.deliveryAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Delivery:</span>
            <span className="text-gray-900 font-medium">{orderDetails.estimatedDelivery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="text-gray-900 font-medium">{orderDetails.paymentMethod}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDeliveryProcess;
