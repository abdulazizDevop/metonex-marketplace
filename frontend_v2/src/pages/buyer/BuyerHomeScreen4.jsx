import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerHomeScreen4 = () => {
  const navigate = useNavigate();
  
  const [estimateData] = useState({
    projectName: "Downtown Tower",
    materials: [
      {
        id: 1,
        name: "Rebar 12mm",
        needed: 50,
        purchased: 20,
        remaining: 30,
        unit: "tons",
        progress: 40
      },
      {
        id: 2,
        name: "Cement M500",
        needed: 100,
        purchased: 70,
        remaining: 30,
        unit: "tons",
        progress: 70
      },
      {
        id: 3,
        name: "Bricks",
        needed: 10000,
        purchased: 2000,
        remaining: 8000,
        unit: "pcs",
        progress: 20
      },
      {
        id: 4,
        name: "Sand",
        needed: 200,
        purchased: 190,
        remaining: 10,
        unit: "m³",
        progress: 95
      }
    ],
    summary: {
      totalValue: 120000,
      paid: 45000,
      remaining: 75000,
      paidChange: -8.2,
      remainingChange: 12.5
    }
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuyRemaining = () => {
    console.log('Buying remaining items...');
    // Navigate to purchase page
  };

  const handleComparePrices = () => {
    console.log('Comparing prices...');
    // Navigate to price comparison page
  };

  const handleViewReport = () => {
    console.log('Viewing report...');
    // Navigate to report page
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute left-0">
              <button 
                onClick={handleBack}
                className="flex items-center text-[#5E5CE6] hover:text-[#4A48D1]"
              >
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold">Estimate: {estimateData.projectName}</h1>
              <p className="text-xs text-[#6E6E73]">Track what's purchased and remaining</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 space-y-5 pb-56">
        {estimateData.materials.map((material) => (
          <div key={material.id} className="bg-[#FFFFFF] p-4 rounded-xl shadow-sm space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm font-medium mb-1">
                <span className="font-semibold text-base">{material.name}</span>
              </div>
              <div className="w-full bg-[#E5E5EA] rounded-full h-2.5 my-2">
                <div 
                  className="bg-[#5E5CE6] h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${material.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-200 text-center text-xs">
                <div className="px-1">
                  <p className="text-[#6E6E73]">Needed</p>
                  <p className="font-bold text-sm text-[#1D1D1F]">
                    {formatNumber(material.needed)} {material.unit}
                  </p>
                </div>
                <div className="px-1">
                  <p className="text-[#6E6E73]">Purchased</p>
                  <p className="font-bold text-sm text-[#1D1D1F]">
                    {formatNumber(material.purchased)} {material.unit}
                  </p>
                </div>
                <div className="px-1">
                  <p className="text-[#6E6E73]">Remaining</p>
                  <p className="font-bold text-sm text-[#1D1D1F]">
                    {formatNumber(material.remaining)} {material.unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-[#E5E5EA] p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Summary Card */}
          <div className="bg-[#FFFFFF] p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm text-[#6E6E73]">Total Value</p>
                <p className="text-lg font-bold text-[#1D1D1F]">
                  ${formatNumber(estimateData.summary.totalValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6E6E73]">Paid</p>
                <p className="text-lg font-bold text-[#1D1D1F]">
                  ${formatNumber(estimateData.summary.paid)}
                </p>
                <div className="flex items-center justify-center text-xs text-[#34C759]">
                  <span className="material-symbols-outlined text-sm">arrow_downward</span>
                  <span>{Math.abs(estimateData.summary.paidChange)}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6E6E73]">Remaining</p>
                <p className="text-lg font-bold text-[#1D1D1F]">
                  ${formatNumber(estimateData.summary.remaining)}
                </p>
                <div className="flex items-center justify-center text-xs text-[#FF3B30]">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>{estimateData.summary.remainingChange}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button 
              onClick={handleBuyRemaining}
              className="w-full py-3 px-4 text-base font-semibold bg-[#5E5CE6] text-white rounded-xl hover:opacity-90 transition-opacity shadow-md"
            >
              Buy Remaining Items
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleComparePrices}
                className="w-full py-3 px-4 text-base font-semibold bg-gray-100 text-[#1D1D1F] rounded-xl hover:bg-gray-200 transition-colors"
              >
                Compare Prices
              </button>
              <button 
                onClick={handleViewReport}
                className="w-full py-3 px-4 text-base font-semibold bg-gray-100 text-[#1D1D1F] rounded-xl hover:bg-gray-200 transition-colors"
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuyerHomeScreen4;