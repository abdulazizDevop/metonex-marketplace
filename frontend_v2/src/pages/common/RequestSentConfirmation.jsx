import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestSentConfirmation = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [requestId] = useState('REQ-2024-001');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleViewRequest = () => {
    navigate('/view-request');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-green-600">
              check_circle
            </span>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Request Sent Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your request has been sent to potential suppliers. You'll receive notifications when they respond with offers.
        </p>

        {/* Request Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Request ID:</span>
            <span className="font-medium text-gray-900">#{requestId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Pending Response
            </span>
          </div>
        </div>

        {/* What's Next */}
        <div className="text-left mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="material-symbols-outlined text-green-500 mr-2 mt-0.5">check</span>
              Suppliers will review your request
            </li>
            <li className="flex items-start">
              <span className="material-symbols-outlined text-blue-500 mr-2 mt-0.5">schedule</span>
              You'll receive offers within 24-48 hours
            </li>
            <li className="flex items-start">
              <span className="material-symbols-outlined text-purple-500 mr-2 mt-0.5">notifications</span>
              Compare offers and choose the best one
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={handleViewRequest}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            View Request Details
          </button>
          
          <button 
            onClick={handleBackToDashboard}
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Auto Redirect Notice */}
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default RequestSentConfirmation;
