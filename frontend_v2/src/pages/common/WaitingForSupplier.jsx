import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WaitingForSupplier = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(50);

  // Simulate progress update
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 1000);

    // Simulate supplier confirmation after 5 seconds
    const timeout = setTimeout(() => {
      navigate('/payment-confirmed');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const handleContactSupport = () => {
    // Navigate to support or show contact modal
    console.log('Contacting support...');
  };

  return (
    <div className="flex flex-col h-screen justify-between bg-white">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-20 flex-grow">
        <div className="w-20 h-20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-7xl text-purple-700">
            hourglass_empty
          </span>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          You paid cash. Supplier is confirming receipt.
        </h1>
        
        <div className="w-full max-w-xs">
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="flex items-center text-purple-700 font-medium">
              <span className="material-symbols-outlined text-lg mr-1">check_circle</span>
              <span>You Paid</span>
            </div>
            <div className="flex items-center text-purple-700 font-medium">
              <span className="material-symbols-outlined text-lg mr-1 animate-spin">progress_activity</span>
              <span>Supplier Confirmation</span>
            </div>
          </div>
          
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div 
              className="bg-purple-700 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Usually takes 1–2 minutes.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6">
        <button 
          onClick={handleContactSupport}
          className="w-full h-12 px-5 rounded-lg border border-purple-700 text-purple-700 text-base font-bold transition-colors hover:bg-purple-50"
        >
          Contact Support
        </button>
      </footer>
    </div>
  );
};

export default WaitingForSupplier;
