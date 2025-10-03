import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../utils/userApi';

const BuyerEditCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    legalAddress: '',
    innStir: '',
    bankName: '',
    accountNumber: '',
    mfo: '',
    currency: 'UZS',
    accountantName: '',
    accountantPhone: '',
    accountantEmail: '',
    telegramOwner: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load company data from backend
  const loadCompanyData = async () => {
    setInitialLoading(true);
    try {
      const company = await userApi.getCompany();
      
      setFormData({
        companyName: company.name || '',
        legalAddress: company.legal_address || '',
        innStir: company.inn_stir || '',
        bankName: company.bank_details?.bank_name || '',
        accountNumber: company.bank_details?.account_number || '',
        mfo: company.bank_details?.mfo || '',
        currency: company.bank_details?.currency || 'UZS',
        accountantName: company.accountant_contact?.name || '',
        accountantPhone: company.accountant_contact?.phone || '',
        accountantEmail: company.accountant_contact?.email || '',
        telegramOwner: company.accountant_contact?.telegram || ''
      });
      
    } catch (error) {
      console.error('Company ma\'lumotlarini yuklashda xatolik:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const companyUpdateData = {
        name: formData.companyName,
        legal_address: formData.legalAddress,
        inn_stir: formData.innStir,
        bank_details: {
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          mfo: formData.mfo,
          currency: formData.currency
        },
        accountant_contact: {
          name: formData.accountantName,
          phone: formData.accountantPhone,
          email: formData.accountantEmail,
          telegram: formData.telegramOwner
        }
      };

      await userApi.updateCompany(companyUpdateData);
      alert('Company ma\'lumotlari muvaffaqiyatli saqlandi');
      navigate('/buyer/company');
    } catch (error) {
      console.error('Company ma\'lumotlarini saqlashda xatolik:', error);
      alert('Company ma\'lumotlarini saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/buyer/company');
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4FFF] mb-4"></div>
        <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden bg-white">
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 pb-3 backdrop-blur-sm">
          <button 
            onClick={handleCancel}
            className="flex size-10 items-center justify-center rounded-full text-[#140e1b] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Edit Company</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4">
          <div className="space-y-6">
            {/* Company Information */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b] mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Legal Address</label>
                  <textarea
                    value={formData.legalAddress}
                    onChange={(e) => handleInputChange('legalAddress', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">INN/STIR</label>
                  <input
                    type="text"
                    value={formData.innStir}
                    onChange={(e) => handleInputChange('innStir', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Bank Details */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b] mb-4">Bank Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MFO</label>
                    <input
                      type="text"
                      value={formData.mfo}
                      onChange={(e) => handleInputChange('mfo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                    >
                      <option value="UZS">UZS</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Accountant Contact */}
            <section>
              <h2 className="text-lg font-bold text-[#140e1b] mb-4">Accountant Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.accountantName}
                    onChange={(e) => handleInputChange('accountantName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.accountantPhone}
                    onChange={(e) => handleInputChange('accountantPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.accountantEmail}
                    onChange={(e) => handleInputChange('accountantEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegramOwner}
                    onChange={(e) => handleInputChange('telegramOwner', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a35ee8] focus:border-transparent"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-gray-100 bg-white/95 pb-safe">
        <div className="flex gap-4 p-4">
          <button 
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-300 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="truncate">Cancel</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#a35ee8] text-base font-bold text-white shadow-lg shadow-[#a35ee8]/30 hover:bg-[#8e4dd1] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="truncate">Saving...</span>
              </div>
            ) : (
              <span className="truncate">Save Changes</span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BuyerEditCompany;
