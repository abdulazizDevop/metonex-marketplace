import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerProducts = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, date
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Mock products data for seller
      const mockProducts = [
        {
          id: 'prod-001',
          name: 'Armatura Ø12mm',
          category: 'Metal',
          price: 850000,
          unit: 'ton',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdryttP_hZ1aOk38j1UfJbfA5OebrlBiw7thSPbx4WDN_QlLxeRQsUiZIFcpFdPHV1nu3Cl_xIr4U_0IMAPPzq7zpQGl8B0RJ-JhAMsg-PLY89sC-RmC-bVGaeWzpeh9vVg288XDJF5LSe0FECkk9ty51y8vugWrV9lz4d81ssqiPFji-6HftEipidgx88QMxwEw3TkWjldEBY1I1ueKZOdSs7ccgfrJRYkM_iBfzZf9EW6nnDKo6PwSDhZ0kL6e907xx5QbLaqx4',
          status: 'active',
          stock: 50,
          minOrder: 5,
          createdAt: '2024-01-15',
          views: 123,
          orders: 8
        },
        {
          id: 'prod-002',
          name: 'Cement M400',
          category: 'Cement',
          price: 450000,
          unit: 'ton',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI31wkO9eVTgkFGDmhiqMjizara4ZdYNgG-Z3MXS94iBWSvxJDMLoBgWamNgXoj3DITxVkODWU9VFueaT0sqIjtNkT7M8dr7RSoutdGntzCkQ3mnJbkmr27OoTC7nH4RjaRsg6WEwTSh_keao6_VLbdM_jHpOD-MxYMX-047JoL1P-DFBMIikBJzFrtdEZPK9YaPzc552WF_VZAm24OJ38RyEFwMjyi6w64ygzK-GQWpO6aURFHamnDz8FUwOqXMKeejzG-jZOAaA',
          status: 'active',
          stock: 100,
          minOrder: 10,
          createdAt: '2024-01-10',
          views: 87,
          orders: 12
        },
        {
          id: 'prod-003',
          name: 'Concrete Mix C25',
          category: 'Concrete',
          price: 120000,
          unit: 'm³',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgPuS-UHMaMPZ0EBlleg_Yhd0_WnBfMKNAkrutiOKwCZXntW5hHvsiJjAkHxsgiQ6eOjJ9QTPHaPGPOlfVX4Au-KfblMpXZ5RJq5DpHDO0ILM-c4qAK6c755SjLX3HNRFF64YWSdds5wcwPPzKwwOO5OFTOQpF1_FCsAIZ6YzXlUotOYx8gUV6DVuBKnm5x9w4hreHfG_2ZfsMTBXP1fm6-8qk8-NqqVdfduYRIymfaDCZpI9hf4mrB5EmCIC0fnBjSNRYLwW8CXA',
          status: 'draft',
          stock: 0,
          minOrder: 1,
          createdAt: '2024-01-20',
          views: 45,
          orders: 0
        }
      ];
      
      setProducts(mockProducts);
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
    navigate('/seller/products/add');
  };

  const handleEditProduct = (productId) => {
    navigate(`/seller/products/edit/${productId}`);
  };

  const handleViewProduct = (productId) => {
    navigate(`/seller/product/${productId}`);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bu mahsulotni o\'chirishni xohlaysizmi?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
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
        ? 'bg-[#6C4FFF] text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Faol</span>;
      case 'draft':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Loyiha</span>;
      case 'inactive':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Nofaol</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Noma'lum</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a35ee8]"></div>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#a35ee8] text-white rounded-lg hover:bg-[#8e4dd1]"
          >
            Qaytadan urinish
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
          <h1 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Mening mahsulotlarim
          </h1>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="text-sm font-medium">Qo'shish</span>
          </button>
        </header>

        {/* Search and Filter */}
        <div className="px-4 pb-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => handleSortChange('name')}
              className={getSortButtonClass('name')}
            >
              Nomi
            </button>
            <button 
              onClick={() => handleSortChange('price')}
              className={getSortButtonClass('price')}
            >
              Narx
            </button>
            <button 
              onClick={() => handleSortChange('date')}
              className={getSortButtonClass('date')}
            >
              Sana
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="flex flex-col gap-4 p-4 pt-0 pb-24">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                inventory_2
              </span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Mahsulotlar topilmadi' : 'Hali mahsulotlar yo\'q'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Qidiruv so\'zingizni o\'zgartiring yoki boshqa filtrlarni sinab ko\'ring.'
                  : 'Birinchi mahsulotingizni qo\'shing va sotishni boshlang.'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={handleAddProduct}
                  className="px-6 py-3 bg-[#a35ee8] text-white rounded-lg hover:bg-[#8e4dd1] transition-colors"
                >
                  Mahsulot qo'shish
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-500">
                        {product.category}
                      </p>
                      {getStatusBadge(product.status)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      Narx: {formatCurrency(product.price)} / {product.unit}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Zaxira: {product.stock} {product.unit}</span>
                      <span>Min. buyurtma: {product.minOrder} {product.unit}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Ko'rishlar: {product.views}</span>
                      <span>Buyurtmalar: {product.orders}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Qo'shilgan: {new Date(product.createdAt).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                  <div 
                    className="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: `url("${product.image}")`}}
                  ></div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewProduct(product.id)}
                    className="flex h-10 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-bold leading-normal text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <span className="truncate">Ko'rish</span>
                  </button>
                  <button 
                    onClick={() => handleEditProduct(product.id)}
                    className="flex h-10 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#6C4FFF] text-sm font-bold leading-normal text-white hover:bg-[#5A3FE6] transition-colors"
                  >
                    <span className="truncate">Tahrirlash</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Product Button */}
        <div className="fixed bottom-20 right-4 z-40">
          <button 
            onClick={handleAddProduct}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6C4FFF] text-white shadow-lg hover:bg-[#5A3FE6] transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerProducts;
