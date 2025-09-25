import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  })
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setIsLoginLoading(true)
    setLoginError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if user exists (simulate)
      if (loginData.phone && loginData.password) {
        // Store login data
        localStorage.setItem('userLoginData', JSON.stringify({
          phone: loginData.phone,
          loggedIn: true,
          loginTime: new Date().toISOString()
        }))
        
        // Navigate to appropriate dashboard based on stored role
        const userRole = localStorage.getItem('userRole') || 'buyer'
        if (userRole === 'buyer') {
          navigate('/buyer/home')
        } else if (userRole === 'supplier') {
          navigate('/seller/dashboard')
        } else {
          navigate('/buyer/home') // Default to buyer
        }
      } else {
        setLoginError('Please enter valid phone number and password')
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
    setLoginError('')
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center p-6 pt-12">
        <button 
          onClick={handleBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-900">Sign In</h1>
          <p className="text-sm text-gray-500">Welcome back to Metone</p>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">login</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={loginData.phone}
                onChange={handleLoginInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="+998XXXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoginLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot your password?
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={handleRegister}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10 p-6 pb-8">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
