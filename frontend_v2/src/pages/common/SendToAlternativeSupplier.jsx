import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SendToAlternativeSupplier = () => {
  const navigate = useNavigate();
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const requestDetails = {
    requestId: 'REQ-2024-001',
    productType: 'Steel Beams',
    quantity: 50,
    requestedPrice: 7500.00,
    deadline: '2024-01-25',
    specifications: 'Grade A steel, 6m length, galvanized finish'
  };

  const availableSuppliers = [
    {
      id: 'SUP-001',
      name: 'MetallTech Solutions',
      rating: 4.8,
      completedOrders: 156,
      responseTime: '2 hours',
      specialties: ['Steel Products', 'Construction Materials'],
      location: 'Tashkent',
      verified: true
    },
    {
      id: 'SUP-002',
      name: 'SteelWorks Ltd.',
      rating: 4.6,
      completedOrders: 89,
      responseTime: '4 hours',
      specialties: ['Steel Products', 'Metal Fabrication'],
      location: 'Samarkand',
      verified: true
    },
    {
      id: 'SUP-003',
      name: 'Construction Materials Co.',
      rating: 4.4,
      completedOrders: 234,
      responseTime: '1 hour',
      specialties: ['Construction Materials', 'Building Supplies'],
      location: 'Bukhara',
      verified: false
    },
    {
      id: 'SUP-004',
      name: 'Premium Steel Corp.',
      rating: 4.9,
      completedOrders: 312,
      responseTime: '30 minutes',
      specialties: ['Steel Products', 'Industrial Materials'],
      location: 'Tashkent',
      verified: true
    },
    {
      id: 'SUP-005',
      name: 'Quick Supply Chain',
      rating: 4.2,
      completedOrders: 67,
      responseTime: '6 hours',
      specialties: ['Construction Materials'],
      location: 'Namangan',
      verified: false
    }
  ];

  const filteredSuppliers = availableSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSupplierToggle = (supplierId) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedSuppliers.length === 0) {
      alert('Iltimos, kamida bitta supplierni tanlang');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`${selectedSuppliers.length} ta supplierga so'rov yuborildi`);
      navigate('/buyer/requests');
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Muqobil Supplierlarga Yuborish</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              So'rov yuborish
            </span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="material-symbols-outlined text-blue-600 mr-3 mt-0.5">
                info
              </span>
              <div>
                <h3 className="text-blue-800 font-medium">Ma'lumot</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Tanlangan supplierlar so'rovni ko'radi va sizga taklif yuborishi mumkin. 
                  Siz eng yaxshi taklifni tanlashingiz mumkin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">So'rov Tafsilotlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">So'rov ID:</p>
              <p className="font-medium text-gray-900">#{requestDetails.requestId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mahsulot:</p>
              <p className="font-medium text-gray-900">{requestDetails.productType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Miqdor:</p>
              <p className="font-medium text-gray-900">{requestDetails.quantity} dona</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Muddat:</p>
              <p className="font-medium text-gray-900">{requestDetails.deadline}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Texnik talablar:</p>
              <p className="font-medium text-gray-900">{requestDetails.specifications}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mavjud Supplierlar</h2>
            <div className="text-sm text-gray-600">
              {selectedSuppliers.length} ta tanlangan
            </div>
          </div>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Supplier nomi yoki ixtisosligi bo'yicha qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>
        </div>

        {/* Supplier List */}
        <div className="space-y-4 mb-6">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
                selectedSuppliers.includes(supplier.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.includes(supplier.id)}
                      onChange={() => handleSupplierToggle(supplier.id)}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                        {supplier.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            ✓ Tasdiqlangan
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-yellow-500 mr-1 text-sm">
                            star
                          </span>
                          <span className="text-gray-600">Reyting:</span>
                          <span className="font-medium text-gray-900 ml-1">{supplier.rating}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-blue-500 mr-1 text-sm">
                            inventory
                          </span>
                          <span className="text-gray-600">Buyurtmalar:</span>
                          <span className="font-medium text-gray-900 ml-1">{supplier.completedOrders}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-green-500 mr-1 text-sm">
                            schedule
                          </span>
                          <span className="text-gray-600">Javob:</span>
                          <span className="font-medium text-gray-900 ml-1">{supplier.responseTime}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-gray-500 mr-1 text-sm">
                            location_on
                          </span>
                          <span className="text-gray-600">Manzil:</span>
                          <span className="font-medium text-gray-900 ml-1">{supplier.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Ixtisosliklar:</p>
                        <div className="flex flex-wrap gap-2">
                          {supplier.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSupplierToggle(supplier.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSuppliers.includes(supplier.id)
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedSuppliers.includes(supplier.id) ? 'Tanlangan' : 'Tanlash'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Message */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maxsus Xabar (Ixtiyoriy)</h3>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Supplierlarga qo'shimcha ma'lumot yuborish uchun xabar yozing..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Bu xabar barcha tanlangan supplierlarga yuboriladi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedSuppliers.length > 0 ? (
                <span className="text-green-600 font-medium">
                  {selectedSuppliers.length} ta supplier tanlandi
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Hech qanday supplier tanlanmagan
                </span>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedSuppliers.length === 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined mr-2 animate-spin text-sm">refresh</span>
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2 text-sm">send</span>
                    Supplierlarga Yuborish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendToAlternativeSupplier;
