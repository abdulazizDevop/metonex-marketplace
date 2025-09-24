import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard2 = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('supplier'); // 'category' or 'supplier'
  const [hoveredBar, setHoveredBar] = useState(null);
  
  const [dashboardData] = useState({
    outstandingAmount: 3200,
    totalSpend: 12450,
    outstandingChange: 12,
    spendChange: 8,
    chartData: [
      { month: 'Jan', suppliers: { '14ad': 60, '25fg': 75, '39hj': 90, others: 20 } },
      { month: 'Feb', suppliers: { '14ad': 75, '25fg': 80, '39hj': 85, others: 25 } },
      { month: 'Mar', suppliers: { '14ad': 90, '25fg': 85, '39hj': 80, others: 15 } },
      { month: 'Apr', suppliers: { '14ad': 95, '25fg': 70, '39hj': 75, others: 10 } },
      { month: 'May', suppliers: { '14ad': 70, '25fg': 90, '39hj': 85, others: 40 } },
      { month: 'Jun', suppliers: { '14ad': 80, '25fg': 60, '39hj': 70, others: 30 } }
    ],
    topPurchases: [
      { category: 'Metal', percentage: 35 },
      { category: 'Cement', percentage: 28 },
      { category: 'Concrete', percentage: 22 }
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
    },
    suppliers: [
      { id: '14ad', color: '#64B5F6', name: 'ID 14ad' },
      { id: '25fg', color: '#9575CD', name: 'ID 25fg' },
      { id: '39hj', color: '#78909C', name: 'ID 39hj' },
      { id: 'others', color: '#E0E0E0', name: 'Others' }
    ]
  });

  const handleSettings = () => {
    console.log('Opening settings...');
    // Navigate to settings page
  };

  const handleReorder = () => {
    console.log('Reordering from top supplier...');
    // Navigate to reorder page
  };

  const handleReorderFromSupplier = () => {
    console.log('Reordering from Supplier ID 14ad...');
    // Navigate to reorder page
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const getSupplierColor = (supplierId) => {
    const supplier = dashboardData.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.color : '#E0E0E0';
  };

  const getSupplierName = (supplierId) => {
    const supplier = dashboardData.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Others';
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white">
      <div className="flex-grow pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 px-4 py-3 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={handleSettings}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <span className="material-symbols-outlined text-gray-600" style={{ fontSize: '20px' }}>
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
                    ? 'bg-white text-[#5E5CE6] shadow-sm font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                By Supplier
              </button>
            </div>
            
            <div className="mt-4 rounded-2xl bg-gray-100 p-4">
              <div className="flex h-[180px] items-end justify-between space-x-2">
                <div className="h-full w-full flex items-end">
                  <div className="flex h-full w-full justify-around items-end">
                    {dashboardData.chartData.map((data, index) => (
                      <div key={index} className="flex flex-col w-8 h-full items-center justify-end">
                        <div 
                          className="flex flex-col w-full rounded-lg overflow-hidden relative"
                          style={{ height: `${Math.max(...Object.values(data.suppliers))}%` }}
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {Object.entries(data.suppliers).map(([supplierId, percentage]) => (
                            <div
                              key={supplierId}
                              className="w-full"
                              style={{ 
                                height: `${(percentage / Math.max(...Object.values(data.suppliers))) * 100}%`,
                                backgroundColor: getSupplierColor(supplierId)
                              }}
                            />
                          ))}
                          {index === 3 && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-90 shadow-lg">
                              Apr 2024 - ID 14ad - $3,200
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] h-2 w-2 rotate-45 bg-gray-800"></div>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs mt-1 ${index === 3 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                          {data.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {dashboardData.suppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center text-xs text-gray-600">
                    <span 
                      className="mr-1.5 h-2 w-2 rounded-full"
                      style={{ backgroundColor: supplier.color }}
                    />
                    {supplier.name}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleReorderFromSupplier}
                className="mt-4 w-full rounded-xl bg-green-500 py-3 text-base font-semibold text-white hover:bg-green-600 transition-colors"
              >
                Reorder from Supplier ID 14ad
              </button>
            </div>
          </div>
        </div>

        {/* Top Purchases */}
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900">Top Purchases</h2>
          <div className="mt-3 space-y-4">
            {dashboardData.topPurchases.map((purchase, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <p>{purchase.category}</p>
                  <p>{purchase.percentage}%</p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-2 rounded-full bg-[#5E5CE6] transition-all duration-300"
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
                className="rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
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

export default BuyerDashboard2;