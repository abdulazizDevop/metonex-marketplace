import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmCashReceived = () => {
  const navigate = useNavigate();

  const handleIReceivedCash = () => {
    // Navigate to payment confirmed processing
    navigate('/payment-confirmed-processing');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-white" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      {/* Header */}
      <header className="flex items-center p-4">
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900">
          Confirm Payment
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl text-green-500">
          <span>💵</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">
          Have you received the cash from the courier?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          By confirming, you acknowledge receipt of cash.
        </p>
      </main>

      {/* Footer */}
      <footer className="p-6">
        <div className="flex flex-col space-y-3">
          <button 
            onClick={handleIReceivedCash}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#6d28d9] text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-purple-800 transition-colors"
          >
            <span className="truncate">I Received Cash</span>
          </button>
          
          <button 
            onClick={handleCancel}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 border border-gray-300 bg-transparent text-gray-900 text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-gray-100 transition-colors"
          >
            <span className="truncate">Cancel</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ConfirmCashReceived;
