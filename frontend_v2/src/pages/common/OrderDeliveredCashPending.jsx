import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDeliveredCashPending = () => {
  const navigate = useNavigate();

  const handleConfirmPaymentReceived = () => {
    // Navigate to confirm cash received screen
    navigate('/confirm-cash-received');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-center relative">
        <h1 className="text-lg font-bold text-gray-900">Cash on Delivery</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="text-8xl mb-6">📦</div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order delivered. Waiting for buyer to hand over cash.
        </h2>
        <p className="text-gray-600 mb-8">
          Funds will be secured in system once confirmed.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 w-full max-w-sm">
          <p className="text-sm text-gray-700">
            Buyer chose COD payment method.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6">
        <button 
          onClick={handleConfirmPaymentReceived}
          className="w-full bg-[#6D28D9] text-white font-bold py-4 px-4 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Confirm Payment Received
        </button>
      </footer>
    </div>
  );
};

export default OrderDeliveredCashPending;
