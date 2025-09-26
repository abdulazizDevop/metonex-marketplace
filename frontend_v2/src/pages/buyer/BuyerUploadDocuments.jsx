import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerUploadDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
    companyLicense: null,
    taxCertificate: null,
    bankStatement: null,
    otherDocuments: []
  });

  const [uploading, setUploading] = useState(false);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Uploading documents:', documents);
      navigate('/buyer/profile?tab=company');
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate('/buyer/profile?tab=company');
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
          <h1 className="flex-1 text-center text-lg font-bold text-[#140e1b]">Upload Documents</h1>
          <div className="w-10"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4">
          <div className="space-y-6">
            {/* Instructions */}
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500">info</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Document Requirements</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Please upload clear, readable copies of your documents. Supported formats: PDF, JPG, PNG. Maximum file size: 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Upload Sections */}
            {documentTypes.map((docType) => (
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

            {/* Other Documents */}
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
            disabled={uploading || !documents.companyLicense || !documents.taxCertificate || !documents.bankStatement}
            className="flex-1 h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#a35ee8] text-base font-bold text-white shadow-lg shadow-[#a35ee8]/30 hover:bg-[#8e4dd1] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="truncate">Uploading...</span>
              </div>
            ) : (
              <span className="truncate">Upload Documents</span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BuyerUploadDocuments;
