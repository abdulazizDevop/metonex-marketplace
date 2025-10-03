import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import userApi from '../../utils/userApi'

const CategorySelection = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [flowData, setFlowData] = useState({
    fromHome: false,
    fromOrderMethod: false,
    method: null,
    flowStep: null,
    returnPath: null
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Load categories from backend
  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await userApi.getCategories()
      const categoriesData = response.results || response || []
      
      // Transform backend data to match component format
      const transformedCategories = categoriesData.map(cat => ({
        id: cat.slug || cat.id,
        label: cat.name,
        icon: cat.icon || 'category' // Default icon if not provided
      }))
      
      setCategories(transformedCategories)
    } catch (error) {
      console.error('Kategoriyalarni yuklashda xatolik:', error)
      // Fallback categories
      setCategories([
        { id: 'metal', label: 'Metal', icon: 'construction' },
        { id: 'cement', label: 'Cement', icon: 'foundation' },
        { id: 'concrete', label: 'Concrete', icon: 'blender' },
        { id: 'paint', label: 'Paint', icon: 'format_paint' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Initialize flow data from location state
  useEffect(() => {
    if (location.state) {
      setFlowData({
        fromHome: location.state.fromHome || false,
        fromOrderMethod: location.state.fromOrderMethod || false,
        method: location.state.method || null,
        flowStep: location.state.flowStep || null,
        returnPath: location.state.returnPath || null
      });
    }
  }, [location.state]);

  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleNext = () => {
    if (selectedCategories.length === 0) {
      alert('Iltimos, kamida bitta kategoriya tanlang')
      return
    }
    console.log(`Selected categories: ${selectedCategories.join(', ')}`)
    
    // Navigate to products with flow context
    navigate('/buyer/products', { 
      state: { 
        selectedCategories,
        flowData,
        flowStep: 'product-browsing',
        returnPath: '/buyer/category-selection'
      } 
    })
  }

  const handleBack = () => {
    if (flowData.returnPath) {
      navigate(flowData.returnPath)
    } else {
      navigate('/buyer/home')
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-white" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <button 
            onClick={handleBack}
            aria-label="Go back" 
            className="text-gray-900 flex size-10 shrink-0 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-xl font-bold text-gray-900 pr-10">Select a Category</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4FFF] mx-auto mb-4"></div>
            <p className="text-gray-500">Kategoriyalar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategorySelect(category.label)}
              className={`flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                selectedCategories.includes(category.label)
                  ? 'border-[#6C4FFF] shadow-lg shadow-[#6C4FFF]/30'
                  : 'border-transparent hover:border-[#6C4FFF]/30'
              }`}
              tabIndex="0"
            >
              <div className={`flex items-center justify-center size-16 rounded-full text-white ${
                selectedCategories.includes(category.label)
                  ? 'bg-[#6C4FFF]'
                  : 'bg-gray-400'
              }`}>
                <span className="material-symbols-outlined text-3xl">{category.icon}</span>
              </div>
              <span className="text-base font-semibold text-gray-900">{category.label}</span>
            </div>
          ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white p-4 pb-20">
        <button 
          onClick={handleNext}
          className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-[#6C4FFF] text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-[#6C4FFF]/30 hover:bg-[#5A3FE6] transition-all duration-200"
        >
          <span className="truncate">Next</span>
        </button>
      </footer>
    </div>
  )
}

export default CategorySelection
