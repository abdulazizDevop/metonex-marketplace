import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../utils/userApi';

const CompanyPage = () => {
  const navigate = useNavigate();
  
  const [companyData, setCompanyData] = useState({
    companyName: '',
    buyerId: '',
    rating: 0,
    rank: 0,
    totalBuyers: 0,
    totalReviews: 0,
    profileImage: '',
    legalAddress: '',
    inn: '',
    verificationStatus: 'unverified',
    bankName: '',
    accountNumber: '',
    mfo: '',
    currency: 'UZS',
    accountantName: '',
    accountantPhone: '',
    accountantEmail: '',
    accountantTelegram: '',
    memberSince: '',
    totalOrders: 0,
    createdAt: null
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load company data from API
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        
        // Fetch company and user data
        const [companyResponse, userProfile, ordersData] = await Promise.all([
          userApi.getCompany(),
          userApi.getProfile(),
          userApi.getOrders()
        ]);

        // Process company data
        const company = companyResponse;
        const user = userProfile;
        const orders = ordersData.results || ordersData || [];

        // Get accountant from team members
        let accountant = null;
        try {
          const teamResponse = await userApi.getTeamMembers();
          accountant = teamResponse.find(member => member.role === 'accountant');
        } catch (teamError) {
          console.error('Team members olishda xatolik:', teamError);
        }

        // Extract bank details from JSON field
        const bankDetails = company.bank_details || {};
        const accountantContact = company.accountant_contact || {};

        setCompanyData({
          companyName: company.name || 'Company Name',
          buyerId: user.id || 'N/A',
          rating: user.rating || 0,
          rank: user.rank || 0,
          totalBuyers: user.total_buyers || 0,
          totalReviews: user.total_reviews || 0,
          profileImage: user.avatar || '',
          legalAddress: company.legal_address || '',
          inn: company.inn_stir || '',
          verificationStatus: company.is_verified ? 'verified' : 'unverified',
          bankName: bankDetails.bank_name || '',
          accountNumber: bankDetails.account_number || '',
          mfo: bankDetails.mfo || '',
          currency: bankDetails.currency || 'UZS',
          accountantName: accountantContact.name || accountant?.name || '',
          accountantPhone: accountantContact.phone || accountant?.phone || '',
          accountantEmail: accountantContact.email || accountant?.email || '',
          accountantTelegram: accountantContact.telegram || accountant?.telegram_username || '',
          memberSince: company.created_at ? new Date(company.created_at).getFullYear().toString() : '',
          totalOrders: orders.length,
          createdAt: company.created_at
        });

        // Load verification documents from new Document model API
        try {
          const documentsResponse = await userApi.getCompanyDocuments();
          const processedDocs = documentsResponse.documents.map(doc => ({
            id: doc.id,
            name: doc.name || 'Document',
            date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            file: doc.file || 'document.pdf',
            file_name: doc.file_name || 'document.pdf'
          }));
          setDocuments(processedDocs);
        } catch (docError) {
          console.error('Hujjatlarni yuklashda xatolik:', docError);
          setDocuments([]); // Fallback to empty array
        }

      } catch (error) {
        console.error('Company ma\'lumotlarini yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  const handleBack = () => {
    navigate('/buyer/company');
  };

  const handleEditCompany = () => {
    navigate('/buyer/edit-company');
  };

  const handleUploadDocuments = () => {
    navigate('/buyer/upload-documents');
  };

  const handleViewDocument = (doc) => {
    // Open document in new tab
    const fileUrl = doc.file.startsWith('http') ? doc.file : `http://localhost:8000${doc.file}`;
    window.open(fileUrl, '_blank');
  };


  const handleDeleteDocument = async (doc) => {
    if (window.confirm('Bu hujjatni o\'chirishni xohlaysizmi?')) {
      try {
        await userApi.deleteCompanyDocument(doc.id);
        alert('Hujjat muvaffaqiyatli o\'chirildi');
        // Reload page data
        window.location.reload();
      } catch (error) {
        console.error('Hujjatni o\'chirishda xatolik:', error);
        alert('Hujjatni o\'chirishda xatolik yuz berdi');
      }
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-20 border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold text-center text-gray-900">
                Company Information
              </h1>
            </div>
            <button
              onClick={handleEditCompany}
              className="px-3 py-1.5 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4FFF] mx-auto mb-4"></div>
              <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Company Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20" 
                style={{ 
                  backgroundImage: companyData.profileImage 
                    ? `url("${companyData.profileImage.startsWith('http') ? companyData.profileImage : `http://localhost:8000${companyData.profileImage}`}")` 
                    : 'none',
                  backgroundColor: companyData.profileImage ? 'transparent' : '#f3f4f6'
                }}
              >
                {!companyData.profileImage && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="material-symbols-outlined text-2xl">business</span>
                  </div>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-2 ring-white ${
                companyData.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <span className="material-symbols-outlined text-sm">
                  {companyData.verificationStatus === 'verified' ? 'verified' : 'schedule'}
                </span>
                <span>{companyData.verificationStatus === 'verified' ? 'Verified' : 'Pending'}</span>
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900">{companyData.companyName}</h2>
            <p className="text-sm text-gray-500">Buyer ID: {companyData.buyerId}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>Kompaniya qo'shilgan: {companyData.createdAt ? new Date(companyData.createdAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}</span>
              <span>•</span>
              <span>Buyurtmalar: {companyData.totalOrders}</span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Company Name</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.companyName || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Legal Address</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.legalAddress || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">INN/STIR</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.inn || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Verification Status</span>
              <span className="flex items-center gap-1">
                <span className={`material-symbols-outlined text-sm ${
                  companyData.verificationStatus === 'verified' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {companyData.verificationStatus === 'verified' ? 'verified' : 'schedule'}
                </span>
                <span className={`text-sm font-semibold ${
                  companyData.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {companyData.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Bank Name</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.bankName || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Account Number</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountNumber || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">MFO</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.mfo || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Currency</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.currency || 'UZS'}</span>
            </div>
          </div>
        </div>

        {/* Accountant Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accountant Contact</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Name</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantName || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Phone</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantPhone || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantEmail || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Telegram</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantTelegram || 'Kiritilmagan'}</span>
            </div>
          </div>
        </div>

        {/* Verification Documents */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification Documents</h3>
            <button 
              onClick={handleUploadDocuments}
              className="px-3 py-1.5 bg-[#6C4FFF] text-white rounded-lg hover:bg-[#5A3FE6] transition-colors text-sm"
            >
              Upload
            </button>
          </div>
          <div className="space-y-3">
            {documents.length > 0 ? documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#6C4FFF]/10 text-[#6C4FFF]">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.file_name || 'document.pdf'}</p>
                  <p className="text-xs text-gray-500">Uploaded: {doc.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    onClick={() => handleViewDocument(doc)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#6C4FFF] cursor-pointer transition-colors"
                    title="Ko'rish"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Ko'rish
                  </span>
                  <span 
                    onClick={() => handleDeleteDocument(doc)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-500 cursor-pointer transition-colors"
                    title="O'chirish"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    O'chirish
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">description</span>
                <p className="text-sm">Hozircha hujjatlar yo'q</p>
                <p className="text-xs text-gray-400 mt-1">Hujjatlarni yuklash uchun "Upload" tugmasini bosing</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Statistics */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-lg font-bold text-purple-600">{companyData.memberSince}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-lg font-bold text-purple-600">{companyData.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </main>

    </div>
  );
};

export default CompanyPage;
