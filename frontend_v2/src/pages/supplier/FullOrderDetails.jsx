import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';

const FullOrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  // URL dan order ID ni olish
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Real API call
      // const response = await api.get(`/supplier/orders/${orderId}`);
      // setOrderData(response.data);
      
      // Mock data for now
      setOrderData({
        id: orderId,
        orderNumber: '#123456789',
        date: '2024-07-15',
        totalAmount: 2500000,
        status: 'in_transit',
        statusText: 'Yo\'lda',
        products: [
          {
            id: 1,
            name: 'Concrete Mix',
            quantity: 500,
            unit: 'cubic yards',
            price: 1250000,
            total: 1250000
          },
          {
            id: 2,
            name: 'Rebar',
            quantity: 1000,
            unit: 'kg',
            price: 750,
            total: 750000
          },
          {
            id: 3,
            name: 'Cement Bags',
            quantity: 200,
            unit: 'bags',
            price: 2500,
            total: 500000
          }
        ],
        supplier: {
          id: '987654321',
          name: 'Toshkent Qurilish Materiallari',
          rating: 4.5,
          phone: '+998 90 123 45 67',
          email: 'info@toshkent-qm.uz'
        },
        delivery: {
          address: 'Toshkent shahar, Chilonzor tumani, Mustaqillik ko\'chasi 15',
          estimatedDelivery: '2024-07-18T10:00:00',
          trackingStatus: 'Yo\'lda, ertaga yetkazib berish kutilmoqda',
          trackingNumber: 'TN123456789'
        },
        payment: {
          method: 'Bank Transfer',
          transactionId: '#ABC123XYZ',
          status: 'paid',
          statusText: 'To\'langan',
          paidAt: '2024-07-15T14:30:00'
        },
        buyer: {
          id: '12345',
          name: 'O\'zbekiston Qurilish',
          phone: '+998 90 987 65 43',
          email: 'orders@ozbekiston-q.uz'
        }
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Buyurtma ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleReportIssue = () => {
    navigate(`/supplier/report-issue/${orderId}`, {
      state: { orderData }
    });
  };

  const handleContactSupplier = () => {
    if (orderData?.supplier?.phone) {
      window.open(`tel:${orderData.supplier.phone}`);
    }
  };

  const handleContactBuyer = () => {
    if (orderData?.buyer?.phone) {
      window.open(`tel:${orderData.buyer.phone}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
            shopping_cart
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Buyurtma topilmadi</h2>
          <p className="text-gray-600">Kechirasiz, buyurtma ma'lumotlari topilmadi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <button 
          onClick={handleBack}
          className="flex size-9 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
          Buyurtma tafsilotlari
        </h1>
        <div className="size-9"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Order Summary */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold text-gray-900">Buyurtma xulosasi</h2>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Buyurtma ID</p>
              <p className="text-sm font-medium text-gray-900">{orderData.orderNumber}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Sana</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(orderData.date)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Jami summa</p>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(orderData.totalAmount)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Holat</p>
              <div className="flex items-center gap-1.5">
                <div className={`size-2 rounded-full ${getStatusColor(orderData.status)}`}></div>
                <p className="text-sm font-medium text-gray-900">{orderData.statusText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold text-gray-900">Mahsulot tafsilotlari</h2>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {orderData.products.map((product, index) => (
              <div key={product.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Miqdor: {product.quantity} {product.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Narx: {formatCurrency(product.price)} / {product.unit}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">{formatCurrency(product.total)}</p>
                </div>
                {index < orderData.products.length - 1 && (
                  <div className="my-3 border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Supplier Information */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold text-gray-900">Yetkazib beruvchi ma'lumotlari</h2>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Yetkazib beruvchi ID</p>
              <p className="text-sm font-medium text-gray-900">#{orderData.supplier.id}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Kompaniya nomi</p>
              <p className="text-sm font-medium text-gray-900">{orderData.supplier.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Reyting</p>
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-900">{orderData.supplier.rating}</p>
                <span className="material-symbols-outlined text-base text-yellow-500">star</span>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Telefon</p>
              <button 
                onClick={handleContactSupplier}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {orderData.supplier.phone}
              </button>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-sm font-medium text-gray-900">{orderData.supplier.email}</p>
            </div>
          </div>
        </section>

        {/* Buyer Information */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold text-gray-900">Xaridor ma'lumotlari</h2>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Xaridor ID</p>
              <p className="text-sm font-medium text-gray-900">#{orderData.buyer.id}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Kompaniya nomi</p>
              <p className="text-sm font-medium text-gray-900">{orderData.buyer.name}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Telefon</p>
              <button 
                onClick={handleContactBuyer}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {orderData.buyer.phone}
              </button>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-sm font-medium text-gray-900">{orderData.buyer.email}</p>
            </div>
          </div>
        </section>

        {/* Delivery Information */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold text-gray-900">Yetkazib berish ma'lumotlari</h2>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Manzil</p>
              <p className="text-sm font-medium text-gray-900">{orderData.delivery.address}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Taxminiy yetkazib berish</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(orderData.delivery.estimatedDelivery)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Kuzatish holati</p>
              <p className="text-sm font-medium text-gray-900">{orderData.delivery.trackingStatus}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Kuzatish raqami</p>
              <p className="text-sm font-medium text-gray-900">{orderData.delivery.trackingNumber}</p>
            </div>
          </div>
        </section>

        {/* Payment Details */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold text-gray-900">To'lov tafsilotlari</h2>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Usul</p>
              <p className="text-sm font-medium text-gray-900">{orderData.payment.method}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Tranzaksiya ID</p>
              <p className="text-sm font-medium text-gray-900">{orderData.payment.transactionId}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">To'lov holati</p>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-green-500">
                  check_circle
                </span>
                <p className="text-sm font-medium text-gray-900">{orderData.payment.statusText}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">To'langan vaqt</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(orderData.payment.paidAt)}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={handleReportIssue}
            className="h-12 flex-1 rounded-xl bg-purple-100 text-base font-bold text-purple-600 transition-colors hover:bg-purple-200"
          >
            Muammo haqida xabar berish
          </button>
          <button 
            onClick={handleContactSupplier}
            className="h-12 flex-1 rounded-xl bg-purple-600 text-base font-bold text-white transition-colors hover:bg-purple-700"
          >
            Yetkazib beruvchi bilan bog'lanish
          </button>
        </div>
      </footer>
    </div>
  );
};

export default FullOrderDetails;
