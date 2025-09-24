import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmedProcessing = () => {
  const navigate = useNavigate();

  const handleViewReceipt = () => {
    navigate('/receipt');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-white" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <span 
            className="material-symbols-outlined text-green-500" 
            style={{ 
              fontSize: '64px', 
              fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
            }}
          >
            check
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Confirmed!
        </h1>
        <p className="text-gray-600 mb-4 max-w-xs">
          You confirmed receiving cash. The system is generating a receipt.
        </p>
        <p className="text-gray-500 text-sm">
          This order is officially closed.
        </p>
      </div>
      
      {/* Footer */}
      <div className="p-4 w-full">
        <button 
          onClick={handleViewReceipt}
          className="w-full flex items-center justify-center rounded-xl h-14 px-5 bg-[#8013ec] text-white text-lg font-bold hover:bg-purple-700 transition-colors"
        >
          <span className="truncate">View Receipt</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmedProcessing;
