/**
 * Document Test Panel - Development testing component
 * Hujjat yuklash va API ni test qilish uchun
 */

import React, { useState } from 'react'
import { documentApi, documentValidation, documentTypes } from '../utils/documentApi'

const DocumentTestPanel = ({ orderId = 1 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [testing, setTesting] = useState(false)

  const addTestResult = (test, success, message, data = null) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }
    setTestResults(prev => [result, ...prev])
  }

  const testAPI = async (testName, apiCall) => {
    setTesting(true)
    try {
      const result = await apiCall()
      addTestResult(testName, true, 'Test muvaffaqiyatli', result)
      return result
    } catch (error) {
      addTestResult(testName, false, error.message, error)
      throw error
    } finally {
      setTesting(false)
    }
  }

  const runTests = async () => {
    setTestResults([])
    
    try {
      // Test 1: Load order documents
      await testAPI('Load Order Documents', () => 
        documentApi.getOrderDocuments(orderId)
      )

      // Test 2: Load my documents
      await testAPI('Load My Documents', () => 
        documentApi.getMyDocuments()
      )

      // Test 3: Search documents
      await testAPI('Search Documents', () => 
        documentApi.searchDocuments({
          document_type: 'contract',
          status: 'verified'
        })
      )

      // Test 4: File validation
      await testAPI('File Validation', () => {
        // Create a mock file
        const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
        const validation = documentValidation.validateFile(mockFile)
        return Promise.resolve(validation)
      })

      addTestResult('All Tests', true, 'Barcha testlar muvaffaqiyatli o\'tdi')

    } catch (error) {
      addTestResult('Test Suite', false, 'Ba\'zi testlar muvaffaqiyatsiz tugadi')
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Document API Test Panel"
        >
          <span className="material-symbols-outlined">science</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Document API Test</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={testing}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Run Tests'}
          </button>
          <button
            onClick={() => setTestResults([])}
            className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Clear
          </button>
        </div>

        <div className="text-xs text-gray-500">
          Order ID: {orderId} | API: {import.meta.env?.VITE_API_URL || 'http://localhost:8000/api'}
        </div>

        <div className="max-h-48 overflow-y-auto space-y-2">
          {testResults.map((result) => (
            <div
              key={result.id}
              className={`p-2 rounded text-xs border ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.test}</span>
                <span className="text-xs opacity-75">{result.timestamp}</span>
              </div>
              <div className="mt-1">{result.message}</div>
              {result.data && (
                <details className="mt-1">
                  <summary className="cursor-pointer">Data</summary>
                  <pre className="mt-1 text-xs bg-gray-100 p-1 rounded overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
          
          {testResults.length === 0 && (
            <div className="text-center text-gray-500 text-xs py-4">
              Test natijalar bu yerda ko'rsatiladi
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentTestPanel
