import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';
import { userApi } from '../../utils/userApi';

const SellerProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, date
  const [error, setError] = useState(null);
  const [flowData, setFlowData] = useState({
    fromDashboard: false,
    flowStep: null,
    returnPath: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy]);

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        fromDashboard: location.state.fromDashboard || false,
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || null
      });
    }
  }, [location.state]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API-dan mahsulotlarni olish
      const response = await userApi.getSellerProducts();
      console.log('Seller products:', response);
      
      // API response-ni UI formatiga transform qilish
      const apiProducts = response.map(product => ({
        id: product.id,
        name: product.brand || 'Nomsiz mahsulot',
        category: product.category?.name || 'Kategoriya',
        price: product.base_price || 0,
        unit: product.unit?.name || 'don',
        image: product.image || '',
        status: product.is_active ? 'active' : 'inactive',
        stock: product.stock_quantity || 0,
        minOrder: product.min_order_quantity || 1,
        createdAt: product.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        views: product.view_count || 0,
        orders: product.order_count || 0
      }));
      
      setProducts(apiProducts);
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
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
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

  const handleAddProduct = () => {
    navigate('/seller/products/add', {
      state: {
        fromProducts: true,
        flowStep: 'product-add',
        returnPath: '/seller/products'
      }
    });
  };

  const handleBack = () => {
    if (flowData.returnPath) {
      navigate(flowData.returnPath);
    } else {
      navigate(-1);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/seller/products/${productId}`, {
      state: {
        fromProducts: true,
        flowStep: 'product-detail',
        returnPath: '/seller/products'
      }
    });
  };

  const handleProductStatusToggle = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? false : true;
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus ? 'active' : 'inactive' }
          : product
      ));
      
      // TODO: API-ni chaqirish API update endpointi mavjud bo'lsa
      console.log(`Product ${productId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Status o\'zgartirishda xatolik:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('eu-EU').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Faol';
      case 'inactive':
        return 'Yopiq';
      case 'draft':
        return 'Loyiha';
      default:
        return status;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Mahsulotlar</h1>
          <div className="w-10"></div>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xatolik</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors"
            >
              Qayta urinish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-white">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Mahsulotlar</h1>
          <button 
            onClick={handleAddProduct}
            className="flex size-10 items-center justify-center rounded-full bg-[#6C4FFF] text-white hover:bg-[#5A3FE6] transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 pb-3 bg-white border-b border-gray-100">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Mahsulot qidirish..."
                className="w-full pl-12 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400 text-lg">sort</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
            >
              <option value="name">Nom bo'yicha</option>
              <option value="price">Narx bo'yicha</option>
              <option value="date">Sana bo'yicha</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#6C4FFF] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Mahsulotlar yuklanmoqda...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-16 px-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchTerm ? (
                    <span className="material-symbols-outlined text-gray-400 text-2xl">search_off</span>
                  ) : (
                    <span className="material-symbols-outlined text-gray-400 text-2xl">inventory_2</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'Hech qanday natija topilmadi' : 'Hozircha mahsulot yo\'q'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `"${searchTerm}" uchun natija topilmadi` 
                    : 'Birinchi mahsulotingizni qo\'shing'
                  }
                </p>
                {!searchTerm && (
                  <button 
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors"
                  >
                    Mahsulot qo'shish
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white border border-gray-200 rounded-lg divide divide-y divide-gray-200 hover:shadow-lg hover:border-[#6C4FFF] transition-all cursor-pointer overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="aspect-video bg-gray-50 relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-3xl">image</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductStatusToggle(product.id, product.status);
                        }}
                        className={`p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors ${
                          product.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {product.status === 'active' ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#140e1b] text-sm">{product.name}</h3>
                      <p className="font-bold text-lg text-[#6C4FFF] ml-2">
                        {formatPrice(product.price)} / {product.unit}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3">{product.category}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">inventory</span>
                        <span>Omborida: {product.stock}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                        <span>Min: {product.minOrder}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>{product.views} ko'rildi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        <span>{product.orders} buyurtma</span>
                      </div>
                      <span>{formatDate(product.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Product FAB */}
      {!loading && products.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40">
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center w-14 h-14 bg-[#6C4FFF] text-white rounded-full shadow-lg hover:bg-[#5A3FE6] transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default SellerProducts;