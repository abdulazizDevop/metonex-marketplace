import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const PdfDocumentPreview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [document, setDocument] = useState(null)

  useEffect(() => {
    // Simulate document loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      setDocument(location.state?.document || {
        name: 'Invoice_ORD-2024-001.pdf',
        type: 'Invoice',
        size: '2.4 MB'
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [location.state])

  const handleBack = () => {
    navigate(-1)
  }

  const handleDownload = () => {
    console.log('Downloading document...')
    // In real app, this would download the PDF
  }

  const handleShare = () => {
    console.log('Sharing document...')
    // In real app, this would share the document
  }

  const handlePrint = () => {
    console.log('Printing document...')
    // In real app, this would open print dialog
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handlePageInput = (e) => {
    const page = parseInt(e.target.value)
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
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
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-900 truncate">{document?.name}</h1>
            <p className="text-sm text-gray-500">{document?.type} • {document?.size}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-600 text-lg">share</span>
            </button>
            <button
              onClick={handleDownload}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-600 text-lg">download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Page Navigation */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-gray-600 text-sm">chevron_left</span>
            </button>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={currentPage}
                onChange={handlePageInput}
                className="w-12 h-8 text-center border border-gray-300 rounded text-sm"
                min="1"
                max={totalPages}
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-gray-600 text-sm">chevron_right</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-600 text-sm">remove</span>
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-600 text-sm">add</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* PDF Page Simulation */}
            <div className="aspect-[8.5/11] bg-white border border-gray-200 p-8">
              <div className="h-full flex flex-col">
                {/* Document Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <p className="text-gray-600">Invoice #ORD-2024-001</p>
                </div>

                {/* Document Content */}
                <div className="flex-1 space-y-6">
                  {/* Company Info */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">From:</h3>
                      <p className="text-gray-700">Metro Construction Supplies</p>
                      <p className="text-gray-700">123 Business Street</p>
                      <p className="text-gray-700">Tashkent, Uzbekistan</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">To:</h3>
                      <p className="text-gray-700">Tashkent Builders LLC</p>
                      <p className="text-gray-700">456 Construction Ave</p>
                      <p className="text-gray-700">Tashkent, Uzbekistan</p>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-900 mb-4">Invoice Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Product:</span>
                        <span className="text-gray-700">Concrete Mix M300</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Quantity:</span>
                        <span className="text-gray-700">100 bags</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Unit Price:</span>
                        <span className="text-gray-700">$25.00</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-gray-900">$2,500.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-900 mb-2">Payment Terms</h3>
                    <p className="text-gray-700 text-sm">
                      Payment due within 30 days of invoice date. Late payments may incur additional fees.
                    </p>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="border-t border-gray-200 pt-4 mt-8">
                  <div className="text-center text-sm text-gray-500">
                    <p>Thank you for your business!</p>
                    <p>Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

export default PdfDocumentPreview
