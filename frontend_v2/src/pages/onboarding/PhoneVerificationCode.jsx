import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../utils/authApi'

const PhoneVerificationCode = () => {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  const phoneNumber = localStorage.getItem('registrationPhone') || '+998XXXXXXXXX'

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return // Only allow single digit
    
    const newCode = [...verificationCode]
    newCode[index] = value
    
    setVerificationCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join('')
    
    if (code.length !== 6) {
      setError('6 xonali kodni to\'liq kiriting')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const phoneNumber = localStorage.getItem('registrationPhone')
      
      // Call SMS verification API
      await authApi.verifySMS(phoneNumber, code)
      
      // Store verification status
      localStorage.setItem('phoneVerified', 'true')
      
      // Navigate to registration form based on role
      const userRole = localStorage.getItem('userRole') || 'buyer'
      if (userRole === 'buyer') {
        navigate('/buyer/registration')
      } else if (userRole === 'supplier') {
        navigate('/seller/registration')
      } else if (userRole === 'both') {
        navigate('/both/registration')
      } else {
        navigate('/buyer/registration') // Default to buyer
      }
    } catch (err) {
      console.error('SMS tasdiqlashda xatolik:', err)
      
      // Handle specific error messages
      if (err.message?.includes('400') || err.message?.includes('Invalid')) {
        setError('Noto\'g\'ri tasdiqlash kodi. Qaytadan urinib ko\'ring')
      } else if (err.message?.includes('Network')) {
        setError('Internet aloqasi yo\'q. Qaytadan urinib ko\'ring')
      } else {
        setError('Tasdiqlashda xatolik. Qaytadan urinib ko\'ring')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')

    try {
      const phoneNumber = localStorage.getItem('registrationPhone')
      
      // Call SMS API again
      await authApi.sendSMS(phoneNumber)
      
      setTimeLeft(300)
      setCanResend(false)
      setVerificationCode(['', '', '', '', '', ''])
    } catch (err) {
      console.error('SMS qayta yuborishda xatolik:', err)
      
      // Handle specific error messages
      if (err.message?.includes('429')) {
        setError('Juda ko\'p so\'rov yuborildi. Biroz kuting')
      } else if (err.message?.includes('Network')) {
        setError('Internet aloqasi yo\'q. Qaytadan urinib ko\'ring')
      } else {
        setError('Kod qayta yuborishda xatolik. Qaytadan urinib ko\'ring')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/registration/step-1')
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
            Verify Phone
          </h2>
        </header>

        {/* Main Content */}
        <main className="flex flex-col px-6 pt-8">
          <h1 className="text-[#0d141b] text-3xl font-bold leading-tight tracking-tighter mb-2">
            Enter verification code
          </h1>
          <p className="text-[#4c739a] text-base font-normal leading-normal mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-[#0d141b] text-base font-semibold mb-8">
            {phoneNumber}
          </p>

          {/* Verification Code Input */}
          <div className="flex justify-center gap-3 mb-6">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#1173d4] focus:ring-2 focus:ring-[#1173d4] focus:outline-none bg-[#e7edf3]"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-4">
            {timeLeft > 0 ? (
              <p className="text-[#4c739a] text-sm">
                Code expires in {formatTime(timeLeft)}
              </p>
            ) : (
              <p className="text-red-500 text-sm">
                Code expired
              </p>
            )}
          </div>

          {/* Resend Code */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className="text-[#1173d4] text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend code
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 px-6 pb-8">
        <button 
          onClick={handleVerify}
          disabled={isLoading || verificationCode.join('').length !== 6}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Verifying...
            </div>
          ) : (
            <span className="truncate">Verify & Continue</span>
          )}
        </button>
        
        <div className="text-center text-sm">
          <p className="text-[#4c739a]">
            Didn't receive the code? Check your SMS or try resending.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PhoneVerificationCode
