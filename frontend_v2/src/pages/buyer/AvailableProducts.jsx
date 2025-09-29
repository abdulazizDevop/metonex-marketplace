import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AvailableProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, price, eta
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // URL dan selected categories ni olish
  const categories = location.state?.selectedCategories || [];

  useEffect(() => {
    setSelectedCategories(categories);
    fetchProducts();
  }, [categories.length, categories.join(',')]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products based on selected categories
      // const productsResponse = await api.get(`/products?categories=${categories.join(',')}`);
      // setProducts(productsResponse.data);
      
      // Mock products data based on selected categories
      const mockProducts = [
        {
          id: 'prod-001',
          name: 'Armatura Ø12mm',
          category: 'Metal',
          rating: 4.5,
          reviewCount: 123,
          price: 850000,
          unit: 'ton',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdryttP_hZ1aOk38j1UfJbfA5OebrlBiw7thSPbx4WDN_QlLxeRQsUiZIFcpFdPHV1nu3Cl_xIr4U_0IMAPPzq7zpQGl8B0RJ-JhAMsg-PLY89sC-RmC-bVGaeWzpeh9vVg288XDJF5LSe0FECkk9ty51y8vugWrV9lz4d81ssqiPFji-6HftEipidgx88QMxwEw3TkWjldEBY1I1ueKZOdSs7ccgfrJRYkM_iBfzZf9EW6nnDKo6PwSDhZ0kL6e907xx5QbLaqx4',
          supplier: 'Toshkent Qurilish Materiallari',
          location: 'Toshkent',
          verified: true,
          minOrder: 5,
          inStock: true
        },
        {
          id: 'prod-002',
          name: 'Cement M400',
          category: 'Cement',
          rating: 4.2,
          reviewCount: 87,
          price: 450000,
          unit: 'ton',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI31wkO9eVTgkFGDmhiqMjizara4ZdYNgG-Z3MXS94iBWSvxJDMLoBgWamNgXoj3DITxVkODWU9VFueaT0sqIjtNkT7M8dr7RSoutdGntzCkQ3mnJbkmr27OoTC7nH4RjaRsg6WEwTSh_keao6_VLbdM_jHpOD-MxYMX-047JoL1P-DFBMIikBJzFrtdEZPK9YaPzc552WF_VZAm24OJ38RyEFwMjyi6w64ygzK-GQWpO6aURFHamnDz8FUwOqXMKeejzG-jZOAaA',
          supplier: 'Samarqand Qurilish',
          location: 'Samarqand',
          verified: true,
          minOrder: 10,
          inStock: true
        },
        {
          id: 'prod-003',
          name: 'Concrete Mix C25',
          category: 'Concrete',
          rating: 4.8,
          reviewCount: 200,
          price: 120000,
          unit: 'm³',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgPuS-UHMaMPZ0EBlleg_Yhd0_WnBfMKNAkrutiOKwCZXntW5hHvsiJjAkHxsgiQ6eOjJ9QTPHaPGPOlfVX4Au-KfblMpXZ5RJq5DpHDO0ILM-c4qAK6c755SjLX3HNRFF64YWSdds5wcwPPzKwwOO5OFTOQpF1_FCsAIZ6YzXlUotOYx8gUV6DVuBKnm5x9w4hreHfG_2ZfsMTBXP1fm6-8qk8-NqqVdfduYRIymfaDCZpI9hf4mrB5EmCIC0fnBjSNRYLwW8CXA',
          supplier: 'Premium Materials Co.',
          location: 'Toshkent',
          verified: true,
          minOrder: 1,
          inStock: true
        },
        {
          id: 'prod-004',
          name: 'Interior Paint White',
          category: 'Paint',
          rating: 4.3,
          reviewCount: 156,
          price: 85000,
          unit: 'liter',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdryttP_hZ1aOk38j1UfJbfA5OebrlBiw7thSPbx4WDN_QlLxeRQsUiZIFcpFdPHV1nu3Cl_xIr4U_0IMAPPzq7zpQGl8B0RJ-JhAMsg-PLY89sC-RmC-bVGaeWzpeh9vVg288XDJF5LSe0FECkk9ty51y8vugWrV9lz4d81ssqiPFji-6HftEipidgx88QMxwEw3TkWjldEBY1I1ueKZOdSs7ccgfrJRYkM_iBfzZf9EW6nnDKo6PwSDhZ0kL6e907xx5QbLaqx4',
          supplier: 'Paint Solutions Ltd',
          location: 'Toshkent',
          verified: true,
          minOrder: 20,
          inStock: true
        }
      ];

      // Filter products based on selected categories
      const filteredProducts = categories.length > 0 
        ? mockProducts.filter(product => categories.includes(product.category))
        : mockProducts;
      
      setProducts(filteredProducts);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Mahsulotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleViewProduct = (productId) => {
    navigate(`/buyer/product/${productId}`, {
      state: { 
        selectedCategories,
        fromAvailableProducts: true
      }
    });
  };

  const handleRequestQuote = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Navigate to RFQ form with product data
      navigate('/buyer/rfq-form', { 
        state: { 
          product: product,
          selectedCategories: categories 
        } 
      });
    }
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
            className="px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6]"
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
            Mahsulotlar
          </h1>
        </header>

        {/* Selected Categories */}
        {selectedCategories.length > 0 && (
          <div className="px-4 py-2">
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span key={category} className="px-3 py-1 bg-[#6C4FFF] text-white text-sm rounded-full">
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="px-4 pb-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
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
              onClick={() => handleSortChange('name')}
              className={getSortButtonClass('name')}
            >
              Nomi
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="flex flex-col gap-4 p-4 pt-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                search_off
              </span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Mahsulotlar topilmadi
                </h3>
              <p className="text-gray-600">
                Qidiruv so'zingizni o'zgartiring yoki boshqa filtrlarni sinab ko'ring.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-500">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
                      <p className="text-base font-bold text-gray-900">
                        {product.rating} <span className="font-normal text-gray-500">({product.reviewCount})</span>
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Narx: {formatCurrency(product.price)} / {product.unit}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {product.location}
                      </span>
                      {product.verified && (
                        <span className="text-xs bg-[#6C4FFF]/10 text-[#6C4FFF] px-2 py-1 rounded-full">
                          Tasdiqlangan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Yetkazib beruvchi: {product.supplier}
                    </p>
                    <p className="text-xs text-gray-500">
                      Minimal buyurtma: {product.minOrder} {product.unit}
                    </p>
                  </div>
                  <div 
                    className="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: `url("${product.image}")`}}
                  ></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleViewProduct(product.id)}
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-bold leading-normal text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <span className="truncate">Haqida</span>
                  </button>
                  <button 
                    onClick={() => handleRequestQuote(product.id)}
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#6C4FFF] text-sm font-bold leading-normal text-white hover:bg-[#5A3FE6] transition-colors"
                  >
                    <span className="truncate">So'rov yuborish</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableProducts;
