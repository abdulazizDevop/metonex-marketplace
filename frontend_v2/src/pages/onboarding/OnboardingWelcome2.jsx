import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OnboardingWelcome2 = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    {
      id: 'buyer',
      title: 'I\'m a Buyer',
      subtitle: 'Looking for industrial equipment',
      description: 'Find suppliers, compare prices, and manage your procurement process efficiently.',
      icon: 'shopping_cart',
      color: 'from-blue-500 to-blue-600',
      features: ['Browse Products', 'Compare Prices', 'Secure Payments', 'Track Orders']
    },
    {
      id: 'supplier',
      title: 'I\'m a Supplier',
      subtitle: 'Selling industrial equipment',
      description: 'List your products, connect with buyers, and grow your business with our platform.',
      icon: 'storefront',
      color: 'from-green-500 to-green-600',
      features: ['List Products', 'Manage Orders', 'Analytics Dashboard', 'Secure Payments']
    },
    {
      id: 'both',
      title: 'I\'m Both',
      subtitle: 'Buy and sell equipment',
      description: 'Get the best of both worlds - buy what you need and sell what you have.',
      icon: 'swap_horiz',
      color: 'from-purple-500 to-purple-600',
      features: ['Dual Dashboard', 'Complete Control', 'Maximize Revenue', 'Full Access']
    }
  ]

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    
    try {
      // Store selected role
      localStorage.setItem('userRole', selectedRole)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate based on role
      if (selectedRole === 'buyer') {
        navigate('/buyer/registration')
      } else if (selectedRole === 'supplier') {
        navigate('/onboarding/registration-step-1')
      } else {
        navigate('/onboarding/registration-step-1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/onboarding/welcome-1')
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50"></div>
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
          <h1 className="text-xl font-bold text-gray-900">Choose Your Role</h1>
          <p className="text-sm text-gray-500">How will you use Metone?</p>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Introduction */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">person_add</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get you started</h2>
            <p className="text-gray-600">Select your primary role to customize your experience</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Selection Indicator */}
                {selectedRole === role.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  </div>
                )}

                {/* Role Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}>
                  <span className="material-symbols-outlined text-white text-xl">
                    {role.icon}
                  </span>
                </div>

                {/* Role Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{role.title}</h3>
                  <p className="text-sm font-medium text-gray-600 mb-2">{role.subtitle}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{role.description}</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Don't worry!</p>
                <p className="text-xs text-gray-600">
                  You can always change your role later in settings. This just helps us customize your initial experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10 p-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Setting up your account...
            </div>
          ) : (
            'Continue'
          )}
        </button>

        {/* Progress Indicator */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWelcome2
