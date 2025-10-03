import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerDocumentUpload = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'orders';
  const documentType = location.state?.documentType || 'contract';

  // Mock data for order
  const [orderData] = useState({
    id: id,
    requestTitle: 'Concrete Mix C25, 50 m³',
    buyer: 'BuildCorp Ltd',
    totalAmount: '$4,250'
  });

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const documentTypes = {
    'contract': {
      label: 'Shartnoma',
      description: 'Buyurtma shartnomasi',
      required: true,
      allowedTypes: ['pdf', 'doc', 'docx'],
      maxSize: 10 // MB
    },
    'invoice': {
      label: 'Hisob-faktura',
      description: 'To\'lov hisob-fakturasi',
      required: true,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5
    },
    'ttn': {
      label: 'TTN (Transport hujjati)',
      description: 'Yuk tashish hujjati',
      required: true,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5
    }
  };

  const currentDocType = documentTypes[documentType];

  const handleBack = () => {
    navigate(`/seller/order-details/${id}`, {
      state: { returnTab }
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!currentDocType.allowedTypes.includes(fileExtension)) {
      setError(`Faqat ${currentDocType.allowedTypes.join(', ').toUpperCase()} fayllar qabul qilinadi`);
      return;
    }

    // Validate file size
    const maxSizeBytes = currentDocType.maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Fayl hajmi ${currentDocType.maxSize}MB dan katta bo'lmasligi kerak`);
      return;
    }

    setUploadForm(prev => ({
      ...prev,
      file: file,
      title: prev.title || currentDocType.label
    }));
  };

  const handleSubmit = async () => {
    if (!uploadForm.file) {
      setError('Fayl tanlashingiz kerak');
      return;
    }

    if (!uploadForm.title.trim()) {
      setError('Hujjat nomini kiriting');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Uploading document:', {
        orderId: id,
        type: documentType,
        title: uploadForm.title,
        description: uploadForm.description,
        file: uploadForm.file
      });

      // Success
      alert('Hujjat muvaffaqiyatli yuklandi!');
      navigate(`/seller/order-details/${id}`, {
        state: { returnTab }
      });

    } catch (error) {
      console.error('Upload error:', error);
      setError('Hujjat yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between overflow-x-hidden bg-gray-50">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Hujjat yuklash</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{orderData.requestTitle}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Buyer:</span> {orderData.buyer}
              </div>
              <div>
                <span className="font-medium">Jami summa:</span> {orderData.totalAmount}
              </div>
            </div>
          </div>

          {/* Document Type Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#6C4FFF]/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6C4FFF]">description</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentDocType.label}</h3>
                <p className="text-sm text-gray-600">{currentDocType.description}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-600 text-sm mt-0.5">info</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Talablar:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Ruxsat etilgan formatlar: {currentDocType.allowedTypes.join(', ').toUpperCase()}</li>
                    <li>• Maksimal hajm: {currentDocType.maxSize}MB</li>
                    <li>• {currentDocType.required ? 'Majburiy' : 'Ixtiyoriy'} hujjat</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hujjat ma'lumotlari</h3>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hujjat nomi *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={currentDocType.label}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif (ixtiyoriy)
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Hujjat haqida qo'shimcha ma'lumot..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fayl *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#6C4FFF] transition-colors">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept={currentDocType.allowedTypes.map(type => `.${type}`).join(',')}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                      <p className="text-sm text-gray-600 mb-1">
                        Faylni tanlang yoki bu yerga sudrab tashlang
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentDocType.allowedTypes.join(', ').toUpperCase()} • Maks. {currentDocType.maxSize}MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Selected File */}
                {uploadForm.file && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">{uploadForm.file.name}</p>
                        <p className="text-xs text-green-600">{formatFileSize(uploadForm.file.size)}</p>
                      </div>
                      <button
                        onClick={() => setUploadForm(prev => ({ ...prev, file: null }))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 text-sm">error</span>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-200 space-y-2">
          <button
            onClick={handleSubmit}
            disabled={uploading || !uploadForm.file || !uploadForm.title.trim()}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Yuklanmoqda...' : 'Hujjatni yuklash'}
          </button>
          <button
            onClick={handleBack}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Bekor qilish
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerDocumentUpload;
