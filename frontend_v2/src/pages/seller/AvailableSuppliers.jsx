import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AvailableSuppliers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, price, eta
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState(null);

  // URL dan request ID ni olish
  const requestId = location.state?.requestId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (requestId) {
      fetchRequestAndSuppliers();
    }
  }, [requestId]);

  useEffect(() => {
    filterAndSortSuppliers();
  }, [suppliers, searchTerm, sortBy]);

  const fetchRequestAndSuppliers = async () => {
    try {
      setLoading(true);
      
      // Fetch request details
      // const requestResponse = await api.get(`/buyer/requests/${requestId}`);
      // setRequestData(requestResponse.data);
      
      // Mock request data
      setRequestData({
        id: requestId,
        title: 'Concrete Mix',
        quantity: '50 tons',
        deadline: '2024-08-15',
        specifications: 'High-grade concrete mix for foundation work'
      });

      // Fetch available suppliers
      // const suppliersResponse = await api.get(`/buyer/requests/${requestId}/available-suppliers`);
      // setSuppliers(suppliersResponse.data);
      
      // Mock suppliers data
      setSuppliers([
        {
          id: '12345',
          name: 'Toshkent Qurilish Materiallari',
          rating: 4.5,
          reviewCount: 123,
          price: 1000000,
          eta: 2,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdryttP_hZ1aOk38j1UfJbfA5OebrlBiw7thSPbx4WDN_QlLxeRQsUiZIFcpFdPHV1nu3Cl_xIr4U_0IMAPPzq7zpQGl8B0RJ-JhAMsg-PLY89sC-RmC-bVGaeWzpeh9vVg288XDJF5LSe0FECkk9ty51y8vugWrV9lz4d81ssqiPFji-6HftEipidgx88QMxwEw3TkWjldEBY1I1ueKZOdSs7ccgfrJRYkM_iBfzZf9EW6nnDKo6PwSDhZ0kL6e907xx5QbLaqx4',
          specialties: ['Concrete', 'Cement', 'Rebar'],
          location: 'Toshkent',
          verified: true,
          responseTime: '2 hours',
          minOrder: 10
        },
        {
          id: '67890',
          name: 'Samarqand Qurilish',
          rating: 4.2,
          reviewCount: 87,
          price: 1200000,
          eta: 3,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI31wkO9eVTgkFGDmhiqMjizara4ZdYNgG-Z3MXS94iBWSvxJDMLoBgWamNgXoj3DITxVkODWU9VFueaT0sqIjtNkT7M8dr7RSoutdGntzCkQ3mnJbkmr27OoTC7nH4RjaRsg6WEwTSh_keao6_VLbdM_jHpOD-MxYMX-047JoL1P-DFBMIikBJzFrtdEZPK9YaPzc552WF_VZAm24OJ38RyEFwMjyi6w64ygzK-GQWpO6aURFHamnDz8FUwOqXMKeejzG-jZOAaA',
          specialties: ['Concrete', 'Steel', 'Lumber'],
          location: 'Samarqand',
          verified: true,
          responseTime: '4 hours',
          minOrder: 20
        },
        {
          id: '11223',
          name: 'Premium Materials Co.',
          rating: 4.8,
          reviewCount: 200,
          price: 900000,
          eta: 1,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgPuS-UHMaMPZ0EBlleg_Yhd0_WnBfMKNAkrutiOKwCZXntW5hHvsiJjAkHxsgiQ6eOjJ9QTPHaPGPOlfVX4Au-KfblMpXZ5RJq5DpHDO0ILM-c4qAK6c755SjLX3HNRFF64YWSdds5wcwPPzKwwOO5OFTOQpF1_FCsAIZ6YzXlUotOYx8gUV6DVuBKnm5x9w4hreHfG_2ZfsMTBXP1fm6-8qk8-NqqVdfduYRIymfaDCZpI9hf4mrB5EmCIC0fnBjSNRYLwW8CXA',
          specialties: ['Concrete', 'Premium Materials'],
          location: 'Toshkent',
          verified: true,
          responseTime: '1 hour',
          minOrder: 5
        }
      ]);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Yetkazib beruvchilarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSuppliers = () => {
    let filtered = [...suppliers];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort suppliers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'eta':
          return a.eta - b.eta;
        default:
          return 0;
      }
    });

    setFilteredSuppliers(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleHelpMeChoose = () => {
    // AI-powered supplier recommendation
    navigate(`/buyer/ai-supplier-matcher/${requestId}`, {
      state: { requestData, suppliers }
    });
  };

  const handleViewSupplier = (supplierId) => {
    navigate(`/buyer/supplier-profile/${supplierId}`, {
      state: { 
        requestData,
        fromAvailableSuppliers: true
      }
    });
  };

  const handleOrderFromSupplier = (supplierId) => {
    navigate(`/buyer/create-order/${requestId}`, {
      state: { 
        requestData,
        selectedSupplier: suppliers.find(s => s.id === supplierId)
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getSortButtonClass = (sortType) => {
    return `px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
      sortBy === sortType
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
            error
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Xatolik</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 justify-between" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center p-4 bg-gray-50">
          <button 
            onClick={handleBack}
            className="text-gray-800 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h1 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Mavjud yetkazib beruvchilar
          </h1>
        </header>

        {/* AI Help Button */}
        <div className="flex px-6 py-4 justify-start">
          <button 
            onClick={handleHelpMeChoose}
            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-11 px-5 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined">
              auto_fix_high
            </span>
            <span className="truncate">Yordam berish</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="px-4 pb-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Yetkazib beruvchini qidirish..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => handleSortChange('rating')}
              className={getSortButtonClass('rating')}
            >
              Reyting
            </button>
            <button 
              onClick={() => handleSortChange('price')}
              className={getSortButtonClass('price')}
            >
              Narx
            </button>
            <button 
              onClick={() => handleSortChange('eta')}
              className={getSortButtonClass('eta')}
            >
              Yetkazib berish
            </button>
          </div>
        </div>

        {/* Suppliers List */}
        <div className="flex flex-col gap-4 p-4 pt-0">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                search_off
              </span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Yetkazib beruvchilar topilmadi
              </h3>
              <p className="text-gray-600">
                Qidiruv so'zingizni o'zgartiring yoki boshqa filtrlarni sinab ko'ring.
              </p>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-500">
                      Yetkazib beruvchi ID: {supplier.id}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
                      <p className="text-base font-bold text-gray-900">
                        {supplier.rating} <span className="font-normal text-gray-500">({supplier.reviewCount})</span>
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Narx: {formatCurrency(supplier.price)} • ETA: {supplier.eta} kun
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {supplier.location}
                      </span>
                      {supplier.verified && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Tasdiqlangan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Javob vaqti: {supplier.responseTime}
                    </p>
                  </div>
                  <div 
                    className="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: `url("${supplier.image}")`}}
                  ></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleViewSupplier(supplier.id)}
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-bold leading-normal text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <span className="truncate">Haqida</span>
                  </button>
                  <button 
                    onClick={() => handleOrderFromSupplier(supplier.id)}
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-sm font-bold leading-normal text-white hover:bg-blue-700 transition-colors"
                  >
                    <span className="truncate">Buyurtma</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <nav className="flex items-center justify-around px-4 pt-2 pb-5">
          <button 
            onClick={() => navigate('/buyer/dashboard')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">home</span>
            <p className="text-xs font-medium leading-normal">Bosh sahifa</p>
          </button>
          <button 
            onClick={() => navigate('/buyer/requests')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">list_alt</span>
            <p className="text-xs font-medium leading-normal">So'rovlar</p>
          </button>
          <button 
            onClick={() => navigate('/buyer/analytics')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">bar_chart</span>
            <p className="text-xs font-medium leading-normal">Tahlil</p>
          </button>
          <button 
            onClick={() => navigate('/buyer/profile')}
            className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <p className="text-xs font-medium leading-normal">Profil</p>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default AvailableSuppliers;
