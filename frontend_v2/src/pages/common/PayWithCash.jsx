import React from 'react';
import { useNavigate } from 'react-router-dom';

const PayWithCash = () => {
  const navigate = useNavigate();

  const handleIPaidCash = () => {
    // Navigate to confirmation screen
    navigate('/waiting-for-supplier');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200">
        <button 
          onClick={handleBack}
          className="text-gray-900 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-lg font-bold text-center text-gray-900">
          Cash on Delivery
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="mb-8">
          <span 
            className="material-symbols-outlined text-yellow-500" 
            style={{ 
              fontSize: '100px',
              fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
            }}
          >
            payments
          </span>
        </div>
        
        <p className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Hand cash to the courier.
        </p>
        <p className="text-base text-gray-500 mt-2">
          He will confirm your payment.
        </p>
      </main>

      {/* Footer */}
      <footer className="p-4">
        <button 
          onClick={handleIPaidCash}
          className="w-full bg-[#8013ec] text-white font-bold py-4 px-5 rounded-xl text-lg hover:bg-purple-700 transition-colors"
        >
          I Paid Cash
        </button>
      </footer>
    </div>
  );
};

export default PayWithCash;
