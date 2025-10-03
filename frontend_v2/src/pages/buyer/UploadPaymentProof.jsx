import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const UploadPaymentProof = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Mock data for order
  const [orderData] = useState(location.state?.orderData || {
    id: 'ORD-001',
    title: 'Concrete Mix C25, 50 m³',
    totalAmount: '$4,250',
    supplier: 'SteelCorp Ltd',
    paymentMethod: 'Bank Transfer',
    dueDate: '2024-01-20'
  });

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

  const handleSubmit = async () => {
    if (!uploadedFile) {
      setError('To\'lov tasdiqlash hujjatini yuklashingiz kerak');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      
      // Navigate to success page after delay
      setTimeout(() => {
        navigate('/buyer/payment-confirmed', {
          state: { orderData, paymentProof: uploadedFile }
        });
      }, 2000);

    } catch (error) {
      console.error('Error uploading payment proof:', error);
      setError('To\'lov tasdiqlash hujjatini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-6xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            To'lov tasdiqlash hujjati yuklandi!
          </h2>
          <p className="text-gray-600">
            Sotuvchi to'lovni tekshirib, buyurtmani tasdiqlaydi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">To'lov tasdiqlash</h1>
              <p className="text-sm text-gray-500">Hujjat yuklash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Order Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyurtma ma'lumotlari</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Buyurtma:</span>
              <span className="font-medium">{orderData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sotuvchi:</span>
              <span className="font-medium">{orderData.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa:</span>
              <span className="font-medium text-[#6C4FFF]">{orderData.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov usuli:</span>
              <span className="font-medium">{orderData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To'lov muddati:</span>
              <span className="font-medium">{orderData.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">To'lov tasdiqlash hujjati</h4>
              <p className="text-sm text-blue-800">
                To'lovni amalga oshirganingizdan so'ng, bank cheki, o'tkazma tasdiqlash hujjati yoki boshqa to'lov tasdiqlash hujjatini yuklang.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Hujjat yuklash</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {filePreview ? (
              <div className="mb-4">
                <img 
                  src={filePreview} 
                  alt="Payment Proof Preview" 
                  className="max-w-full h-48 object-contain mx-auto rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-600">
                  {uploadedFile?.name}
                </p>
              </div>
            ) : (
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">
                upload_file
              </span>
            )}
            
            <p className="font-semibold text-gray-900 mb-1">
              {uploadedFile ? 'Fayl yuklandi' : 'To\'lov tasdiqlash hujjatini yuklang'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {uploadedFile ? 'Fayl muvaffaqiyatli yuklandi' : 'JPG, PNG yoki PDF formatida, maksimal 5MB'}
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
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {uploadedFile ? 'Faylni o\'zgartirish' : 'Fayl tanlash'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!uploadedFile || loading}
          className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Yuklanmoqda...
            </div>
          ) : (
            'Hujjatni yuborish'
          )}
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default UploadPaymentProof;
