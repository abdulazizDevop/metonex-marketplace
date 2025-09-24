import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DocumentsReadyForPayment = () => {
  const navigate = useNavigate()
  const [selectedDocuments, setSelectedDocuments] = useState([])

  const documents = [
    {
      id: 1,
      type: 'Invoice',
      name: 'Invoice_ORD-2024-001.pdf',
      size: '2.4 MB',
      status: 'Ready',
      uploadedDate: '2024-01-10',
      description: 'Official invoice for order ORD-2024-001'
    },
    {
      id: 2,
      type: 'Contract',
      name: 'Supply_Contract_2024.pdf',
      size: '1.8 MB',
      status: 'Ready',
      uploadedDate: '2024-01-10',
      description: 'Supply contract and terms agreement'
    },
    {
      id: 3,
      type: 'Certificate',
      name: 'Quality_Certificate.pdf',
      size: '1.2 MB',
      status: 'Ready',
      uploadedDate: '2024-01-10',
      description: 'Product quality certificate'
    },
    {
      id: 4,
      type: 'TTN',
      name: 'Transport_Waybill_TTN.pdf',
      size: '0.9 MB',
      status: 'Ready',
      uploadedDate: '2024-01-10',
      description: 'Transportation waybill document'
    }
  ]

  const orderDetails = {
    orderId: 'ORD-2024-001',
    supplier: 'Metro Construction Supplies',
    buyer: 'Tashkent Builders LLC',
    product: 'Concrete Mix M300',
    quantity: '100 bags',
    totalAmount: '$2,500.00',
    dueDate: '2024-01-20',
    status: 'Documents Ready'
  }

  const handleDocumentSelect = (docId) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map(doc => doc.id))
    }
  }

  const handleDownloadDocument = (document) => {
    console.log(`Downloading ${document.name}...`)
    // In real app, this would download the document
  }

  const handlePreviewDocument = (document) => {
    console.log(`Previewing ${document.name}...`)
    navigate('/pdf-document-preview', { state: { document } })
  }

  const handleProceedToPayment = () => {
    console.log('Proceeding to payment...')
    navigate('/payment-confirmed')
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'Invoice':
        return 'receipt_long'
      case 'Contract':
        return 'description'
      case 'Certificate':
        return 'verified'
      case 'TTN':
        return 'local_shipping'
      default:
        return 'description'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Documents Ready</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-800">Documents Ready for Payment</h2>
              <p className="text-green-700">All required documents have been processed and are ready for payment.</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium">{orderDetails.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{orderDetails.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{orderDetails.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-purple-600">{orderDetails.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{orderDetails.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Payment Documents</h2>
            <button
              onClick={handleSelectAll}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              {selectedDocuments.length === documents.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-3">
            {documents.map((document) => (
              <div 
                key={document.id}
                className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                  selectedDocuments.includes(document.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => handleDocumentSelect(document.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedDocuments.includes(document.id) ? 'bg-purple-600' : 'bg-gray-100'
                    }`}>
                      <span className={`material-symbols-outlined ${
                        selectedDocuments.includes(document.id) ? 'text-white' : 'text-gray-600'
                      }`}>
                        {getDocumentIcon(document.type)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{document.name}</h3>
                      <p className="text-sm text-gray-600">{document.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{document.size}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{document.uploadedDate}</span>
                        <span className="text-xs text-green-600 font-medium">{document.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewDocument(document)
                      }}
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-blue-600 text-sm">visibility</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadDocument(document)
                      }}
                      className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-green-600 text-sm">download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">Payment Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Payment will be processed after document verification</p>
            <p>• All documents must be approved before payment release</p>
            <p>• Payment will be transferred to supplier within 2-3 business days</p>
            <p>• You will receive payment confirmation via email</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleProceedToPayment}
            className="w-full h-14 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => navigate('/upload-invoice')}
            className="w-full h-14 bg-gray-100 text-gray-800 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors"
          >
            Upload Additional Documents
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentsReadyForPayment
