import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userApi from '../../utils/userApi';

const BuyerUploadDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [documents, setDocuments] = useState({
    companyLicense: null,
    taxCertificate: null,
    bankStatement: null,
    otherDocuments: []
  });

  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload', 'edit', 'delete'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState([]);

  // Initialize mode and document from location state
  useEffect(() => {
    if (location.state) {
      setMode(location.state.mode || 'upload');
      setSelectedDocument(location.state.document || null);
    }
  }, [location.state]);

  const handleFileUpload = (documentType, file) => {
    if (documentType === 'otherDocuments') {
      setDocuments(prev => ({
        ...prev,
        otherDocuments: [...prev.otherDocuments, file]
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
  };

  const handleRemoveDocument = (documentType, index = null) => {
    if (documentType === 'otherDocuments' && index !== null) {
      setDocuments(prev => ({
        ...prev,
        otherDocuments: prev.otherDocuments.filter((_, i) => i !== index)
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [documentType]: null
      }));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (mode === 'delete' && selectedDocument) {
        // Handle document deletion
        await userApi.deleteCompanyDocument(selectedDocument.id);
        alert('Hujjat muvaffaqiyatli o\'chirildi');
      } else if (mode === 'edit' && selectedDocument) {
        // Handle document editing
        const formData = new FormData();
        formData.append('id', selectedDocument.id);
        
        const nameInput = document.querySelector('input[type="text"]');
        if (nameInput && nameInput.value) {
          formData.append('name', nameInput.value);
        }
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files[0]) {
          formData.append('file', fileInput.files[0]);
        }
        
        await userApi.updateCompanyDocument(selectedDocument.id, formData);
        alert('Hujjat muvaffaqiyatli yangilandi');
      } else {
        // Handle new document upload - upload each document separately
        const documentsToUpload = [];
        
        if (documents.companyLicense) {
          documentsToUpload.push({ file: documents.companyLicense, name: 'Company License', type: 'company_license' });
        }
        if (documents.taxCertificate) {
          documentsToUpload.push({ file: documents.taxCertificate, name: 'Tax Certificate', type: 'tax_certificate' });
        }
        if (documents.bankStatement) {
          documentsToUpload.push({ file: documents.bankStatement, name: 'Bank Statement', type: 'bank_statement' });
        }
        documents.otherDocuments.forEach((doc, index) => {
          documentsToUpload.push({ file: doc, name: `Other Document ${index + 1}`, type: 'other' });
        });

        for (const docItem of documentsToUpload) {
          const singleFormData = new FormData();
          singleFormData.append('file', docItem.file);
          singleFormData.append('name', docItem.name);
          singleFormData.append('type', docItem.type);
          await userApi.uploadCompanyDocument(singleFormData);
        }
        
        alert('Hujjatlar muvaffaqiyatli yuklandi');
      }
      navigate('/buyer/company');
    } catch (error) {
      console.error('Error processing documents:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate('/buyer/company');
  };

  const handleSingleUpload = async (docKey) => {
    const file = documents[docKey];
    if (!file) {
      alert('Fayl tanlanmagan');
      return;
    }

    setUploading(true);
    try {
      const docType = documentTypes.find(dt => dt.key === docKey);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', docType.label);
      formData.append('type', getDocumentType(docKey));

      await userApi.uploadCompanyDocument(formData);
      
      // Remove uploaded document from state
      setDocuments(prev => ({
        ...prev,
        [docKey]: null
      }));
      
      alert(`${docType.label} muvaffaqiyatli yuklandi!`);
      // Redirect to company page
      navigate('/buyer/company');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setUploading(false);
    }
  };

  const getDocumentType = (docKey) => {
    const typeMap = {
      'companyLicense': 'company_license',
      'taxCertificate': 'tax_certificate', 
      'bankStatement': 'bank_statement'
    };
    return typeMap[docKey] || 'other';
  };

  const documentTypes = [
    {
      key: 'companyLicense',
      label: 'Company License',
      description: 'Upload your company registration license',
      required: true
    },
    {
      key: 'taxCertificate',
      label: 'Tax Certificate',
      description: 'Upload your tax registration certificate',
      required: true
    },
    {
      key: 'bankStatement',
      label: 'Bank Statement',
      description: 'Upload your bank statement or account details',
      required: true
    }
  ];

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
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">
            {mode === 'edit' ? 'Hujjatni tahrirlash' : 
             mode === 'delete' ? 'Hujjatni o\'chirish' : 
             'Hujjat yuklash'}
          </h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4">
          <div className="space-y-6">
            {/* Mode-specific content */}
            {mode === 'delete' && selectedDocument ? (
              <div className="rounded-xl bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                  <div>
                    <h3 className="font-semibold text-red-900">Hujjatni o'chirish</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Siz "{selectedDocument.name}" hujjatini o'chirmoqchisiz. Bu amalni qaytarib bo'lmaydi.
                    </p>
                  </div>
                </div>
              </div>
            ) : mode === 'edit' && selectedDocument ? (
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500">edit</span>
                  <div>
                    <h3 className="font-semibold text-blue-900">Hujjatni tahrirlash</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      "{selectedDocument.name}" hujjatini tahrirlayapsiz. Yangi fayl yuklang yoki nomini o'zgartiring.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500">info</span>
                  <div>
                    <h3 className="font-semibold text-blue-900">Hujjat talablari</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Hujjatlaringizni aniq, o'qiladigan nusxalarini yuklang. Qo'llab-quvvatlanadigan formatlar: PDF, JPG, PNG. Maksimal fayl hajmi: 5MB.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Upload Sections - only show for upload mode */}
            {mode === 'upload' && documentTypes.map((docType) => (
              <section key={docType.key}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-[#140e1b]">{docType.label}</h2>
                  {docType.required && (
                    <span className="text-xs text-red-500 font-medium">Required</span>
                  )}
                </div>
                
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#a35ee8] transition-colors">
                  {documents[docType.key] ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
                        <div className="text-left">
                          <p className="font-medium text-[#140e1b]">{documents[docType.key].name}</p>
                          <p className="text-sm text-gray-500">
                            {(documents[docType.key].size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSingleUpload(docType.key)}
                          className="px-3 py-1.5 text-sm text-white bg-[#6C4FFF] hover:bg-[#5a3fd8] rounded-lg transition-colors"
                        >
                          Upload This
                        </button>
                        <button
                          onClick={() => handleRemoveDocument(docType.key)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => document.getElementById(`file-${docType.key}`).click()}
                          className="px-3 py-1.5 text-sm text-[#a35ee8] hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <span className="material-symbols-outlined text-gray-400 text-4xl">cloud_upload</span>
                      <div>
                        <p className="font-medium text-[#140e1b]">Upload {docType.label}</p>
                        <p className="text-sm text-gray-500">{docType.description}</p>
                      </div>
                      <button
                        onClick={() => document.getElementById(`file-${docType.key}`).click()}
                        className="px-4 py-2 bg-[#a35ee8] text-white rounded-lg hover:bg-[#8e4dd1] transition-colors"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                  
                  <input
                    id={`file-${docType.key}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size <= 5 * 1024 * 1024) {
                        handleFileUpload(docType.key, file);
                      } else if (file) {
                        alert('File size must be less than 5MB');
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </section>
            ))}

            {/* Other Documents - only show for upload mode */}
            {mode === 'upload' && (
            <section>
              <h2 className="text-lg font-bold text-[#140e1b] mb-3">Other Documents</h2>
              <div className="space-y-3">
                {documents.otherDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-500">check_circle</span>
                      <div>
                        <p className="font-medium text-[#140e1b]">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDocument('otherDocuments', index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
                
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-4 text-center hover:border-[#a35ee8] transition-colors">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">add</span>
                  <p className="text-sm text-gray-500 mt-2">Add additional documents</p>
                  <button
                    onClick={() => document.getElementById('file-other').click()}
                    className="mt-2 px-3 py-1.5 text-sm text-[#a35ee8] hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    Choose File
                  </button>
                  
                  <input
                    id="file-other"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size <= 5 * 1024 * 1024) {
                        handleFileUpload('otherDocuments', file);
                      } else if (file) {
                        alert('File size must be less than 5MB');
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </section>
            )}

            {/* Edit/Delete mode content */}
            {(mode === 'edit' || mode === 'delete') && selectedDocument && (
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-gray-500">description</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{selectedDocument.name}</h3>
                    <p className="text-sm text-gray-500">Yuklangan: {selectedDocument.date}</p>
                    <p className="text-xs text-gray-400">{selectedDocument.file}</p>
                  </div>
                </div>
                
                {mode === 'edit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hujjat nomi
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedDocument.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                        placeholder="Hujjat nomini kiriting"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yangi fayl (ixtiyoriy)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4FFF] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-gray-100 bg-white/95 pb-safe">
        <div className="flex gap-4 p-4">
          <button 
            onClick={handleCancel}
            disabled={uploading}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-300 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="truncate">Cancel</span>
          </button>
          <button 
            onClick={handleUpload}
            disabled={uploading || (mode === 'upload' && (!documents.companyLicense || !documents.taxCertificate || !documents.bankStatement))}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#6C4FFF] text-base font-bold text-white shadow-lg shadow-[#6C4FFF]/30 hover:bg-[#5A3FE6] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="truncate">
                  {mode === 'delete' ? 'O\'chirilmoqda...' : 
                   mode === 'edit' ? 'Yangilanmoqda...' : 
                   'Yuklanmoqda...'}
                </span>
              </div>
            ) : (
              <span className="truncate">
                {mode === 'delete' ? 'O\'chirish' : 
                 mode === 'edit' ? 'Saqlash' : 
                 'Hujjat yuklash'}
              </span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BuyerUploadDocuments;
