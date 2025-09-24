import React, { useState } from 'react';

const AllMetricsDynamicView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const metrics = [
    {
      id: 'revenue',
      title: 'Jami Daromad',
      value: 245000,
      change: 12.5,
      trend: 'up',
      icon: 'attach_money',
      color: 'green'
    },
    {
      id: 'orders',
      title: 'Buyurtmalar',
      value: 156,
      change: 8.2,
      trend: 'up',
      icon: 'shopping_cart',
      color: 'blue'
    },
    {
      id: 'customers',
      title: 'Mijozlar',
      value: 89,
      change: -2.1,
      trend: 'down',
      icon: 'people',
      color: 'purple'
    },
    {
      id: 'conversion',
      title: 'Konversiya',
      value: 3.8,
      change: 15.3,
      trend: 'up',
      icon: 'trending_up',
      color: 'orange'
    },
    {
      id: 'satisfaction',
      title: 'Mamnuniyat',
      value: 4.6,
      change: 0.8,
      trend: 'up',
      icon: 'star',
      color: 'yellow'
    },
    {
      id: 'returns',
      title: 'Qaytarishlar',
      value: 2.3,
      change: -5.2,
      trend: 'down',
      icon: 'keyboard_return',
      color: 'red'
    }
  ];

  const chartData = {
    revenue: [18000, 22000, 19500, 28000, 32000, 24500, 31000],
    orders: [12, 18, 15, 24, 28, 22, 26],
    customers: [8, 12, 10, 16, 18, 14, 17]
  };

  const getColorClasses = (color, trend) => {
    const colors = {
      green: trend === 'up' ? 'text-green-600 bg-green-50' : 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      red: trend === 'down' ? 'text-red-600 bg-red-50' : 'text-red-600 bg-red-50'
    };
    return colors[color] || 'text-gray-600 bg-gray-50';
  };

  const formatValue = (metric, value) => {
    if (metric === 'conversion' || metric === 'satisfaction') {
      return `${value}${metric === 'conversion' ? '%' : '/5'}`;
    }
    if (metric === 'returns') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Dinamik Metrikalar</h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="week">Oxirgi hafta</option>
                <option value="month">Oxirgi oy</option>
                <option value="quarter">Oxirgi chorak</option>
                <option value="year">Oxirgi yil</option>
              </select>
              
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="grid">Grid ko'rinish</option>
                <option value="list">Ro'yxat ko'rinish</option>
                <option value="chart">Grafik ko'rinish</option>
              </select>
              
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <span className="material-symbols-outlined mr-2 text-sm">download</span>
                Export
              </button>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="material-symbols-outlined text-purple-600 mr-3 mt-0.5">
                analytics
              </span>
              <div>
                <h3 className="text-purple-800 font-medium">Real-time Analytics</h3>
                <p className="text-purple-700 text-sm mt-1">
                  Barcha metrikalar real vaqtda yangilanadi va interaktiv grafiklar bilan ko'rsatiladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {metrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(metric.color, metric.trend)}`}>
                    <span className="material-symbols-outlined text-xl">
                      {metric.icon}
                    </span>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span className="material-symbols-outlined mr-1 text-sm">
                      {metric.trend === 'up' ? 'trending_up' : 'trending_down'}
                    </span>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{metric.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatValue(metric.id, metric.value)}
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.color === 'green' ? 'bg-green-500' :
                      metric.color === 'blue' ? 'bg-blue-500' :
                      metric.color === 'purple' ? 'bg-purple-500' :
                      metric.color === 'orange' ? 'bg-orange-500' :
                      metric.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (metric.value / 1000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart View */}
        {viewMode === 'chart' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Metrikalar Grafigi</h2>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
                  show_chart
                </span>
                <p className="text-gray-600">Interactive chart will be displayed here</p>
                <p className="text-sm text-gray-500">Chart.js or similar library integration</p>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metrika
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qiymat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      O'zgarish
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.map((metric) => (
                    <tr key={metric.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${getColorClasses(metric.color, metric.trend)}`}>
                            <span className="material-symbols-outlined text-sm">
                              {metric.icon}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{metric.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatValue(metric.id, metric.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <span className="material-symbols-outlined mr-1 text-sm">
                            {metric.trend === 'up' ? 'trending_up' : 'trending_down'}
                          </span>
                          {metric.trend === 'up' ? 'O\'sish' : 'Pasayish'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Eng Yuqori Ko'rsatkich</h3>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="material-symbols-outlined text-green-600">
                  trending_up
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Konversiya</p>
                <p className="text-2xl font-bold text-green-600">15.3%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Diqqat Kerak</h3>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <span className="material-symbols-outlined text-red-600">
                  trending_down
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mijozlar</p>
                <p className="text-2xl font-bold text-red-600">-2.1%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">O'rtacha Ko'rsatkich</h3>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="material-symbols-outlined text-blue-600">
                  analytics
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Buyurtmalar</p>
                <p className="text-2xl font-bold text-blue-600">8.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMetricsDynamicView;