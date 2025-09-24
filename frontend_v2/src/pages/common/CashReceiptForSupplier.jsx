import React from 'react';
import { useNavigate } from 'react-router-dom';

const CashReceiptForSupplier = () => {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // Implement PDF download functionality for accounting
    console.log('Downloading PDF for accounting...');
  };

  const handleBackToOrders = () => {
    navigate('/seller/orders');
  };

  return (
    <div className="flex flex-col h-screen justify-between max-w-md mx-auto bg-white">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">Receipt</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-6">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <span 
            className="material-symbols-outlined text-white" 
            style={{ fontSize: '64px' }}
          >
            check
          </span>
        </div>
        
        <p className="text-5xl font-bold text-gray-900 mb-8">$150.00</p>
        
        <div className="w-full space-y-4 text-sm">
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-600">Buyer:</span>
            <span className="font-medium text-gray-900">BuildCo Ltd.</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium text-gray-900">1234567890</span>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-gray-600">Payment type:</span>
            <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 space-y-3">
        <button 
          onClick={handleDownloadPDF}
          className="w-full bg-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-800 transition-colors"
        >
          <span className="material-symbols-outlined">
            download
          </span>
          <span>Download PDF for Accounting</span>
        </button>
        
        <button 
          onClick={handleBackToOrders}
          className="w-full bg-gray-100 text-gray-900 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Back to Orders
        </button>
      </footer>
    </div>
  );
};

export default CashReceiptForSupplier;
