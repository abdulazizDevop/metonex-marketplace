import React, { useState } from 'react';

const AvailableSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const suppliers = [
    {
      id: 'SUP-001',
      name: 'MetallTech Solutions',
      category: 'Steel Products',
      rating: 4.8,
      completedOrders: 156,
      responseTime: '2 hours',
      location: 'Tashkent',
      verified: true,
      specialties: ['Steel Beams', 'Rebar', 'Metal Sheets'],
      priceRange: '$$'
    },
    {
      id: 'SUP-002',
      name: 'SteelWorks Ltd.',
      category: 'Steel Products',
      rating: 4.6,
      completedOrders: 89,
      responseTime: '4 hours',
      location: 'Samarkand',
      verified: true,
      specialties: ['Steel Beams', 'Metal Fabrication', 'Welding'],
      priceRange: '$$'
    },
    {
      id: 'SUP-003',
      name: 'Construction Materials Co.',
      category: 'Construction Materials',
      rating: 4.4,
      completedOrders: 234,
      responseTime: '1 hour',
      location: 'Bukhara',
      verified: false,
      specialties: ['Cement', 'Concrete', 'Building Blocks'],
      priceRange: '$'
    }
  ];

  const filteredSuppliers = suppliers
    .filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'orders':
          return b.completedOrders - a.completedOrders;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mavjud Supplierlar</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Supplier nomi bo'yicha qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Barcha kategoriyalar</option>
              <option value="Steel Products">Steel Products</option>
              <option value="Construction Materials">Construction Materials</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="rating">Reyting bo'yicha</option>
              <option value="orders">Buyurtmalar bo'yicha</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {supplier.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <div className="flex items-center space-x-2">
                        {supplier.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            ✓ Tasdiqlangan
                          </span>
                        )}
                        <span className="text-sm text-gray-500">{supplier.priceRange}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reyting:</span>
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-yellow-500 mr-1 text-sm">
                        star
                      </span>
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Buyurtmalar:</span>
                    <span className="font-medium">{supplier.completedOrders}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Javob vaqti:</span>
                    <span className="font-medium">{supplier.responseTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Manzil:</span>
                    <span className="font-medium">{supplier.location}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Ixtisosliklar:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <span className="material-symbols-outlined mr-1 text-sm">message</span>
                    Bog'lanish
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <span className="material-symbols-outlined mr-1 text-sm">visibility</span>
                    Profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableSuppliers;