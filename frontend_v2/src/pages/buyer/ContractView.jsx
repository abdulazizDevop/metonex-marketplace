import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const ContractView = () => {
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
    contractUrl: '/contracts/contract-001.pdf',
    contractDetails: {
      product: 'Concrete Mix C25',
      quantity: '50 m³',
      unitPrice: '$85/m³',
      totalPrice: '$4,250',
      deliveryDate: '2024-01-22',
      paymentTerms: '50% advance, 50% on delivery',
      warranty: '12 months',
      deliveryAddress: 'Samarqand shahar, Registon ko\'chasi, 15-uy',
      supplierContact: '+998 91 234 56 78',
      buyerContact: '+998 90 123 45 67'
    }
  });

  const [activeTab, setActiveTab] = useState('overview');

  const handleBack = () => {
    navigate(-1);
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

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Asosiy ma'lumotlar</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Shartnoma ID:</span>
            <span className="font-medium">{contractData.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Buyurtma ID:</span>
            <span className="font-medium">{contractData.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mahsulot:</span>
            <span className="font-medium">{contractData.contractDetails.product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Miqdor:</span>
            <span className="font-medium">{contractData.contractDetails.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Narx:</span>
            <span className="font-medium">{contractData.contractDetails.unitPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jami summa:</span>
            <span className="font-medium text-[#6C4FFF]">{contractData.contractDetails.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Yetkazib berish</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Yetkazib berish sanasi:</span>
            <span className="font-medium">{contractData.contractDetails.deliveryDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Manzil:</span>
            <span className="font-medium text-right">{contractData.contractDetails.deliveryAddress}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov shartlari</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">To'lov usuli:</span>
            <span className="font-medium">{contractData.contractDetails.paymentTerms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kafolat:</span>
            <span className="font-medium">{contractData.contractDetails.warranty}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderParties = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sotuvchi</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Kompaniya:</span>
            <span className="font-medium">{contractData.supplier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Aloqa:</span>
            <span className="font-medium">{contractData.contractDetails.supplierContact}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Xaridor</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Kompaniya:</span>
            <span className="font-medium">Tashkent Builders LLC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Aloqa:</span>
            <span className="font-medium">{contractData.contractDetails.buyerContact}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Shartnoma shartlari</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>1. Sotuvchi shartnoma bo'yicha mahsulotni belgilangan muddatda yetkazib berish majburiyatini oladi.</p>
          <p>2. Xaridor to'lovni shartnoma shartlariga muvofiq amalga oshiradi.</p>
          <p>3. Mahsulot sifatiga kafolat 12 oy davomida beriladi.</p>
          <p>4. Shartnoma O'zbekiston Respublikasi qonunchiligi asosida tuzilgan.</p>
          <p>5. Nizolar hal qilinishda sud yurisdiktsiyasi qo'llaniladi.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Imzolash</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Sotuvchi imzosi:</span>
            <span className="font-medium text-green-600">✓ Imzolangan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Xaridor imzosi:</span>
            <span className="font-medium text-orange-600">⏳ Kutilmoqda</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Yuborilgan sana:</span>
            <span className="font-medium">{contractData.sentDate}</span>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-lg font-semibold text-gray-900">Shartnoma</h1>
              <p className="text-sm text-gray-500">ID: {contractData.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'overview', label: 'Umumiy' },
            { id: 'parties', label: 'Tomonlar' },
            { id: 'terms', label: 'Shartlar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#6C4FFF] text-[#6C4FFF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'parties' && renderParties()}
        {activeTab === 'terms' && renderTerms()}
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <button
          onClick={handleProceedToPayment}
          className="w-full bg-[#6C4FFF] text-white py-3 px-4 rounded-lg hover:bg-[#5A3FE6] transition-colors font-medium"
        >
          To'lov qilish
        </button>
        <button
          onClick={handleDownloadContract}
          className="w-full bg-white text-[#6C4FFF] py-3 px-4 rounded-lg border border-[#6C4FFF] hover:bg-[#6C4FFF]/5 transition-colors font-medium"
        >
          Shartnomani yuklab olish
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ContractView;
