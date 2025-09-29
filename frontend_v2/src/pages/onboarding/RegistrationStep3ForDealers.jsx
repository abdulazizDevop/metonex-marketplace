import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RegistrationStep3ForDealers = () => {
  const navigate = useNavigate()
  const [factoryName, setFactoryName] = useState('')
  const [factories, setFactories] = useState([
    'Arcelor',
    'MMK',
    'Local Plant'
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Dealer ma'lumotlarini localStorage'dan olish
  const [dealerData, setDealerData] = useState(null)
  
  React.useEffect(() => {
    const storedData = localStorage.getItem('dealerRegistrationData')
    if (storedData) {
      setDealerData(JSON.parse(storedData))
    }
  }, [])

  const handleBack = () => {
    navigate('/seller/registration')
  }

  const handleAddFactory = () => {
    if (!factoryName.trim()) {
      setError('Iltimos, zavod nomini kiriting')
      return
    }

    if (factories.includes(factoryName.trim())) {
      setError('Bu zavod allaqachon qo\'shilgan')
      return
    }

    setFactories(prev => [...prev, factoryName.trim()])
    setFactoryName('')
    setError('')
  }

  const handleRemoveFactory = (factoryToRemove) => {
    setFactories(prev => prev.filter(factory => factory !== factoryToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddFactory()
    }
  }

  const handleFinishRegistration = async () => {
    if (factories.length === 0) {
      setError('Iltimos, kamida bitta zavod qo\'shing')
      return
    }

    if (!dealerData) {
      setError('Dealer ma\'lumotlari topilmadi. Qaytadan ro\'yxatdan o\'ting.')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // To'liq registration ma'lumotlarini yig'ish
      const registrationData = {
        user: {
          phone: dealerData.phone,
          password: dealerData.password,
          role: 'supplier',
          supplier_type: dealerData.supplierType
        },
        company: {
          name: dealerData.companyName,
          inn_stir: dealerData.innStir,
          factories: factories
        },
        completedAt: new Date().toISOString()
      }
      
      localStorage.setItem('sellerRegistrationData', JSON.stringify(registrationData))
      localStorage.setItem('userRole', 'supplier')
      
      // Dealer ma'lumotlarini tozalash
      localStorage.removeItem('dealerRegistrationData')
      
      // Navigate to dashboard
      navigate('/seller/dashboard')
    } catch (err) {
      setError('Ro\'yxatdan o\'tishda xatolik yuz berdi. Qaytadan urinib ko\'ring.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white overflow-x-hidden">
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center p-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center size-10 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-gray-900 text-lg font-bold flex-1 text-center pr-10">
            Registration
          </h2>
        </header>

        {/* Main Content */}
        <main className="p-4 pt-8">
          <h1 className="text-gray-900 text-3xl font-bold tracking-tight">
            Yetkazib beruvchi zavodlar
          </h1>

          {/* Factory Input */}
          <div className="mt-8">
            <label className="text-sm font-medium text-gray-700" htmlFor="factory-name">
              Factory name
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input 
                id="factory-name"
                name="factory-name"
                type="text"
                value={factoryName}
                onChange={(e) => {
                  setFactoryName(e.target.value)
                  setError('')
                }}
                onKeyPress={handleKeyPress}
                placeholder="masalan: Temir Zavod MChJ"
                className="form-input block w-full rounded-lg border-gray-300 bg-gray-50 p-4 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              />
              <button 
                onClick={handleAddFactory}
                className="flex items-center justify-center rounded-lg bg-blue-100 p-4 text-blue-600 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Factories List */}
          <div className="mt-6 space-y-3">
            {factories.map((factory, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <span className="text-base text-gray-900">{factory}</span>
                <button 
                  onClick={() => handleRemoveFactory(factory)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Info Message */}
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-orange-100 p-3">
            <span className="material-symbols-outlined text-orange-500 mt-0.5">info</span>
            <p className="text-sm text-orange-800">Keyinroq ko'proq zavodlar qo'shishingiz mumkin.</p>
          </div>

          {/* Registration Progress */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Ro'yxatdan o'tish jarayoni</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
                Telefon raqam tasdiqlandi
              </div>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
                Asosiy ma'lumotlar kiritildi
              </div>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-blue-500 mr-2">radio_button_unchecked</span>
                Zavod ma'lumotlari (joriy qadam)
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="p-4 pb-6">
        <button 
          onClick={handleFinishRegistration}
          disabled={isLoading || factories.length === 0}
          className="w-full rounded-lg bg-[#1172d4] py-4 text-center text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Yakunlanmoqda...
            </div>
          ) : (
            'Ro\'yxatdan o\'tishni yakunlash'
          )}
        </button>
      </div>
    </div>
  )
}

export default RegistrationStep3ForDealers
