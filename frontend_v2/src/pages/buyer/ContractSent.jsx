import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const ContractSent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for contract
  const [contractData] = useState(location.state?.contractData || {
    id: 'CON-001',
    orderId: 'ORD-001',
    title: 'Concrete Mix C25, 50 m³',
    totalAmount: '$4,250',
    supplier: 'SteelCorp Ltd',
    sentDate: '2024-01-15',
    contractUrl: '/contracts/contract-001.pdf'
  });

  const handleViewContract = () => {
    // Navigate to contract view
    navigate('/buyer/contract-view', {
      state: { contractData }
    });
  };

  const handleDownloadContract = () => {
    console.log('Downloading contract:', contractData.contractUrl);
    // In real app, this would download the file
    alert('Shartnoma yuklab olinmoqda...');
  };

  const handleProceedToPayment = () => {
    navigate('/buyer/upload-payment-proof', {
      state: { 
        orderData: contractData,
        contractSent: true 
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
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
              <h1 className="text-lg font-semibold text-gray-900">Shartnoma yuborildi</h1>
              <p className="text-sm text-gray-500">Buyurtma ID: {contractData.orderId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-800">Shartnoma yuborildi!</h2>
              <p className="text-green-700">Sotuvchi shartnomani yubordi. Endi to'lov qilishingiz mumkin.</p>
            </div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shartnoma ma'lumotlari</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Shartnoma ID:</span>
              <span className="font-medium">{contractData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buyurtma:</span>
              <span className="font-medium">{contractData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sotuvchi:</span>
              <span className="font-medium">{contractData.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa:</span>
              <span className="font-medium text-[#6C4FFF]">{contractData.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yuborilgan sana:</span>
              <span className="font-medium">{contractData.sentDate}</span>
            </div>
          </div>
        </div>

        {/* Contract Actions */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shartnoma hujjatlari</h3>
          <div className="space-y-3">
            <button
              onClick={handleViewContract}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6C4FFF]">description</span>
                <span className="font-medium text-gray-900">Shartnomani ko'rish</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <button
              onClick={handleDownloadContract}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6C4FFF]">download</span>
                <span className="font-medium text-gray-900">Shartnomani yuklab olish</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Keyingi qadamlar</h4>
              <p className="text-sm text-blue-800 mb-2">
                Shartnoma yuborildi. Endi to'lov qilishingiz kerak:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• To'lovni amalga oshiring</li>
                <li>• To'lov tasdiqlash hujjatini yuklang</li>
                <li>• Sotuvchi to'lovni tasdiqlaydi</li>
                <li>• Buyurtma tayyorlash boshlanadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
          >
            To'lov qilish
          </button>
          <button
            onClick={handleViewContract}
            className="w-full bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
          >
            Shartnomani ko'rish
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ContractSent;
