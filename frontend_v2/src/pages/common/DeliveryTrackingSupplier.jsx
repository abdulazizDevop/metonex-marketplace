import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryTrackingSupplier = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState('Warehouse');
  const [estimatedArrival, setEstimatedArrival] = useState('14:30');
  const [deliveryStatus, setDeliveryStatus] = useState('in_transit');

  const orderDetails = {
    orderId: 'ORD-2024-001',
    trackingNumber: 'TRK-789456123',
    buyer: 'BuildCo Ltd.',
    deliveryAddress: '123 Construction Site, Tashkent, Uzbekistan',
    courier: 'Express Delivery Co.',
    courierPhone: '+998 90 123 45 67'
  };

  const trackingSteps = [
    { id: 1, title: 'Order Confirmed', time: '09:00', status: 'completed', location: 'Warehouse' },
    { id: 2, title: 'Packed & Ready', time: '10:30', status: 'completed', location: 'Warehouse' },
    { id: 3, title: 'Picked Up', time: '11:45', status: 'completed', location: 'Warehouse' },
    { id: 4, title: 'In Transit', time: '12:00', status: 'current', location: 'On Route' },
    { id: 5, title: 'Out for Delivery', time: '14:00', status: 'pending', location: 'Delivery Area' },
    { id: 6, title: 'Delivered', time: estimatedArrival, status: 'pending', location: orderDetails.deliveryAddress }
  ];

  useEffect(() => {
    // Simulate real-time tracking updates
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Update estimated arrival time
      setEstimatedArrival(timeString);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleContactCourier = () => {
    // Implement contact courier functionality
    window.open(`tel:${orderDetails.courierPhone}`);
  };

  const handleUpdateLocation = () => {
    // Simulate location update
    const locations = ['On Route', 'Nearby Area', 'Approaching', 'At Location'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setCurrentLocation(randomLocation);
  };

  const handleMarkDelivered = () => {
    setDeliveryStatus('delivered');
    navigate('/delivery-confirmed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Tracking</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Live Tracking
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Order: <span className="font-medium text-gray-900">#{orderDetails.orderId}</span></p>
            <p className="text-gray-600">Tracking: <span className="font-medium text-gray-900">{orderDetails.trackingNumber}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">ETA:</p>
            <p className="text-lg font-medium text-gray-900">{estimatedArrival}</p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-blue-600">
              local_shipping
            </span>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Package In Transit
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Current location: <span className="font-medium">{currentLocation}</span>
        </p>

        {/* Live Map Placeholder */}
        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">map</span>
            <p className="text-gray-500">Live tracking map</p>
            <p className="text-sm text-gray-400">Real-time location updates</p>
          </div>
        </div>

        <button 
          onClick={handleUpdateLocation}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Location
        </button>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Progress</h3>
        <div className="space-y-4">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.status === 'completed' ? 'bg-green-500 text-white' :
                  step.status === 'current' ? 'bg-blue-500 text-white animate-pulse' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step.status === 'completed' ? '✓' : step.id}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={`w-0.5 h-8 ml-4 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    step.status === 'completed' ? 'text-green-700' :
                    step.status === 'current' ? 'text-blue-700' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <span className="text-xs text-gray-500">{step.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{step.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Courier Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Courier:</span>
            <span className="font-medium text-gray-900">{orderDetails.courier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium text-gray-900">{orderDetails.courierPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Address:</span>
            <span className="text-gray-900 font-medium text-right max-w-xs">{orderDetails.deliveryAddress}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleContactCourier}
            className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-blue-600 mr-3">phone</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Contact Courier</p>
                <p className="text-sm text-gray-600">Call or message courier</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleMarkDelivered}
            disabled={deliveryStatus === 'delivered'}
            className="p-4 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined text-green-600 mr-3">check_circle</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Mark Delivered</p>
                <p className="text-sm text-gray-600">Confirm delivery completion</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackingSupplier;
