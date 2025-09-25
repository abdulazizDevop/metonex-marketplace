import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CounterOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [counterOffer, setCounterOffer] = useState({
    quantity: '',
    deliveryTime: '',
    pricePerUnit: '',
    totalPrice: '',
    additionalNotes: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // URL dan request ID ni olish
  const requestId = location.state?.requestId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      // Real API call
      // const response = await api.get(`/supplier/requests/${requestId}`);
      // setRequestData(response.data);
      
      // Mock data for now
      setRequestData({
        id: requestId,
        requestNumber: 'ID12345',
        title: 'Premium Concrete Mix',
        quantity: '50 tons',
        deadline: '2024-08-15',
        deliveryLocation: 'Site A, Downtown',
        paymentMethod: 'Net 30',
        buyer: {
          id: '12345',
          name: 'O\'zbekiston Qurilish',
          company: 'O\'zbekiston Qurilish MChJ'
        },
        originalPrice: 25000,
        specifications: 'High-grade concrete mix for foundation work',
        deliveryAddress: 'Toshkent shahar, Chilonzor tumani, Mustaqillik ko\'chasi 15'
      });
    } catch (error) {
      console.error('Error fetching request details:', error);
      setError('So\'rov ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCounterOffer(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate total price
    if (field === 'quantity' || field === 'pricePerUnit') {
      const quantity = field === 'quantity' ? parseFloat(value) : parseFloat(prev.quantity);
      const price = field === 'pricePerUnit' ? parseFloat(value) : parseFloat(prev.pricePerUnit);
      
      if (quantity && price) {
        const total = quantity * price;
        setCounterOffer(prev => ({
          ...prev,
          totalPrice: total.toLocaleString('uz-UZ')
        }));
      }
    }
  };

  const validateForm = () => {
    const { quantity, deliveryTime, pricePerUnit } = counterOffer;
    
    if (!quantity.trim()) {
      setError('Miqdor maydonini to\'ldiring');
      return false;
    }
    
    if (!deliveryTime.trim()) {
      setError('Yetkazib berish vaqtini belgilang');
      return false;
    }
    
    if (!pricePerUnit.trim()) {
      setError('Birlik narxini kiriting');
      return false;
    }

    const price = parseFloat(pricePerUnit);
    if (isNaN(price) || price <= 0) {
      setError('To\'g\'ri narx kiriting');
      return false;
    }

    return true;
  };

  const handleSubmitCounterOffer = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const counterOfferData = {
        requestId: requestId,
        quantity: counterOffer.quantity,
        deliveryTime: counterOffer.deliveryTime,
        pricePerUnit: parseFloat(counterOffer.pricePerUnit),
        totalPrice: parseFloat(counterOffer.totalPrice.replace(/,/g, '')),
        additionalNotes: counterOffer.additionalNotes,
        status: 'pending'
      };

      // Real API call
      // await api.post('/supplier/counter-offers', counterOfferData);

      // Mock success
      console.log('Counter offer submitted:', counterOfferData);
      setSuccess(true);

      // Navigate to success page after delay
      setTimeout(() => {
        navigate('/supplier/requests', {
          state: {
            message: 'Qarshi taklif muvaffaqiyatli yuborildi',
            type: 'success'
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error submitting counter offer:', error);
      setError('Qarshi taklifni yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/supplier/requests');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading && !requestData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && !requestData) {
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

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-6xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Qarshi taklif yuborildi!
          </h2>
          <p className="text-gray-600">
            Xaridorga xabar yuborildi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-800 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            #{requestData?.requestNumber} uchun qarshi taklif
          </h1>
          <div className="w-8"></div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {/* Request Summary */}
          {requestData && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-base font-bold text-gray-900">So'rov xulosasi</p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="font-medium text-gray-500">Mahsulot:</div>
                <div className="text-gray-900">{requestData.title}</div>
                <div className="font-medium text-gray-500">Miqdor:</div>
                <div className="text-gray-900">{requestData.quantity}</div>
                <div className="font-medium text-gray-500">Muddat:</div>
                <div className="text-gray-900">{formatDate(requestData.deadline)}</div>
                <div className="font-medium text-gray-500">Yetkazib berish joyi:</div>
                <div className="text-gray-900">{requestData.deliveryLocation}</div>
                <div className="font-medium text-gray-500">To'lov usuli:</div>
                <div className="text-gray-900">{requestData.paymentMethod}</div>
                <div className="font-medium text-gray-500">Xaridor:</div>
                <div className="text-gray-900">{requestData.buyer.company}</div>
              </div>
            </div>
          )}

          {/* Counter Offer Form */}
          <div className="space-y-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="quantity">
                Miqdor
              </label>
              <div className="mt-1">
                <input 
                  className="form-input block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-base text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  id="quantity" 
                  name="quantity" 
                  placeholder="masalan: 30 ton hozir mavjud"
                  type="text"
                  value={counterOffer.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="delivery-time">
                Yetkazib berish vaqti
              </label>
              <div className="mt-1">
                <input 
                  className="form-input block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-base text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  id="delivery-time" 
                  name="delivery-time" 
                  placeholder="masalan: 20 ton hozir, qolgani 7 kun ichida"
                  type="text"
                  value={counterOffer.deliveryTime}
                  onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                />
              </div>
            </div>

            {/* Price Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="price-per-unit">
                  Birlik narxi
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">so'm</span>
                  </div>
                  <input 
                    className="form-input block w-full rounded-lg border-gray-300 bg-gray-50 py-3 pl-12 text-base text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    id="price-per-unit" 
                    name="price-per-unit" 
                    placeholder="0"
                    type="number"
                    value={counterOffer.pricePerUnit}
                    onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="total-price">
                  Jami narx
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">so'm</span>
                  </div>
                  <input 
                    className="form-input block w-full rounded-lg border-gray-300 bg-gray-200 py-3 pl-12 text-base text-gray-600 shadow-sm focus:outline-none"
                    id="total-price" 
                    name="total-price" 
                    readOnly
                    type="text"
                    value={counterOffer.totalPrice ? `${counterOffer.totalPrice} so'm` : 'Hisoblanadi'}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="additional-notes">
                Qo'shimcha eslatmalar
              </label>
              <div className="mt-1">
                <textarea 
                  className="form-textarea block w-full rounded-lg border-gray-300 bg-gray-50 text-base text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  id="additional-notes" 
                  name="additional-notes" 
                  placeholder="Ixtiyoriy"
                  rows="4"
                  value={counterOffer.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}
        </main>
      </div>

      {/* Footer Actions */}
      <footer className="sticky bottom-0 bg-white p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-xl bg-gray-200 py-3 text-center text-base font-bold text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Bekor qilish
          </button>
          <button 
            onClick={handleSubmitCounterOffer}
            disabled={loading}
            className="flex-1 rounded-xl bg-purple-600 py-3 text-center text-base font-bold text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Yuborilmoqda...' : 'Qarshi taklif yuborish'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CounterOffer;
