import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OfferAcceptancePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentScreen, setCurrentScreen] = useState(1);
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // URL dan offer ID ni olish
  const offerId = location.state?.offerId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (offerId) {
      fetchOfferDetails();
    }
  }, [offerId]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      // Real API call
      // const response = await api.get(`/supplier/offers/${offerId}`);
      // setOfferData(response.data);
      
      // Mock data for now
      setOfferData({
        id: offerId,
        offerNumber: '123456789',
        title: 'Concrete Mix',
        quantity: '50 cubic yards',
        unitPrice: 25000,
        totalAmount: 1250000,
        supplier: {
          id: '987654321',
          name: 'Toshkent Qurilish Materiallari',
          rating: 4.5
        },
        buyer: {
          id: '12345',
          name: 'O\'zbekiston Qurilish'
        },
        deliveryDate: '2024-08-15',
        terms: '30 kun ichida to\'lov, 7 kun ichida yetkazib berish'
      });
    } catch (error) {
      console.error('Error fetching offer details:', error);
      setError('Taklif ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/supplier/requests');
  };

  const handleAcceptOffer = () => {
    setCurrentScreen(2);
  };

  const handleBackToPaymentMethod = () => {
    setCurrentScreen(2);
  };

  const handleBackToOffer = () => {
    setCurrentScreen(1);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'bank') {
      setCurrentScreen(3);
    } else {
      // For card and COD, go directly to processing
      setCurrentScreen(4);
      processPayment(method);
    }
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayment = () => {
    if (selectedPaymentMethod === 'bank') {
      // Validate bank details
      const { accountHolderName, bankName, accountNumber, routingNumber } = paymentDetails;
      if (!accountHolderName || !bankName || !accountNumber || !routingNumber) {
        setError('Barcha maydonlarni to\'ldiring');
        return;
      }
    }
    
    setCurrentScreen(4);
    processPayment(selectedPaymentMethod);
  };

  const processPayment = async (method) => {
    try {
      setProcessing(true);
      setError(null);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Real API call
      // const paymentData = {
      //   offerId: offerId,
      //   paymentMethod: method,
      //   paymentDetails: selectedPaymentMethod === 'bank' ? paymentDetails : null
      // };
      // await api.post('/supplier/offers/accept-and-pay', paymentData);

      // Mock success
      setProcessing(false);
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('To\'lovni amalga oshirishda xatolik yuz berdi');
      setProcessing(false);
    }
  };

  const handleViewOrderDetails = () => {
    navigate(`/supplier/order-details/${offerId}`, {
      state: { 
        orderData: offerData,
        paymentMethod: selectedPaymentMethod,
        paymentSuccess: true
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !offerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
            error
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Xatolik</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-hidden bg-gray-50">
      {/* Screen 1: Accept Offer */}
      {currentScreen === 1 && (
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-gray-900">close</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Taklifni qabul qilish</h1>
            <div className="w-10"></div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Bu taklifni qabul qilmoqchisiz
              </h2>
              <p className="text-gray-600 mt-2">
                Qabul qilish orqali siz sotuvchining shartlari va qoidalariga rozi bo'lasiz. 
                Tafsilotlarni diqqat bilan ko'rib chiqing.
              </p>
            </div>

            {offerData && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-blue-600">
                      <span className="material-symbols-outlined">receipt_long</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Taklif tafsilotlari</p>
                      <p className="text-sm text-gray-600">Taklif ID: {offerData.offerNumber}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mahsulot:</span>
                    <span className="font-medium text-gray-900">{offerData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miqdor:</span>
                    <span className="font-medium text-gray-900">{offerData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Birlik narxi:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(offerData.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jami summa:</span>
                    <span className="font-bold text-gray-900 text-lg">{formatCurrency(offerData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yetkazib berish sanasi:</span>
                    <span className="font-medium text-gray-900">{formatDate(offerData.deliveryDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yetkazib beruvchi:</span>
                    <span className="font-medium text-gray-900">{offerData.supplier.name}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
          </main>

          <footer className="p-4 bg-white border-t border-gray-200">
            <button 
              onClick={handleAcceptOffer}
              disabled={!offerData}
              className="w-full h-12 px-5 text-base font-bold text-white transition-colors duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Taklifni qabul qilish
            </button>
          </footer>
        </div>
      )}

      {/* Screen 2: Select Payment Method */}
      {currentScreen === 2 && (
        <div className="flex flex-col h-full">
          <header className="flex items-center p-4 border-b border-gray-200 bg-white">
            <button 
              onClick={handleBackToOffer}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-gray-900">arrow_back_ios_new</span>
            </button>
            <h1 className="flex-1 text-lg font-semibold text-center text-gray-900">
              To'lov usulini tanlang
            </h1>
            <div className="w-10"></div>
          </header>

          <main className="flex-1 p-6 space-y-4">
            <p className="text-center text-gray-600 mb-4">
              Bu taklif uchun qanday to'lov usulini tanlamoqchisiz?
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => handlePaymentMethodSelect('bank')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="material-symbols-outlined text-blue-600">account_balance</span>
                  <div>
                    <p className="font-semibold text-gray-900">Bank o'tkazmasi</p>
                    <p className="text-sm text-gray-600">Bank hisobingizdan to'g'ridan-to'g'ri o'tkazma.</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </button>

              <button 
                onClick={() => handlePaymentMethodSelect('card')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="material-symbols-outlined text-blue-600">credit_card</span>
                  <div>
                    <p className="font-semibold text-gray-900">Kredit karta</p>
                    <p className="text-sm text-gray-600">Kredit yoki debit kartangiz bilan to'lash.</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </button>

              <button 
                onClick={() => handlePaymentMethodSelect('cod')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="material-symbols-outlined text-blue-600">local_shipping</span>
                  <div>
                    <p className="font-semibold text-gray-900">Yetkazib berishda naqd to'lov</p>
                    <p className="text-sm text-gray-600">Yetkazib berishda naqd pul bilan to'lash.</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </button>
            </div>
          </main>
        </div>
      )}

      {/* Screen 3: Bank Transfer Details */}
      {currentScreen === 3 && (
        <div className="flex flex-col h-full">
          <header className="flex items-center p-4 border-b border-gray-200 bg-white">
            <button 
              onClick={handleBackToPaymentMethod}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-gray-900">arrow_back_ios_new</span>
            </button>
            <h1 className="flex-1 text-lg font-semibold text-center text-gray-900">
              Bank o'tkazmasi
            </h1>
            <div className="w-10"></div>
          </header>

          <main className="flex-1 p-6 space-y-4">
            <p className="text-center text-gray-600 mb-4">
              To'lovni amalga oshirish uchun bank ma'lumotlaringizni kiriting.
            </p>
            
            <div className="space-y-4">
              <input 
                className="w-full h-12 px-4 text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Hisob egasi ismi"
                type="text"
                value={paymentDetails.accountHolderName}
                onChange={(e) => handlePaymentDetailsChange('accountHolderName', e.target.value)}
              />
              <input 
                className="w-full h-12 px-4 text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Bank nomi"
                type="text"
                value={paymentDetails.bankName}
                onChange={(e) => handlePaymentDetailsChange('bankName', e.target.value)}
              />
              <input 
                className="w-full h-12 px-4 text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Hisob raqami"
                type="text"
                value={paymentDetails.accountNumber}
                onChange={(e) => handlePaymentDetailsChange('accountNumber', e.target.value)}
              />
              <input 
                className="w-full h-12 px-4 text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Routing raqami"
                type="text"
                value={paymentDetails.routingNumber}
                onChange={(e) => handlePaymentDetailsChange('routingNumber', e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
          </main>

          <footer className="p-4 bg-white border-t border-gray-200">
            <button 
              onClick={handleSubmitPayment}
              className="w-full h-12 px-5 text-base font-bold text-white transition-colors duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              To'lovni yuborish
            </button>
          </footer>
        </div>
      )}

      {/* Screen 4: Processing and Success */}
      {currentScreen === 4 && (
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
            {processing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto"></div>
                <h2 className="text-2xl font-bold text-gray-900">To'lov amalga oshirilmoqda</h2>
                <p className="text-gray-600">
                  Iltimos, kuting, biz to'lovingizni amalga oshiramiz. Ilovani yopmang.
                </p>
              </div>
            ) : paymentSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full">
                  <span className="text-5xl text-green-500 material-symbols-outlined">check_circle</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">To'lov muvaffaqiyatli!</h2>
                <p className="text-gray-600">
                  To'lovingiz muvaffaqiyatli amalga oshirildi. Endi buyurtma tafsilotlarini ko'rishingiz mumkin.
                </p>
              </div>
            ) : null}
          </div>

          {paymentSuccess && (
            <footer className="p-4 bg-white border-t border-gray-200">
              <button 
                onClick={handleViewOrderDetails}
                className="w-full h-12 px-5 text-base font-bold text-white transition-colors duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Buyurtma tafsilotlarini ko'rish
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferAcceptancePayment;
