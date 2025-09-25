import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OnboardingWelcome1 = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const slides = [
    {
      icon: 'storefront',
      title: 'Welcome to Metone Marketplace',
      subtitle: 'Your B2B Industrial Equipment Hub',
      description: 'Connect with verified suppliers and buyers in the industrial equipment industry. Find the best deals, manage your business efficiently.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: 'handshake',
      title: 'Trusted Transactions',
      subtitle: 'Secure Escrow Protection',
      description: 'All transactions are protected by our secure escrow system. Your payments are safe until delivery is confirmed.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: 'analytics',
      title: 'Smart Analytics',
      subtitle: 'AI-Powered Insights',
      description: 'Get intelligent recommendations, market insights, and performance analytics to grow your business.',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const handleNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsAnimating(false)
    }, 300)
  }

  const handlePrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsAnimating(false)
    }, 300)
  }

  const handleGetStarted = () => {
    navigate('/register')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 pt-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">business</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Metone</span>
        </div>
        <button 
          onClick={handleLogin}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md mx-auto">
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Icon */}
            <div className={`w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r ${slides[currentSlide].color} flex items-center justify-center shadow-lg`}>
              <span className="material-symbols-outlined text-white text-4xl">
                {slides[currentSlide].icon}
              </span>
            </div>

            {/* Content */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                {slides[currentSlide].subtitle}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10 p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span>Next</span>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </button>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Get Started
        </button>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Join thousands of businesses already using Metone
          </p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{i}</span>
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">+2,847 more</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWelcome1