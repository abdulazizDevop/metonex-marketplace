import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerSkuRevenueDetails = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');

  // Mock data for SKU revenue details
  const [skuData] = useState([
    {
      id: 'SKU-001',
      name: 'Concrete Mix C25',
      category: 'Concrete',
      unit: 'm³',
      price: 85,
      totalSold: 150,
      totalRevenue: 12750,
      profitMargin: 25,
      orders: 45,
      avgOrderValue: 283.33,
      lastSale: '2024-01-20',
      trend: 'up',
      change: 12.5
    },
    {
      id: 'SKU-002',
      name: 'Steel Bars 12mm',
      category: 'Steel',
      unit: 'ton',
      price: 450,
      totalSold: 25,
      totalRevenue: 11250,
      profitMargin: 30,
      orders: 18,
      avgOrderValue: 625,
      lastSale: '2024-01-19',
      trend: 'up',
      change: 8.3
    },
    {
      id: 'SKU-003',
      name: 'Cement Grade 42.5',
      category: 'Cement',
      unit: 'bag',
      price: 12,
      totalSold: 500,
      totalRevenue: 6000,
      profitMargin: 20,
      orders: 32,
      avgOrderValue: 187.5,
      lastSale: '2024-01-18',
      trend: 'down',
      change: -5.2
    },
    {
      id: 'SKU-004',
      name: 'Sand Fine',
      category: 'Aggregates',
      unit: 'm³',
      price: 35,
      totalSold: 200,
      totalRevenue: 7000,
      profitMargin: 15,
      orders: 28,
      avgOrderValue: 250,
      lastSale: '2024-01-17',
      trend: 'up',
      change: 15.7
    },
    {
      id: 'SKU-005',
      name: 'Gravel 20mm',
      category: 'Aggregates',
      unit: 'm³',
      price: 40,
      totalSold: 120,
      totalRevenue: 4800,
      profitMargin: 18,
      orders: 22,
      avgOrderValue: 218.18,
      lastSale: '2024-01-16',
      trend: 'stable',
      change: 0.5
    }
  ]);

  const categories = ['all', 'Concrete', 'Steel', 'Cement', 'Aggregates'];

  const handleBack = () => {
    navigate('/seller/dashboard');
  };

  const filteredData = skuData.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.totalRevenue - a.totalRevenue;
      case 'quantity':
        return b.totalSold - a.totalSold;
      case 'profit':
        return (b.totalRevenue * b.profitMargin / 100) - (a.totalRevenue * a.profitMargin / 100);
      case 'orders':
        return b.orders - a.orders;
      default:
        return 0;
    }
  });

  const totalRevenue = sortedData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = sortedData.reduce((sum, item) => sum + (item.totalRevenue * item.profitMargin / 100), 0);
  const totalOrders = sortedData.reduce((sum, item) => sum + item.orders, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SKU daromad tafsilotlari</h1>
              <p className="text-sm text-gray-500">Mahsulotlar bo'yicha daromad tahlili</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jami daromad</p>
                <p className="text-xl font-bold text-[#6C4FFF]">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-10 h-10 bg-[#6C4FFF]/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6C4FFF]">attach_money</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jami foyda</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalProfit)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">trending_up</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jami buyurtmalar</p>
                <p className="text-xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">O'rtacha foyda</p>
                <p className="text-xl font-bold text-orange-600">{((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600">percent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Davr</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
              >
                <option value="week">Oxirgi hafta</option>
                <option value="month">Oxirgi oy</option>
                <option value="quarter">Oxirgi chorak</option>
                <option value="year">Oxirgi yil</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Barcha kategoriyalar' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Saralash</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
              >
                <option value="revenue">Daromad bo'yicha</option>
                <option value="quantity">Miqdor bo'yicha</option>
                <option value="profit">Foyda bo'yicha</option>
                <option value="orders">Buyurtmalar bo'yicha</option>
              </select>
            </div>
          </div>
        </div>

        {/* SKU List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Mahsulotlar ro'yxati</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {item.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.category} • {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#6C4FFF]">{formatCurrency(item.totalRevenue)}</p>
                    <div className={`flex items-center text-sm ${getTrendColor(item.trend)}`}>
                      <span className="material-symbols-outlined text-sm mr-1">
                        {getTrendIcon(item.trend)}
                      </span>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Narx</p>
                    <p className="font-medium">{formatCurrency(item.price)}/{item.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sotilgan</p>
                    <p className="font-medium">{item.totalSold} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Foyda foizi</p>
                    <p className="font-medium text-green-600">{item.profitMargin}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Buyurtmalar</p>
                    <p className="font-medium">{item.orders}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>O'rtacha buyurtma: {formatCurrency(item.avgOrderValue)}</span>
                    <span>Oxirgi sotish: {new Date(item.lastSale).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium">
          <span className="material-symbols-outlined mr-2 text-sm">download</span>
          Ma'lumotlarni eksport qilish
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerSkuRevenueDetails;
