import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmed = () => {
  const navigate = useNavigate();

  const handleViewReceipt = () => {
    navigate('/receipt');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center bg-white">
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-green-100">
          <svg 
            className="h-20 w-20 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 13l4 4L19 7" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <p className="text-lg font-medium text-gray-700">
          Supplier confirmed your cash payment.
        </p>
      </div>
      
      <div className="w-full">
        <button 
          onClick={handleViewReceipt}
          className="w-full rounded-lg bg-[#7f13ec] py-4 text-lg font-semibold text-white shadow-md hover:bg-[#6b10c9] transition-colors"
        >
          View Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmed;