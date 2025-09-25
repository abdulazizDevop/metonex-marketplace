import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('category'); // 'category' or 'supplier'
  const [hoveredBar, setHoveredBar] = useState(null);
  
  const [dashboardData] = useState({
    outstandingAmount: 3200,
    totalSpend: 12450,
    outstandingChange: 12,
    spendChange: 8,
    chartData: {
      category: [
        { month: 'Jan', metal: 60, cement: 75, concrete: 90 },
        { month: 'Feb', metal: 75, cement: 80, concrete: 85 },
        { month: 'Mar', metal: 90, cement: 85, concrete: 80 },
        { month: 'Apr', metal: 55, cement: 70, concrete: 75 },
        { month: 'May', metal: 80, cement: 90, concrete: 85 },
        { month: 'Jun', metal: 40, cement: 60, concrete: 70 },
        { month: 'Jul', metal: 70, cement: 75, concrete: 80 }
      ],
      supplier: [
        { month: 'Jan', suppliers: { '14ad': 60, '25fg': 75, '39hj': 90, others: 20 } },
        { month: 'Feb', suppliers: { '14ad': 75, '25fg': 80, '39hj': 85, others: 25 } },
        { month: 'Mar', suppliers: { '14ad': 90, '25fg': 85, '39hj': 80, others: 15 } },
        { month: 'Apr', suppliers: { '14ad': 95, '25fg': 70, '39hj': 75, others: 10 } },
        { month: 'May', suppliers: { '14ad': 70, '25fg': 90, '39hj': 85, others: 40 } },
        { month: 'Jun', suppliers: { '14ad': 80, '25fg': 60, '39hj': 70, others: 30 } }
      ]
    },
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

  const handleNewRequest = () => {
    navigate('/buyer/home');
  };

  const handleUploadBOM = () => {
    navigate('/buyer/orders');
  };

  const handleTrackOrders = () => {
    navigate('/buyer/orders');
  };

  const renderCategoryChart = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
        <div className="flex gap-2">
          {dashboardData.topPurchases.map((item, index) => (
            <div key={index} className="flex items-center gap-1 text-sm">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-gray-600">{item.category}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {dashboardData.chartData.category.map((month, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{month.month}</span>
              <span className="text-sm text-gray-500">${month.metal + month.cement + month.concrete}</span>
            </div>
            <div className="flex h-6 rounded-lg overflow-hidden">
              <div 
                className="bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${month.metal}%` }}
              >
                {month.metal > 15 && `${month.metal}%`}
              </div>
              <div 
                className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${month.cement}%` }}
              >
                {month.cement > 15 && `${month.cement}%`}
              </div>
              <div 
                className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${month.concrete}%` }}
              >
                {month.concrete > 15 && `${month.concrete}%`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupplierChart = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Spending by Supplier</h3>
        <div className="flex gap-2">
          {dashboardData.suppliers.map((supplier, index) => (
            <div key={index} className="flex items-center gap-1 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: supplier.color }}
              ></div>
              <span className="text-gray-600">{supplier.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {dashboardData.chartData.supplier.map((month, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{month.month}</span>
              <span className="text-sm text-gray-500">
                ${Object.values(month.suppliers).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <div className="flex h-6 rounded-lg overflow-hidden">
              {Object.entries(month.suppliers).map(([supplierId, value]) => {
                const supplier = dashboardData.suppliers.find(s => s.id === supplierId);
                return (
                  <div 
                    key={supplierId}
                    className="flex items-center justify-center text-xs text-white font-medium"
                    style={{ 
                      width: `${value}%`,
                      backgroundColor: supplier?.color || '#E0E0E0'
                    }}
                  >
                    {value > 15 && `${value}%`}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hi, Apex Construction 👋</h1>
              <p className="text-sm text-gray-500">Dashboard overview for your business</p>
            </div>
            <button 
              onClick={handleSettings}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={handleNewRequest}
              className="w-full flex items-center justify-center py-4 px-5 bg-primary text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
              <span className="text-lg font-semibold">New Request</span>
              <span className="material-symbols-outlined ml-2">add</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleUploadBOM}
                className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-start gap-1 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-accent">upload_file</span>
                <span className="text-sm font-semibold">Upload Estimate</span>
              </button>
              <button 
                onClick={handleTrackOrders}
                className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-start gap-1 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-green-500">local_shipping</span>
                <span className="text-sm font-semibold">Track Orders</span>
              </button>
            </div>
          </div>
        </section>

        {/* Financial Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">To Pay</p>
              <p className="text-2xl font-bold mt-1">${dashboardData.outstandingAmount.toLocaleString()}</p>
              <div className="flex items-center text-xs text-red-500 mt-1">
                <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
                <span>+{dashboardData.outstandingChange}% vs last month</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Total Spend</p>
              <p className="text-2xl font-bold mt-1">${dashboardData.totalSpend.toLocaleString()}</p>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
                <span>+{dashboardData.spendChange}% vs last month</span>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Spending Analysis</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('category')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'category'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  By Category
                </button>
                <button
                  onClick={() => setViewMode('supplier')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'supplier'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  By Supplier
                </button>
              </div>
            </div>
            
            {viewMode === 'category' ? renderCategoryChart() : renderSupplierChart()}
          </div>
        </section>

        {/* Top Supplier & Last Purchase */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Supplier */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Supplier</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">{dashboardData.topSupplier.id}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Supplier {dashboardData.topSupplier.id}</p>
                <p className="text-sm text-gray-500">{dashboardData.topSupplier.description}</p>
              </div>
              <button 
                onClick={handleReorder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Reorder
              </button>
            </div>
          </div>

          {/* Last Purchase */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Purchase</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{dashboardData.lastPurchase.item}</p>
                <p className="text-sm text-gray-500">{dashboardData.lastPurchase.quantity}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">${dashboardData.lastPurchase.amount.toLocaleString()}</span>
                <span className="text-sm text-gray-500">{dashboardData.lastPurchase.date}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">Next payment: {dashboardData.lastPurchase.nextPayment}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => navigate('/buyer/home')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/orders')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/counter-offers')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
            <span className="text-xs font-medium">Counter Offers</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/notifications')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="text-xs font-medium">Notifications</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <span className="material-symbols-outlined">business</span>
            <span className="text-xs font-bold">My Company</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BuyerDashboard;
