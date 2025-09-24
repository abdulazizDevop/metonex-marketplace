import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DocumentGenerationProgress = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(50)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 33 && currentStep === 1) {
      setCurrentStep(2)
    } else if (progress >= 66 && currentStep === 2) {
      setCurrentStep(3)
    }
  }, [progress, currentStep])

  const steps = [
    {
      id: 1,
      title: 'Contract Generated',
      completed: currentStep >= 1,
      active: currentStep === 1
    },
    {
      id: 2,
      title: 'Invoice Generating',
      completed: currentStep >= 2,
      active: currentStep === 2
    },
    {
      id: 3,
      title: 'Preparing PDF',
      completed: currentStep >= 3,
      active: currentStep === 3
    }
  ]

  const handleNavigation = (page) => {
    navigate(`/${page}`)
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
      
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-10 pb-8 text-center">
        <div className="relative mb-8">
          <svg className="w-48 h-48" viewBox="0 0 120 120">
            <circle 
              className="text-gray-200" 
              cx="60" 
              cy="60" 
              fill="transparent" 
              r="52" 
              stroke="currentColor" 
              strokeWidth="8"
            ></circle>
            <circle 
              className="transition-all duration-500" 
              cx="60" 
              cy="60" 
              fill="transparent" 
              r="52" 
              strokeDasharray="326.72" 
              strokeDashoffset={326.72 - (326.72 * progress / 100)}
              strokeLinecap="round" 
              strokeWidth="8"
              stroke="#5E5CE6"
              transform="rotate(-90 60 60)"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-purple-600">
              enhanced_encryption
            </span>
            <p className="text-gray-900 text-lg font-bold mt-2">In Progress</p>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-12">Estimated time: 1–3 minutes</p>
        
        <div className="w-full max-w-sm space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm ${
              step.id > currentStep ? 'opacity-60' : ''
            }`}>
              <div className={`flex items-center justify-center size-10 rounded-full ${
                step.completed 
                  ? 'bg-green-100' 
                  : step.active 
                    ? 'bg-purple-100' 
                    : 'bg-gray-100'
              }`}>
                {step.completed ? (
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                ) : step.active ? (
                  <div className="w-6 h-6 border-2 border-dashed rounded-full border-purple-600 animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-gray-500">schedule</span>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium leading-normal ${
                  step.active ? 'text-purple-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {step.completed && (
                <span className="material-symbols-outlined text-green-600 text-2xl">check</span>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8 text-center text-sm">
        <p className="text-gray-400 mb-2">Escrow ID: 789456123</p>
        <p className="text-gray-600 max-w-xs mx-auto">
          Your contract and invoice are securely generated via escrow. This ensures a safe and verified transaction.
        </p>
      </footer>
    </div>
  )
}

export default DocumentGenerationProgress
