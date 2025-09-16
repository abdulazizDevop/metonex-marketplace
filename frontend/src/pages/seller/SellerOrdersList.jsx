import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import { getSellerOrders } from '../../utils/api';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Modal';

const SellerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Tab count'lari uchun
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast, error, toasts, hideToast } = useToast();

  const statusLabels = {
    'ochilgan': 'Ochilgan',
    'to_lov_kutilmoqda': 'To\'lov kutilmoqda',
    'to_lov_qilindi': 'To\'lov qilindi',
    'yeg_ilmoqda': 'Yeg\'ilmoqda',
    'yo_lda': 'Yo\'lda',
    'yetib_bordi': 'Yetib bordi',
    'yakunlandi': 'Yakunlandi',
    'bekor_qilindi': 'Bekor qilindi'
  };

  const statusColors = {
    'ochilgan': 'bg-blue-100 text-blue-800',
    'to_lov_kutilmoqda': 'bg-yellow-100 text-yellow-800',
    'to_lov_qilindi': 'bg-green-100 text-green-800',
    'yeg_ilmoqda': 'bg-purple-100 text-purple-800',
    'yo_lda': 'bg-orange-100 text-orange-800',
    'yetib_bordi': 'bg-indigo-100 text-indigo-800',
    'yakunlandi': 'bg-green-100 text-green-800',
    'bekor_qilindi': 'bg-red-100 text-red-800'
  };

  const tabs = [
    { id: 'all', label: 'Barchasi', count: allOrders.length },
    { id: 'to_lov_kutilmoqda', label: 'To\'lov kutilmoqda', count: allOrders.filter(o => o.status === 'to_lov_kutilmoqda').length },
    { id: 'to_lov_qilindi', label: 'To\'lov qilindi', count: allOrders.filter(o => o.status === 'to_lov_qilindi').length },
    { id: 'yeg_ilmoqda', label: 'Yeg\'ilmoqda', count: allOrders.filter(o => o.status === 'yeg_ilmoqda').length },
    { id: 'yo_lda', label: 'Yo\'lda', count: allOrders.filter(o => o.status === 'yo_lda').length },
    { id: 'yetib_bordi', label: 'Yetib bordi', count: allOrders.filter(o => o.status === 'yetib_bordi').length },
    { id: 'yakunlandi', label: 'Yakunlandi', count: allOrders.filter(o => o.status === 'yakunlandi').length }
  ];

  useEffect(() => {
    loadOrders();
    loadAllOrders(); // Tab count'lari uchun
  }, [activeTab, currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getSellerOrders();
      
      // Response struktura tekshirish
      let ordersData = [];
      if (response && response.results) {
        ordersData = response.results;
      } else if (Array.isArray(response)) {
        ordersData = response;
      }
      
      // Duplicate orderlarni olib tashlash va tab bo'yicha filterlash
      const uniqueOrders = ordersData.filter((order, index, self) => 
        index === self.findIndex(o => o.id === order.id)
      );
      
      let filteredOrders = uniqueOrders;
      if (activeTab !== 'all') {
        filteredOrders = uniqueOrders.filter(order => order.status === activeTab);
      }
      
      setOrders(filteredOrders);
      
      // Pagination ma'lumotlari
      if (response?.count && response?.page_size) {
        setTotalPages(Math.ceil(response.count / response.page_size));
      }
    } catch (error) {
      console.error('Orderlarni yuklashda xato:', error);
      showToast('Orderlarni yuklashda xato yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAllOrders = async () => {
    try {
      // Tab count'lari uchun barcha orderlarni yuklaymiz
      const response = await getSellerOrders();
      
      // Response struktura tekshirish
      let ordersData = [];
      if (response && response.results) {
        ordersData = response.results;
      } else if (Array.isArray(response)) {
        ordersData = response;
      }
      
      // Duplicate orderlarni olib tashlash
      const uniqueOrders = ordersData.filter((order, index, self) => 
        index === self.findIndex(o => o.id === order.id)
      );
      
      setAllOrders(uniqueOrders);
    } catch (error) {
      console.error('Barcha orderlarni yuklashda xato:', error);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '-';
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('uz-UZ');
    } catch {
      return '-';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mening orderlarim</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-700 bg-white">
            <nav className="-mb-px border-gray-700 flex space-x-4 bg-white overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-2 border-b-2 font-medium text-xs bg-white whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({length: 5}).map((_,i) => (
                <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders.length ? (
            <>
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                          {(() => {
                            const paymentType = order.payment_terms || order.request?.payment_type;
                            if (paymentType) {
                              return (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  paymentType.toLowerCase().includes('bank') 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {paymentType.toLowerCase().includes('bank') ? 'Bank orqali' : 'Naqd to\'lov'}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {order.request_description || order.request?.description || 'Tavsif yo\'q'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-gray-500">Buyer:</span>
                            <span className="ml-1 font-medium">
                              {order.buyer_company_name || order.buyer_company?.name || '-'}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Jami summa:</span>
                            <span className="ml-1 font-medium">
                              {formatPrice(order.total_amount)}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">To'lov turi:</span>
                            <span className="ml-1 font-medium">
                              {(() => {
                                const paymentType = order.payment_terms || order.request?.payment_type;
                                if (paymentType) {
                                  return paymentType.toLowerCase().includes('bank') ? 'Bank orqali' : 'Naqd to\'lov';
                                }
                                return '-';
                              })()}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Yaratilgan:</span>
                            <span className="ml-1 font-medium">{formatDate(order.created_at)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-400">
                          Telefon: {order.buyer_phone || '-'}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col gap-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                        >
                          Ko'rish
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Oldingi
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Keyingi
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Orderlar topilmadi</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all' 
                  ? 'Hozircha yaratilgan orderlar yo\'q'
                  : `${tabs.find(t => t.id === activeTab)?.label} statusidagi orderlar yo'q`
                }
              </p>
            </div>
          )}
        </div>

        {/* Toast notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            isVisible={toast.isVisible}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SellerOrdersList;
