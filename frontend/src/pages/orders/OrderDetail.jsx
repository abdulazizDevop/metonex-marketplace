import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, confirmPayment, startProduction, shipOrder, markDelivered, confirmDelivery, confirmCashPayment, createRating, getOrderRating } from '../../utils/api';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Modal';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, success, error, toasts, hideToast } = useToast();
  
  const [order, setOrder] = useState(null);
  const [orderRating, setOrderRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTTNModal, setShowTTNModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [paymentDocument, setPaymentDocument] = useState(null);
  const [ttnDocument, setTtnDocument] = useState(null);
  const [deliveryPhotos, setDeliveryPhotos] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [ratings, setRatings] = useState({
    quality_rating: 0,
    delivery_speed: 0,
    communication: 0,
    price_fairness: 0,
    reliability: 0
  });

  // User role'ni aniqlash
  const userRole = localStorage.getItem('user_role')?.toLowerCase();
  const isBuyer = userRole === 'buyer' || userRole === 'sotib_oluvchi';
  const isSupplier = userRole === 'sotuvchi' || userRole === 'supplier';

  // To'lov turini aniqlash funksiyasi
  const getPaymentType = () => {
    if (!order) return null;
    const paymentType = order.payment_terms || order.request?.payment_type;
    if (!paymentType) return null;
    
    if (paymentType.toLowerCase().includes('bank')) return 'bank';
    if (paymentType.toLowerCase().includes('naqd_pul')) return 'naqd_pul';
    return 'other';
  };

  const isBankPayment = getPaymentType() === 'bank';
  const isCashPayment = getPaymentType() === 'naqd_pul';

  const statusLabels = {
    'ochilgan': 'Ochilgan',
    'to_lov_kutilmoqda': 'To\'lov kutilmoqda',
    'to_lov_qilindi': 'To\'lov qilindi',
    'yeg_ilmoqda': 'Yeg\'ilmoqda',
    'yo_lda': 'Yo\'lda',
    'yetib_bordi': 'Yetib bordi',
    'naqd_tolov_kutilmoqda': 'Naqd to\'lov kutilmoqda',
    'naqd_tolov_qabul_qilindi': 'Naqd to\'lov qabul qilindi',
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
    'naqd_tolov_kutilmoqda': 'bg-amber-100 text-amber-800',
    'naqd_tolov_qabul_qilindi': 'bg-cyan-100 text-cyan-800',
    'yakunlandi': 'bg-green-100 text-green-800',
    'bekor_qilindi': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  // hasReviewed state'ini orderRating mavjudligiga qarab o'rnatish
  useEffect(() => {
    setHasReviewed(!!orderRating);
  }, [orderRating]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const [orderResponse, ratingResponse] = await Promise.all([
        getOrder(id),
        getOrderRating(id).catch(() => null) // Rating yo'q bo'lsa xato bermaslik uchun
      ]);
      setOrder(orderResponse);
      setOrderRating(ratingResponse);
    } catch (error) {
      console.error('Order yuklashda xato:', error);
      showToast('Order yuklashda xato yuz berdi', 'error');
      // User role'ga qarab to'g'ri sahifaga yo'naltirish
      const userRole = localStorage.getItem('user_role')?.toLowerCase();
      if (userRole === 'sotuvchi') {
        navigate('/orders/seller');
      } else {
        navigate('/buyer/orders');
      }
    } finally {
      setLoading(false);
    }
  };

  // Bank orqali to'lov qilish
  const handleBankPayment = async () => {
    if (!paymentDocument) {
      error('To\'lov hujjatini yuklang');
      return;
    }

    // File type validatsiyasi
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(paymentDocument.type)) {
      error('Faqat PDF, JPG, JPEG, PNG formatidagi fayllar qabul qilinadi');
      return;
    }

    // File size validatsiyasi (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (paymentDocument.size > maxSize) {
      error('Fayl hajmi 5MB dan kichik bo\'lishi kerak');
      return;
    }

    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append('payment_document', paymentDocument);
      
      await confirmPayment(id, formData);
      success('To\'lov tasdiqlandi');
      setShowBankModal(false);
      setPaymentDocument(null);
      loadOrder();
    } catch (error) {
      console.error('To\'lov tasdiqlashda xato:', error);
      error(error.response?.data?.detail || 'To\'lov tasdiqlashda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  // Naqd to'lov uchun to'lov qilish
  const handleCashPayment = async () => {
    if (!paymentDocument) {
      error('To\'lov hujjatini (naqd pul rasmini) yuklang');
      return;
    }

    // File type validatsiyasi (faqat rasm)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(paymentDocument.type)) {
      error('Faqat JPG, JPEG, PNG formatidagi rasmlar qabul qilinadi');
      return;
    }

    // File size validatsiyasi (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (paymentDocument.size > maxSize) {
      error('Rasm hajmi 5MB dan kichik bo\'lishi kerak');
      return;
    }

    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append('payment_document', paymentDocument);
      
      await confirmPayment(id, formData);
      success('Naqd to\'lov tasdiqlandi');
      setShowPaymentModal(false);
      setPaymentDocument(null);
      loadOrder();
    } catch (error) {
      console.error('Naqd to\'lov tasdiqlashda xato:', error);
      error(error.response?.data?.detail || 'Naqd to\'lov tasdiqlashda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  // Naqd to'lovni qabul qilish (seller)
  const handleConfirmCashPayment = async () => {
    try {
      setActionLoading(true);
      await confirmCashPayment(id);
      success('Naqd to\'lov qabul qilindi. Buyer endi qabul qilishi mumkin');
      loadOrder();
    } catch (error) {
      console.error('Naqd to\'lov qabul qilishda xato:', error);
      error(error.response?.data?.detail || 'Naqd to\'lov qabul qilishda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  // Rating yuborish
  const handleSubmitRating = async () => {
    // Barcha rating'larni tekshirish
    const requiredRatings = ['quality_rating', 'delivery_speed', 'communication', 'price_fairness', 'reliability'];
    const missingRatings = requiredRatings.filter(key => ratings[key] === 0);
    
    if (missingRatings.length > 0) {
      error('Iltimos, barcha baholarni to\'ldiring');
      return;
    }

    if (reviewText.length > 1000) {
      error('Sharh 1000 belgidan uzun bo\'lmasligi kerak');
      return;
    }

    try {
      setActionLoading(true);
      
      // API'ga rating yuborish
      await createRating({
        order: order.id,
        quality_rating: ratings.quality_rating,
        delivery_speed: ratings.delivery_speed,
        communication: ratings.communication,
        price_fairness: ratings.price_fairness,
        reliability: ratings.reliability,
        comment: reviewText.trim()
      });
      
      success('Baho va sharh yuborildi');
      setShowRatingModal(false);
      setRating(0);
      setReviewText('');
      setRatings({
        quality_rating: 0,
        delivery_speed: 0,
        communication: 0,
        price_fairness: 0,
        reliability: 0
      });
      // Rating'larni qayta yuklash
      const newRating = await getOrderRating(id).catch(() => null);
      setOrderRating(newRating);
    } catch (error) {
      console.error('Rating yuborishda xato:', error);
      error(error.response?.data?.detail || 'Rating yuborishda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartProduction = async () => {
    try {
      setActionLoading(true);
      await startProduction(id);
      success('Ishlab chiqarish boshlandi');
      loadOrder();
    } catch (error) {
      console.error('Ishlab chiqarishni boshlashda xato:', error);
      error(error.response?.data?.detail || 'Ishlab chiqarishni boshlashda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShipOrder = async () => {
    if (!ttnDocument) {
      error('TTN hujjatini yuklang');
      return;
    }

    // File type validatsiyasi
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(ttnDocument.type)) {
      error('Faqat PDF, JPG, JPEG, PNG formatidagi fayllar qabul qilinadi');
      return;
    }

    // File size validatsiyasi (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (ttnDocument.size > maxSize) {
      error('Fayl hajmi 5MB dan kichik bo\'lishi kerak');
      return;
    }

    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append('ttn_document', ttnDocument);
      
      await shipOrder(id, formData);
      success('Buyumlar yuborildi');
      setShowTTNModal(false);
      setTtnDocument(null);
      loadOrder();
    } catch (error) {
      console.error('Buyumlarni yuborishda xato:', error);
      error(error.response?.data?.detail || 'Buyumlarni yuborishda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    try {
      setActionLoading(true);
      await markDelivered(id);
      success('Buyumlar yetkazib berildi');
      loadOrder();
    } catch (error) {
      console.error('Yetkazib berishni belgilashda xato:', error);
      error(error.response?.data?.detail || 'Yetkazib berishni belgilashda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (deliveryPhotos.length === 0) {
      error('Yetkazib berish rasmlarini yuklang');
      return;
    }

    // File type validatsiyasi
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    for (let photo of deliveryPhotos) {
      if (!allowedTypes.includes(photo.type)) {
        error('Faqat JPG, JPEG, PNG formatidagi rasmlar qabul qilinadi');
        return;
      }
      // File size validatsiyasi (2MB per image)
      const maxSize = 2 * 1024 * 1024;
      if (photo.size > maxSize) {
        error('Har bir rasm hajmi 2MB dan kichik bo\'lishi kerak');
        return;
      }
    }

    // Maximum 5 rasm
    if (deliveryPhotos.length > 5) {
      error('Maksimal 5 ta rasm yuklashingiz mumkin');
      return;
    }

    try {
      setActionLoading(true);
      const formData = new FormData();
      deliveryPhotos.forEach(photo => {
        formData.append('delivery_photos', photo);
      });
      
      await confirmDelivery(id, formData);
      success('Order yakunlandi');
      setShowDeliveryModal(false);
      setDeliveryPhotos([]);
      loadOrder();
    } catch (error) {
      console.error('Yetkazib berishni tasdiqlashda xato:', error);
      error(error.response?.data?.detail || 'Yetkazib berishni tasdiqlashda xato yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Order yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order topilmadi</h2>
          <button
            onClick={() => {
              const userRole = localStorage.getItem('user_role')?.toLowerCase();
              if (userRole === 'sotuvchi') {
                navigate('/orders/seller');
              } else {
                navigate('/buyer/orders');
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Orderlar ro'yxatiga qaytish
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[order.status] || order.status}
              </span>
              {(() => {
                const paymentType = order.payment_terms || order.request?.payment_type;
                if (paymentType) {
                  return (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
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
          </div>
          <button
            onClick={() => {
              const userRole = localStorage.getItem('user_role')?.toLowerCase();
              if (userRole === 'sotuvchi') {
                navigate('/orders/seller');
              } else {
                navigate('/buyer/orders');
              }
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
          >
            ← Orqaga qaytish
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order ma'lumotlari</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Jami summa</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">To'lov turi</p>
                  <p className="text-gray-900">
                    {(() => {
                      const paymentType = order.payment_terms || order.request?.payment_type;
                      if (paymentType) {
                        return paymentType.toLowerCase().includes('bank') ? 'Bank orqali' : 'Naqd to\'lov';
                      }
                      return 'Belgilanmagan';
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="text-gray-900 font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Yaratilgan</p>
                  <p className="text-gray-900">{formatDate(order.created_at)}</p>
                </div>
                {order.started_at && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Boshlangan</p>
                    <p className="text-gray-900">{formatDate(order.started_at)}</p>
                  </div>
                )}
                {order.completed_at && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Yakunlangan</p>
                    <p className="text-gray-900">{formatDate(order.completed_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Companies Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kompaniya ma'lumotlari</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Buyer</h3>
                  <p className="text-gray-900">{order.buyer_company_name || order.buyer_company?.name}</p>
                  <p className="text-sm text-gray-500">{order.buyer_phone}</p>
                  {order.buyer_company?.region && (
                    <p className="text-sm text-gray-500">Viloyat: {order.buyer_company.region}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Supplier</h3>
                  <p className="text-gray-900">{order.supplier_company_name || order.supplier_company?.name}</p>
                  <p className="text-sm text-gray-500">{order.supplier_phone}</p>
                  {order.supplier_company?.region && (
                    <p className="text-sm text-gray-500">Viloyat: {order.supplier_company.region}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Request Info */}
            {order.request && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">So'rov ma'lumotlari</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kategoriya</p>
                    <p className="text-gray-900">{order.request.category?.name || 'Belgilanmagan'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Miqdor</p>
                    <p className="text-gray-900">{order.request.quantity} {order.request.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Byudjet</p>
                    <p className="text-gray-900">
                      {order.request.budget_from && order.request.budget_to 
                        ? `${formatPrice(order.request.budget_from)} - ${formatPrice(order.request.budget_to)}`
                        : 'Belgilanmagan'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Muddat</p>
                    <p className="text-gray-900">{order.request.deadline_date || 'Belgilanmagan'}</p>
                  </div>
                </div>
                {(order.request_description || order.request?.description) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Tavsif</p>
                    <p className="text-gray-900">{order.request_description || order.request?.description}</p>
                  </div>
                )}
                {order.request?.delivery_address && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Yetkazib berish manzili</p>
                    <p className="text-gray-900">{order.request.delivery_address}</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents */}
            {(order.payment_document_url || order.ttn_document_url || order.delivery_photos) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hujjatlar</h2>
                <div className="space-y-3">
                  {order.payment_document_url && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-900">To'lov hujjati</span>
                      </div>
                      <a
                        href={order.payment_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ko'rish
                      </a>
                    </div>
                  )}
                  {order.ttn_document_url && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-900">TTN hujjati</span>
                      </div>
                      <a
                        href={order.ttn_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ko'rish
                      </a>
                    </div>
                  )}
                  {((order.delivery_photos_urls && order.delivery_photos_urls.length > 0) || (order.delivery_photos && order.delivery_photos.length > 0)) && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-3">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-900">Tovar rasmlari ({order.delivery_photos_urls?.length || order.delivery_photos?.length || 0})</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(order.delivery_photos_urls || order.delivery_photos || []).map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Tovar rasmi ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(photo, '_blank');
                              }}
                              onError={(e) => {
                                e.target.src = '/placeholder-image.png'; // Fallback image
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Payment Actions - Bank orqali to'lov */}
            {isBuyer && order.status === 'to_lov_kutilmoqda' && isBankPayment && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank orqali to'lov</h3>
                
                {/* Bank Details */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Bank ma'lumotlari</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Bank:</span>
                      <span className="text-blue-900 font-medium">{order.supplier_company?.bank_details?.bank_name || 'Xalq Bank'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Hisob raqami:</span>
                      <span className="text-blue-900 font-medium font-mono">{order.supplier_company?.bank_details?.account_number || '20208000000000000001'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">MFO:</span>
                      <span className="text-blue-900 font-medium">{order.supplier_company?.bank_details?.mfo || '00014'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">INN:</span>
                      <span className="text-blue-900 font-medium">{order.supplier_company?.bank_details?.inn || order.supplier_company?.inn || '310111222'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Summa:</span>
                        <span className="text-blue-900 font-bold">{formatPrice(order.total_amount)}</span>
                      </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBankModal(true)}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {actionLoading ? 'Jarayonda...' : 'To\'lov qilish'}
                </button>
                
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Eslatma:</strong> Bank orqali to'lov qilgandan so'ng, hujjatni yuklang va supplier tasdiqlaydi.
                  </p>
                    </div>
                  </div>
                )}

            {/* Payment Actions - Naqd to'lov */}
            {isBuyer && order.status === 'to_lov_kutilmoqda' && isCashPayment && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Naqd to'lov</h3>
                
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Naqd to'lov:</strong> To'lov naqd pul bilan amalga oshiriladi. Supplier yig'ishni boshlaydi.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {actionLoading ? 'Jarayonda...' : 'To\'lov qilish (Naqd pul rasmi)'}
                </button>
                
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Eslatma:</strong> Naqd to'lov uchun supplier yig'ishni boshlaydi.
                  </p>
                </div>
              </div>
            )}


            {/* Supplier Actions */}
            {isSupplier && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier amallari</h3>
                
                {/* Status Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Joriy holat:</strong> {statusLabels[order.status] || order.status}
                  </p>
                  {order.status === 'to_lov_kutilmoqda' && (
                    <p className="text-sm text-blue-600 mt-1">
                      Buyer to'lov hujjatini yuklaguncha kuting
                    </p>
                  )}
                  {order.status === 'to_lov_qilindi' && (
                    <p className="text-sm text-green-600 mt-1">
                      To'lov tasdiqlandi. Yeg'ishni boshlashingiz mumkin
                    </p>
                  )}
                  {order.status === 'yeg_ilmoqda' && (
                    <p className="text-sm text-purple-600 mt-1">
                      Ishlab chiqarish jarayonda. TTN yuklang
                    </p>
                  )}
                  {order.status === 'yo_lda' && (
                    <p className="text-sm text-orange-600 mt-1">
                      Buyumlar yuborildi. Yetkazib berilgach belgilang
                    </p>
                  )}
                  {order.status === 'yetib_bordi' && (
                    <p className="text-sm text-indigo-600 mt-1">
                      Buyumlar yetkazib berildi. Buyer tasdiqlashini kuting
                    </p>
                  )}
                  {order.status === 'yakunlandi' && (
                    <p className="text-sm text-green-600 mt-1">
                      Order muvaffaqiyatli yakunlandi
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Naqd to'lov uchun yig'ishni boshlash */}
                  {order.status === 'to_lov_kutilmoqda' && isCashPayment && (
                    <button
                      onClick={handleStartProduction}
                      disabled={actionLoading}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Jarayonda...' : 'Yig\'ishni boshlash'}
                    </button>
                  )}
                  
                  {/* Bank orqali to'lov uchun to'lovni tasdiqlash */}
                  {order.status === 'to_lov_qilindi' && isBankPayment && (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>To'lov tasdiqlandi!</strong> Buyer to'lov hujjatini yukladi. Endi yig'ishni boshlashingiz mumkin.
                        </p>
                      </div>
                      <button
                        onClick={handleStartProduction}
                        disabled={actionLoading}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'Jarayonda...' : 'Yig\'ishni boshlash'}
                      </button>
                    </div>
                  )}
                  
                  {/* Yetkazishni boshlash (TTN yuklash) */}
                  {order.status === 'yeg_ilmoqda' && (
                    <button
                      onClick={() => setShowTTNModal(true)}
                      className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      Yetkazishni boshlash (TTN yuklash)
                    </button>
                  )}
                  
                  {/* Yetkazib berildi deb belgilash */}
                  {order.status === 'yo_lda' && (
                    <button
                      onClick={handleMarkDelivered}
                      disabled={actionLoading}
                      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Jarayonda...' : 'Yetkazib berildi deb belgilash'}
                    </button>
                  )}

                  {/* Naqd to'lov uchun qabul qilish */}
                  {order.status === 'naqd_tolov_kutilmoqda' && isCashPayment && (
                    <button
                      onClick={handleConfirmCashPayment}
                      disabled={actionLoading}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Jarayonda...' : 'Naqd to\'lovni qabul qildim'}
                    </button>
                  )}
                  
                  {/* Naqd to'lov qabul qilinganidan keyin */}
                  {order.status === 'naqd_tolov_qabul_qilindi' && isCashPayment && (
                    <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <p className="text-sm text-cyan-800">
                        <strong>Naqd to'lov qabul qilindi!</strong> Buyer endi mahsulotni qabul qilishi mumkin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buyer Actions - Qabul qilish */}
            {isBuyer && order.status === 'yetib_bordi' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer amallari</h3>
                
                {/* Status Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Joriy holat:</strong> {statusLabels[order.status] || order.status}
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    Supplier buyumlarni yetkazib berdi. TTN hujjati va tovar rasmlari bilan tasdiqlang
                  </p>
                </div>
                
                <button
                  onClick={() => setShowDeliveryModal(true)}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Qabul qildim (TTN + Tovar rasmi)
                </button>
              </div>
            )}

            {/* Rating/Review qismi */}
            {isBuyer && order.status === 'yakunlandi' && !hasReviewed && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Baholash va sharh</h3>
                
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Order yakunlandi!</strong> Supplier va mahsulot haqida baho qoldiring.
                  </p>
          </div>
                
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Baho qoldirish va sharh yozish
                </button>
        </div>
            )}

            {/* Review qoldirilgandan keyin */}
            {isBuyer && order.status === 'yakunlandi' && hasReviewed && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Baholash va sharh</h3>
                
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Rahmat!</strong> Sizning bahoingiz va sharhingiz yuborildi.
                  </p>
                </div>
              </div>
            )}

            {/* Review ko'rsatish - agar review mavjud bo'lsa */}
            {orderRating && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Baholash va sharh</h3>
                <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {orderRating.rater_company_name || 'Noma\'lum kompaniya'}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(orderRating.overall_score) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">{orderRating.overall_score}/5</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(orderRating.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  
                  {orderRating.comment && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        "{orderRating.comment}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal - Naqd to'lov uchun */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Naqd to'lov hujjati</h3>
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Eslatma:</strong> Naqd to'lov uchun to'lov rasmini yuklang (naqd pul rasmi)
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'lov rasmi (Naqd pul)
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // File type validatsiyasi (faqat rasm)
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                      if (!allowedTypes.includes(file.type)) {
                        error('Faqat JPG, JPEG, PNG formatidagi rasmlar qabul qilinadi');
                        e.target.value = '';
                        return;
                      }
                      // File size validatsiyasi (5MB)
                      const maxSize = 5 * 1024 * 1024;
                      if (file.size > maxSize) {
                        error('Rasm hajmi 5MB dan kichik bo\'lishi kerak');
                        e.target.value = '';
                        return;
                      }
                    }
                    setPaymentDocument(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {paymentDocument && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tanlangan rasm: {paymentDocument.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCashPayment}
                  disabled={actionLoading || !paymentDocument}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Yuklanmoqda...' : 'To\'lovni tasdiqlash'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Modal */}
        {showBankModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank ma'lumotlari</h3>
              {order.supplier_company?.bank_details && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">To'lov ma'lumotlari</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank nomi:</span>
                      <span className="font-medium">{order.supplier_company.bank_details.bank_name || 'Belgilanmagan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hisob raqami:</span>
                      <span className="font-medium font-mono">{order.supplier_company.bank_details.account_number || 'Belgilanmagan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MFO:</span>
                      <span className="font-medium">{order.supplier_company.bank_details.mfo || 'Belgilanmagan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">INN:</span>
                      <span className="font-medium">{order.supplier_company.bank_details.inn || 'Belgilanmagan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Summa:</span>
                      <span className="font-medium text-green-600">{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'lov hujjatini yuklang
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // File type validatsiyasi
                      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                      if (!allowedTypes.includes(file.type)) {
                        error('Faqat PDF, JPG, JPEG, PNG formatidagi fayllar qabul qilinadi');
                        e.target.value = '';
                        return;
                      }
                      // File size validatsiyasi (5MB)
                      const maxSize = 5 * 1024 * 1024;
                      if (file.size > maxSize) {
                        error('Fayl hajmi 5MB dan kichik bo\'lishi kerak');
                        e.target.value = '';
                        return;
                      }
                    }
                    setPaymentDocument(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {paymentDocument && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tanlangan fayl: {paymentDocument.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleBankPayment}
                  disabled={actionLoading || !paymentDocument}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Yuklanmoqda...' : 'To\'lovni tasdiqlash'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TTN Modal */}
        {showTTNModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TTN hujjatini yuklash</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TTN hujjati
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // File type validatsiyasi
                      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                      if (!allowedTypes.includes(file.type)) {
                        error('Faqat PDF, JPG, JPEG, PNG formatidagi fayllar qabul qilinadi');
                        e.target.value = '';
                        return;
                      }
                      // File size validatsiyasi (5MB)
                      const maxSize = 5 * 1024 * 1024;
                      if (file.size > maxSize) {
                        error('Fayl hajmi 5MB dan kichik bo\'lishi kerak');
                        e.target.value = '';
                        return;
                      }
                    }
                    setTtnDocument(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {ttnDocument && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tanlangan fayl: {ttnDocument.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTTNModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleShipOrder}
                  disabled={actionLoading || !ttnDocument}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Yuklanmoqda...' : 'Yuklash'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Modal */}
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish rasmlarini yuklash</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish rasmlari
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      // File type validatsiyasi
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                      for (let file of files) {
                        if (!allowedTypes.includes(file.type)) {
                          error('Faqat JPG, JPEG, PNG formatidagi rasmlar qabul qilinadi');
                          e.target.value = '';
                          return;
                        }
                        // File size validatsiyasi (2MB per image)
                        const maxSize = 2 * 1024 * 1024;
                        if (file.size > maxSize) {
                          error('Har bir rasm hajmi 2MB dan kichik bo\'lishi kerak');
                          e.target.value = '';
                          return;
                        }
                      }
                      // Maximum 5 rasm
                      if (files.length > 5) {
                        error('Maksimal 5 ta rasm yuklashingiz mumkin');
                        e.target.value = '';
                        return;
                      }
                    }
                    setDeliveryPhotos(files);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bir nechta rasm yuklashingiz mumkin (maksimal 5 ta, har biri 2MB dan kichik)
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Eslatma:</strong> Yetkazib berish rasmlari order yakunlanishi uchun zarur
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Maslahat:</strong> Buyumlarni qabul qilish jarayonini ko'rsatadigan rasmlar yuklang
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Qo'llab-quvvatlash:</strong> Agar muammo bo'lsa, supplier bilan bog'laning
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Xavfsizlik:</strong> Shaxsiy ma'lumotlarni ko'rsatadigan rasmlar yuklamang
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Texnik yordam:</strong> Agar rasm yuklashda muammo bo'lsa, sahifani yangilang
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Qo'shimcha:</strong> Rasmlar avtomatik ravishda siqiladi va optimallashtiriladi
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Yuklash:</strong> Rasmlar yuklangandan so'ng, ularni ko'rish va o'chirish imkoniyati bo'ladi
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Format:</strong> Faqat JPG, JPEG, PNG formatidagi rasmlar qabul qilinadi
                </p>
                {deliveryPhotos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 font-medium">Tanlangan rasmlar:</p>
                    <ul className="text-sm text-gray-600 mt-1">
                      {deliveryPhotos.map((photo, index) => (
                        <li key={index}>• {photo.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirmDelivery}
                  disabled={actionLoading || deliveryPhotos.length === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Yuklanmoqda...' : 'Yuklash'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            isVisible={toast.isVisible}
            onClose={() => hideToast(toast.id)}
          />
        )        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Baholash va sharh</h3>
              
              {/* Sifat bahosi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sifat bahosi (1-5 yulduz)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings(prev => ({...prev, quality_rating: star}))}
                      className={`text-2xl bg-gray-50 px-2 py-1 rounded ${
                        star <= ratings.quality_rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {ratings.quality_rating > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ratings.quality_rating} yulduz - {ratings.quality_rating === 1 ? 'Yomon' : ratings.quality_rating === 2 ? 'Qoniqarsiz' : ratings.quality_rating === 3 ? 'O\'rtacha' : ratings.quality_rating === 4 ? 'Yaxshi' : 'Ajoyib'}
                  </p>
                )}
              </div>

              {/* Yetkazib berish tezligi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish tezligi (1-5 yulduz)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings(prev => ({...prev, delivery_speed: star}))}
                      className={`text-2xl bg-gray-50 px-2 py-1 rounded ${
                        star <= ratings.delivery_speed ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {ratings.delivery_speed > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ratings.delivery_speed} yulduz - {ratings.delivery_speed === 1 ? 'Yomon' : ratings.delivery_speed === 2 ? 'Qoniqarsiz' : ratings.delivery_speed === 3 ? 'O\'rtacha' : ratings.delivery_speed === 4 ? 'Yaxshi' : 'Ajoyib'}
                  </p>
                )}
              </div>

              {/* Aloqa */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aloqa (1-5 yulduz)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings(prev => ({...prev, communication: star}))}
                      className={`text-2xl bg-gray-50 px-2 py-1 rounded ${
                        star <= ratings.communication ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {ratings.communication > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ratings.communication} yulduz - {ratings.communication === 1 ? 'Yomon' : ratings.communication === 2 ? 'Qoniqarsiz' : ratings.communication === 3 ? 'O\'rtacha' : ratings.communication === 4 ? 'Yaxshi' : 'Ajoyib'}
                  </p>
                )}
              </div>

              {/* Narx adolatligi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narx adolatligi (1-5 yulduz)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings(prev => ({...prev, price_fairness: star}))}
                      className={`text-2xl bg-gray-50 px-2 py-1 rounded ${
                        star <= ratings.price_fairness ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {ratings.price_fairness > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ratings.price_fairness} yulduz - {ratings.price_fairness === 1 ? 'Yomon' : ratings.price_fairness === 2 ? 'Qoniqarsiz' : ratings.price_fairness === 3 ? 'O\'rtacha' : ratings.price_fairness === 4 ? 'Yaxshi' : 'Ajoyib'}
                  </p>
                )}
              </div>

              {/* Ishonchlilik */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ishonchlilik (1-5 yulduz)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings(prev => ({...prev, reliability: star}))}
                      className={`text-2xl bg-gray-50 px-2 py-1 rounded ${
                        star <= ratings.reliability ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {ratings.reliability > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ratings.reliability} yulduz - {ratings.reliability === 1 ? 'Yomon' : ratings.reliability === 2 ? 'Qoniqarsiz' : ratings.reliability === 3 ? 'O\'rtacha' : ratings.reliability === 4 ? 'Yaxshi' : 'Ajoyib'}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sharh yozing
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Supplier va mahsulot haqida fikringizni yozing..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewText.length}/1000 belgi
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={actionLoading || Object.values(ratings).some(r => r === 0)}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Yuborilmoqda...' : 'Baho yuborish'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
