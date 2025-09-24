import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SupplierRoleSelection = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('dealer')

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    console.log(`Selected role: ${selectedRole}`)
    // Navigate based on selected role
    if (selectedRole === 'manufacturer') {
      navigate('/seller/dashboard')
    } else {
      navigate('/seller/dashboard')
    }
  }

  const roles = [
    {
      id: 'manufacturer',
      icon: 'factory',
      label: 'Manufacturer'
    },
    {
      id: 'dealer',
      icon: 'local_shipping',
      label: 'Dealer'
    }
  ]

  return (
    <div className="flex flex-col h-screen justify-between bg-white p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="text-center pt-8 pb-12">
        <h1 className="text-3xl font-bold text-black tracking-tight">Select your role</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`bg-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-200 ${
              selectedRole === role.id 
                ? 'border-2 border-purple-600 shadow-lg shadow-purple-600/50' 
                : 'shadow-sm hover:shadow-md'
            }`}
            onClick={() => handleRoleSelect(role.id)}
            style={{
              boxShadow: selectedRole === role.id 
                ? '0 0 20px rgba(94, 92, 230, 0.5)' 
                : '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}
          >
            <span 
              className={`material-symbols-outlined text-5xl ${
                selectedRole === role.id ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              {role.icon}
            </span>
            <span className="text-lg font-semibold text-black">{role.label}</span>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="pb-8">
        <button 
          onClick={handleContinue}
          className="w-full bg-purple-600 text-white font-bold py-4 px-5 rounded-2xl text-lg hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </footer>
    </div>
  )
}

export default SupplierRoleSelection
