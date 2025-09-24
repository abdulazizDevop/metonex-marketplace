import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CategorySelection = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('Cement')

  const categories = [
    {
      id: 'metal',
      label: 'Metal',
      icon: 'construction'
    },
    {
      id: 'cement',
      label: 'Cement',
      icon: 'foundation'
    },
    {
      id: 'concrete',
      label: 'Concrete',
      icon: 'blender'
    },
    {
      id: 'paint',
      label: 'Paint',
      icon: 'format_paint'
    }
  ]

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleNext = () => {
    console.log(`Selected category: ${selectedCategory}`)
    navigate('/buyer/choose-order-method')
  }

  const handleBack = () => {
    navigate(-1)
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
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategorySelect(category.label)}
              className={`flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                selectedCategory === category.label
                  ? 'border-purple-600 shadow-lg shadow-purple-600/30'
                  : 'border-transparent hover:border-purple-300'
              }`}
              tabIndex="0"
            >
              <div className="flex items-center justify-center size-16 bg-purple-600 rounded-full text-white">
                <span className="material-symbols-outlined text-3xl">{category.icon}</span>
              </div>
              <span className="text-base font-semibold text-gray-900">{category.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white p-4 pb-8">
        <button 
          onClick={handleNext}
          className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-purple-600 text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-purple-600/39 hover:bg-opacity-90 transition-all duration-200"
        >
          <span className="truncate">Next</span>
        </button>
      </footer>
    </div>
  )
}

export default CategorySelection
