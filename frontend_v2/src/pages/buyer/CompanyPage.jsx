import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyPage = () => {
  const navigate = useNavigate();
  
  const [companyData] = useState({
    companyName: 'O\'zbekiston Qurilish MChJ',
    buyerId: '123456',
    rating: 4.8,
    rank: 8,
    totalBuyers: 150,
    totalReviews: 95,
    profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj41-PwDLpMDAVf0vzGk89KRvxCUknfTyrhRvmtMkNK29xe4ngs3qUssLoayhPwAPuseJ84dl4TTlO08AqaWnQv0SwBd-5IJCxShTODuYldLnvXjMN3CQz-qUKnPRuonOTqO0zq6JFolj-oGctqKvT4CvxMJg6wBjgG6YxWYe4ZoNFYzIzAIv9RNp9agkGsbGcyyXpuZ3ZxU52YS_6KQDSKXw2zipAFfkEschcYc8183tWUl4w_G6Ni_wrkTSpRkOzPieIq_Zkh6o',
    legalAddress: 'Tashkent, Uzbekistan',
    inn: '123456789',
    verificationStatus: 'verified',
    bankName: 'Asaka Bank',
    accountNumber: '****1234',
    mfo: '00014',
    currency: 'UZS',
    accountantName: 'Sarah Wilson',
    accountantPhone: '+998 90 234 56 78',
    accountantEmail: 'sarah.wilson@uzbekiston-qurilish.uz',
    accountantTelegram: '@sarah_wilson',
    memberSince: '2020',
    totalOrders: 156
  });

  const [documents] = useState([
    { name: 'Company License', status: 'verified', date: '2024-01-15', file: 'license.pdf' },
    { name: 'Tax Certificate', status: 'verified', date: '2024-01-10', file: 'tax_cert.pdf' },
    { name: 'Bank Statement', status: 'verified', date: '2024-01-20', file: 'bank_statement.pdf' },
    { name: 'Other Documents', status: 'pending', date: '2024-01-25', file: 'other_docs.pdf' }
  ]);

  const handleBack = () => {
    navigate('/buyer/company');
  };

  const handleEditCompany = () => {
    navigate('/buyer/edit-company');
  };

  const handleUploadDocuments = () => {
    navigate('/buyer/upload-documents');
  };

  const handleViewDocument = (file) => {
    console.log('View document:', file);
  };

  const handleDownloadDocument = (file) => {
    console.log('Download document:', file);
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
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </header>

      Main Content
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Company Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20" 
                style={{ backgroundImage: `url("${companyData.profileImage}")` }}
              />
              <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-2 ring-white">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Verified</span>
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900">{companyData.companyName}</h2>
            <p className="text-sm text-gray-500">Buyer ID: {companyData.buyerId}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>Member since {companyData.memberSince}</span>
              <span>•</span>
              <span>Rank #{companyData.rank} of {companyData.totalBuyers}</span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            <button 
              onClick={handleEditCompany}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Company Name</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.companyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Legal Address</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.legalAddress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">INN/STIR</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.inn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Verification Status</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                <span className="text-sm font-semibold text-green-600">Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
            <button 
              onClick={handleEditCompany}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Bank Name</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.bankName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Account Number</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">MFO</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.mfo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Currency</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.currency}</span>
            </div>
          </div>
        </div>

        {/* Accountant Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accountant Contact</h3>
            <button 
              onClick={handleEditCompany}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Name</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Phone</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Telegram</span>
              <span className="text-sm font-semibold text-gray-900">{companyData.accountantTelegram}</span>
            </div>
          </div>
        </div>

        {/* Verification Documents */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification Documents</h3>
            <button 
              onClick={handleUploadDocuments}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Upload
            </button>
          </div>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">Uploaded: {doc.date}</p>
                  <p className="text-xs text-gray-400">{doc.file}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewDocument(doc.file)}
                    className="p-1.5 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                  <button 
                    onClick={() => handleDownloadDocument(doc.file)}
                    className="p-1.5 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {doc.status === 'verified' ? (
                      <>
                        <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                        <span className="text-xs font-medium text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-yellow-500 text-sm">schedule</span>
                        <span className="text-xs font-medium text-yellow-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
      </main>
    </div>
  );
};

export default CompanyPage;
