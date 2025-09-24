import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard1 = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('category'); // 'category' or 'supplier'
  
  const [dashboardData] = useState({
    outstandingAmount: 3200,
    totalSpend: 12450,
    outstandingChange: 12,
    spendChange: 8,
    chartData: [
      { month: 'Jan', metal: 60, cement: 75, concrete: 90 },
      { month: 'Feb', metal: 75, cement: 80, concrete: 85 },
      { month: 'Mar', metal: 90, cement: 85, concrete: 80 },
      { month: 'Apr', metal: 55, cement: 70, concrete: 75 },
      { month: 'May', metal: 80, cement: 90, concrete: 85 },
      { month: 'Jun', metal: 40, cement: 60, concrete: 70 },
      { month: 'Jul', metal: 70, cement: 75, concrete: 80 }
    ],
    topPurchases: [
      { category: 'Metal', percentage: 35, color: 'bg-gray-400' },
      { category: 'Cement', percentage: 28, color: 'bg-purple-500' },
      { category: 'Concrete', percentage: 22, color: 'bg-blue-500' }
    ],
    topSupplier: {
      id: '14ad',
      category: 'Cement',
      description: 'Mostly purchased: Cement'
    },
    lastPurchase: {
      item: 'Reinforced Steel Bars',
      quantity: '10 tons',
      amount: 2500,
      date: 'Jul 20',
      nextPayment: 'Aug 15, 2024'
    }
  });

  const handleSettings = () => {
    console.log('Opening settings...');
    // Navigate to settings page
  };

  const handleReorder = () => {
    console.log('Reordering from top supplier...');
    // Navigate to reorder page
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white">
      <div className="flex-grow pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 px-4 py-3 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={handleSettings}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-gray-600" style={{ fontSize: '24px' }}>
              settings
            </span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 px-4 py-4">
          <div className="rounded-2xl bg-gray-100 p-4">
            <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
            <p className="mt-1 text-3xl font-bold text-orange-500">
              {formatCurrency(dashboardData.outstandingAmount)}
            </p>
            <div className="mt-2 flex items-center">
              <span className="material-symbols-outlined text-green-500" style={{ fontSize: '16px' }}>
                arrow_upward
              </span>
              <p className="ml-1 text-xs font-medium text-green-500">
                +{dashboardData.outstandingChange}% vs last month
              </p>
            </div>
          </div>
          
          <div className="rounded-2xl bg-gray-100 p-4">
            <p className="text-sm font-medium text-gray-600">Total Spend This Month</p>
            <p className="mt-1 text-3xl font-bold text-[#5E5CE6]">
              {formatCurrency(dashboardData.totalSpend)}
            </p>
            <div className="mt-2 flex items-center">
              <span className="material-symbols-outlined text-green-500" style={{ fontSize: '16px' }}>
                arrow_upward
              </span>
              <p className="ml-1 text-xs font-medium text-green-500">
                +{dashboardData.spendChange}% vs last month
              </p>
            </div>
          </div>
        </div>

        {/* Spending Overview */}
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold text-gray-900">Spending Overview</h2>
          <div className="mt-3">
            <div className="flex justify-center rounded-lg bg-gray-100 p-1">
              <button 
                onClick={() => handleViewModeChange('category')}
                className={`flex-1 rounded-md py-1.5 text-center text-sm font-medium transition-colors ${
                  viewMode === 'category' 
                    ? 'bg-white text-gray-800 shadow-sm font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                By Category
              </button>
              <button 
                onClick={() => handleViewModeChange('supplier')}
                className={`flex-1 rounded-md py-1.5 text-center text-sm font-medium transition-colors ${
                  viewMode === 'supplier' 
                    ? 'bg-white text-gray-800 shadow-sm font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                By Supplier
              </button>
            </div>
            
            <div className="mt-4 h-56 rounded-2xl bg-gray-100 p-4">
              <div className="grid h-full grid-cols-7 items-end gap-3">
                {dashboardData.chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="h-[60%] rounded-t-lg bg-gray-400 w-full"></div>
                    <div className="h-[75%] rounded-t-lg bg-purple-500 w-full"></div>
                    <div className="h-[90%] rounded-t-lg bg-blue-500 w-full"></div>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 grid grid-cols-7 text-center">
                {dashboardData.chartData.map((data, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {data.month}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
                  <p className="ml-1.5 text-xs text-gray-600">Metal</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                  <p className="ml-1.5 text-xs text-gray-600">Cement</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                  <p className="ml-1.5 text-xs text-gray-600">Concrete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Purchases */}
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900">Top Purchases</h2>
          <div className="mt-3 space-y-4 rounded-2xl bg-gray-100 p-4">
            {dashboardData.topPurchases.map((purchase, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <p>{purchase.category}</p>
                  <p>{purchase.percentage}%</p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className={`h-2 rounded-full ${purchase.color} transition-all duration-300`}
                    style={{ width: `${purchase.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Supplier */}
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900">Top Supplier</h2>
          <div className="mt-3 rounded-2xl bg-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">ID {dashboardData.topSupplier.id}</p>
                <p className="text-sm text-gray-500">{dashboardData.topSupplier.description}</p>
              </div>
              <button 
                onClick={handleReorder}
                className="rounded-xl bg-green-500 px-5 py-3 text-base font-semibold text-white hover:bg-green-600 transition-colors"
              >
                Reorder
              </button>
            </div>
          </div>
        </div>

        {/* Last Purchase */}
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900">Last Purchase</h2>
          <div className="mt-3 rounded-2xl bg-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{dashboardData.lastPurchase.item}</p>
                <p className="mt-1 text-sm text-gray-500">{dashboardData.lastPurchase.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(dashboardData.lastPurchase.amount)}
                </p>
                <p className="text-sm text-gray-500">{dashboardData.lastPurchase.date}</p>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-500">
                Next payment due: <span className="font-medium text-gray-700">
                  {dashboardData.lastPurchase.nextPayment}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 pb-3 pt-2 backdrop-blur-sm">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6]">
            <span className="material-symbols-outlined">home</span>
            <p className="text-xs font-medium">Home</p>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6]">
            <span className="material-symbols-outlined">list_alt</span>
            <p className="text-xs font-medium">Orders</p>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#5E5CE6]">
            <span className="material-symbols-outlined">bar_chart</span>
            <p className="text-xs font-medium">Dashboard</p>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5E5CE6]">
            <span className="material-symbols-outlined">person</span>
            <p className="text-xs font-medium">Profile</p>
          </button>
        </div>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default BuyerDashboard1;