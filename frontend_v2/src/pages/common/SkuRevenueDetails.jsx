import React, { useState } from 'react';

const SkuRevenueDetails = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const skuData = [
    {
      id: 'SKU-001',
      name: 'Steel Beam 6m',
      category: 'Steel Products',
      price: 150.00,
      sold: 45,
      revenue: 6750.00,
      profit: 1350.00,
      margin: 20
    },
    {
      id: 'SKU-002',
      name: 'Concrete Mix C25',
      category: 'Construction Materials',
      price: 85.00,
      sold: 120,
      revenue: 10200.00,
      profit: 2040.00,
      margin: 20
    },
    {
      id: 'SKU-003',
      name: 'Rebar 12mm',
      category: 'Steel Products',
      price: 25.00,
      sold: 200,
      revenue: 5000.00,
      profit: 1000.00,
      margin: 20
    },
    {
      id: 'SKU-004',
      name: 'Cement Bag 50kg',
      category: 'Construction Materials',
      price: 12.00,
      sold: 300,
      revenue: 3600.00,
      profit: 720.00,
      margin: 20
    }
  ];

  const filteredData = skuData.filter(sku => 
    selectedCategory === 'all' || sku.category === selectedCategory
  );

  const totalRevenue = filteredData.reduce((sum, sku) => sum + sku.revenue, 0);
  const totalProfit = filteredData.reduce((sum, sku) => sum + sku.profit, 0);
  const totalSold = filteredData.reduce((sum, sku) => sum + sku.sold, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">SKU Daromad Tafsilotlari</h1>
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
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <span className="material-symbols-outlined mr-2">download</span>
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-green-600 mr-2">attach_money</span>
              <div>
                <p className="text-sm text-gray-600">Jami Daromad</p>
                <p className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-blue-600 mr-2">trending_up</span>
              <div>
                <p className="text-sm text-gray-600">Jami Foyda</p>
                <p className="text-xl font-bold text-blue-600">${totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-purple-600 mr-2">inventory</span>
              <div>
                <p className="text-sm text-gray-600">Sotilgan Mahsulot</p>
                <p className="text-xl font-bold text-purple-600">{totalSold}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-orange-600 mr-2">percent</span>
              <div>
                <p className="text-sm text-gray-600">O'rtacha Marjinal</p>
                <p className="text-xl font-bold text-orange-600">20%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filterlar</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Barcha kategoriyalar</option>
            <option value="Steel Products">Po'lat mahsulotlari</option>
            <option value="Construction Materials">Qurilish materiallari</option>
          </select>
        </div>
      </div>

      {/* SKU Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahsulot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Narx
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sotilgan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daromad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foyda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marjinal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((sku) => (
                <tr key={sku.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{sku.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sku.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {sku.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sku.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sku.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    ${sku.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    ${sku.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${sku.margin}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{sku.margin}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xulosa</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Eng ko'p sotilgan</p>
            <p className="text-xl font-bold text-gray-900">
              {filteredData.reduce((max, sku) => sku.sold > max.sold ? sku : max, filteredData[0])?.name}
            </p>
            <p className="text-sm text-gray-500">
              {filteredData.reduce((max, sku) => sku.sold > max.sold ? sku : max, filteredData[0])?.sold} dona
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Eng yuqori daromad</p>
            <p className="text-xl font-bold text-gray-900">
              {filteredData.reduce((max, sku) => sku.revenue > max.revenue ? sku : max, filteredData[0])?.name}
            </p>
            <p className="text-sm text-gray-500">
              ${filteredData.reduce((max, sku) => sku.revenue > max.revenue ? sku : max, filteredData[0])?.revenue.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Eng yuqori foyda</p>
            <p className="text-xl font-bold text-gray-900">
              {filteredData.reduce((max, sku) => sku.profit > max.profit ? sku : max, filteredData[0])?.name}
            </p>
            <p className="text-sm text-gray-500">
              ${filteredData.reduce((max, sku) => sku.profit > max.profit ? sku : max, filteredData[0])?.profit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkuRevenueDetails;
