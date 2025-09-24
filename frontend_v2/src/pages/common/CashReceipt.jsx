import React from 'react';
import { useNavigate } from 'react-router-dom';

const CashReceipt = () => {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF receipt...');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen flex-col bg-white" style={{fontFamily: "'Manrope', sans-serif"}}>
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button 
          onClick={handleBack}
          className="text-gray-900 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Receipt</h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-50">
          <span className="material-symbols-outlined text-5xl text-purple-700">
            receipt_long
          </span>
        </div>
        
        <p className="text-5xl font-bold text-gray-900">$150.00</p>
        
        <div className="mt-8 w-full max-w-sm px-6">
          <div className="flex justify-between border-t border-gray-200 py-4">
            <p className="text-gray-600">Order ID</p>
            <p className="font-medium text-gray-900">#1234567890</p>
          </div>
          <div className="flex justify-between border-t border-gray-200 py-4">
            <p className="text-gray-600">Payment type</p>
            <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4">
        <div className="mx-auto max-w-sm space-y-3">
          <button 
            onClick={handleDownloadPDF}
            className="w-full rounded-xl bg-purple-700 py-4 text-center font-bold text-white transition-colors hover:bg-purple-800"
          >
            Download PDF
          </button>
          <button 
            onClick={handleBackToDashboard}
            className="w-full rounded-xl bg-gray-100 py-4 text-center font-bold text-gray-900 transition-colors hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CashReceipt;
