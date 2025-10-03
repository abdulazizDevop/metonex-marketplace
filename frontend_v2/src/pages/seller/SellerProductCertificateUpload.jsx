import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const SellerProductCertificateUpload = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const returnTab = location.state?.returnTab || 'products';

  // Mock data for product
  const [productData] = useState(location.state?.productData || {
    id: id,
    name: 'Steel Bars Grade 60',
    brand: 'SteelCorp',
    category: 'Metal',
    currentCertificates: [
      {
        id: 1,
        name: 'Quality Certificate ISO 9001',
        type: 'quality',
        uploadDate: '2024-01-15',
        expiryDate: '2025-01-15',
        status: 'verified',
        fileUrl: 'https://example.com/cert1.pdf'
      },
      {
        id: 2,
        name: 'Material Test Report',
        type: 'test',
        uploadDate: '2024-01-10',
        expiryDate: '2024-07-10',
        status: 'pending',
        fileUrl: 'https://example.com/cert2.pdf'
      }
    ]
  });

  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'quality',
    description: '',
    expiryDate: '',
    file: null
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const certificateTypes = [
    { value: 'quality', label: 'Sifat sertifikati', description: 'ISO 9001, ISO 14001 va boshqalar' },
    { value: 'test', label: 'Sinov hisoboti', description: 'Material sinov hisobotlari' },
    { value: 'safety', label: 'Xavfsizlik sertifikati', description: 'OHSAS 18001 va boshqalar' },
    { value: 'environmental', label: 'Atrof-muhit sertifikati', description: 'ISO 14001 va boshqalar' },
    { value: 'origin', label: 'Kelib chiqish sertifikati', description: 'Mahsulot kelib chiqishi' },
    { value: 'customs', label: 'Bojxona hujjati', description: 'Import/eksport hujjatlari' },
    { value: 'other', label: 'Boshqa', description: 'Boshqa turdagi sertifikatlar' }
  ];

  const handleBack = () => {
    navigate(`/seller/product/${id}`, {
      state: { returnTab }
    });
  };

  const handleInputChange = (field, value) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Faqat PDF, JPG, PNG formatidagi fayllar qabul qilinadi');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Fayl hajmi 10MB dan katta bo\'lmasligi kerak');
      return;
    }

    setUploadForm(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.name.trim()) {
      setError('Sertifikat nomini kiriting');
      return;
    }

    if (!uploadForm.file) {
      setError('Sertifikat faylini yuklang');
      return;
    }

    if (!uploadForm.expiryDate) {
      setError('Amal qilish muddatini kiriting');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Certificate uploaded:', {
        productId: id,
        certificate: uploadForm
      });

      setSuccess('Sertifikat muvaffaqiyatli yuklandi!');
      
      // Reset form
      setUploadForm({
        name: '',
        type: 'quality',
        description: '',
        expiryDate: '',
        file: null
      });

      // Navigate back after success
      setTimeout(() => {
        navigate(`/seller/product/${id}`, {
          state: { returnTab, message: 'Sertifikat muvaffaqiyatli yuklandi' }
        });
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setError('Sertifikat yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Tasdiqlangan';
      case 'pending': return 'Kutilmoqda';
      case 'rejected': return 'Rad etilgan';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

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
              <h1 className="text-lg font-semibold text-gray-900">Sertifikat yuklash</h1>
              <p className="text-sm text-gray-500">{productData.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Current Certificates */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Mavjud sertifikatlar</h3>
          <div className="space-y-3">
            {productData.currentCertificates.map((cert) => (
              <div key={cert.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{cert.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                    {getStatusText(cert.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Tur: {certificateTypes.find(t => t.value === cert.type)?.label}</p>
                  <p>Yuklangan: {formatDate(cert.uploadDate)}</p>
                  <p className={`${isExpired(cert.expiryDate) ? 'text-red-600' : isExpiringSoon(cert.expiryDate) ? 'text-yellow-600' : 'text-gray-600'}`}>
                    Amal qilish muddati: {formatDate(cert.expiryDate)}
                    {isExpired(cert.expiryDate) && ' (Muddati o\'tgan)'}
                    {isExpiringSoon(cert.expiryDate) && ' (Tez orada tugaydi)'}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-[#6C4FFF] hover:text-[#5A3FE6] text-sm font-medium">
                    Ko'rish
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Yuklab olish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yangi sertifikat yuklash</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Certificate Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sertifikat nomi *
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masalan: ISO 9001 Quality Certificate"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                required
              />
            </div>

            {/* Certificate Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sertifikat turi *
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                required
              >
                {certificateTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {certificateTypes.find(t => t.value === uploadForm.type)?.description}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Sertifikat haqida qo'shimcha ma'lumot..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent resize-none"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amal qilish muddati *
              </label>
              <input
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sertifikat fayli *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#6C4FFF] transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
                      cloud_upload
                    </span>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-[#6C4FFF]">Faylni tanlang</span> yoki bu yerga sudrab tashlang
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG (maksimal 10MB)
                    </p>
                    {uploadForm.file && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">
                          {uploadForm.file.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-red-600 mr-2 text-sm">
                    error
                  </span>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-green-600 mr-2 text-sm">
                    check_circle
                  </span>
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Yuklanmoqda...
                </div>
              ) : (
                'Sertifikatni yuklash'
              )}
            </button>
          </form>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="material-symbols-outlined text-blue-600 mr-3 mt-0.5">
              info
            </span>
            <div>
              <h4 className="text-blue-800 font-medium">Ma'lumot</h4>
              <ul className="text-blue-700 text-sm mt-1 space-y-1">
                <li>• Sertifikatlar admin tomonidan tekshiriladi</li>
                <li>• Faqat PDF, JPG, PNG formatidagi fayllar qabul qilinadi</li>
                <li>• Fayl hajmi 10MB dan katta bo'lmasligi kerak</li>
                <li>• Amal qilish muddati aniq belgilanishi kerak</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SellerProductCertificateUpload;
