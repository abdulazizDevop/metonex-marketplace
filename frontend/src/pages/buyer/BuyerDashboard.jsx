import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RoleGuard from '../../components/RoleGuard.jsx'
import BuyerHeader from '../../components/BuyerHeader.jsx'
import { getItems } from '../../utils/api.js'

export default function BuyerDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageIndices, setImageIndices] = useState({})
  const [rowScrollPositions, setRowScrollPositions] = useState({}) // Har qator uchun scroll pozitsiyasi
  const [rowItems, setRowItems] = useState({}) // Har qator uchun doimiy mahsulotlar
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('buyer_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  
  // Search va filter state'lari
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    unit: '',
    subcategory: ''
  })

  useEffect(() => {
    loadItems()
  }, [])

  // Filterlar o'zgarganida mahsulotlarni qayta yuklash
  useEffect(() => {
    loadItems()
  }, [filters])

  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  async function loadItems() {
    try {
      setLoading(true)
      
      // Filter parametrlarini tayyorlash
      const paramsObj = {}
      if (filters.search && filters.search.trim()) paramsObj.search = filters.search.trim()
      if (filters.category && filters.category.trim()) paramsObj.category = filters.category.trim()
      if (filters.status && filters.status.trim()) paramsObj.status = filters.status.trim()
      if (filters.unit && filters.unit.trim()) paramsObj.unit = filters.unit.trim()
      if (filters.subcategory && filters.subcategory.trim()) paramsObj.subcategory = filters.subcategory.trim()
      
      console.log('Dashboard filters:', filters)
      console.log('API params:', paramsObj)
      const data = await getItems(paramsObj)
      console.log('Backend\'dan kelgan data:', data) // Debug uchun
      console.log('Items array:', data.results || data) // Debug uchun
      const itemsData = data.results || data
      setItems(itemsData)
      
      // Har qator uchun doimiy mahsulotlar yaratish
      const totalRows = 4
      const itemsPerRow = 8 // 4 ta ko'rinadigan + 4 ta qo'shimcha
      const newRowItems = {}
      
      for (let row = 0; row < totalRows; row++) {
        // Har qator uchun alohida random shuffle (faqat 1 marta)
        const shuffledItems = [...itemsData].sort(() => Math.random() - 0.5)
        const rowItemsArray = []
        
        // Ko'proq mahsulotlar yaratish (scroll uchun)
        for (let col = 0; col < itemsPerRow; col++) {
          const itemIndex = col % shuffledItems.length
          rowItemsArray.push(shuffledItems[itemIndex])
        }
        
        newRowItems[row] = rowItemsArray
      }
      
      setRowItems(newRowItems)
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xato:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(price) {
    if (!price || price === 0) return '0 so\'m'
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  function formatQuantity(quantity) {
    if (!quantity || quantity === 0) return '0'
    return new Intl.NumberFormat('uz-UZ').format(quantity)
  }

  function nextImage(itemId, totalImages) {
    setImageIndices(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }))
  }

  function prevImage(itemId, totalImages) {
    setImageIndices(prev => ({
      ...prev,
      [itemId]: prev[itemId] === 0 ? totalImages - 1 : (prev[itemId] || 0) - 1
    }))
  }

  // Har qator uchun doimiy mahsulotlar
  function getDisplayItems() {
    if (Object.keys(rowItems).length === 0) return []
    
    const displayItems = []
    const totalRows = 4
    
    for (let row = 0; row < totalRows; row++) {
      if (rowItems[row]) {
        displayItems.push({
          rowIndex: row,
          items: rowItems[row]
        })
      }
    }
    
    return displayItems
  }

  // Qator navigation funksiyalari - faqat scroll
  function moveRowLeft(rowIndex) {
    // Faqat scroll pozitsiyasini o'zgartirish
    const container = document.getElementById(`row-container-${rowIndex}`)
    if (container) {
      const cardWidth = 300 // Har bir card kengligi + gap
      const currentScroll = rowScrollPositions[rowIndex] || 0
      const newScroll = Math.max(0, currentScroll - cardWidth)
      
      // Kitob sahifasi kabi sekin scroll
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
      
      setRowScrollPositions(prev => ({
        ...prev,
        [rowIndex]: newScroll
      }))
    }
  }

  function moveRowRight(rowIndex) {
    // Faqat scroll pozitsiyasini o'zgartirish
    const container = document.getElementById(`row-container-${rowIndex}`)
    if (container) {
      const cardWidth = 300 // Har bir card kengligi + gap
      const currentScroll = rowScrollPositions[rowIndex] || 0
      const maxScroll = container.scrollWidth - container.clientWidth
      const newScroll = Math.min(maxScroll, currentScroll + cardWidth)
      
      // Kitob sahifasi kabi sekin scroll
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
      
      setRowScrollPositions(prev => ({
        ...prev,
        [rowIndex]: newScroll
      }))
    }
  }

  // Text'lar uchun funksiya
  function getTexts() {
    return [
      { type: 'text', content: 'Eng yaxshi narxlar', description: 'Eng arzon va sifatli mahsulotlar' },
      { type: 'text', content: 'Eng mashhurlar', description: 'Eng ko\'p sotiladigan mahsulotlar' },
      { type: 'text', content: 'Yangi mahsulotlar', description: 'Eng so\'nggi qo\'shilgan mahsulotlar' },
      { type: 'text', content: 'Maxsus takliflar', description: 'Chegirmali va maxsus mahsulotlar' }
    ]
  }

  // Mahsulot kartasi komponenti
  function ProductCard({ item, index }) {
    return (
      <div key={`${item.id}-${index}`} className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all duration-300 group">
        <Link to={`/buyer/items/${item.id}`} className="block">
          {/* Product Image */}
          <div className="aspect-square bg-green-50 relative overflow-hidden group">
            {item.images_urls && item.images_urls.length > 0 ? (
              <div className="relative w-full h-full">
                <img
                  src={item.images_urls[imageIndices[item.id] || 0]}
                  alt={item.name}
                  className="w-full h-full object-cover image-hover-scale"
                />
                
                {/* Image Navigation Buttons */}
                {item.images_urls.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        prevImage(item.id, item.images_urls.length)
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        nextImage(item.id, item.images_urls.length)
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {(imageIndices[item.id] || 0) + 1}/{item.images_urls.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-400">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.status === 'mavjud' 
                  ? 'bg-green-100 text-green-700' 
                  : item.status === 'mavjud_emas'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {item.status === 'mavjud' ? 'Mavjud' : 
                 item.status === 'mavjud_emas' ? 'Mavjud emas' : 
                 item.status === 'sotildi' ? 'Sotildi' : 'Noma\'lum'}
              </span>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
              {item.name}
            </h3>
            
            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {item.category_name || 'Kategoriya yo\'q'}
              </span>
              {item.subcategory_name && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {item.subcategory_name}
                </span>
              )}
            </div>
            
            {/* Price and Quantity */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(item.price)}
                </span>
                <span className="text-xs text-gray-500">
                  {item.quantity ? `${formatQuantity(item.quantity)} ${item.unit || 'dona'}` : 'Miqdor yo\'q'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {item.unit || 'dona'}
                </div>
              </div>
            </div>
            
            {/* Company Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                  {item.company_logo ? (
                    <img
                      src={item.company_logo}
                      alt={item.company_name || 'Kompaniya'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Logo yuklanmadi:', item.company_logo)
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                      onLoad={() => {
                        console.log('Logo yuklandi:', item.company_logo)
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-xs font-medium text-green-600" 
                    style={{display: item.company_logo ? 'none' : 'block'}}
                  >
                    🏢
                  </span>
                </div>
                <span className="text-xs text-gray-600 truncate">
                  {item.company_name || 'Kompaniya nomi yo\'q'}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {item.created_at ? new Date(item.created_at).toLocaleDateString('uz-UZ') : ''}
              </div>
            </div>
            
            {/* Description (if available) */}
            {item.description && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </Link>
      </div>
    )
  }

  return (
    <RoleGuard requiredRole="BUYER" requireCompany={true}>
      <div className="min-h-screen bg-gray-50">
        <BuyerHeader 
          search={filters.search}
          setSearch={(value) => setFilters(f => ({ ...f, search: value }))}
          category={filters.category}
          setCategory={(value) => setFilters(f => ({ ...f, category: value }))}
          status={filters.status}
          setStatus={(value) => setFilters(f => ({ ...f, status: value }))}
          unit={filters.unit}
          setUnit={(value) => setFilters(f => ({ ...f, unit: value }))}
          subcategory={filters.subcategory}
          setSubcategory={(value) => setFilters(f => ({ ...f, subcategory: value }))}
          showFilters={true}
          cartCount={getCartItemCount()}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner w-8 h-8"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mahsulot topilmadi</h3>
              <p className="text-gray-600 mb-6">Qidiruv natijalariga mos mahsulot topilmadi</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setFilters({ search: '', category: '', status: '', unit: '', subcategory: '' })}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Filterni Tozalash
                </button>
                <Link
                  to="/buyer/requests/create"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Zayavka Yuborish
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Har 2 ta qatordan keyin text va mahsulotlar */}
              {(() => {
                const displayData = getDisplayItems()
                const texts = getTexts()
                const elements = []
                let textIndex = 0
                
                // Har 2 ta qatordan keyin text qo'shish
                for (let row = 0; row < 4; row++) {
                  // Har 2 ta qatordan keyin text qo'shish
                  if (row % 2 === 0 && textIndex < texts.length) {
                    elements.push(
                      <div key={`text-${textIndex}`} className="mb-6">
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 max-w-2xl mx-auto">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{texts[textIndex].content}</h2>
                          <p className="text-gray-600">{texts[textIndex].description}</p>
                        </div>
                      </div>
                    )
                    textIndex++
                  }
                  
                  // Mahsulotlar qatorini qo'shish
                  const rowData = displayData[row]
                  if (rowData && rowData.items.length > 0) {
                    elements.push(
                      <div key={`row-${row}`} className="relative mb-6">
                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => moveRowLeft(row)}
                            className="flex items-center justify-center w-12 h-12 bg-green-200 hover:bg-green-300 text-green-800 rounded-full shadow-lg transition-colors duration-200 border-2 border-green-300"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Qator {row + 1}</h3>
                            <p className="text-sm text-gray-500">Mahsulotlar</p>
                          </div>
                          
                          <button
                            onClick={() => moveRowRight(row)}
                            className="flex items-center justify-center w-12 h-12 bg-green-200 hover:bg-green-300 text-green-800 rounded-full shadow-lg transition-colors duration-200 border-2 border-green-300"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Product Grid - Horizontal Scroll */}
                        <div 
                          id={`row-container-${row}`}
                          className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {rowData.items.map((item, colIndex) => (
                            <div key={`item-${row}-${colIndex}`} className="flex-shrink-0 w-72">
                              <ProductCard 
                                item={item} 
                                index={colIndex} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                }
                
                return elements
              })()}
            </>
          )}

          {/* {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Mahsulot topilmadi</h3>
              <p className="mt-1 text-sm text-gray-500">Qidiruv shartlarini o'zgartiring yoki boshqa mahsulotlarni ko'ring.</p>
            </div>
          )} */}
        </main>
      </div>
    </RoleGuard>
  )
}