import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfirmDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
        title: 'Concrete Mix',
        quantity: '50 cubic yards',
        buyerId: '12345',
        buyerName: 'Toshkent Qurilish',
        deliveryAddress: 'Toshkent shahar, Chilonzor tumani, Mustaqillik ko\'chasi 15',
        deliveryDate: '2024-08-15',
        totalAmount: '15,000,000 so\'m',
        status: 'delivered'
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Buyurtma ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // File validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Faqat JPG, PNG yoki PDF fayllar qabul qilinadi');
        return;
      }

      if (file.size > maxSize) {
        setError('Fayl hajmi 5MB dan katta bo\'lmasligi kerak');
        return;
      }

      setUploadedFile(file);
      setError(null);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmDelivery = async () => {
    if (!uploadedFile) {
      setError('Imzolangan TTN faylini yuklashingiz kerak');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('ttn_document', uploadedFile);
      formData.append('order_id', orderId);
      formData.append('delivery_confirmed', 'true');

      // Real API call
      // const response = await api.post(`/supplier/orders/${orderId}/confirm-delivery`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // Mock success
      console.log('Delivery confirmed successfully');
      setSuccess(true);

      // Navigate to success page after delay
      setTimeout(() => {
        navigate('/supplier/orders', {
          state: {
            message: 'Yetkazib berish muvaffaqiyatli tasdiqlandi',
            type: 'success'
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error confirming delivery:', error);
      setError('Yetkazib berishni tasdiqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = () => {
    navigate(`/supplier/report-issue/${orderId}`, {
      state: { orderData }
    });
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

  if (loading && !orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
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
            Yetkazib berish tasdiqlandi!
          </h2>
          <p className="text-gray-600">
            Xaridorga xabar yuborildi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center p-4 border-b border-gray-200">
          <button 
            onClick={handleBack}
            className="text-gray-900 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-xl font-bold">Yetkazib berishni tasdiqlash</h1>
          <div className="w-8"></div>
        </header>

        {/* Main Content */}
        <main className="flex-grow px-4">
          <div className="flex flex-col items-center">
            {/* Success Icon */}
            <div className="w-full max-w-sm flex justify-center mt-8">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-7xl">
                  check_circle
                </span>
              </div>
            </div>

            {/* Title and Description */}
            <h2 className="mt-8 text-2xl font-bold text-gray-900 text-center">
              Buyurtmangiz yetib keldi!
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Imzolangan TTN faylini yuklab, tovarlarni qabul qilganingizni tasdiqlang.
            </p>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Buyurtma tafsilotlari
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mahsulot:</span>
                  <span className="font-medium text-gray-900">{orderData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miqdor:</span>
                  <span className="font-medium text-gray-900">{orderData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Xaridor:</span>
                  <span className="font-medium text-gray-900">{orderData.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yetkazish manzili:</span>
                  <span className="font-medium text-gray-900 text-right max-w-48">
                    {orderData.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yetkazish sanasi:</span>
                  <span className="font-medium text-gray-900">{formatDate(orderData.deliveryDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jami summa:</span>
                  <span className="font-medium text-gray-900">{orderData.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* File Upload Section */}
          <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            {filePreview ? (
              <div className="mb-4">
                <img 
                  src={filePreview} 
                  alt="TTN Preview" 
                  className="max-w-full h-48 object-contain mx-auto rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-600">
                  {uploadedFile?.name}
                </p>
              </div>
            ) : (
              <span className="material-symbols-outlined text-4xl text-purple-600">
                edit_document
              </span>
            )}
            
            <p className="mt-2 font-semibold text-gray-900">
              {uploadedFile ? 'Fayl yuklandi' : 'Imzolangan TTN yuklash'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {uploadedFile ? 'Fayl muvaffaqiyatli yuklandi' : 'Imzo bilan rasm yoki skan yuklang.'}
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button 
              onClick={handleUploadClick}
              className="mt-4 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
            >
              {uploadedFile ? 'Faylni o\'zgartirish' : 'Yuklash'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button 
              onClick={handleConfirmDelivery}
              disabled={loading || !uploadedFile}
              className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Tasdiqlanmoqda...' : 'Yetkazib berishni tasdiqlash'}
            </button>
            <button 
              onClick={handleReportIssue}
              disabled={loading}
              className="w-full rounded-lg bg-gray-200 py-3 font-semibold text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Muammo haqida xabar berish
            </button>
          </div>
        </main>
      </div>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white">
        <nav className="flex items-center justify-around px-4 py-2">
          <button 
            onClick={() => navigate('/supplier/dashboard')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs">Bosh sahifa</span>
          </button>
          <button 
            onClick={() => navigate('/supplier/requests')}
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-xs">So'rovlar</span>
          </button>
          <button 
            onClick={() => navigate('/supplier/analytics')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-xs">Tahlil</span>
          </button>
          <button 
            onClick={() => navigate('/supplier/profile')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs">Profil</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default ConfirmDelivery;
