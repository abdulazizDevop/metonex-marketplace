import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RegistrationStep1PhoneVerification = () => {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+998')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const countryOptions = [
    { code: '+998', country: 'UZ' }
  ]

  const handleBack = () => {
    navigate('/register')
  }

  const validatePhoneNumber = (phone) => {
    // Uzbekistan phone number validation (+998XXXXXXXXX)
    const phoneRegex = /^[0-9]{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handleSendCode = async () => {
    setError('')
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number')
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 9-digit phone number (e.g., 901234567)')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store phone number in localStorage for next step
      localStorage.setItem('registrationPhone', `${countryCode}${phoneNumber}`)
      
      // Navigate to verification code step
      navigate('/registration/phone-verification-code')
    } catch (err) {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    setPhoneNumber(value)
    setError('')
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white">
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center p-4">
          <button 
            onClick={handleBack}
            className="text-[#0d141b] hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
          </button>
          <h2 className="text-[#0d141b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-8">
            Sign up
          </h2>
        </header>

        {/* Main Content */}
        <main className="flex flex-col px-6 pt-8">
          <h1 className="text-[#0d141b] text-3xl font-bold leading-tight tracking-tighter mb-2">
            Enter your phone number
          </h1>
          <p className="text-[#4c739a] text-base font-normal leading-normal mb-8">
            We'll send you a code to verify your number.
          </p>

          {/* Phone Number Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="form-select appearance-none w-28 rounded-xl border-gray-300 bg-[#e7edf3] py-4 pl-4 pr-10 text-base text-[#0d141b] focus:border-[#1173d4] focus:ring-[#1173d4] focus:outline-none"
              >
                {countryOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0d141b]">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
            
            <input 
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Phone number"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-gray-300 bg-[#e7edf3] h-14 placeholder:text-[#4c739a] p-4 text-base font-normal leading-normal focus:border-[#1173d4] focus:ring-[#1173d4] focus:outline-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 px-6 pb-8">
        <p className="text-[#4c739a] text-center text-xs font-normal leading-normal">
          By continuing, you agree to our{' '}
          <a className="font-medium text-[#1173d4] hover:underline" href="#">
            Terms of Service
          </a>{' '}
          and{' '}
          <a className="font-medium text-[#1173d4] hover:underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
        
        <button 
          onClick={handleSendCode}
          disabled={isLoading || !phoneNumber.trim()}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            <span className="truncate">Send code</span>
          )}
        </button>
        
        <div className="text-center text-sm">
          <p className="text-[#4c739a]">
            Next: enter the 6-digit code in blue input boxes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationStep1PhoneVerification
