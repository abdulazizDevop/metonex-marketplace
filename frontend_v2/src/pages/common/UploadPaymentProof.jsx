import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const UploadPaymentProof = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')

  const orderDetails = {
    orderId: 'ORD-2024-001',
    supplier: 'Metro Construction Supplies',
    buyer: 'Tashkent Builders LLC',
    product: 'Concrete Mix M300',
    quantity: '100 bags',
    totalAmount: '$2,500.00',
    dueDate: '2024-01-20'
  }

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'account_balance' },
    { id: 'cash', name: 'Cash Payment', icon: 'payments' },
    { id: 'card', name: 'Card Payment', icon: 'credit_card' },
    { id: 'mobile', name: 'Mobile Payment', icon: 'phone_android' }
  ]

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    uploadFiles(newFiles)
  }

  const uploadFiles = async (files) => {
    setIsUploading(true)
    
    for (let fileObj of files) {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'completed' }
            : f
        )
      )
    }
    
    setIsUploading(false)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = () => {
    console.log('Submitting payment proof...')
    navigate('/following-payments-success')
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getFileIcon = (type) => {
    if (type.includes('image')) return 'image'
    if (type.includes('pdf')) return 'picture_as_pdf'
    return 'description'
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
          <h1 className="text-xl font-bold text-gray-900">Upload Payment Proof</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
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

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === method.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    paymentMethod === method.id ? 'bg-purple-600' : 'bg-gray-100'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      paymentMethod === method.id ? 'text-white' : 'text-gray-600'
                    }`}>
                      {method.icon}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    paymentMethod === method.id ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {method.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Payment Proof</h2>
          
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-purple-600 text-3xl">cloud_upload</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
            <p className="text-gray-600 mb-4">
              Upload payment receipt, screenshot, or bank statement
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File Requirements */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Accepted Documents:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Bank transfer receipts</li>
              <li>• Payment confirmation screenshots</li>
              <li>• Bank statements (highlighted transaction)</li>
              <li>• Mobile payment confirmations</li>
              <li>• Cash payment receipts</li>
            </ul>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Uploaded Files</h2>
            <div className="space-y-3">
              {uploadedFiles.map((fileObj) => (
                <div key={fileObj.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-purple-600">
                        {getFileIcon(fileObj.type)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{fileObj.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(fileObj.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fileObj.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-purple-600">Uploading...</span>
                      </div>
                    )}
                    {fileObj.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                        <span className="text-sm text-green-600">Uploaded</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-red-600 text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-900 mb-3">Important Information</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>• Upload clear, readable payment proof documents</p>
            <p>• Include transaction ID or reference number if available</p>
            <p>• Payment will be verified within 24-48 hours</p>
            <p>• You will receive confirmation once payment is verified</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={uploadedFiles.length === 0 || isUploading || uploadedFiles.some(f => f.status === 'pending')}
          className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${
            uploadedFiles.length === 0 || isUploading || uploadedFiles.some(f => f.status === 'pending')
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Submit Payment Proof'}
        </button>
      </div>
    </div>
  )
}

export default UploadPaymentProof
