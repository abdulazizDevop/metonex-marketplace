import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ContractGenerationStart = () => {
  const navigate = useNavigate()
  const [currentScreen, setCurrentScreen] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen(2)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleStartGeneration = () => {
    setCurrentScreen(2)
  }

  const handleNavigation = (page) => {
    navigate(`/${page}`)
  }

  if (currentScreen === 1) {
    return (
      <div className="flex flex-col h-screen justify-between bg-gray-100" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <header className="h-40 bg-gradient-to-b from-purple-600 to-purple-500"></header>
          
          {/* Main Content */}
          <main className="flex-grow flex flex-col justify-center items-center text-center px-8 -mt-24">
            <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-3xl shadow-lg mb-8">
              <span className="material-symbols-outlined text-7xl text-purple-600">folder</span>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white">
                <span className="material-symbols-outlined text-white text-xl">lock</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Secure Contract & Invoice Generation</h1>
            <p className="text-gray-600 mt-3 text-base">
              Your documents will be prepared via escrow.<br/>Estimated time: 1–3 minutes.
            </p>
          </main>
          
          {/* Footer */}
          <footer className="p-6">
            <button 
              onClick={handleStartGeneration}
              className="w-full bg-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-300 flex items-center justify-center text-lg hover:bg-purple-700 transition-colors"
            >
              <span className="material-symbols-outlined mr-2">flash_on</span>
              Start Generation
            </button>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="h-20 bg-white"></header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-8">
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-9xl text-gray-200">folder</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-purple-600 border-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Generating Documents…</h1>
        <p className="text-gray-600 mt-3 text-base">Please wait, this may take up to 3 minutes.</p>
        
        <div className="w-full mt-12 space-y-5 text-left">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-white text-lg">check</span>
            </div>
            <p className="text-gray-900 font-medium text-lg">Contract Generated</p>
            <span className="ml-auto text-2xl">📑</span>
          </div>
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full border-2 border-purple-600 flex items-center justify-center mr-4 animate-pulse">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            <p className="text-gray-900 font-medium text-lg">Invoice Generating</p>
            <span className="ml-auto text-2xl">💳</span>
          </div>
          <div className="flex items-center opacity-50">
            <div className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4"></div>
            <p className="text-gray-500 font-medium text-lg">Preparing PDF</p>
            <span className="ml-auto text-2xl">📥</span>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-6"></footer>
    </div>
  )
}

export default ContractGenerationStart
